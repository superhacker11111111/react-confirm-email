const QA = require("../model/QA");
const QACategory = require("../model/QACategory");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");

const getQAList = async (req, res) => {
  try {
    const categories = await QACategory.findAll({
      where: { isDeleted: false },
      order: [["name", "ASC"]],
    });
    const result = [];
    await Promise.all(
      categories &&
        categories.length > 0 &&
        categories.map(async (category) => {
          const QAs = await QA.findAll({
            where: {
              isDeleted: false,
              category: category.id,
            },
            order: [["createdAt", "DESC"]],
          });
          if (QAs && QAs.length > 0) {
            result.push({
              categoryTitle: category.name,
              qaData: QAs,
            });
          }
        })
    );
    return resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
};

const getQAByID = async (req, res) => {
  const id = req.params.id;
  QA.findByPk(id)
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const createQA = (req, res) => {
  const reqData = req.body;
  QA.findOne({
    where: { question: reqData.question, isDeleted: false },
  }).then((qa) => {
    if (qa) {
      return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
    } else {
      QA.create(reqData)
        .then((result) => {
          return resMsg(res, resCode.CREATED, resMessage.CREATED);
        })
        .catch((err) => {
          resError(res);
        });
    }
  });
};

const updateQA = async (req, res) => {
  const reqData = req.body;

  const id = req.params.id;
  const qa = await QA.findOne({
    where: { question: reqData.question, isDeleted: false },
  });
  if (qa && qa.id !== id) {
    return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
  } else {
    QA.update(reqData, { where: { id: id } })
      .then(async () => {
        return resSuccess(res);
      })
      .catch((err) => {
        return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
      });
  }
};
//Delete
const deleteQA = async (req, res) => {
  await QA.update({ isDeleted: true }, { where: { id: req.params.id } })
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};

module.exports = {
  getQAList,
  getQAByID,
  createQA,
  updateQA,
  deleteQA,
};
