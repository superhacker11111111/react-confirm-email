const ED = require("../model/ED");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");
const AWS = require("aws-sdk");

const sns = new AWS.SNS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const getEDList = async (req, res) => {
  try {
    const eds = await ED.findAll({
      where: { isDeleted: false, isDraft: false },
      order: [["createdAt", "ASC"]],
    });
    const drafts = await ED.findAll({
      where: { isDeleted: false, isDraft: true },
      order: [["createdAt", "ASC"]],
    });
    return resSuccess(res, {
      eds: eds,
      drafts: drafts,
    });
  } catch (err) {
    resError(res, err);
  }
};

const getEDByID = async (req, res) => {
  const id = req.params.id;
  ED.findByPk(id)
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const createED = (req, res) => {
  const reqData = req.body;
  ED.findOne({
    where: { url: reqData.url, isDeleted: false },
  })
    .then((ed) => {
      if (ed) {
        return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
      } else {
        ED.create(reqData).then((result) => {
          return resMsg(res, resCode.CREATED, resMessage.CREATED);
        });
      }
    })
    .catch((err) => {
      resError(res, err);
    });
};

const updateED = async (req, res) => {
  const reqData = req.body;

  const id = req.params.id;
  const ed = await ED.findOne({
    where: { url: reqData.url, isDeleted: false },
  });
  if (ed && ed.id !== id) {
    return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
  } else {
    ED.update(reqData, { where: { id: id } })
      .then(async () => {
        return resSuccess(res);
      })
      .catch((err) => {
        return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
      });
  }
};
//Delete
const deleteED = async (req, res) => {
  await ED.update({ isDeleted: true }, { where: { id: req.params.id } })
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};

module.exports = {
  getEDList,
  getEDByID,
  createED,
  updateED,
  deleteED,
};
