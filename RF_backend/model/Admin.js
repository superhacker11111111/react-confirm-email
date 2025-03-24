const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define(
  "Admins",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV4(),
      allowNull: false,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      require: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      require: false,
    },
    email: {
      type: DataTypes.STRING,
      require: true,
    },
    password: {
      type: DataTypes.STRING,
      require: false,
    },
    verifyCode: {
      type: DataTypes.STRING,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      require: true,
    },
    device: {
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["id", "email"],
      },
    ],
  }
);

module.exports = Admin;
