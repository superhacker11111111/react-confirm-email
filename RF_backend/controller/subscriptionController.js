const Subscription = require("../model/Subscription");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");
const {
  DEFAULT_PASSWORD,
  Roles,
  UserType,
  DEFAULT_IS_DELETED,
  USER_STATUS,
  Type,
} = require("../constants/constant");
require("dotenv").config();

const getSubscriptionList = async (req, res) => {
  Subscription.findAll({
    where: { isDeleted: false },
    order: [["price", "ASC"]],
  })
    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const getSubscriptionByID = async (req, res) => {
  const id = req.params.id;
  Subscription.findByPk(id)
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const createSubscription = (req, res) => {
  const reqData = req.body;
  Subscription.findOne({
    where: { name: reqData.name, isDeleted: false },
  }).then((subscription) => {
    if (subscription) {
      return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
    } else {
      Subscription.create(reqData)
        .then((result) => {
          return resMsg(res, resCode.CREATED, resMessage.CREATED);
        })
        .catch((err) => {
          resError(res);
        });
    }
  });
};

const updateSubscription = async (req, res) => {
  const reqData = req.body;

  const id = req.params.id;
  const subscription = await Subscription.findOne({
    where: { name: reqData.name },
  });
  if (subscription && subscription.id !== id) {
    return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
  } else {
    Subscription.update(reqData, { where: { id: id } })
      .then(async () => {
        return resSuccess(res);
      })
      .catch((err) => {
        return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
      });
  }
};
//Delete
const deleteSubscription = async (req, res) => {
  await Subscription.update(
    { isDeleted: true },
    { where: { id: req.params.id } }
  )
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};

module.exports = {
  getSubscriptionList,
  getSubscriptionByID,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};
