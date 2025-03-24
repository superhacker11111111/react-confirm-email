const Media = require("../model/Media");
const { resMsg, resError, resSuccess } = require("../utils/responseMessage");
const { MediaType } = require("../constants/constant");

const createOrUpdateVideo = async (req, res) => {
  try {
    const videoData = req.body;
    const isTutorialExist = await Media.findOne({
      where: { type: MediaType.tutorialVideo },
    });
    if (isTutorialExist) {
      await Media.update(
        { url: videoData.tutorialURL },
        {
          where: { type: MediaType.tutorialVideo },
        }
      );
    } else {
      await Media.create({
        type: MediaType.tutorialVideo,
        url: videoData.tutorialURL,
      });
    }
    const isMarketingExist = await Media.findOne({
      where: { type: MediaType.marketingVideo },
    });
    if (isMarketingExist) {
      await Media.update(
        { url: videoData.marketingURL },
        {
          where: { type: MediaType.marketingVideo },
        }
      );
    } else {
      await Media.create({
        type: MediaType.marketingVideo,
        url: videoData.marketingURL,
      });
    }
    return resSuccess(res);
  } catch (err) {
    resError(res, err);
  }
};

const getVideos = async (req, res) => {
  try {
    const tutorial = await Media.findOne({
      where: { type: MediaType.tutorialVideo, isDeleted: false },
    });
    const marketing = await Media.findOne({
      where: { type: MediaType.marketingVideo, isDeleted: false },
    });
    return resSuccess(res, {
      marketingURL: marketing.url.preview,
      tutorialURL: tutorial.url.preview,
    });
  } catch (err) {
    resError(res, err);
  }
};

const getAllImages = async (req, res) => {
  const searchData = {
    pageNumber: req.query.pageNumber,
    limit: req.query.limit ? req.query.limit : 20,
  };
  const offset = (Number(searchData.pageNumber) - 1) * 20;
  try {
    const images = await Media.findAll({
      where: { isDeleted: false, type: MediaType.galleryImage },
      offset: offset,
      limit: searchData.limit,
      order: [["createdAt", "DESC"]],
    });
    const count = await Media.count({
      where: { isDeleted: false, type: MediaType.galleryImage },
    });
    resSuccess(res, { images: images, totalCount: count });
  } catch (err) {
    resError(res, err);
  }
};

const deleteImage = async (req, res) => {
  const id = req.params.id;

  Media.update({ isDeleted: true }, { where: { id: id } })
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const createImages = async (req, res) => {
  const images = req.body;
  try {
    let imageData = [];
    images.forEach((url) => {
      const image = {
        type: MediaType.galleryImage,
        url: url,
      };
      imageData.push(image);
    });
    const result = await Media.bulkCreate(imageData);
    return resSuccess(res);
  } catch (err) {
    resError(res, err);
  }
  await MarketingMedia.update({ isDeleted: true }, { where: { id: id } })
    .then(() => {
      return resMsg(res, SUCCESS, SUCCESSMSG);
    })
    .catch((err) => {
      // return resMsg(res, SERVERERROR, SERVERERRORMSG);
      return resError(res, err);
    });
};

module.exports = {
  createOrUpdateVideo,
  getVideos,
  getAllImages,
  createImages,
  deleteImage,
};
