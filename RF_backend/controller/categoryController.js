const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");
const Category = require("../model/Category");
const Fence = require("../model/Fence");
const { Op } = require("sequelize");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const multer = require("multer");
const { resMessage, resCode } = require("../constants/resCode");
// Category
const getCategoryList = async (req, res) => {
  // const id = req.user.id;
  // const searchData = {
  //   name: req.body.Category_name ? req.body.Category_name : "all",
  //   description: req.body.Category_description
  //     ? req.body.Category_description
  //     : "all",
  //   // status: req.body.status ? req.body.status : "all",
  //   Category_code: req.body.Category_code ? req.body.Category_code : "",
  //   pageNumber: req.body.pageNumber ? req.body.pageNumber : 1,
  //   pageSize: req.body.pageSize ? req.body.pageSize : 5,
  //   sortOrder: req.body.sortOrder ? req.body.sortOrder : 1,
  // };
  // searchData.offset =
  //   Number(searchData.pageNumber - 1) * Number(searchData.pageSize);
  Category.findAll({
    where: {
      [Op.and]: [
        { isDeleted: false },

        // {
        //   status:
        //     searchData.status === "all"
        //       ? { [Op.not]: "all" }
        //       : searchData.status,
        // },
      ],
    },
    // offset: searchData.offset,
    // limit: searchData.pageSize,
    order: [["createdAt", "DESC"]],
  })

    .then(async (categories) => {
      // const productCount = await Product.count({ where: { isDeleted: false } });
      // const selectedCount = await ProductSelection.count({
      //   where: { user_id: id },
      // });
      return resSuccess(res, {
        category: categories,
        // totalCount: categories.length,
        // productCount: productCount,
        // selectedCount: selectedCount,
      });
    })
    .catch((err) => {
      return resError(res, err);
    });
};
const createCategory = async (req, res) => {
  const categoryData = {
    name: req.body.name,
    images: req.body.images,
    sub_categories: req.body.subCategories,
    styles: req.body.styles,
    colors: req.body.colors,
  };
  Category.create(categoryData)
    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      return resMsg(res, resCode.CREATED, resMessage.CREATED);
    })
    .catch((err) => {
      return resError(res, err);
    });
};
const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const updateData = req.body;

  Category.update(updateData, { where: { id: categoryId } })
    .then((result) => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resError(res, err);
    });
};
const deleteCategory = async (req, res) => {
  const Categoryid = req.params.id;
  await Category.update({ isDeleted: true }, { where: { id: Categoryid } })
    .then(() => {
      return resMsg(res, SUCCESS, SUCCESSMSG);
    })
    .catch((err) => {
      // return resMsg(res, SERVERERROR, SERVERERRORMSG);
      return resError(res, err);
    });
};
const deleteCategorys = async (req, res) => {
  const ids = await req.body.ids;
  await Category.update(
    { isDeleted: true },
    {
      where: {
        id: ids,
      },
    }
  )
    .then(() => {
      return resMsg(res, SUCCESS, SUCCESSMSG);
    })
    .catch((err) => {
      // return resMsg(res, SERVERERROR, SERVERERRORMSG);
      return resError(res, err);
    });
};
const getCategoryByName = async (req, res) => {
  const id = req.params.id;
  Category.findByPk(id)
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const getStylesByName = async (req, res) => {
  const styleData = req.body.data;
  const tagData = req.body.selectedChips;
  let styleQuery;
  if (styleData.length !== 0) {
    styleQuery = styleData.map((style) => `"style" = '${style}'`).join(" OR ");
  } else {
    styleQuery = `"style" LIKE '%'`;
  }
  const queryString = `
    SELECT
      "id", "name", "description", "filesImage", "filesDocs", "files3D", "category",
      "sub_category", "style", "color", "size", "status", "addedBy", "tags", "visible",
      "pdf_url", "createdAt", "updatedAt", "isDeleted"
    FROM
      (SELECT
        *
      FROM
        "Fences"
      WHERE
        (${styleQuery}) AND "isDeleted" = false) AS "Style"
    WHERE
      ARRAY[${tagData
        .map((tag) => `'${tag}'`)
        .join(", ")}]::varchar[] <@ "Style"."tags";
  `;
  await sequelize
    .query(queryString, { type: QueryTypes.SELECT })
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const getStyles = async (req, res) => {
  Category.findAll({ where: { isDeleted: false } })
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => resError(res));
};

module.exports = {
  createCategory,
  getCategoryList,
  updateCategory,
  getCategoryByName,
  deleteCategory,
  deleteCategorys,
  getStyles,
  getStylesByName,
};
