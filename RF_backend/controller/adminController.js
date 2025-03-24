const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { resMsg, resSuccess, resError } = require("../utils/responseMessage");
const { resCode, resMessage } = require("../constants/resCode");
const { DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3Client");
const { stripe } = require("./stripe");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const AWS = require("aws-sdk");

const SES_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const adminLogin = async (req, res) => {
  const loginData = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const admin = await Admin.findOne({
      where: {
        email: {
          [Op.iLike]: loginData.email,
        },
        isDeleted: false,
      },
    });
    if (admin) {
      if (!admin.password) {
        return resMsg(res, resCode.INVALID_USER, resMessage.INVALID_USER);
      }
      const result = await bcrypt.compare(loginData.password, admin.password);
      if (result) {
        const phoneNumber = admin.phoneNumber;
        const code = generateRandomNumber(100000, 999999);
        const tmp = await Admin.update(
          { verifyCode: code },
          {
            where: {
              email: { [Op.iLike]: admin.email },
            },
          }
        );
        // var params = {
        //   Message: `<html>
        //   <body>
        //     <h1>Hello, Customer</h1>
        //     <p>Dear ${user.fullName}</p>
        //     <p>
        //      Thank you for signing up with RealityFence! To verify your account and ensure the security of your information, we have generated a unique verification code for you.
        //     </p>
        //     <p>
        //      Your Verification Code: ${code}
        //     </p>
        //     <p>
        //     Please enter this code in the appropriate field on the account setup page. This code will expire after 30 minutes for your security.
        //     </p>
        //     <p>
        //    If you did not request this code or if you're having trouble verifying your account, please contact our support team immediately at support@realityfence.com.
        //     </p>
        //     <p>Welcome aboard and we look forward to helping you transform your sales with RealityFence!</p>
        //     <p>Best Regards,</p>
        //     <p>RealityFence Team</p>
        //   </body>
        // </html>`,
        //   PhoneNumber: phoneNumber,
        // };
        // new AWS.SNS({ apiVersion: new Date().toString() })
        //   .publish(params)
        //   .promise();
        const ses = new AWS.SES(SES_CONFIG);
        const params = {
          Destination: {
            ToAddresses: [admin.email], // Email address/addresses that you want to send your email
          },
          ConfigurationSetName: process.env.EMAIL_CONFIG_NAME,
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `<html>
                          <body>
                            <p>
                            Your RealityFence verification code is ${code}.
                            </p>
                            <p>
                            Please enter this code to complete your login. This code expires in 10 minutes.
                            </p>
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
        const sendresult = await ses.sendEmail(params).promise();
        resSuccess(res, admin.email);
      } else {
        resMsg(res, resCode.INVALID_USER, resMessage.INVALID_USER);
      }
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({ where: { isDeleted: false } });
    resSuccess(res, admins);
  } catch (err) {
    resError(res, err);
  }
};

const addAdmin = async (req, res) => {
  const adminData = req.body;
  try {
    const admin = await Admin.create(adminData);
    const token = jwt.sign(
      {
        email: admin.email,
      },
      process.env.secretOrKey,
      {
        expiresIn: process.env.expired,
      }
    );
    const ses = new AWS.SES(SES_CONFIG);
    const params = {
      Destination: {
        ToAddresses: [admin.email], // Email address/addresses that you want to send your email
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
    ses.sendEmail(params).promise();
    resSuccess(res);
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const deleteAdmin = async (req, res) => {
  const id = req.params.id;
  try {
    await Admin.update({ isDeleted: true }, { where: { id: id } });
    resSuccess(res);
  } catch (err) {
    resError(res, err);
  }
};

const resendCode = async (req, res) => {
  const email = req.body.email;
  try {
    const admin = await Admin.findOne({
      where: {
        email: { [Op.iLike]: email },
        isDeleted: false,
      },
    });
    if (admin) {
      const code = generateRandomNumber(100000, 999999);
      await Admin.update(
        { verifyCode: code },
        { where: { email: { [Op.iLike]: admin.email }, isDeleted: false } }
      );
      const ses = new AWS.SES(SES_CONFIG);
      const params = {
        Destination: {
          ToAddresses: [admin.email],
        },
        ConfigurationSetName: process.env.EMAIL_CONFIG_NAME,
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `<html>
              <body>
                <h1>Hello, Customer</h1>
                <p>Dear ${admin.fullName}</p>
                <p>
                We received a request to reset your password for your RealityFence account. If you made this request, please use the following verification code:
                </p>
                <p>
                 Verification Code: ${code}
                </p>
                <p>
                Please enter this code in the appropriate field on the password reset page. This code will be valid for the next 15 minutes.
                </p>
                <p>
                Didn't request this change?
                </p>
                <p>If you didn't request a new password, please ignore this email or let us know right away. It's important to us to keep your information secure.</p>
                <p>Thanks</p>
                <p>The RealityFence Team</p>
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
      const sendingResult = ses.sendEmail(params).promise();
      resSuccess(res);
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const verify = async (req, res) => {
  const verifyData = {
    code: req.body.code,
    email: req.body.email,
  };
  try {
    const admin = await Admin.findOne({
      where: { email: { [Op.iLike]: verifyData.email }, isDeleted: false },
    });

    if (admin) {
      if (admin.verifyCode === verifyData.code) {
        resSuccess(res);
      } else {
        resMsg(
          res,
          resCode.VERIFY_CODE_INCORRECT,
          resMessage.VERIFY_CODE_INCORRECT
        );
      }
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const phoneVerify = async (req, res) => {
  const verifyData = {
    code: req.body.code,
    email: req.body.email,
  };
  try {
    const admin = await Admin.findOne({
      where: { email: { [Op.iLike]: verifyData.email }, isDeleted: false },
    });

    if (admin) {
      if (admin.verifyCode === verifyData.code) {
        const token = jwt.sign(
          {
            id: admin.id,
          },
          process.env.secretOrKey,
          {
            expiresIn: process.env.expired,
          }
        );
        return resSuccess(res, {
          accessToken: token,
          admin,
        });
      } else {
        resMsg(
          res,
          resCode.VERIFY_CODE_INCORRECT,
          resMessage.VERIFY_CODE_INCORRECT
        );
      }
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const admin = await Admin.findOne({
      where: { email: { [Op.iLike]: email }, isDeleted: false },
    });
    if (admin) {
      const code = generateRandomNumber(100000, 999999);
      await Admin.update(
        {
          verifyCode: code,
        },
        {
          where: { email: { [Op.iLike]: admin.email } },
        }
      );
      const ses = new AWS.SES(SES_CONFIG);
      const params = {
        Destination: {
          ToAddresses: [admin.email], // Email address/addresses that you want to send your email
        },
        ConfigurationSetName: process.env.EMAIL_CONFIG_NAME,
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `<html>
                      <body>
                        <h1>Hello, Customer</h1>
                        <p>Dear ${admin.fullName}</p>
                        <p>
                        We received a request to reset your password for your RealityFence account. If you made this request, please use the following verification code:
                        </p>
                        <p>
                         Verification Code: ${code}
                        </p>
                        <p>
                        Please enter this code in the appropriate field on the password reset page. This code will be valid for the next 15 minutes.
                        </p>
                        <p>
                        Didn't request this change?
                        </p>
                        <p>If you didn't request a new password, please ignore this email or let us know right away. It's important to us to keep your information secure.</p>
                        <p>Thanks</p>
                        <p>The RealityFence Team</p>
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
      ses.sendEmail(params).promise();
      return resSuccess(res, admin.email);
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const resetPassword = async (req, res) => {
  const passwordData = {
    email: req.body.email,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  };

  try {
    const admin = await Admin.findOne({
      where: { isDeleted: false, email: { [Op.iLike]: passwordData.email } },
    });

    if (admin) {
      if (passwordData.currentPassword) {
        const isEqual = await bcrypt.compare(
          passwordData.currentPassword,
          admin.password
        );
        if (!isEqual) {
          return resMsg(
            res,
            resCode.CURRENT_PASSWORD_INCORRECT,
            resMessage.CURRENT_PASSWORD_INCORRECT
          );
        }
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(passwordData.newPassword, salt);
      await Admin.update(
        { password: hash },
        {
          where: {
            email: { [Op.iLike]: admin.email },
            isDeleted: false,
          },
        }
      );
      return resSuccess(res);
    } else {
      return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

const getUserByID = async (req, res) => {
  const id = req.params.id;
  try {
    const admin = await Admin.findByPk(id);
    if (admin) {
      resSuccess(res, admin);
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    resError(res, err);
  }
};

const createPassword = async (req, res) => {
  const passwordData = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const admin = await Admin.findOne({
      where: { isDeleted: false, email: { [Op.iLike]: passwordData.email } },
    });
    if (admin) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(passwordData.password, salt);
      await Admin.update(
        { password: hash },
        { where: { email: { [Op.iLike]: admin.email } } }
      );
      resSuccess(res);
    } else {
      resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
    }
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
};

module.exports = {
  adminLogin,
  addAdmin,
  resendCode,
  verify,
  phoneVerify,
  forgotPassword,
  resetPassword,
  getUserByID,
  getAdmins,
  deleteAdmin,
  createPassword,
};
