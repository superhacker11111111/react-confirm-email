require('dotenv').config();
const Service = require('../model/Service');
const User = require('../model/User');
const { resSuccess, resError } = require('../utils/responseMessage');
const { BROADCAST_TYPE } = require('../constants/constant');
const validator = require('validator');
const AWS = require('aws-sdk');
const {
  sendSupportEmail,
  sendReceivedCustomerSupportRequest,
  sendReceivedSalesSupportRequest,
  sendViewPriceRequest,
  sendNewsToAllEmails,
  sendNewToAllPhones,
} = require('../utils/sendEmail');

const sendMessage = async (req, res) => {
  const contactData = req.body;
  try {
    await Service.create(contactData);
    sendSupportEmail(contactData);
    if (
      (contactData.sales && contactData.customer) ||
      (!contactData.sales && !contactData.customer) ||
      contactData.sales
    ) {
      sendReceivedSalesSupportRequest(contactData.email);
    }
    if (contactData.customer) {
      sendReceivedCustomerSupportRequest(contactData.email);
    }

    return resSuccess(res, { email: contactData.email });
  } catch (err) {
    console.log('contact err :==>', err);
    resError(res, err);
  }
};

const sendViewPriceMessage = async (req, res) => {
  const data = req.body;
  try {
    sendViewPriceRequest(data);
    resSuccess(res);
  } catch (err) {
    resError(res, err);
  }
};

const sendNews = async (req, res) => {
  const { title, content, type } = req.body;
  try {
    const users = await User.findAll({
      where: {
        isDeleted: false,
      },
      attributes: ['email', 'phoneNumber'],
    });
    if (users && users.length > 0) {
      if (type === BROADCAST_TYPE.EMAIL) {
        const emailList = users.map((user) => user.dataValues.email);
        if (emailList && emailList.length > 0) {
          const emails = emailList.filter((email) => validator.isEmail(email));
          sendNewsToAllEmails(emails, title, content);
        }
      } else {
        const phoneNumberList = users.map(
          (user) => user.dataValues.phoneNumber
        );
        if (phoneNumberList && phoneNumberList.length > 0) {
          const phoneNumbers = phoneNumberList.filter((phoneNumber) =>
            validator.isMobilePhone(phoneNumber)
          );
          sendNewToAllPhones(phoneNumbers, content);
        }
      }
    }
    resSuccess(res);
  } catch (err) {
    resError(res, err.message);
  }
};

module.exports = {
  sendMessage,
  sendViewPriceMessage,
  sendNews,
};
