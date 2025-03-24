const QACategory = require("../model/QACategory");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");

const getCategoryList = async (req, res) => {
  QACategory.findAll({
    where: { isDeleted: false },
    order: [["createdAt", "ASC"]],
  })
    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const getCategoryByID = async (req, res) => {
  const id = req.params.id;
  QACategory.findByPk(id)
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const createCategory = (req, res) => {
  const reqData = req.body;
  QACategory.findOne({
    where: { name: reqData.name, isDeleted: false },
  }).then((qa) => {
    if (qa) {
      return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
    } else {
      QACategory.create(reqData)
        .then((result) => {
          return resMsg(res, resCode.CREATED, resMessage.CREATED);
        })
        .catch((err) => {
          resError(res);
        });
    }
  });
};

const updateCategory = async (req, res) => {
  const reqData = req.body;

  const id = req.params.id;
  const qa = await QACategory.findOne({
    where: { name: reqData.name, isDeleted: false },
  });
  if (qa && qa.id !== id) {
    return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
  } else {
    QACategory.update(reqData, { where: { id: id } })
      .then(async () => {
        return resSuccess(res);
      })
      .catch((err) => {
        return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
      });
  }
};
//Delete
const deleteCategory = async (req, res) => {
  await QACategory.update({ isDeleted: true }, { where: { id: req.params.id } })
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};

module.exports = {
  getCategoryList,
  createCategory,
  getCategoryByID,
  updateCategory,
  deleteCategory,
};
