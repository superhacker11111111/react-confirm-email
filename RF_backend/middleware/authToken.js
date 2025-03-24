const jwt = require("jsonwebtoken");
require("dotenv").config();
const { resCode, resMessage } = require("../constants/resCode");
const Admin = require("../model/Admin");
const User = require("../model/User");
const { resMsg } = require("../utils/responseMessage");

authToken = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return resMsg(res, resCode.FORBIDDEN, resMessage.FORBIDDEN);
  }

  jwt.verify(token, process.env.secretOrKey, async (err, decoded) => {
    if (err) {
      return resMsg(res, resCode.UNAUTHORIZED, resMessage.UNAUTHORIZED);
    }
    try {
      const user = await User.findOne({ where: { id: decoded.id } });
      const admin = await Admin.findOne({
        where: { id: decoded.id, isDeleted: false },
      });
      if (!user && !admin) {
        return resMsg(res, resCode.NO_EXIST, resMessage.NO_EXIST);
      }
      req.user = user || admin;
      return next();
    } catch (err) {
      resMsg(
        res,
        resCode.INTERNAL_SERVER_ERROR,
        resMessage.INTERNAL_SERVER_ERROR
      );
    }
  });
};

module.exports = authToken;
