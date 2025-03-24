const { resCode, resMessage } = require("../constants/resCode");

const resMsg = (res, code, message, data) => {
  return res.json({ code: code, message: message, data: data });
};

const resSuccess = (res, data) => {
  if (data) {
    return resMsg(res, resCode.SUCCESS, resMessage.SUCCESS, data);
  }
  return resMsg(res, resCode.SUCCESS, resMessage.SUCCESS);
};

const resError = (res, message) => {
  if (message) {
    return resMsg(res, resCode.INTERNAL_SERVER_ERROR, message);
  }
  return resMsg(
    res,
    resCode.INTERNAL_SERVER_ERROR,
    resMessage.INTERNAL_SERVER_ERROR
  );
};

const resIosError = (res, code, message, token) => {
  return res.json({
    code: code,
    message: message,
    data: { accessToken: token },
  });
};

const resIosPass = (res, code, message, token) => {
  return res.json({
    code: code,
    message: { email: message },
    accessToken: token,
  });
};

module.exports = { resMsg, resSuccess, resError, resIosError, resIosPass };
