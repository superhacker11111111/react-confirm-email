const { DataTypes, UUIDV1 } = require("sequelize");
const sequelize = require("../config/database");

const Subscription = sequelize.define(
  "Subscription",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV1(),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    discount: {
      type: DataTypes.STRING,
    },
    totalFences: {
      type: DataTypes.STRING,
    },
    totalUsers: {
      type: DataTypes.STRING,
    },
    requestAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    popular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // swapCount: {
    //   type: DataTypes.STRING,
    // },
    createdAt: {
      type: DataTypes.DATE,
      default: Date.now(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      default: Date.now(),
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
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

module.exports = Subscription;
