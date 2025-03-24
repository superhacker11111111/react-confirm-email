const { DataTypes, fn, UUIDV1 } = require("sequelize");
const sequelize = require("../config/database");

const Tag = sequelize.define(
  "Tag",
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

module.exports = Tag;
