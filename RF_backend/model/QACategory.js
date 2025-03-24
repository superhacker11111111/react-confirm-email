const { DataTypes, UUIDV1 } = require("sequelize");
const sequelize = require("../config/database");

const QACategory = sequelize.define(
  "QACategory",
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

module.exports = QACategory;
