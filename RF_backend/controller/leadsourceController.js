const LeadSource = require("../model/LeadSource");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");

require("dotenv").config();

const getLeadSourceList = async (req, res) => {
  LeadSource.findAll({
    where: { isDeleted: false },
    order: [["name", "ASC"]],
  })
    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const createLeadSource = (req, res) => {
  const reqData = req.body;

  LeadSource.create(reqData)
    .then(() => {
      return resMsg(res, resCode.CREATED, resMessage.CREATED);
    })
    .catch((err) => {
      resError(res, err);
    });
};

//Delete
const deleteLeadSource = async (req, res) => {
  await LeadSource.update({ isDeleted: true }, { where: { id: req.params.id } })
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};

const deletemultiLeadSource = async (req, res) => {
  const { ids } = req.body;
  if (ids && ids.length > 0) {
    await LeadSource.update({ isDeleted: true }, { where: { id: ids } })
      .then(() => {
        return resSuccess(res);
      })
      .catch((err) => {
        return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
      });
  }
  return resSuccess(res);
};

module.exports = {
  getLeadSourceList,
  createLeadSource,
  deleteLeadSource,
  deletemultiLeadSource,
};
