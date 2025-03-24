const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database");

const Media = sequelize.define(
  "Media",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV4(),
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.JSON,
      require: false,
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

module.exports = Media;
