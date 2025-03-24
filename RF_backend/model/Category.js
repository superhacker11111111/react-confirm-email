const { DataTypes, UUIDV1 } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define(
  "Category",
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
    images: {
      type: DataTypes.JSON,
    },
    sub_categories: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    styles: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    colors: {
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

module.exports = Category;
