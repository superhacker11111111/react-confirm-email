const express = require("express");
const router = express.Router();
const authRouter = require("./api/authRouter");
const userRouter = require("./api/userRouter");
const adminRouter = require("./api/adminRouter");
const accountRouter = require("./api/accountRouter");
const fenceRouter = require("./api/fenceRouter");
const categoryRouter = require("./api/categoryRouter");
const QACategoryRouter = require("./api/QACategoryRouter");
const mediaRouter = require("./api/mediaRouter");
const paymentRouter = require("./api/paymentRouter");
const tagRouter = require("./api/tagRouter");
const QARouter = require("./api/qaRouter");
const edRouter = require("./api/edRouter");
const blogRouter = require("./api/blogRouter");
const subscriptionRouter = require("./api/subscriptionRouter");
const stripeRouter = require("./api/stripeRouter");
const serviceRouter = require("./api/serviceRouter");
const deviceRouter = require("./api/deviceRouter");
const leadsourceRouter = require("./api/leadsourceRouter");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/products", fenceRouter);
router.use("/account", accountRouter);
router.use("/category", categoryRouter);
router.use("/qacategory", QACategoryRouter);
router.use("/media", mediaRouter);
router.use("/payment", paymentRouter);
router.use("/tag", tagRouter);
router.use("/qa", QARouter);
router.use("/ed", edRouter);
router.use("/blog", blogRouter);
router.use("/subscription", subscriptionRouter);
router.use("/stripe", stripeRouter);
router.use("/contact", serviceRouter);
router.use("/leadsource", leadsourceRouter);
router.use("/register-device", deviceRouter);

module.exports = router;
