const { DataTypes, UUIDV1 } = require("sequelize");
const sequelize = require("../config/database");

const QA = sequelize.define(
  "QA",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV1(),
      allowNull: false,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING,
    },
    answer: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.STRING,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
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

module.exports = QA;
