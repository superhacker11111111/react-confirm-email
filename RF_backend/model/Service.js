const { DataTypes, UUIDV1 } = require("sequelize");
const sequelize = require("../config/database");

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV1(),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      require: false,
    },
    email: {
      type: DataTypes.STRING,
      require: false,
    },
    phone: {
      type: DataTypes.STRING,
      require: false,
    },
    company: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
    },
    sales: {
      type: DataTypes.BOOLEAN,
    },
    customer: {
      type: DataTypes.BOOLEAN,
    },
    subject: {
      type: DataTypes.STRING,
    },
    // state: {
    //   type: DataTypes.STRING,
    //   require: false,
    // },
    // createdAt: {
    //   type: DataTypes.DATE,
    //   default: Date.now(),
    // },
    // updatedAt: {
    //   type: DataTypes.DATE,
    //   default: Date.now(),
    // },
    // isDeleted: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["id"],
      },
    ],
  }
);

module.exports = Service;
