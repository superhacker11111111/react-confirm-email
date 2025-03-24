const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const uuidv4 = require("uuid").v4;
const path = require("path");
const apiRouter = require("./routes/");
const sequelize = require("./config/database");
const errorHandler = require("./middleware/error");
const Billing = require("./model/Billing");
const User = require("./model/User");
const AWS = require("aws-sdk");
const morgan = require("morgan");
const axios = require("axios");
const cron = require("node-cron");
const moment = require("moment");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDocument = require("./swagger.json");
const { Roles, UserType, BILLING_TYPE } = require("./constants/constant");
const { trialDaysLeft } = require("./utils/sendEmail");
const { resError } = require("./utils/responseMessage");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    // For sample support and debugging, not required for production:
    name: "stripe-samples/accept-a-payment/payment-element",
    version: "0.0.2",
    url: "https://github.com/stripe-samples",
  },
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const app = express();

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(morgan("tiny"));

app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Employee API",
      version: "1.0.0",
    },
  },
  apis: ["api.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Register public directory
app.use("/static", express.static(path.join(__dirname, "public")));

//session
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/webhook", async (req, res) => {
  let data, eventType;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
        {
          // Increase tolerance to allow for timestamp differences
          tolerance: 300, // Time difference tolerance in seconds
        }
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      console.log(err);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }
  if (eventType === "payment_intent.succeeded") {
    if (
      data.object.description &&
      data.object.description.split(" ")[0] === "Upgrade"
    ) {
      try {
        const billing = {
          invoice_id: "",
          customer_id: data.object.customer,
          paid_amount: Number(data.object.amount_received) / 100,
          start_date: data.object.created * 1000,
          description:
            data.object.description ||
            "Additional Payment for Upgrade Subscription",
        };
        await Billing.create(billing);
      } catch (err) {
        console.log(err);
        resError(res, err);
      }
    }
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log("💰 Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
  } else if (eventType === "invoice.paid") {
    try {
      console.log("💰 Payment captured!");
      // add billing document
      const billing = {
        invoice_id: data.object.id,
        customer_id: data.object.customer,
        paid_amount: Number(data.object.amount_paid) / 100,
        start_date: data.object.lines.data[0].period.start * 1000,
        end_date: data.object.lines.data[0].period.end * 1000,
        description:
          data.object.lines.data[Number(data.object.lines.total_count) - 1]
            .description || "Subscription Creation",
      };
      await Billing.create(billing);
    } catch (err) {
      console.log("💰 Billing capture is failed");
      console.log(err);
      resError(res, err);
    }
  } else if (eventType === "invoice.payment_failed") {
    const customerId = data.object.customer;
    const subscriptionId = data.object.subscription;
    const pauseData = {
      subscription_id: subscriptionId,
      data: {
        pause_collection: {
          behavior: "void",
        },
      },
    };
  } else if (eventType === "customer.subscription.updated") {
    const subscriptionId = data.object.id;
    const status = data.object.status;
    await User.update(
      {
        subscription_status: status,
      },
      { where: { stripe_subscription_id: subscriptionId, isDeleted: false } }
    );
  }
  res.sendStatus(200);
});

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", apiRouter);
app.use(errorHandler);

// scheduling using cron

//  every 1 am EST
cron.schedule("0 12 * * *", function () {
  User.findAll({
    where: {
      role: Roles.COMPANY,
      userType: UserType["FREE TRIAL"],
      isDeleted: false,
    },
  })
    .then((result) => {
      result &&
        result.length > 0 &&
        result.forEach((user) => {
          const dayDifference = Math.floor(
            (new Date() - new Date(user?.createdAt)) / 1000 / 60 / 60 / 24
          );
          trialDaysLeft(user.email, dayDifference);
        });
    })
    .catch((err) => {
      console.log("Automation Email for FREE TRIAL:", err);
      return;
    });
});

const port = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    app.listen(port, "0.0.0.0", () =>
      console.log(`Server up and running on port ${port} !`)
    );
  })
  .catch((err) => {
    console.log(err);
  });
