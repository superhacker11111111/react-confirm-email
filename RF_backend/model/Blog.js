const { DataTypes, UUIDV1 } = require("sequelize");
const sequelize = require("../config/database");

const Blog = sequelize.define(
  "Blog",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV1(),
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    files: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    text: {
      type: DataTypes.TEXT({ length: 10000 }),
    },
    isDraft: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

module.exports = Blog;
