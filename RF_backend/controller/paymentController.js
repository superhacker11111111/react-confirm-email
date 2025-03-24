const Billing = require("../model/Billing");
const { Op } = require("sequelize");

const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");
const { DEFAULT_SEARCH_PARAMS } = require("../constants/constant");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    // For sample support and debugging, not required for production:
    name: "stripe-samples/accept-a-payment/payment-element",
    version: "0.0.2",
    url: "https://github.com/stripe-samples",
  },
});

const getBillingList = async (req, res) => {
  const searchData = {
    customer: req.body.customer ? req.body.customer : "all",
    pageNumber: req.body.pageNumber
      ? req.body.pageNumber
      : DEFAULT_SEARCH_PARAMS.PAGE_NUMBER,
  };
  searchData.offset =
    Number(searchData.pageNumber) * Number(DEFAULT_SEARCH_PARAMS.PAGE_SIZE);
  Billing.findAndCountAll({
    where: {
      [Op.and]: [
        { isDeleted: false },
        {
          customer_id:
            searchData.customer === "all"
              ? { [Op.not]: "all" }
              : searchData.customer,
        },
      ],
    },
    // offset: searchData.offset,
    // limit: DEFAULT_SEARCH_PARAMS.PAGE_SIZE,
    order: [["createdAt", "DESC"]],
  })
    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);

      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const getBillingDetail = async (req, res) => {
  const { id } = req.body;
  try {
    const billing = await Billing.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    const customer = await stripe.customers.retrieve(billing.customer_id);
    return res.status(200).json({
      data: {
        ...billing.dataValues,
        customer_address: customer.address,
        customer_name: customer.name,
        customer_email: customer.email,
      },
    });
  } catch (err) {
    resError(res, err);
  }
};

module.exports = {
  getBillingList,
  getBillingDetail,
};
