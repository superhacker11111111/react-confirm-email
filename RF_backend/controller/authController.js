const { Op } = require("sequelize");
const isEmpty = require("is-empty");
const validator = require("validator");
const User = require("../model/User");
const Subscription = require("../model/Subscription");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailchimp = require("./mailchimpController");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { validateResetPasswordInput } = require("../validation/authValidation");
const {
  DEFAULT_PASSWORD,
  Roles,
  UserType,
  DEFAULT_IS_DELETED,
  DEFAULT_AVATAR,
  USER_STATUS,
  Type,
  PAYMENT_TYPE,
  NotificationSetting,
  SUBSCRIPTION_STATUS,
  EMAIL_TYPE,
  MemberType,
} = require("../constants/constant");
const { resCode, resMessage } = require("../constants/resCode");
const { DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const AWS = require("aws-sdk");
const {
  verifyEmail,
  signUpEmail,
  forgotPasswordEmail,
  sendShopperSignUpEmail,
  sendPurchaseSubscriptionNotifyingEmail,
} = require("../utils/sendEmail");

const sns = new AWS.SNS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const validateHexadecimal = (input) => {
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(input);
};

const initialize = async (req, res) => {
  const id = req.params.id;
  try {
    let user = await User.findOne({ where: { id: id } });
    if (!user) {
      return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
    if (user.isParent) {
      const childs = await User.findAll({
        where: { parentId: user.id, isDeleted: false },
      });
      const emails =
        childs && childs.length > 0 ? childs.map((item) => item.email) : [];
      const response = { ...user.dataValues, childs: emails };
      return resSuccess(res, response);
    } else {
      let parentUser = await User.findOne({
        where: { id: user.parentId },
      });
      const childs = await User.findAll({
        where: { parentId: user.id, isDeleted: false },
      });
      const emails =
        childs && childs.length > 0 ? childs.map((item) => item.email) : [];
      const response = {
        ...parentUser.dataValues,
        childs: emails,
        email: user.email,
        isParent: false,
      };
      return resSuccess(res, response);
    }
  } catch (err) {
    console.log("Initilize Error", err);
    resError(res, err);
  }
};

const signIn = async (req, res) => {
  const loginData = {
    email: req.body.email,
    password: req.body.password,
    type: req.body.type ? req.body.type : Type.NORMAL,
    role:
      req.body.role == Roles.ADMIN || req.body.role
        ? req.body.role
        : Roles.USER,
  };
  User.findOne({
    where: {
      email: { [Op.iLike]: loginData.email },
      role: loginData.role,
      isDeleted: false,
    },
  })
    .then((user) => {
      if (user) {
        if (!user.password) {
          return resMsg(res, resCode.INVALID_USER, resMessage.INVALID_USER);
        }
        bcrypt
          .compare(loginData.password, user.password)
          .then(async (result) => {
            if (result) {
              if (user.status !== USER_STATUS.ACTIVE) {
                return resMsg(
                  res,
                  resCode.USER_IS_BANNED,
                  resMessage.USER_IS_BANNED
                );
              } else {
                if (user.isVerified) {
                  const token = jwt.sign(
                    {
                      id: user.id,
                    },
                    process.env.secretOrKey,
                    {
                      expiresIn: process.env.expired,
                    }
                  );
                  return resSuccess(res, {
                    accessToken: token,
                    user,
                  });
                } else {
                  const code = generateRandomNumber(100000, 999999);
                  User.update(
                    {
                      verifyCode: code,
                    },
                    {
                      where: { email: { [Op.iLike]: user.email } },
                    }
                  )
                    .then(() => {
                      verifyEmail(user.email, code);
                      return resMsg(
                        res,
                        resCode.USER_NOT_VERIFIED,
                        resMessage.USER_NOT_VERIFIED
                      );
                    })
                    .catch((err) => {
                      console.log(err);
                      return resError(res, err);
                    });
                }
              }
            } else {
              return resMsg(res, resCode.INVALID_USER, resMessage.INVALID_USER);
            }
          })
          .catch((err) => {
            console.log("Password Compare Error", err);
            return resError(res, err);
          });
      } else {
        return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      }
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const appLogin = async (req, res) => {
  const loginData = {
    email: req.body.email,
    password: req.body.password,
    deviceToken: req.body.deviceToken,
  };
  try {
    let user = await User.findOne({
      where: {
        email: {
          [Op.iLike]: loginData.email,
        },
        isDeleted: false,
      },
    });
    if (!user) {
      return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
    if (isEmpty(user.password)) {
      return resMsg(res, resCode.INVALID_USER, resMessage.INVALID_USER);
    }

    const isEqualPassword = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isEqualPassword) {
      return resMsg(res, resCode.INVALID_USER, resMessage.INVALID_USER);
    }

    if (!user.isParent) {
      let parentUser = await User.findOne({
        where: { id: user.parentId },
      });
      user = {
        ...parentUser.dataValues,
        id: user.id,
        email: user.email,
        isParent: user.isParent,
        parentId: user.parentId,
      };
    }

    const expireDate = new Date(user.createdAt);

    if (
      user.role === Roles.COMPANY &&
      user.userType === UserType["FREE TRIAL"] &&
      new Date(expireDate.setDate(expireDate.getDate() + 7)) < new Date()
    ) {
      return resMsg(
        res,
        resCode.NOT_ACTIVE_SUBSCRIPTION,
        resMessage.NOT_ACTIVE_SUBSCRIPTION
      );
    }

    if (
      user.role === Roles.SHOPPER &&
      new Date(expireDate.setDate(expireDate.getDate() + 7)) < new Date()
    ) {
      return resMsg(
        res,
        resCode.NOT_ACTIVE_SUBSCRIPTION,
        "This Shopper is expired"
      );
    }

    if (
      user.role === Roles.COMPANY &&
      user.userType !== UserType["FREE TRIAL"] &&
      user.subscription_status !== SUBSCRIPTION_STATUS.ACTIVE
    ) {
      return resMsg(
        res,
        resCode.NOT_ACTIVE_SUBSCRIPTION,
        resMessage.NOT_ACTIVE_SUBSCRIPTION
      );
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      return resMsg(res, resCode.USER_IS_BANNED, resMessage.USER_IS_BANNED);
    }

    if (!user.isVerified) {
      const code = generateRandomNumber(100000, 999999);
      await User.update(
        {
          verifyCode: code,
        },
        {
          where: { email: { [Op.iLike]: user.email } },
        }
      );
      verifyEmail(user?.email, code);
      return resMsg(
        res,
        resCode.USER_NOT_VERIFIED,
        resMessage.USER_NOT_VERIFIED
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.secretOrKey
    );
    if (loginData.deviceToken) {
      const tokenParams = {
        PlatformApplicationArn: process.env.AWS_PLAT_ARN,
        Token: loginData.deviceToken.replace(/-/g, ""),
      };
      if (!validateHexadecimal(tokenParams.Token)) {
        return resMsg(
          res,
          resCode.INTERNAL_SERVER_ERROR,
          "Device Token is invalid"
        );
      }
      sns.createPlatformEndpoint(tokenParams, async (err, data) => {
        if (err) {
          console.log("Failed to register device", err.stack);
          return resMsg(
            res,
            resCode.INTERNAL_SERVER_ERROR,
            "Failed to register device"
          );
        } else {
          let createData = {
            endpointArn: data.EndpointArn,
            device: loginData.deviceToken,
            sessionId: token,
          };
          await User.update(createData, {
            where: {
              id: user.id,
            },
          });
        }
      });
    } else {
      let createData = {
        sessionId: token,
      };
      await User.update(createData, {
        where: {
          id: user.id,
        },
      });
    }
    return resSuccess(res, {
      accessToken: token,
      user,
    });
  } catch (err) {
    console.log(err);
    return resError(res, err);
  }
};

const signUp = async (req, res) => {
  const userData = {
    first_name: req.body.first_name ? req.body.first_name : "",
    last_name: req.body.last_name ? req.body.last_name : "",
    fullName: req.body.full_name ? req.body.full_name : "",
    email: req.body.email ? req.body.email : "",
    phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : "",
    country: req.body.country ? req.body.country : "",
    state: req.body.state ? req.body.state : "",
    city: req.body.city ? req.body.city : "",
    address1: req.body.address1 ? req.body.address1 : "",
    address2: req.body.address2 ? req.body.address2 : "",
    zipCode: req.body.zipCode ? req.body.zipCode : "",
    company: req.body.company ? req.body.company : "",
    password: req.body.password,
    role: req.body.role ? req.body.role : Roles.USER,
    type: req.body.type ? req.body.type : Type.NORMAL,
    userType: req.body.userType ? req.body.userType : UserType.SHOPPER,
    status: req.body.status ? req.body.status : USER_STATUS.ACTIVE,
    avatarUrl: req.body.avatarUrl ? req.body.avatarUrl : DEFAULT_AVATAR,
    isDeleted: DEFAULT_IS_DELETED,
    stripe_subscription_id: req.body.stripe_subscription_id
      ? req.body.stripe_subscription_id
      : "",
    stripe_customer_id: req.body.stripe_customer_id
      ? req.body.stripe_customer_id
      : "",
    selectedFences: [],
    favoriteFences: [],
    paymentType: req.body.payType ? PAYMENT_TYPE.YEARLY : PAYMENT_TYPE.MONTHLY,
    subscription_status: req.body.subscription_status
      ? req.body.subscription_status
      : SUBSCRIPTION_STATUS.NO_SUBSCRIPTION,
    plan: req.body.plan ? req.body.plan : "",
    stripe_price_id: req.body.price_id ? req.body.price_id : "",
    childs: [],
    notificationSetting: NotificationSetting,
    interestLevel: req.body.interestLevel ? req.body.interestLevel : "",
    sms_allow: req.body.receive_sms ? req.body.receive_sms : false,
    referralName: req.body.referralName ? req.body.referralName : "",
  };

  if (userData.sms_allow) {
    userData.sms_allow_updated_date = new Date();
  }

  if (userData.type !== 0) {
    userData.password = DEFAULT_PASSWORD;
  }

  // const { errors, isValid } = validateRegisterInput(userData);

  // if (!isValid) {
  //   return resMsg(res, resCode.BAD_REQUEST, errors);
  // }
  User.findOne({
    where: {
      email: { [Op.iLike]: userData.email },
      role: userData.role,
      isDeleted: false,
    },
  })
    .then(async (user) => {
      if (user) {
        return resMsg(res, resCode.ALREADY_EXIST, resMessage.ALREADY_EXIST);
      } else {
        const name = userData.fullName.split(" ");
        const member = await mailchimp.createListMember({
          email: userData.email,
          fname: name[0] ? name[0] : "",
          lname: name[1] ? name[1] : "",
          birthday: userData.birthday ? userData.birthday : "",
          addr1: userData.address1 ? userData.address1 : "",
          city: userData.city ? userData.city : "",
          state: userData.state ? userData.state : "",
          zipCode: userData.zipCode ? userData.zipCode : "",
          country: userData.country ? userData.country : "",
          phoneNumber: userData.phoneNumber
            ? validator.isMobilePhone(userData.phoneNumber)
              ? userData.phoneNumber
              : ""
            : "",
          membertype: userData.userType
            ? userData.userType === UserType["FREE TRIAL"]
              ? MemberType.TRIAL
              : MemberType.SUBSCRIBE
            : "",
        });
        if (member) {
          userData.mailchimp_member_id = member.id;
        }

        bcrypt.genSalt(10, async (err, salt) => {
          bcrypt.hash(userData.password, salt, async (err, hash) => {
            if (err) throw err;
            userData.password = hash;
            User.create(userData).then(async (result) => {
              if (result) {
                const code = generateRandomNumber(100000, 999999);
                User.update(
                  {
                    verifyCode: code,
                  },
                  {
                    where: {
                      email: { [Op.iLike]: userData.email },
                      role: userData.role,
                    },
                  }
                )
                  .then(() => {
                    verifyEmail(result.email, code);

                    return resMsg(res, resCode.CREATED, resMessage.CREATED);
                  })
                  .catch((err) => {
                    console.log("Signup Error1", err);
                    return resError(res, err);
                  });
              }
            });
          });
        });
      }
    })
    .catch((err) => {
      console.log("Signup Error2", err);
      return resError(res, err);
    });
};

const resendCode = async (req, res) => {
  const email = req.body.email;
  User.findOne({
    where: {
      email: { [Op.iLike]: email },
      isDeleted: false,
    },
  })
    .then((result) => {
      console.log("result :>> ", result);
      if (result) {
        const phoneNumber = result.phoneNumber;
        const code = generateRandomNumber(100000, 999999);
        User.update(
          { verifyCode: code },
          { where: { email: { [Op.iLike]: result.email } } }
        )
          .then(() => {
            // var params = {
            //   Message: "Welcome! Your phone verification code is: " + code,
            //   PhoneNumber: phoneNumber,
            // };
            // new AWS.SNS({ apiVersion: new Date().toString() })
            //   .publish(params)
            //   .promise()
            //   .then((message) => {
            verifyEmail(result.email, code);
            return resSuccess(res);
            // })
            // .catch((err) => {
            //   return resError(res, err);
            // });
          })
          .catch((err) => {
            return resError(res, err);
          });
      } else {
        return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      }
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const verify = async (req, res) => {
  const code = req.body.code;
  const email = req.body.email;
  const emailType = req.body.emailType;
  try {
    const user = await User.findOne({
      where: {
        verifyCode: code,
        email: { [Op.iLike]: email },
        isDeleted: false,
      },
    });
    if (user) {
      const subscription = await Subscription.findOne({
        where: {
          id: user.plan,
        },
      });
      await User.update(
        { isVerified: true },
        { where: { email: { [Op.iLike]: user.email }, isDeleted: false } }
      );

      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.secretOrKey,
        {
          expiresIn: process.env.expired,
        }
      );
      if (emailType && emailType === EMAIL_TYPE.SIGNUP_EMAIL) {
        if (user.role === Roles.SHOPPER) {
          sendShopperSignUpEmail(user.email);
          sendPurchaseSubscriptionNotifyingEmail(user, "Shopper");
        } else if (user.role === Roles.COMPANY) {
          signUpEmail(user.email, subscription?.name);
          sendPurchaseSubscriptionNotifyingEmail(user, subscription?.name);
        }
      }
      return resSuccess(res, {
        accessToken: token,
        user,
      });
    } else {
      return resMsg(
        res,
        resCode.VERIFY_CODE_INCORRECT,
        resMessage.VERIFY_CODE_INCORRECT
      );
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const appVerify = async (req, res) => {
  const veryifyData = {
    code: req.body.code,
    email: req.body.email,
    deviceToken: req.body.deviceToken,
  };
  try {
    const user = await User.findOne({
      where: {
        verifyCode: veryifyData.code,
        email: { [Op.iLike]: veryifyData.email },
        isDeleted: false,
      },
    });
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.secretOrKey
      );
      const params = {
        PlatformApplicationArn: process.env.AWS_PLAT_ARN,
        Token: veryifyData.deviceToken,
      };

      sns.createPlatformEndpoint(params, async (err, data) => {
        if (err) {
          console.log("Failed to register device", err.stack);
          resMsg(
            res,
            resCode.INTERNAL_SERVER_ERROR,
            "Failed to register device"
          );
        } else {
          let createData = {
            endpointArn: data.EndpointArn,
            device: veryifyData.deviceToken,
            sessionId: token,
            isVerified: true,
          };
          await User.update(createData, {
            where: {
              id: user.id,
              email: { [Op.iLike]: user.email },
              isDeleted: false,
            },
          });
        }
      });

      return resSuccess(res, {
        accessToken: token,
        user,
      });
    } else {
      return resMsg(
        res,
        resCode.VERIFY_CODE_INCORRECT,
        resMessage.VERIFY_CODE_INCORRECT
      );
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const forgetPassword = async (req, res) => {
  const userEmail = req.body.email;
  User.findOne({ where: { email: { [Op.iLike]: userEmail } } })
    .then((result) => {
      if (result) {
        const code = generateRandomNumber(100000, 999999);
        User.update(
          {
            verifyCode: code,
            isVerified: USER_STATUS.ACTIVE,
          },
          {
            where: { email: { [Op.iLike]: userEmail } },
          }
        )
          .then(() => {
            forgotPasswordEmail(userEmail, code);

            return resSuccess(res);
          })
          .catch((err) => {
            return resError(res, err);
          });
      } else {
        return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      }
    })
    .catch((err) => {
      return resError(res, err);
    });
};

const resetPassword = async (req, res) => {
  const data = {
    email: req.body.email,
    // verifyCode: req.body.code,
    newPassword: req.body.newPassword,
    confirmPassword: req.body.confirmPassword,
  };

  const { errors, isValid } = validateResetPasswordInput(data);

  if (!isValid) {
    return resMsg(res, resCode.BAD_REQUEST, errors);
  }

  User.findOne({ where: { email: { [Op.iLike]: data.email } } })
    .then((user) => {
      if (!user) {
        return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      } else {
        User.findOne({
          // where: { email: data.email, verifyCode: data.verifyCode },
          where: { email: { [Op.iLike]: data.email }, isDeleted: false },
        })
          .then((result) => {
            if (!result) {
              return resMsg(
                res,
                resCode.VERIFY_CODE_INCORRECT,
                resMessage.VERIFY_CODE_INCORRECT
              );
            } else {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(data.newPassword, salt, (err, hash) => {
                  if (err) throw err;
                  User.update(
                    { password: hash },
                    { where: { email: data.email } }
                  )
                    .then(() => {
                      const token = jwt.sign(
                        {
                          id: user.id,
                        },
                        process.env.secretOrKey,
                        {
                          expiresIn: process.env.expired,
                        }
                      );
                      return resSuccess(res, {
                        accessToken: token,
                        user,
                      });
                    })
                    .catch((err) => {
                      return resError(res, err);
                    });
                });
              });
            }
          })
          .catch((err) => {
            resError(res, err);
          });
      }
    })
    .catch((err) => {
      resError(res, err);
    });
};

//create password for a child
const createPassword = (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  };

  User.findOne({ where: { email: data.email } })
    .then((user) => {
      if (!user) {
        return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(data.password, salt, (err, hash) => {
            if (err) throw err;
            User.update(
              { password: hash, status: USER_STATUS.ACTIVE },
              { where: { email: data.email } }
            )
              .then((result) => resSuccess(res, result))
              .catch((error) => {
                return resError(res, error);
              });
          });
        });
      }
    })
    .catch((error) => {
      resError(res, error);
    });
};

const getPresignedUrl = async (req, res) => {
  const data = req.body;
  const bucketParams = {
    Bucket: `rf-test-test`,
    Key: data.key,
    ContentType: "image/jpeg",
  };

  try {
    // Create a command to put the object in the S3 bucket.
    const command = new PutObjectCommand(bucketParams);

    // Create the presigned URL.
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    const resData = {
      signedUrl: signedUrl,
      key: data.key,
    };
    res.send(resData);
  } catch (err) {
    console.log("Error creating presigned URL", err);
  }
};

const deleteS3File = async (req, res) => {
  const data = req.body;
  const bucketParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: data.key,
  };

  try {
    const command = new DeleteObjectCommand(bucketParams);
    const response = await s3Client.send(command);
    resSuccess(res, response);
  } catch (err) {
    console.error("Error deleting file:", err);
    resError(res, err);
  }
};

const phoneVerify = async (req, res) => {
  const verifyData = {
    email: req.body.email,
    code: req.body.code,
  };
  User.findOne({
    where: {
      email: { [Op.iLike]: verifyData.email },
      isDeleted: false,
    },
  })
    .then((user) => {
      if (!user) {
        return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      } else {
        if (user.verifyCode == verifyData.code) {
          const token = jwt.sign(
            {
              id: user.id,
            },
            process.env.secretOrKey,
            {
              expiresIn: process.env.expired,
            }
          );
          return resSuccess(res, {
            accessToken: token,
            user,
          });
        } else {
          return resMsg(
            res,
            resCode.VERIFY_CODE_INCORRECT,
            resMessage.VERIFY_CODE_INCORRECT
          );
        }
      }
    })
    .catch((err) => {
      resError(res, err);
    });
};

const checkNewLogin = async (req, res) => {
  const currentLoginData = {
    userId: req.body.userId,
    token: req.body.token,
  };
  try {
    let user = await User.findOne({
      where: {
        id: currentLoginData.userId,
        sessionId: currentLoginData.token,
        isDeleted: false,
      },
    });
    if (!user) {
      return resSuccess(res, { otherLogin: true });
    }

    if (!user.isParent) {
      const parent = await User.findOne({
        where: {
          id: user.parentId,
        },
      });

      user = {
        ...parent.dataValues,
        id: user.id,
        email: user.email,
        isParent: user.isParent,
        parentId: user.parentId,
      };
    }

    const expireDate = new Date(user.createdAt);
    if (
      user.role === Roles.COMPANY &&
      ((user.userType === UserType["FREE TRIAL"] &&
        new Date(expireDate.setDate(expireDate.getDate() + 7)) < new Date()) ||
        (user.userType !== UserType["FREE TRIAL"] &&
          user.subscription_status !== SUBSCRIPTION_STATUS.ACTIVE))
    ) {
      return resMsg(
        res,
        resCode.NOT_ACTIVE_SUBSCRIPTION,
        resMessage.NOT_ACTIVE_SUBSCRIPTION
      );
    }

    if (
      user.role === Roles.SHOPPER &&
      new Date(expireDate.setDate(expireDate.getDate() + 7)) < new Date()
    ) {
      return resMsg(
        res,
        resCode.NOT_ACTIVE_SUBSCRIPTION,
        "This Shopper is expired"
      );
    }
    return resSuccess(res, { otherLogin: false });
  } catch (err) {
    resError(res, err);
  }
};

module.exports = {
  initialize,
  signIn,
  signUp,
  verify,
  resendCode,
  forgetPassword,
  createPassword,
  resetPassword,
  getPresignedUrl,
  deleteS3File,
  phoneVerify,
  appLogin,
  checkNewLogin,
  appVerify,
};
