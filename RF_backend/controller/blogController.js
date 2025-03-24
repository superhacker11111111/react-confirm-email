const Blog = require("../model/Blog");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");
const AWS = require("aws-sdk");

// Create an instance of the SNS service
const sns = new AWS.SNS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const getBlogList = async (req, res) => {
  const searchData = {
    pageNumber: req.query.pageNumber ? req.query.pageNumber : 1,
    limit: req.query.limit ? req.query.limit : 6,
  };
  const offset = (Number(searchData.pageNumber) - 1) * 6;
  try {
    const blogs = await Blog.findAll({
      where: { isDeleted: false, isDraft: false },
      offset: offset,
      limit: searchData.limit,
      order: [["createdAt", "DESC"]],
    });
    const drafts = await Blog.findAll({
      where: { isDeleted: false, isDraft: true },
      order: [["createdAt", "ASC"]],
    });
    return resSuccess(res, {
      blogs: blogs,
      drafts: drafts,
    });
  } catch (err) {
    resError(res, err);
  }
};

const getBlogByID = async (req, res) => {
  const id = req.params.id;
  Blog.findByPk(id)
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const createBlog = (req, res) => {
  const reqData = req.body;

  Blog.create(reqData)
    .then((result) => {
      return resSuccess(res, result.Products);
    })
    .catch((err) => {
      console.log(err);
      resError(res);
    });
};

const updateBlog = async (req, res) => {
  const reqData = req.body;

  const id = req.params.id;
  Blog.update(reqData, { where: { id: id } })
    .then(async () => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};
//Delete
const deleteBlog = async (req, res) => {
  await Blog.update({ isDeleted: true }, { where: { id: req.params.id } })
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};

module.exports = {
  getBlogList,
  getBlogByID,
  createBlog,
  updateBlog,
  deleteBlog,
};
