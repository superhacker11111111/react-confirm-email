const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");
const Fence = require("../model/Fence");
const { Op, col, fn } = require("sequelize");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const multer = require("multer");
const { resMessage, resCode } = require("../constants/resCode");
const {
  FENCE_STATUS,
  DEFAULT_SEARCH_PARAMS,
} = require("../constants/constant");
const User = require("../model/User");
const AWS = require("aws-sdk");

const sns = new AWS.SNS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Fence
const getFenceList = async (req, res) => {
  const searchData = {
    keyword: req.query.keyword ? req.query.keyword : "",
    // name: req.body.Product_name ? req.body.Product_name : "all",
    // description: req.body.Product_description
    //   ? req.body.Product_description
    //   : "all",
    // status: req.body.status ? req.body.status : "all",
    // Product_code: req.body.Product_code ? req.body.Product_code : "",
    // pageNumber: req.body.pageNumber ? req.body.pageNumber : 1,
    // pageSize: req.body.pageSize ? req.body.pageSize : 5,
    // sortOrder: req.body.sortOrder ? req.body.sortOrder : 1,
  };
  // searchData.offset =
  //   Number(searchData.pageNumber - 1) * Number(searchData.pageSize);
  await sequelize
    .query(
      `SELECT
        f.ID,
        f."name",
        f.description,
        f."filesImage",
        C."name" AS category,
        f.sub_category,
        f.style,
        f.color,
        f."size",
        f.status,
        f."visible",
        f."createdAt" 
      FROM
        "Fences" f
        LEFT JOIN "Categories" C ON f.category = C."id" 
      WHERE
        f."isDeleted" = FALSE
        AND f.status = '${FENCE_STATUS.MODELING}'
        AND
          (f.name ILIKE '%${searchData.keyword}%' OR 
          f.description ILIKE '%${searchData.keyword}%' OR 
          f.style ILIKE '%${searchData.keyword}%' OR 
          f.color ILIKE '%${searchData.keyword}%' OR 
          f.size ILIKE '%${searchData.keyword}%' OR
          EXISTS (
              SELECT 1
              FROM unnest(f.tags) AS t
              WHERE t ILIKE '%${searchData.keyword}%'
            ) OR
          c."name" ILIKE '%${searchData.keyword}%')
          ORDER BY
          c."name" ASC`,
      {
        type: QueryTypes.SELECT,
      }
    )
    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      return resSuccess(res, { product: result, totalcount: result.length });
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const getFenceListByName = async (req, res) => {
  const searchData = {
    keyword: req.query.keyword ? req.query.keyword : "",
    // name: req.body.Product_name ? req.body.Product_name : "all",
    // description: req.body.Product_description
    //   ? req.body.Product_description
    //   : "all",
    // status: req.body.status ? req.body.status : "all",
    // Product_code: req.body.Product_code ? req.body.Product_code : "",
    // pageNumber: req.body.pageNumber ? req.body.pageNumber : 1,
    // pageSize: req.body.pageSize ? req.body.pageSize : 5,
    // sortOrder: req.body.sortOrder ? req.body.sortOrder : 1,
  };
  // searchData.offset =
  //   Number(searchData.pageNumber - 1) * Number(searchData.pageSize);
  await sequelize
    .query(
      `SELECT
        f.ID,
        f."name",
        f.description,
        f."filesImage",
        C."name" AS category,
        f.sub_category,
        f.style,
        f.color,
        f."size",
        f.status,
        f."visible",
        f."createdAt" 
      FROM
        "Fences" f
        LEFT JOIN "Categories" C ON f.category = C."id" 
      WHERE
        f."isDeleted" = FALSE
        AND f.status = '${FENCE_STATUS.MODELING}'
        AND
          (f.name ILIKE '%${searchData.keyword}%' OR 
          f.description ILIKE '%${searchData.keyword}%' OR 
          f.style ILIKE '%${searchData.keyword}%' OR 
          f.color ILIKE '%${searchData.keyword}%' OR 
          f.size ILIKE '%${searchData.keyword}%' OR
          EXISTS (
                  SELECT 1
                  FROM unnest(f.tags) AS t
                  WHERE t ILIKE '%${searchData.keyword}%'
              ) OR
          c."name" ILIKE '%${searchData.keyword}%')
          ORDER BY
          f."createdAt" DESC`,
      {
        type: QueryTypes.SELECT,
      }
    )

    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      return resSuccess(res, { product: result, totalcount: result.length });
    })
    .catch((err) => {
      return resError(res, err);
    });
};

// const getFenceById = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const fence = await Fence.findByPk(id);
//     resSuccess(res, fence);
//   } catch (err) {
//     console.log(err);
//     resError(res);
//   }
// };

const getFenceById = async (req, res) => {
  const id = req.params.id;
  try {
    const fence = await Fence.findOne({
      where: {
        isDeleted: false,
        id: id,
        status: FENCE_STATUS.MODELING,
      },
    });
    if (!fence) {
      return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
    return resSuccess(res, fence);
  } catch (err) {
    console.log(err);
    resError(res);
  }
};

const getFenceByCategoryId = async (req, res) => {
  const id = req.params.id;
  try {
    const fence = await Fence.findAll({ category: id });
    resSuccess(res, fence);
  } catch (err) {
    console.log(err);
    resError(res);
  }
};

const createFence = async (req, res) => {
  let fenceData = {
    name: req.body.name,
    description: req.body.description,
    filesImage: req.body.filesImage ? req.body.filesImage : [],
    files3D: req.body.files3D ? req.body.files3D : [],
    tags: req.body.tags ? req.body.tags : [],
    sub_category: req.body.sub_category,
    style: req.body.style,
    category: req.body.category,
    size: req.body.size,
    color: req.body.color,
    addedBy: req.body.addedBy,
    status: req.body.status ? req.body.status : FENCE_STATUS.NOT_STARTED,
  };
  try {
    const newFence = await Fence.create(fenceData);
    return resSuccess(res, newFence);
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const updateFence = async (req, res) => {
  const productid = req.params.productid;
  let productData = req.body;

  Fence.update(productData, { where: { id: productid } })
    .then((result) => {
      return resSuccess(res);
    })
    .catch((err) => {
      // return resMsg(res, SERVERERROR, SERVERERRORMSG);
      return resError(res, err);
    });
};

const getFenceId = async (req, res) => {
  const productid = req.params.id;
  Fence.findOne({
    where: {
      id: productid,
    },
  })
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      console.log(err);
      resError(res, err);
    });
};

const updateFenceVisible = async (req, res) => {
  const updateData = req.body;
  try {
    updateData &&
      updateData.length > 0 &&
      updateData.forEach(async (data) => {
        await Fence.update(
          { visible: data.visible },
          { where: { id: data.id } }
        );
      });
    return resSuccess(res);
  } catch (err) {
    resError(res, err);
  }
};

const updateFenceStatus = async (req, res) => {
  const updateData = req.body;
  try {
    updateData &&
      updateData.length > 0 &&
      updateData.forEach(async (data) => {
        await Fence.update({ status: data.status }, { where: { id: data.id } });
        // await User.update(
        //   {
        //     selectedFences: sequelize.literal(
        //       `array_remove(selectedFences, '${data.id}')`
        //     ),
        //   },
        //   { where: { selectedFences: { [Op.contains]: [data.id] } } }
        // );
        data.status === FENCE_STATUS.COMPLETE &&
          (await User.update(
            {
              selectedFences: fn(
                "array_remove",
                col("selectedFences"),
                data.id
              ),
            },
            { where: { selectedFences: { [Op.contains]: [data.id] } } }
          ));
      });
    return resSuccess(res);
  } catch (err) {
    resError(res, err);
  }
};

const deleteFence = async (req, res) => {
  const productid = req.params.id;
  await Fence.update({ isDeleted: true }, { where: { id: productid } })
    .then(() => {
      return resMsg(res, SUCCESS, SUCCESSMSG);
    })
    .catch((err) => {
      // return resMsg(res, SERVERERROR, SERVERERRORMSG);
      return resError(res, err);
    });
};
const deleteFences = async (req, res) => {
  const ids = await req.body.ids;
  await Fence.update(
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

const getRequestFencesByUser = async (req, res) => {
  const id = req.params.userId;
  // const selectFences = [];
  // const favoFences = [];
  try {
    const requestFences = await Fence.findAll({
      where: {
        isDeleted: false,
        addedBy: id,
        status: {
          [Op.and]: [
            { [Op.not]: FENCE_STATUS.COMPLETE },
            { [Op.not]: FENCE_STATUS.MODELING },
          ],
        },
      },
    });
    const selectFences_query = `SELECT 
      f.ID,
        f."name",
        f.description,
        f."filesImage",
        C."name" AS category,
        f.sub_category,
        f.style,
        f.color,
        f."size",
        f.status,
        f."visible",
        f."createdAt"
      FROM "Fences" f
         LEFT JOIN "Categories" C ON f.category = C."id" 
      JOIN (
          SELECT unnest("selectedFences") AS "id"
          FROM "Users" WHERE "id" = '${id}' AND "isDeleted" = false
      ) AS "Users_ids"
      ON f.id = "Users_ids".id
       ORDER BY
          c."name" ASC`;

    const selectFences = await sequelize.query(selectFences_query);
    const favoFences_query = `SELECT *
    FROM "Fences"
    JOIN (
        SELECT unnest("favoriteFences") AS "id"
        FROM "Users" WHERE "id" = '${id}' AND "isDeleted" = false
    ) AS "Users_ids"
    ON "Fences".id = "Users_ids".id`;

    const favoFences = await sequelize.query(favoFences_query);
    resSuccess(res, {
      requestlist: requestFences,
      selectedlist: selectFences[0],
      favoritelist: favoFences[0],
    });
  } catch (err) {
    console.log(err);
    resError(res);
  }
};

const getFencesByUserId = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    const query = `
 SELECT *
FROM "Fences"
JOIN (
    SELECT unnest("selectedFences") AS "id"
    FROM "Users" WHERE "id" = $1
) AS "Users_ids"
ON "Fences".id = "Users_ids".id;`;
    // const query = `SELECT * FROM your_table WHERE id = $1`;

    const result = await sequelize.query(query, [id]);

    const totalCount = await Fence.count({ where: { isDeleted: false } });
    return resSuccess(res, {
      list: result,
      totalCount: totalCount,
      selectedCount: result.length,
    });
  } catch (error) {
    resError(res);
  }
};

const getSelectableElements = (req, res) => {
  // const id = req.params.id;
  const whereClause = req.body.data;
  Fence.findAll({
    where: {
      ...whereClause,
      isDeleted: false,
      status: FENCE_STATUS.MODELING,
      visible: true,
    },
    order: [["createdAt", "DESC"]],
  })
    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      return resSuccess(res, { elements: result });
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const getVisibleFences = async (req, res) => {
  console.log("req.query :>> ", req.query);
  const searchData = {
    limit: req.query.limit ? req.query.limit : 20,
  };
  await sequelize
    .query(
      `SELECT
        f.ID,
        f."name",
        f.description,
        f."filesImage",
        C."name" AS category,
        f.sub_category,
        f.style,
        f.color,
        f."size",
        f.status,
        f."visible",
        f."createdAt" 
      FROM
        "Fences" f
        LEFT JOIN "Categories" C ON f.category = C."id" 
      WHERE
        f."isDeleted" = FALSE AND f."visible" = TRUE
        AND f.status = '${FENCE_STATUS.MODELING}'
        ORDER BY
        c."name" ASC, f."name" ASC
        LIMIT ${searchData.limit} OFFSET 0`,
      {
        type: QueryTypes.SELECT,
      }
    )
    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      return resSuccess(res, { product: result, totalcount: result.length });
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const getAssetRequests = (req, res) => {
  const searchParams = {
    pageSize: req.query.pageSize
      ? req.query.pageSize
      : DEFAULT_SEARCH_PARAMS.PAGE_SIZE,
    pageNumber: req.query.pageNumber
      ? req.query.pageNumber
      : DEFAULT_SEARCH_PARAMS.PAGE_NUMBER,
    sortOrder: req.query.sortOrder
      ? req.query.sortOrder
      : DEFAULT_SEARCH_PARAMS.SORT_ORDER,
    sortField: req.query.sortField ? req.query.sortField : "date",
    filter: req.query.filter ? req.query.filter : DEFAULT_SEARCH_PARAMS.FILTER,
  };
  searchParams.offset =
    parseInt(searchParams.pageSize) * parseInt(searchParams.pageNumber);
  sequelize
    .query(
      `SELECT
        u."id" AS id,
        u."company" AS company,
        u."fullName" AS primaryContact,
        u."createdAt" AS DATE,
        u."avatarUrl" AS "avatarUrl",
        COUNT ( P."id" ) AS requested,
        ARRAY_AGG ( P."id" ) AS requestList 
      FROM
        "Users" u
        LEFT JOIN "Fences" P ON P."addedBy" = u."id" 
      WHERE
        P."isDeleted" = FALSE AND P.status != '${FENCE_STATUS.MODELING}' ${
        searchParams.filter !== "all"
          ? `AND P.status = '${searchParams.filter}'`
          : ""
      }
      GROUP BY
        u."id",
        u."company",
        u."fullName",
        u."createdAt",
        u."avatarUrl" 
      ORDER BY
        ${searchParams.sortField} ${searchParams.sortOrder} 
        LIMIT ${searchParams.pageSize} OFFSET ${searchParams.offset}`,
      {
        type: QueryTypes.SELECT,
      }
    )
    .then(async (result) => {
      const allData = await sequelize.query(
        `SELECT
	        u."id" AS ID 
            FROM "Users" u LEFT JOIN "Fences" P ON P."addedBy" = u."id" 
            WHERE P."isDeleted" = FALSE AND P.status != '${
              FENCE_STATUS.MODELING
            }' ${
          searchParams.filter !== "all"
            ? `AND P.status = '${searchParams.filter}'`
            : ""
        } 
            GROUP BY u."id"`,
        {
          type: QueryTypes.SELECT,
        }
      );
      const notStarted = await sequelize.query(
        `SELECT
          count(*)
        FROM
          "Users" u
          LEFT JOIN "Fences" P ON P."addedBy" = u."id" 
        WHERE
          P."isDeleted" = FALSE AND P.status = '${FENCE_STATUS.NOT_STARTED}'`,
        {
          type: QueryTypes.SELECT,
        }
      );
      const pending = await sequelize.query(
        `SELECT
          count(*)
        FROM
          "Users" u
          LEFT JOIN "Fences" P ON P."addedBy" = u."id" 
        WHERE
          P."isDeleted" = FALSE AND P.status = '${FENCE_STATUS.PENDING}'`,
        {
          type: QueryTypes.SELECT,
        }
      );
      const complete = await sequelize.query(
        `SELECT
          count(*)
        FROM
          "Users" u
          LEFT JOIN "Fences" P ON P."addedBy" = u."id" 
        WHERE
          P."isDeleted" = FALSE AND P.status = '${FENCE_STATUS.COMPLETE}'`,
        {
          type: QueryTypes.SELECT,
        }
      );
      const allCount = await sequelize.query(
        `SELECT
          count(*)
        FROM
          "Users" u
          LEFT JOIN "Fences" P ON P."addedBy" = u."id" 
        WHERE
          P."isDeleted" = FALSE AND P.status != '${FENCE_STATUS.MODELING}'`,
        {
          type: QueryTypes.SELECT,
        }
      );
      return resSuccess(res, {
        fences: result,
        dataCount: allData.length,
        totalCount: allCount[0].count,
        notStarted: notStarted[0].count,
        pending: pending[0].count,
        complete: complete[0].count,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAssetRequest = async (req, res) => {
  const id = req.params.id;

  try {
    const company = await User.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    const result = await sequelize.query(
      `SELECT
	f.ID,
	f."name",
	f.description,
	f."filesImage",
	C."name" AS category,
	f.sub_category,
	f.style,
	f.color,
	f."size",
	f.status,
	f."createdAt" 
FROM
	"Fences" f
	LEFT JOIN "Categories" C ON f.category = C."id" 
WHERE
	f."isDeleted" = FALSE AND f.status != '${FENCE_STATUS.MODELING}' AND f."addedBy" = '${id}'
  ORDER BY f."createdAt" DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const notStarted = await Fence.count({
      where: {
        isDeleted: false,
        status: FENCE_STATUS.NOT_STARTED,
        addedBy: id,
      },
    });
    const pending = await Fence.count({
      where: { isDeleted: false, status: FENCE_STATUS.PENDING, addedBy: id },
    });
    const complete = await Fence.count({
      where: { isDeleted: false, status: FENCE_STATUS.COMPLETE, addedBy: id },
    });
    return resSuccess(res, {
      fences: result,
      company: company,
      totalCount: result.length,
      notStarted: notStarted,
      pending: pending,
      complete: complete,
    });
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const getAssetRequestById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await sequelize.query(
      `SELECT 
      f.ID,
      f."name",
      f.description,
      f."filesImage",
      f.color,
      f."size",
      f."createdAt",
      u."company" AS company
      FROM
       "Fences" f LEFT JOIN "Users" u ON f."addedBy" = u."id"
      WHERE
        f.id = '${id}' AND f."isDeleted" = FALSE AND f.status != '${FENCE_STATUS.MODELING}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (result && result.length > 0) {
      return resSuccess(res, result[0]);
    } else {
      return resSuccess(res);
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const deleteAssetRequests = async (req, res) => {
  const ids = await req.body.ids;
  const status = await req.body.status;
  await Fence.update(
    { isDeleted: true },
    {
      where:
        status === "all"
          ? { addedBy: ids }
          : {
              status: status,
              addedBy: ids,
            },
    }
  )
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const deleteAssetRequest = async (req, res) => {
  const id = req.params.id;
  Fence.update(
    { isDeleted: true },
    {
      where: { id: id },
    }
  )
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resError(res, err);
    });
};

module.exports = {
  getFenceList,
  getFenceById,
  getFenceByCategoryId,
  createFence,
  updateFence,
  updateFenceVisible,
  updateFenceStatus,
  deleteFence,
  deleteFences,
  getFencesByUserId,
  getSelectableElements,
  getRequestFencesByUser,
  getAssetRequests,
  getAssetRequest,
  deleteAssetRequests,
  getFenceListByName,
  getVisibleFences,
  getFenceId,
  getAssetRequestById,
  deleteAssetRequest,
};
