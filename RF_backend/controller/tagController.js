const sequelize = require("../config/database");
const { Op } = require("sequelize");
const Tag = require("../model/tag");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");

const getTags = (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword : "";
  Tag.findAll({
    where: [{ isDeleted: false }, { title: { [Op.iLike]: `%${keyword}%` } }],
    order: [["title", "ASC"]],
  })
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      resError(res);
    });
};

const updateTags = (req, res) => {
  const updateData = {
    deletedlist: req.body.deletelist,
    createdlist: req.body.createlist,
  };
  Tag.update(
    { isDeleted: true },
    {
      where: {
        id: updateData.deletedlist,
      },
    }
  )
    .then(() => {
      const data = [];
      updateData.createdlist &&
        updateData.createdlist.length > 0 &&
        updateData.createdlist.forEach((element) => {
          data.push({ title: element });
        });
      Tag.bulkCreate(data)
        .then((result) => {
          if (result) {
            resSuccess(res);
          } else {
            resError(res, resMessage.CREATE_FAILED);
          }
        })
        .catch((err) => {
          console.log(err);
          resError(res);
        });
    })
    .catch((err) => {
      console.log(err);
      return resError(res);
    });
};

module.exports = {
  updateTags,
  getTags,
};
