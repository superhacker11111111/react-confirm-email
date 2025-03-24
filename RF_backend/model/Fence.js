const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database");

const Fence = sequelize.define("Fence", {
  id: {
    type: DataTypes.STRING,
    defaultValue: UUIDV4(),
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  filesImage: {
    type: DataTypes.ARRAY(DataTypes.JSON),
  },
  filesDocs: {
    type: DataTypes.ARRAY(DataTypes.JSON),
  },
  files3D: {
    type: DataTypes.ARRAY(DataTypes.JSON),
  },
  category: {
    type: DataTypes.STRING,
  },

  sub_category: {
    type: DataTypes.STRING,
  },

  style: {
    type: DataTypes.STRING,
  },

  color: {
    type: DataTypes.STRING,
  },

  size: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  addedBy: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  pdf_url: {
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
});

module.exports = Fence;
