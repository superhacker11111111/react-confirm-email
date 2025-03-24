const sequelize = require("../config/database");
const { QueryTypes, Op, where } = require("sequelize");
const User = require("../model/User");
const validator = require("validator");
const Subscription = require("../model/Subscription");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");
const {
  DEFAULT_PASSWORD,
  Roles,
  UserType,
  DEFAULT_IS_DELETED,
  USER_STATUS,
  Type,
  DEFAULT_SEARCH_PARAMS,
  SUBSCRIPTION_STATUS,
  PAYMENT_TYPE,
  FENCE_STATUS,
  NotificationSetting,
  EMAIL_TYPE,
  MemberType,
} = require("../constants/constant");
require("dotenv").config();
const AWS = require("aws-sdk");
const Fence = require("../model/Fence");
const Category = require("../model/Category");
const {
  updateSubscriptionEmail,
  sendAddChildUserEmail,
  signUpEmail,
  sendTestEmail,
  getNewFenceRequests,
} = require("../utils/sendEmail");
const mailchimp = require("./mailchimpController");

const SES_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
const sns = new AWS.SNS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

//Get
const getUserList = async (req, res) => {
  const role = req.query.role;
  User.findAll({
    where: {
      isDeleted: false,
      role: role,
      isParent: true,
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
//Change
const changePassword = async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  User.findOne({ id: id })
    .then((result) => {
      bcrypt
        .compare(data.old_password, result.password)
        .then((result) => {
          if (result) {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(data.new_password1, salt, (err, hash) => {
                if (err) throw err;
                User.findByIdAndUpdate(id, {
                  password: hash,
                })
                  .then(() => {
                    return resSuccess(res);
                  })
                  .catch((err) => {
                    return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
                  });
              });
            });
          } else {
            return resMsg(
              res,
              resCode.PASSWORD_NOT_EQUAL,
              resMessage.PASSWORD_NOT_EQUAL
            );
          }
        })
        .catch((err) => resMsg(res, resCode.INTERNAL_SERVER_ERROR, err));
    })
    .catch((err) => resMsg(res, resCode.INTERNAL_SERVER_ERROR, err));
};
//add
const createUser = (req, res) => {
  const userData = req.body.userData;
  let createData = {
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    country: userData.country,
    state: userData.state,
    fullName: userData.name,
    role: Roles.COMPANY,
    address1: userData.address1,
    address2: userData.address2,
    city: userData.city,
    zipCode: userData.zipCode,
    company: userData.company,
    selectionFences: userData.selectionFences,
    avatarUrl: userData.avatarUrl,
    isVerified: userData.isVerified,
    type: Type.NORMAL,
    userType: userData.userType ? userData.userType : UserType.SHOPPER,
    status: USER_STATUS.ACTIVE,
    isDeleted: DEFAULT_IS_DELETED,
  };
  User.findOne({ where: { email: createData.email } }).then(async (user) => {
    if (user) {
      return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
    } else {
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(DEFAULT_PASSWORD, salt, async (err, hash) => {
          if (err) throw err;
          createData.password = hash;
          User.create(createData)
            .then((result) => {
              return resMsg(res, resCode.CREATED, resMessage.CREATED);
            })
            .catch((err) => {
              resError(res);
            });
        });
      });
    }
  });
};
//Account
const getAccount = async (req, res) => {
  User.findById(id).then((result) => {
    if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    return resSuccess(res, result.account);
  });
};
const updateAccount = async (req, res) => {
  const accountInfo = req.body;
  const id = req.params.id;
  try {
    const user = User.findOne({ where: { isDeleted: false, id: id } });
    if (!user) {
      return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    } else {
      const existUser = User.findOne({
        where: {
          isDeleted: false,
          email: accountInfo.email,
          role: accountInfo.role,
        },
      });
      if (existUser && existUser.id !== user.id) {
        return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
      }
      if (accountInfo.password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(accountInfo.password, salt);
        accountInfo.password = hash;
      } else {
        accountInfo.password = user.password;
      }
      await User.update(accountInfo, { where: { id: id } });
      if (userData.email !== user.email && user.mailchimp_member_id) {
        await mailchimp.deleteListMember(user.mailchimp_member_id);
      }
      const name = accountInfo.fullName.split(" ");
      await mailchimp.addOrUpdateListMember(user.mailchimp_member_id, {
        email: accountInfo.email,
        fname: name[0] ? name[0] : "",
        lname: name[1] ? name[1] : "",
        birthday: accountInfo.birthday ? accountInfo.birthday : "",
        addr1: accountInfo.address1 ? accountInfo.address1 : "",
        city: accountInfo.city ? accountInfo.city : "",
        state: accountInfo.state ? accountInfo.state : "",
        zipCode: accountInfo.zipCode ? accountInfo.zipCode : "",
        phoneNumber: accountInfo.phoneNumber
          ? validator.isMobilePhone(accountInfo.phoneNumber)
            ? accountInfo.phoneNumber
            : ""
          : "",
        membertype: existUser.userType
          ? existUser.userType === UserType["FREE TRIAL"]
            ? MemberType.TRIAL
            : MemberType.SUBSCRIBE
          : "",
      });
      resSuccess(res);
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const deleteAccount = async (req, res) => {
  const user = User.findOne({ where: { isDeleted: false, id: id } });
  await User.update(
    { status: USER_STATUS.DEACTIVE },
    { where: { id: req.params.id } }
  )
    .then(async () => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};

//User
const getUserByID = async (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((result) => {
      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};
//Update
const updateUser = async (req, res) => {
  const userData = req.body;
  const id = req.params.id;
  // if (userData.email) {
  //   const user = await User.findOne({ where: { email: userData.email } });
  //   if (user && user.id !== id) {
  //     return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
  //   }
  // }
  try {
    const user = await User.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    if (user) {
      if (
        userData.email &&
        userData.email === user.email &&
        user.mailchimp_member_id
      ) {
        await mailchimp.deleteListMember(user.mailchimp_member_id);
      }
      const name = userData.fullName
        ? userData.fullName.split(" ")
        : user.fullName.split(" ");
      await mailchimp.addOrUpdateListMember(user.mailchimp_member_id, {
        email: userData.email ? userData.email : user.email,
        fname: name[0] ? name[0] : "",
        lname: name[1] ? name[1] : "",
        birthday: userData.birthday ? userData.birthday : "",
        addr1: userData.address1 ? userData.address1 : user.address1,
        city: userData.city ? userData.city : user.city,
        state: userData.state ? userData.state : user.state,
        zipCode: userData.zipCode ? userData.zipCode : user.zipCode,
        phoneNumber: userData.phoneNumber
          ? validator.isMobilePhone(userData.phoneNumber)
            ? userData.phoneNumber
            : ""
          : user.phoneNumber
          ? validator.isMobilePhone(user.phoneNumber)
            ? user.phoneNumber
            : ""
          : "",
        membertype: userData.userType
          ? userData.userType === UserType["FREE TRIAL"]
            ? MemberType.TRIAL
            : MemberType.SUBSCRIBE
          : user.userType === UserType["FREE TRIAL"]
          ? MemberType.TRIAL
          : MemberType.SUBSCRIBE,
      });
      await User.update(userData, { where: { id: id } });
      if (userData.requestFences && userData.requestFences.length === 0)
        await Fence.destroy({ where: { addedBy: id } });

      if (userData.plan && userData.plan !== user.plan) {
        const oldPlan = await Subscription.findOne({
          where: {
            id: user.plan,
          },
        });
        const newPlan = await Subscription.findOne({
          where: {
            id: userData.plan,
          },
        });
        updateSubscriptionEmail(
          user.email,
          Number(newPlan.price) > Number(oldPlan.price)
            ? EMAIL_TYPE.UPGRADE_SUBSCRIPTION
            : EMAIL_TYPE.DOWNGRADE_SUBSCRIPTION,
          newPlan.name
        );
      }
      return resSuccess(res);
    } else {
      return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log("err1", err);
    resError(res, err);
  }
};
//UpdateUserInfo
const updateInfoUser = async (req, res) => {
  const userData = req.body;
  const id = req.params.id;

  if (!userData.password) {
    try {
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        if (userData.email !== user.email && user.mailchimp_member_id) {
          await mailchimp.deleteListMember(user.mailchimp_member_id);
        }
        const name = userData.fullName.split(" ");
        await mailchimp.addOrUpdateListMember(user.mailchimp_member_id, {
          email: userData.email,
          fname: name[0] ? name[0] : "",
          lname: name[1] ? name[1] : "",
          birthday: userData.birthday ? userData.birthday : "",
          addr1: userData.address1 ? userData.address1 : "",
          city: userData.city ? userData.city : "",
          state: userData.state ? userData.state : "",
          zipCode: userData.zipCode ? userData.zipCode : "",
          phoneNumber: userData.phoneNumber
            ? validator.isMobilePhone(userData.phoneNumber)
              ? userData.phoneNumber
              : ""
            : "",
          membertype: user.userType
            ? user.userType === UserType["FREE TRIAL"]
              ? MemberType.TRIAL
              : MemberType.SUBSCRIBE
            : "",
        });
        await User.update(userData, { where: { id: id } });
        return resSuccess(res);
      }
    } catch (err) {
      console.log("err1", err);
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    }
  } else {
    const user = await User.findOne({ where: { id: id } });
    User.findOne({ where: { id: id } })
      .then((result) => {
        bcrypt
          .compare(userData.password, result.password)
          .then((result) => {
            if (result) {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(userData.updatePassword, salt, (err, hash) => {
                  if (err) throw err;
                  userData.password = hash;
                  User.update(userData, {
                    where: { id: id },
                  })
                    .then(async () => {
                      if (
                        userData.email !== user.email &&
                        user.mailchimp_member_id
                      ) {
                        await mailchimp.deleteListMember(
                          user.mailchimp_member_id
                        );
                      }
                      const name = userData.fullName.split(" ");
                      await mailchimp.addOrUpdateListMember(
                        user.mailchimp_member_id,
                        {
                          email: userData.email,
                          fname: name[0] ? name[0] : "",
                          lname: name[1] ? name[1] : "",
                          birthday: userData.birthday ? userData.birthday : "",
                          addr1: userData.address1 ? userData.address1 : "",
                          city: userData.city ? userData.city : "",
                          state: userData.state ? userData.state : "",
                          zipCode: userData.zipCode ? userData.zipCode : "",
                          phoneNumber: userData.phoneNumber
                            ? validator.isMobilePhone(userData.phoneNumber)
                              ? userData.phoneNumber
                              : ""
                            : "",
                          membertype: user.userType
                            ? user.userType === UserType["FREE TRIAL"]
                              ? MemberType.TRIAL
                              : MemberType.SUBSCRIBE
                            : "",
                        }
                      );
                      return resSuccess(res);
                    })
                    .catch((err) => {
                      console.log("err2", err);
                      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
                    });
                });
              });
            } else {
              return resMsg(
                res,
                resCode.PASSWORD_NOT_EQUAL,
                resMessage.PASSWORD_NOT_EQUAL
              );
            }
          })
          .catch((err) => {
            console.log("err3", err);
            resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
          });
      })
      .catch((err) => {
        console.log("err4", err);
        resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
      });
  }
};
//Delete
const deleteUser = async (req, res) => {
  await User.update({ isDeleted: true }, { where: { id: req.params.id } })
    .then(async () => {
      await User.destroy({
        where: { parentId: req.params.id, isParent: false },
      });
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};

const deleteUserByEmail = async (req, res) => {
  const user = await User.findOne({
    where: { isDeleted: false, email: req.params.email },
  });
  await User.destroy({ where: { email: req.params.email } })
    .then(async () => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};

const deleteUsers = async (req, res) => {
  const ids = await req.body.ids;
  try {
    const deleteUsers = await User.findAll({
      where: {
        [Op.or]: [
          { id: ids, isDeleted: false },
          { parentId: ids, isDeleted: false },
        ],
      },
    });
    await User.update(
      { isDeleted: true },
      {
        where: {
          id: ids,
        },
      }
    );
    await User.destroy({
      where: { parentId: ids, isParent: false },
    });
    resSuccess(res);
  } catch (err) {
    console.log("err", err);
    resMsg(res, resCode.INTERNAL_SERVER_ERROR, err.message);
    resError(res, err.message);
  }
};
const deleteUsersByEmail = async (req, res) => {
  const emails = await req.body;
  User.destroy({
    where: {
      email: emails,
    },
  })
    .then(() => {
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};
const createProfile = async (req, res) => {
  const profile = req.body;
  const id = req.user.id;
  const user = await User.findOne({ where: { id: id } });
  if (!user) {
    return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
  } else {
    User.update(profile, { where: { id: id } })
      .then(() => {
        return resSuccess(res);
      })
      .catch((err) => {
        return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
      });
  }
};
const updateUserFence = async (req, res) => {
  const userData = req.body;
  const id = req.params.id;
  try {
    const user = await User.findOne({ where: { email: userData.email } });
    if (user) {
      await User.update(
        {
          selectedFences: userData.selectedFences,
          favoriteFences: userData.favoriteFences,
          onboardingPass: userData.onboardingPass,
        },
        {
          where: {
            id: id,
          },
        }
      );
      //   await Fence.destroy({ where: { addedBy: id } });
      await Fence.bulkCreate(userData.requestFences);
      if (userData.requestFences && userData.requestFences.length > 0) {
        getNewFenceRequests({
          name: user.fullName,
          company: user.company,
          count: userData.requestFences.length,
        });
      }
      return resSuccess(res);
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    resError(res);
  }
};
const getCompanyList = async (req, res) => {
  const searchData = {
    subscription: req.query.subscription ? req.query.subscription : "all",
    subscription_status: req.query.subscription_status
      ? req.query.subscription_status
      : "all",
    keyword: req.query.keyword ? req.query.keyword : "",
    pageNumber: req.query.pageNumber ? req.query.pageNumber : 0,
    pageSize: req.query.pageSize
      ? req.query.pageSize
      : DEFAULT_SEARCH_PARAMS.PAGE_SIZE,
    sortOrder: req.query.sortOrder ? req.query.sortOrder : "ASC",
    sortField: req.query.sortField ? req.query.sortField : "company",
  };
  searchData.offset =
    parseInt(searchData.pageNumber) * parseInt(searchData.pageSize);
  sequelize
    .query(
      `SELECT
	u."id" AS ID,
	u."company" AS company,
	u."fullName" AS primaryContact,
  u."referralName" AS referralName,
	s."name" AS subscription,
	u."subscription_status" AS "status",
	u.status AS "activate",
  	u."avatarUrl" AS "avatarUrl",
	array_length( u."selectedFences", 1 ) = CAST ( s."totalFences" AS INT ) AS "implementation"
FROM
	"Users" u
	LEFT JOIN "Subscriptions" s ON s."id" = u."plan" 
WHERE
  u."role" = ${Roles.COMPANY}
  AND u."isDeleted" = FALSE AND u."isParent" = true
	AND s."isDeleted" = FALSE AND (u.company ILIKE '%${
    searchData.keyword
  }%' OR u."fullName" ILIKE '%${searchData.keyword}%') ${
        searchData.subscription !== "all"
          ? `AND u.plan = '${searchData.subscription}'`
          : ""
      }
  ${
    searchData.subscription_status !== "all"
      ? `AND u.subscription_status = '${searchData.subscription_status}'`
      : ""
  }
  ORDER BY ${searchData.sortField} ${searchData.sortOrder} 
	LIMIT ${searchData.pageSize} OFFSET ${searchData.offset}`,
      {
        type: QueryTypes.SELECT,
      }
    )
    .then(async (result) => {
      const allData = await sequelize.query(
        `SELECT
	        "count"(*)
        FROM
	        "Users" u LEFT JOIN "Subscriptions" s ON s."id" = u."plan" 
        WHERE
          u."role" = ${Roles.COMPANY} AND u."isParent" = true AND
          u."isDeleted" = FALSE AND s."isDeleted" = FALSE AND (u.company ILIKE '%${
            searchData.keyword
          }%' OR u."fullName" ILIKE '%${searchData.keyword}%') 
          ${
            searchData.subscription !== "all"
              ? `AND u.plan = '${searchData.subscription}'`
              : ""
          }
          ${
            searchData.subscription_status !== "all"
              ? `AND u.subscription_status = '${searchData.subscription_status}'`
              : ""
          }`,
        {
          type: QueryTypes.SELECT,
        }
      );
      const active = await User.count({
        where: {
          isDeleted: false,
          subscription_status: SUBSCRIPTION_STATUS.ACTIVE,
          role: Roles.COMPANY,
          isParent: true,
          plan:
            searchData.subscription === "all"
              ? { [Op.not]: "all" }
              : searchData.subscription,
        },
      });
      const pause = await User.count({
        where: {
          isDeleted: false,
          subscription_status: SUBSCRIPTION_STATUS.PAUSE,
          role: Roles.COMPANY,
          isParent: true,
          plan:
            searchData.subscription === "all"
              ? { [Op.not]: "all" }
              : searchData.subscription,
        },
      });
      const cancelled = await User.count({
        where: {
          isDeleted: false,
          subscription_status: SUBSCRIPTION_STATUS.CANCELLED,
          role: Roles.COMPANY,
          isParent: true,
          plan:
            searchData.subscription === "all"
              ? { [Op.not]: "all" }
              : searchData.subscription,
        },
      });
      const allActive = await User.count({
        where: {
          isDeleted: false,
          subscription_status: SUBSCRIPTION_STATUS.ACTIVE,
          role: Roles.COMPANY,
          isParent: true,
        },
      });
      const allPause = await User.count({
        where: {
          isDeleted: false,
          subscription_status: SUBSCRIPTION_STATUS.PAUSE,
          role: Roles.COMPANY,
          isParent: true,
        },
      });
      const allCancelled = await User.count({
        where: {
          isDeleted: false,
          subscription_status: SUBSCRIPTION_STATUS.CANCELLED,
          role: Roles.COMPANY,
          isParent: true,
        },
      });
      const allCount = await User.count({
        where: {
          isDeleted: false,
          role: Roles.COMPANY,
          isParent: true,
        },
      });
      return resSuccess(res, {
        companies: result,
        dataCount: allData[0].count,
        totalCount: allCount,
        active: active,
        pause: pause,
        cancelled: cancelled,
        allActive: allActive,
        allPause: allPause,
        allCancelled: allCancelled,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
const getShopperList = async (req, res) => {
  const searchData = {
    state: req.query.state ? req.query.state : "all",
    country: req.query.country ? req.query.country : "all",
    keyword: req.query.keyword ? req.query.keyword : "",
    pageNumber: req.query.pageNumber ? req.query.pageNumber : 0,
    pageSize: req.query.pageSize
      ? req.query.pageSize
      : DEFAULT_SEARCH_PARAMS.PAGE_SIZE,
    sortOrder: req.query.sortOrder ? req.query.sortOrder : "ASC",
    sortField: req.query.sortField ? req.query.sortField : "company",
  };
  searchData.offset =
    parseInt(searchData.pageNumber) * parseInt(searchData.pageSize);
  sequelize
    .query(
      `SELECT
		    u.ID AS ID,
        u."fullName" AS "fullName",
        u."phoneNumber" AS "phoneNumber",
        u.email AS email,
        u.address1,
        u."state",
        u."zipCode",
        u."city",
        u."avatarUrl" AS "avatarUrl",
        u."interestLevel" AS "interestLevel",
        DATE_PART('day', AGE(CURRENT_DATE, u."createdAt")) < 8 AS status
      FROM "Users" u
      WHERE
        u."role" = ${Roles.SHOPPER}
        AND u."isDeleted" = FALSE AND (u.company ILIKE '%${
          searchData.keyword
        }%' OR u."fullName" ILIKE '%${searchData.keyword}%') ${
        searchData.country !== "all"
          ? `AND u.country = '${searchData.country}'`
          : ""
      }
        ${
          searchData.state !== "all"
            ? `AND u.state = '${searchData.state}'`
            : ""
        }
      ORDER BY "${searchData.sortField}" ${searchData.sortOrder} 
      LIMIT ${searchData.pageSize} OFFSET ${searchData.offset}`,
      {
        type: QueryTypes.SELECT,
      }
    )
    .then(async (result) => {
      const totalCount = await User.count({
        where: {
          isDeleted: false,
          role: Roles.SHOPPER,
          country:
            searchData.country === "all"
              ? { [Op.not]: "all" }
              : searchData.country,
          state:
            searchData.state === "all" ? { [Op.not]: "all" } : searchData.state,
        },
      });
      return resSuccess(res, {
        shoppers: result,
        totalCount: totalCount,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
const getAdminList = async (req, res) => {
  User.findAll({
    where: {
      role: Roles.ADMIN,
      isDeleted: false,
    },
    order: [["createdAt", "DESC"]],
  })
    .then((result) => {
      if (!result) return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);

      return resSuccess(res, result);
    })
    .catch((err) => {
      return resError(res, err);
    });
};
const addAdmins = async (req, res) => {
  const parentId = req.params.id;
  const emailList = req.body.emailList;
  try {
    const parent = await User.findOne({
      where: { id: parentId, isDeleted: false },
    });
    if (parent) {
      const result = await User.update(
        { childs: emailList },
        { where: { id: parentId } }
      );
      for (const email of emailList) {
        const token = jwt.sign(
          {
            email: email,
            role: parent.role,
          },
          process.env.secretOrKey,
          {
            expiresIn: process.env.expired,
          }
        );
        const ses = new AWS.SES(SES_CONFIG);
        const params = {
          Destination: {
            ToAddresses: [parent.email], // Email address/addresses that you want to send your email
          },
          ConfigurationSetName: process.env.EMAIL_CONFIG_NAME,
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `<html>
                      <body>
                        <h1>Hello, Customer</h1>
                          <p>Welcome to RealityFence administrator. Please click the link below to create your password and sign in.</p>
                          <p> ${process.env.ADMIN_APP_HOST}auth/setPassword?token=${token}</p>
                          <p>Best Regards,</p>
                          <p>Drew Baskin</p>
                      </body>
                    </html>`,
              },
            },
            Subject: {
              Charset: "UTF-8",
              Data: "Welcome RealityFence!",
            },
          },
          Source: "RealityFence Team <Drew@realityfence.com>",
        };
        // ses.sendEmail(params).promise();
      }
      resSuccess(res);
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    resError(res, err);
  }
};
const addCompany = async (req, res) => {
  const createData = req.body;
  const userData = {
    fullName: createData.full_name ? createData.full_name : "",
    email: createData.email ? createData.email : "",
    phoneNumber: createData.phoneNumber ? createData.phoneNumber : "",
    country: createData.country ? createData.country : "",
    state: createData.state ? createData.state : "",
    city: createData.city ? createData.city : "",
    address1: createData.address1 ? createData.address1 : "",
    address2: createData.address2 ? createData.address2 : "",
    zipCode: createData.zipCode ? createData.zipCode : "",
    company: createData.company ? createData.company : "",
    role: createData.role ? createData.role : Roles.COMPANY,
    type: createData.type ? createData.type : Type.NORMAL,
    userType: createData.userType ? createData.userType : UserType.PRO,
    status: createData.status ? createData.status : USER_STATUS.ACTIVE,
    isDeleted: DEFAULT_IS_DELETED,
    stripe_subscription_id: createData.stripe_subscription_id
      ? createData.stripe_subscription_id
      : "",
    stripe_customer_id: createData.stripe_customer_id
      ? createData.stripe_customer_id
      : "",
    selectedFences: [],
    favoriteFences: [],
    paymentType: createData.payType
      ? PAYMENT_TYPE.YEARLY
      : PAYMENT_TYPE.MONTHLY,
    subscription_status: createData.subscription_status
      ? createData.subscription_status
      : SUBSCRIPTION_STATUS.NO_SUBSCRIPTION,
    plan: createData.plan ? createData.plan : "",
    stripe_price_id: createData.price_id ? createData.price_id : "",
    childs: [],
    notificationSetting: NotificationSetting,
    device: "",
    interestLevel: "",
    sms_allow: createData.receive_sms ? createData.receive_sms : false,
    referralName: createData.referralName ? createData.referralName : "",
  };
  if (userData.sms_allow) {
    userData.sms_allow_updated_date = new Date();
  }
  try {
    const user = await User.findOne({
      where: {
        email: userData.email,
        role: userData.role,
        isDeleted: false,
      },
    });
    if (user) {
      resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
    } else {
      console.log("userData :>> ", userData);
      const name = userData.fullName.split(" ");
      const member = await mailchimp.createListMember({
        email: userData.email,
        fname: name[0] ? name[0] : "",
        lname: name[1] ? name[1] : "",
        birthday: userData.birthday ? parent.birthday : "",
        addr1: userData.address1 ? userData.address1 : "",
        phoneNumber: userData.phoneNumber
          ? validator.isMobilePhone(userData.phoneNumber)
            ? userData.phoneNumber
            : ""
          : "",
        city: userData.city ? userData.city : "",
        state: userData.state ? userData.state : "",
        zipCode: userData.zipCode ? userData.zipCode : "",
        country: userData.country ? userData.country : "",
        membertype: userData.userType
          ? userData.userType === UserType["FREE TRIAL"]
            ? MemberType.TRIAL
            : MemberType.SUBSCRIBE
          : "",
      });
      if (member) {
        userData.mailchimp_member_id = member.id;
      }
      const createdData = await User.create(userData);
      const plan = await Subscription.findOne({
        where: { isDeleted: false, id: createdData.plan },
      });
      const code = generateRandomNumber(100000, 999999);
      await User.update(
        {
          verifyCode: code,
        },
        { where: { email: createdData.email } }
      );
      const token = jwt.sign(
        {
          id: createdData.id,
          email: createdData.email,
          role: createdData.role,
        },
        process.env.secretOrKey,
        {
          expiresIn: process.env.expired,
        }
      );
      const ses = new AWS.SES(SES_CONFIG);
      const params = {
        Destination: {
          ToAddresses: [createdData.email], // Email address/addresses that you want to send your email
        },
        ConfigurationSetName: process.env.EMAIL_CONFIG_NAME,
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `<html>
                <body>
                  <h1>Hello, Customer</h1>
                  <p>Dear, ${createdData.company}.</p>
                  <p>
                    We are excited to announce that you have been added to a
                    RealityFence ${plan.name} account!
                  </p>
                  <p>
                    RealityFence ${plan.name} offers enhanced features and access to
                    a premium selection of fences. We're thrilled to have
                    you on board!
                  </p>
                  <p>
                    To complete your registration and set up your account,
                    please click on the link below:
                  </p>
                  <p>
                    ${process.env.USER_APP_HOST}auth/setPassword/${token}
                  </p>
                  <p>
                    Once your account is set up, you'll be able to browse
                    our extensive selection of fences and benefit from our
                    advanced features including customizing any fence for
                    any project.
                  </p>
                  <p>
                    If you have any questions or need assistance, our
                    support team is always here to help. You can reach us at
                    support@realityfence.com.
                  </p>
                  <p>We look forward to serving you!</p>
                  <p>Best Regards,</p>
                  <p>RealityFence Team</p>
                </body>
              </html>`,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "RealityFence Verification Code",
          },
        },
        Source: "RealityFence Team <Drew@realityfence.com>",
      };
      ses
        .sendEmail(params)
        .promise()
        .then(() => {
          return resMsg(res, resCode.CREATED, resMessage.CREATED);
        });
    }
  } catch (err) {
    console.log("err :>> ", err);
    resError(res, err);
  }
};
const deleteCompany = async (req, res) => {
  await User.update({ isDeleted: true }, { where: { id: req.params.id } })
    .then(async () => {
      await User.destroy({
        where: {
          parentId: req.params.id,
        },
      });
      return resSuccess(res);
    })
    .catch((err) => {
      return resMsg(res, resCode.INTERNAL_SERVER_ERROR, err);
    });
};
const getUsersByParentId = async (req, res) => {
  const parentId = req.body.parentId;
  User.findAll({
    where: {
      parentId: parentId,
      isParent: false,
      isDeleted: false,
    },
  })
    .then((result) => {
      resSuccess(res, result);
    })
    .catch((err) => {
      resError(res, err);
    });
};
const getAllInformationForApp = async (req, res) => {
  const id = req.params.id;

  try {
    let user = await User.findOne({
      where: {
        id: id,
        isDeleted: false,
      },
    });

    if (!user) {
      return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }

    if (!user.isParent) {
      const parent = await User.findOne({
        where: {
          id: user.parentId,
          isDeleted: false,
        },
      });
      if (!parent) {
        return resMsg(res, resCode.NO_EXIST, "Main user is not exist");
      }
      user = {
        ...parent.dataValues,
        id: user.id,
        email: user.email,
        isParent: user.isParent,
        parentId: user.parentId,
      };
    }

    let dataArray = []; // Array to store the fetched data
    let favoriteArray = [];
    if (user.role === Roles.SHOPPER) {
      dataArray = await sequelize.query(
        `SELECT
              f.ID,
              f.NAME,
              f.description,
              f."filesImage",
              f."files3D",
              C."name" AS "category",
              f.sub_category,
              f.style,
              f.color,
              f."size",
              f.tags,
              f.status 
            FROM
              "Fences" f
              LEFT JOIN "Categories" C ON f."category" = C."id" 
            WHERE
              f."isDeleted" = FALSE AND f."visible" = TRUE`,
        {
          type: QueryTypes.SELECT,
        }
      );
    } else {
      if (user && user.selectedFences && user.selectedFences.length > 0) {
        for (const fenceId of user.selectedFences) {
          const data = await sequelize.query(
            `SELECT
                f.ID,
                f.NAME,
                f.description,
                f."filesImage",
                f."files3D",
                C."name" AS "category",
                f.sub_category,
                f.style,
                f.color,
                f."size",
                f.tags,
                f.status 
              FROM
                "Fences" f
                LEFT JOIN "Categories" C ON f."category" = C."id" 
              WHERE
                f."isDeleted" = FALSE 
                AND f.ID = '${fenceId}'
                AND f.status = '${FENCE_STATUS.MODELING}'
              LIMIT 1`,
            {
              type: QueryTypes.SELECT,
            }
          );
          if (data && data.length > 0) {
            dataArray.push(data[0]); // Add the fetched data to the array
          }
        }
      }
    }

    if (user && user.favoriteFences && user.favoriteFences.length > 0)
      for (const fenceId of user.favoriteFences) {
        const data = await sequelize.query(
          `SELECT
              f.ID,
              f.NAME,
              f.description,
              f."filesImage",
              f."files3D",
              C."name" AS "category",
              f.sub_category,
              f.style,
              f.color,
              f."size",
              f.tags,
              f.status 
            FROM
              "Fences" f
              LEFT JOIN "Categories" C ON f."category" = C."id" 
            WHERE
              f."isDeleted" = FALSE 
              AND f.ID = '${fenceId}'
              AND f.status = '${FENCE_STATUS.MODELING}'
            LIMIT 1`,
          {
            type: QueryTypes.SELECT,
          }
        );
        if (data && data.length > 0) {
          favoriteArray.push(data[0]); // Add the fetched data to the array
        }
      }

    const Categories = await Category.findAll({
      where: {
        isDeleted: false,
      },
    });
    resSuccess(res, {
      user: user,
      categories: Categories,
      selectedFences: dataArray,
      favoriteFences: favoriteArray,
    });
  } catch (err) {
    console.log("err :>> ", err);
    resError(res, err);
  }
};

const getCompany = async (req, res) => {
  const searchData = {
    companyId: req.query.companyId,
    keyword: req.query.keyword ? req.query.keyword : "",
    filter: req.query.filter ? req.query.filter : "current",
  };
  try {
    const company = await User.findOne({
      where: {
        isDeleted: false,
        role: Roles.COMPANY,
        id: searchData.companyId,
      },
    });
    if (company) {
      const companyPlan = await Subscription.findOne({
        where: {
          isDeleted: false,
          id: company.plan,
        },
      });
      let selectedFences = [];
      let filteredFences = [];
      for (const fenceId of company.selectedFences) {
        const data = await sequelize.query(
          `SELECT
              f.ID,
              f.NAME,
              f.description,
              f."filesImage",
              f."files3D",
              C."name" AS "category",
              f.sub_category,
              f.style AS "style",
              f.color,
              f."size",
              f.tags,
              f.status
            FROM
              "Fences" f
              LEFT JOIN "Categories" C ON f."category" = C."id"
            WHERE
              f."isDeleted" = FALSE
              AND f.ID = '${fenceId}'`,
          {
            type: QueryTypes.SELECT,
          }
        );
        if (data && data.length > 0) {
          selectedFences.push(data[0]); // Add the fetched data to the array
        }
      }
      if (searchData.filter === "current") {
        for (const fenceId of company.selectedFences) {
          const data = await sequelize.query(
            `SELECT
                f.ID,
                f.NAME,
                f.description,
                f."filesImage",
                f."files3D",
                C."name" AS "category",
                f.sub_category,
                f.style AS "style",
                f.color,
                f."size",
                f.tags,
                f.status
              FROM
                "Fences" f
                LEFT JOIN "Categories" C ON f."category" = C."id"
              WHERE
                f."isDeleted" = FALSE
                AND f.ID = '${fenceId}'
                AND (f.name ILIKE '%${searchData.keyword}%' OR 
                    f.description ILIKE '%${searchData.keyword}%' OR 
                    f.style ILIKE '%${searchData.keyword}%' OR 
                    f.color ILIKE '%${searchData.keyword}%' OR 
                    f.size ILIKE '%${searchData.keyword}%' OR
                EXISTS (
                    SELECT 1
                    FROM unnest(f.tags) AS t
                    WHERE t ILIKE '%${searchData.keyword}%'
                        ) OR
                c."name" ILIKE '%${searchData.keyword}%')`,
            {
              type: QueryTypes.SELECT,
            }
          );
          if (data && data.length > 0) {
            filteredFences.push(data[0]); // Add the fetched data to the array
          }
        }
        filteredFences = filteredFences.sort(
          (a, b) => a.createdAt - b.createdAt
        );
      } else {
        filteredFences = await sequelize.query(
          `SELECT
                f.ID,
                f.NAME,
                f.description,
                f."filesImage",
                f."files3D",
                C."name" AS "category",
                f.sub_category,
                f.style AS "style",
                f.color,
                f."size",
                f.tags,
                f.status
              FROM
                "Fences" f
                LEFT JOIN "Categories" C ON f."category" = C."id"
              WHERE
                f."isDeleted" = FALSE
                AND f."addedBy" != '${searchData.companyId}'
                AND (f.name ILIKE '%${searchData.keyword}%' OR
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
        );
      }
      const notStarted =
        searchData.filter === "current"
          ? selectedFences &&
            selectedFences.length > 0 &&
            selectedFences.filter(
              (item) => item.status === FENCE_STATUS.NOT_STARTED
            ).length
          : await Fence.count({
              where: {
                isDeleted: false,
                status: FENCE_STATUS.NOT_STARTED,
              },
            });
      const pending =
        searchData.filter === "current"
          ? selectedFences &&
            selectedFences.length > 0 &&
            selectedFences.filter(
              (item) => item.status === FENCE_STATUS.PENDING
            ).length
          : await Fence.count({
              where: {
                isDeleted: false,
                status: FENCE_STATUS.PENDING,
              },
            });
      const completed =
        searchData.filter === "current"
          ? selectedFences &&
            selectedFences.length > 0 &&
            selectedFences.filter(
              (item) => item.status === FENCE_STATUS.COMPLETE
            ).length
          : await Fence.count({
              where: {
                isDeleted: false,
                status: FENCE_STATUS.COMPLETE,
              },
            });

      const modeling =
        searchData.filter === "current"
          ? selectedFences &&
            selectedFences.length > 0 &&
            selectedFences.filter(
              (item) => item.status === FENCE_STATUS.MODELING
            ).length
          : await Fence.count({
              where: {
                isDeleted: false,
                status: FENCE_STATUS.MODELING,
              },
            });

      resSuccess(res, {
        company: company,
        selectedFences: selectedFences,
        filteredFences: filteredFences,
        planCount: companyPlan.totalFences,
        totalCount: selectedFences && selectedFences.length,
        notStarted: notStarted,
        pending: pending,
        completed: completed,
        modeling: modeling,
      });
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log(err);
    resError(res);
  }
};

const getCompanyFileList = async (req, res) => {
  const searchData = {
    companyId: req.query.companyId,
    keyword: req.query.keyword ? req.query.keyword : "",
    filter: req.query.filter ? req.query.filter : "current",
  };
  try {
    const company = await User.findOne({
      where: {
        isDeleted: false,
        role: Roles.COMPANY,
        id: searchData.companyId,
      },
    });
    if (company) {
      const companyPlan = await Subscription.findOne({
        where: {
          isDeleted: false,
          id: company.plan,
        },
      });
      const filteredFences =
        searchData.filter === "current" && !(company.selectedFences.length > 0)
          ? []
          : await sequelize.query(
              `SELECT
                  f.ID,
                  f.NAME,
                  f.description,
                  f."filesImage",
                  f."files3D",
                  C."name" AS "category",
                  f.sub_category,
                  f.style AS "style",
                  f.color,
                  f."size",
                  f.tags,
                  f.status,
                  f."isDeleted"
                FROM
                  "Fences" f
                  LEFT JOIN "Categories" C ON f."category" = C."id"
                WHERE
                ${
                  searchData.filter === "current"
                    ? `f.id = ANY (ARRAY [${company.selectedFences.map(
                        (id) => `'${id}'`
                      )}]) AND`
                    : ""
                }(f.name ILIKE '%${searchData.keyword}%' OR
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
            );
      const notStarted = await Fence.count({
        where: {
          isDeleted: false,
          status: FENCE_STATUS.NOT_STARTED,
          addedBy: searchData.companyId,
        },
      });
      const pending = await Fence.count({
        where: {
          isDeleted: false,
          status: FENCE_STATUS.PENDING,
          addedBy: searchData.companyId,
        },
      });
      const completed = await Fence.count({
        where: {
          isDeleted: false,
          status: FENCE_STATUS.COMPLETE,
          addedBy: searchData.companyId,
        },
      });

      const modeling = await Fence.count({
        where: {
          isDeleted: false,
          status: FENCE_STATUS.MODELING,
          id: {
            [Op.in]: company.selectedFences,
          },
        },
      });

      resSuccess(res, {
        company: company,
        planCount: companyPlan.totalFences,
        filteredFences: filteredFences,
        notStarted: notStarted,
        pending: pending,
        completed: completed,
        modeling: modeling,
      });
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log(err);
    resError(res);
  }
};

const getCountryAndStateList = async (req, res) => {
  try {
    const getCountries = await sequelize.query(
      `SELECT
        DISTINCT country
      FROM
        "Users" U
      WHERE
        U."isDeleted" = false AND U.role = '${Roles.SHOPPER}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    const getStates = await sequelize.query(
      `SELECT
        DISTINCT state
      FROM
        "Users" U
      WHERE
      U."isDeleted" = false AND U.role = '${Roles.SHOPPER}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    resSuccess(res, {
      countries:
        getCountries.length > 0 ? getCountries.map((row) => row.country) : [],
      states: getStates.length > 0 ? getStates.map((row) => row.state) : [],
    });
  } catch (err) {
    resError(res, err);
  }
};

// add child
const addUsersByUser = async (req, res) => {
  const parentId = req.params.id;
  const emailList = req.body.emailList;
  try {
    const parent = await User.findOne({
      where: { id: parentId, isDeleted: false },
    });
    if (!parent) {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
    let rejectList = [];
    for (const email of emailList) {
      const user = await User.findOne({
        where: { email: email, isDeleted: false },
      });

      if (user) {
        // resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
        rejectList = [
          ...rejectList,
          {
            email,
            message: resMessage.ALREADY_EXIST,
            code: resCode.ALREADY_EXIST,
          },
        ];
        continue;
      }
      const createData = {
        email,
        parentId,
        paymentType: 0,
        status: USER_STATUS.ACTIVE,
        isParent: USER_STATUS.DEACTIVE,
        isVerified: USER_STATUS.ACTIVE,
        role: 1,
        type: 0,
        password: "",
      };
      const name = parent.fullName ? parent.fullName.split(" ") : "";
      const member = await mailchimp.createListMember({
        email: createData.email,
        fname: name[0] ? name[0] : "",
        lname: name[1] ? name[1] : "",
        birthday: parent.birthday ? parent.birthday : "",
        addr1: parent.address1 ? parent.address1 : "",
        city: parent.city ? parent.city : "",
        state: parent.state ? parent.state : "",
        zipCode: parent.zipCode ? parent.zipCode : "",
        country: parent.country ? parent.country : "",
        phoneNumber: parent.phoneNumber
          ? validator.isMobilePhone(parent.phoneNumber)
            ? parent.phoneNumber
            : ""
          : "",
        membertype: parent.userType
          ? parent.userType === UserType["FREE TRIAL"]
            ? MemberType.TRIAL
            : MemberType.SUBSCRIBE
          : "",
      });
      if (member) {
        createData.mailchimp_member_id = member.id;
      }
      await User.create(createData);
      const plan = await Subscription.findOne({
        where: {
          id: parent.plan,
          isDeleted: false,
        },
      });
      const token = jwt.sign(
        {
          email: email,
          role: parent.role,
        },
        process.env.secretOrKey,
        {
          expiresIn: process.env.expired,
        }
      );
      sendAddChildUserEmail(email, plan?.name, token);
      signUpEmail(email, plan?.name);
    }
    resSuccess(res, rejectList);
    // const parent = await User.findOne({
    //   where: { id: parentId, isDeleted: false },
    // });
    // if (parent) {
    //   const result = await User.update(
    //     { childs: emailList },
    //     { where: { id: parentId } }
    //   );
    //   const plan = await Subscription.findOne({
    //     where: {
    //       id: parent.plan,
    //       isDeleted: false,
    //     },
    //   });
    //   for (const email of emailList) {
    //     const token = jwt.sign(
    //       {
    //         email: email,
    //         role: parent.role,
    //       },
    //       process.env.secretOrKey,
    //       {
    //         expiresIn: process.env.expired,
    //       }
    //     );
    //     const ses = new AWS.SES(SES_CONFIG);
    //     const params = {
    //       Destination: {
    //         ToAddresses: [email], // Email address/addresses that you want to send your email
    //       },
    //       ConfigurationSetName: process.env.EMAIL_CONFIG_NAME,
    //       Message: {
    //         Body: {
    //           Html: {
    //             Charset: "UTF-8",
    //             Data: `<html>
    //                 <body>
    //                   <h1>Hello, Customer</h1>
    //                   <p>Dear, ${parent.company}.</p>
    //                   <p>
    //                     We are excited to announce that you have been added to a
    //                     RealityFence ${plan.name} account!
    //                   </p>
    //                   <p>
    //                     RealityFence ${plan.name} offers enhanced features and access to
    //                     a premium selection of fences. We're thrilled to have
    //                     you on board!
    //                   </p>
    //                   <p>
    //                     To complete your registration and set up your account,
    //                     please click on the link below:
    //                   </p>
    //                   <p>
    //                     ${process.env.USER_APP_HOST}auth/setPassword/${token}
    //                   </p>
    //                   <p>
    //                     Once your account is set up, you'll be able to browse
    //                     our extensive selection of fences and benefit from our
    //                     advanced features including customizing any fence for
    //                     any project.
    //                   </p>
    //                   <p>
    //                     If you have any questions or need assistance, our
    //                     support team is always here to help. You can reach us at
    //                     support@realityfence.com.
    //                   </p>
    //                   <p>We look forward to serving you!</p>
    //                   <p>Best Regards,</p>
    //                   <p>RealityFence Team</p>
    //                 </body>
    //               </html>`,
    //           },
    //         },
    //         Subject: {
    //           Charset: "UTF-8",
    //           Data: "Welcome RealityFence!",
    //         },
    //       },
    //       Source: "RealityFence Team <Drew@realityfence.com>",
    //     };
    //     ses.sendEmail(params).promise();
    //   }
    //   resSuccess(res);
    // } else {
    //   resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    // }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const isExistEmail = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({
      where: { email: email, role: Roles.COMPANY, isDeleted: false },
    });
    if (user) {
      resSuccess(res, { isExist: true });
    } else {
      resSuccess(res, { isExist: false });
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const shopperEmailExistCheck = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({
      where: { email: email, role: Roles.SHOPPER, isDeleted: false },
    });
    if (user) {
      resSuccess(res, { isExist: true });
    } else {
      resSuccess(res, { isExist: false });
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const createEndpoint = async (req, res) => {
  const deviceToken = req.body.deviceToken;
  const userId = req.params.id;

  // Creating SNS endpoint for device token
  const params = {
    PlatformApplicationArn: process.env.AWS_PLAT_ARN,
    Token: deviceToken,
  };

  sns.createPlatformEndpoint(params, (err, data) => {
    if (err) {
      console.log("Failed to register device", err.stack);
      resMsg(res, resCode.INTERNAL_SERVER_ERROR, "Failed to register device");
    } else {
      const endpointArn = data.EndpointArn;
      let createData = { endpointArn: endpointArn };
      User.update(createData, {
        where: {
          id: userId,
        },
      })
        .then((result) => {
          return resMsg(res, resCode.SUCCESS, "Device registered successfully");
        })
        .catch((err) => {
          resError(res, err);
        });
    }
  });
};

const sendFenceUpdateNotification = async (req, res) => {
  const fenceName = req.body.name;
  try {
    const message = JSON.stringify({ default: `${fenceName} created!` });
    const notificationDevices = await User.findAll({
      where: { endpointArn: { [Op.not]: null }, isDeleted: false },
    });
    if (notificationDevices && notificationDevices.length > 0) {
      notificationDevices.map((device) => {
        if (
          device.notificationSetting &&
          !device.notificationSetting.productUpdate
        ) {
          return;
        }

        const getEndpointAttributesParams = {
          EndpointArn: device.endpointArn,
        };
        sns.getEndpointAttributes(getEndpointAttributesParams, (err, data) => {
          if (err) {
            console.log("Retieve Endpoint Error:", err);
            return resError(res, err);
          } else {
            if (data.Attributes.Enabled === "false") {
              return;
            }
            const params = {
              Message: message,
              Subject: "New Fence Announcement",
              TargetArn: device.endpointArn,
              MessageStructure: "json",
            };
            sns.publish(params);
          }
        });
      });
    } else {
      return resSuccess(res);
    }
    return resSuccess(res);
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const sendFileManagerNotification = async (req, res) => {
  const companyId = req.body.id;
  try {
    const message = JSON.stringify({
      default: `Selected Fences are changed!`,
    });
    const notificationDevice = await User.findOne({
      where: { id: companyId, isDeleted: false },
    });
    if (notificationDevice && notificationDevice.device) {
      const getEndpointAttributesParams = {
        EndpointArn: notificationDevice.endpointArn,
      };
      sns.getEndpointAttributes(getEndpointAttributesParams, (err, data) => {
        if (err) {
          console.log("Retieve Endpoint Error:", err);
          return resError(res, err);
        } else {
          if (data.Attributes.Enabled === "false") {
            return;
          }
          const params = {
            Message: message,
            Subject: "Your Fences Changed",
            TargetArn: notificationDevice.endpointArn,
            MessageStructure: "json",
          };
          sns.publish(params);
        }
      });
    } else {
      return resSuccess(res);
    }
    return resSuccess(res);
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const emailTest = async (req, res) => {
  try {
    sendTestEmail();
    return resSuccess(res);
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const mailchimpTest = async (req, res) => {
  try {
    await mailchimp.getMacilChimpData();
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

module.exports = {
  changePassword,
  getAllInformationForApp,
  getAccount,
  createUser,
  updateAccount,
  getUserByID,
  updateUser,
  updateInfoUser,
  deleteUser,
  deleteUserByEmail,
  deleteUsers,
  deleteAccount,
  deleteUsersByEmail,
  getUserList,
  createProfile,
  addUsersByUser,
  updateUserFence,
  getCompanyList,
  getAdminList,
  addAdmins,
  getShopperList,
  addCompany,
  deleteCompany,
  getUsersByParentId,
  getCompany,
  getCompanyFileList,
  getCountryAndStateList,
  createEndpoint,
  isExistEmail,
  shopperEmailExistCheck,
  sendFenceUpdateNotification,
  sendFileManagerNotification,
  emailTest,
  mailchimpTest,
};
