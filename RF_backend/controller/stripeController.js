const { resCode } = require("../constants/resCode");
const { resError, resSuccess } = require("../utils/responseMessage");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    // For sample support and debugging, not required for production:
    name: "stripe-samples/accept-a-payment/payment-element",
    version: "0.0.2",
    url: "https://github.com/stripe-samples",
  },
});

const createPaymentIntent = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    resError(res, resCode.BAD_REQUEST, e.message);
  }
};

const createPaymentMethod = async (req, res) => {
  const pmData = req.body;
  try {
    const { paymentMethod, error } = await stripe.createPaymentMethod(pmData);
    res.json(paymentMethod);
  } catch (err) {
    resError(res, err);
  }
};

const createCustomer = async (req, res) => {
  const customerData = req.body;
  try {
    const customer = await stripe.customers.create(customerData);
    res.json(customer);
  } catch (err) {
    resError(res, err);
  }
};

const attachPaymentMethod = async (req, res) => {
  const attachData = req.body;
  try {
    await stripe.paymentMethods.attach(attachData.pId, attachData.customerInfo);
    resSuccess(res);
  } catch (err) {
    resError(res, err);
  }
};

const createPrice = async (req, res) => {
  const priceData = req.body;
  try {
    const price = await stripe.prices.create(priceData);
    res.json(price);
  } catch (err) {
    resError(res, err);
  }
};

const retrievePrice = async (req, res) => {
  const { price_id } = req.body;
  try {
    const result = await stripe.prices.retrieve(price_id);
    res.json({ result });
  } catch (e) {
    resError(res, err);
  }
};

const createSubscription = async (req, res) => {
  const subscriptionData = req.body;
  try {
    const subscription = await stripe.subscriptions.create(subscriptionData);
    res.json(subscription);
  } catch (err) {
    resError(res, err);
  }
};
0;

const addPaymentMethod = async (req, res) => {
  const { paymentMethodInfo, stripe_customer_id } = req.body;
  try {
    const result = await stripe.paymentMethods.create(paymentMethodInfo);

    const updatePaymentMethod = await stripe.paymentMethods.attach(result.id, {
      customer: stripe_customer_id,
    });

    return res.status(200).json({ data: updatePaymentMethod });
  } catch (err) {
    resError(res, err);
  }
};

const getPaymentMethodInfo = async (req, res) => {
  const { stripe_customer_id, stripe_subscription_id } = req.body;
  try {
    const priceData = await stripe.customers.listPaymentMethods(
      stripe_customer_id,
      {
        type: "card",
      }
    );
    if (!priceData) return res.status(404).json({ msg: "No Pirce Data" });
    const subscriptionData = await stripe.subscriptions.retrieve(
      stripe_subscription_id
    );
    if (!subscriptionData)
      return res.status(404).json({ msg: "No Subscription Data" });

    return res
      .status(200)
      .json({ price_data: priceData, subscription_data: subscriptionData });
  } catch (e) {
    resError(res, e);
  }
};

const detachPaymentMethod = async (req, res) => {
  const { paymentId } = req.body;
  await stripe.paymentMethods
    .detach(paymentId)
    .then(() => {
      return res.status(200);
    })
    .catch((err) => {
      return resError(res, err);    });
};

const updateSubscription = async (req, res) => {
  const { subscription_id, data } = req.body;
  try {
    const result = await stripe.subscriptions.update(subscription_id, data);
    return res.status(200).json({ data: result });
  } catch (err) {
    resError(res, err);
  }
};

const retrieveSubscription = (req, res) => {
  const { subscription_id } = req.body;
  stripe.subscriptions
    .retrieve(subscription_id)
    .then((result) => {
      return res.status(200).json({ result });
    })
    .catch((err) => {
      console.log(err);
      return resError(res, err);
    });
};

const cancelSubscription = (req, res) => {
  const { subscription_id } = req.body;
  stripe.subscriptions
    .cancel(subscription_id)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const customerListPaymentMethod = (req, res) => {
  const { subscription_id } = req.body;
  stripe.customers
    .listPaymentMethods(subscription_id, {
      type: "card",
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const syncTime = (req, res) => {
  const date = new Date();
  return res.status(200).json({ date: date });
};

const additionalCharge = async (req, res) => {
  const { price, customer, description } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price * 100,
    currency: "usd",
    customer: customer,
    description: description ? description : "",
  });

  return res.status(200).json({ client_secret: paymentIntent.client_secret });
};

const customerCreditBalance = async (req, res) => {
  const { stripe_customer_id, description, cost } = req.body;
  const customerBalanceTransaction =
    await stripe.customers.createBalanceTransaction(stripe_customer_id, {
      amount: -cost * 100,
      currency: "usd",
      description: description || "",
    });
  if (customerBalanceTransaction) {
    return res.status(200).json({ result: "success" });
  } else {
    return res.status(500).josn({ result: "failed" });
  }
};

module.exports = {
  createPaymentIntent,
  createPaymentMethod,
  createCustomer,
  attachPaymentMethod,
  createPrice,
  retrievePrice,
  createSubscription,
  addPaymentMethod,
  getPaymentMethodInfo,
  updateSubscription,
  detachPaymentMethod,
  retrieveSubscription,
  cancelSubscription,
  customerListPaymentMethod,
  syncTime,
  additionalCharge,
  customerCreditBalance,
};
