const { DataTypes, UUIDV1 } = require("sequelize");
const sequelize = require("../config/database");

const Billing = sequelize.define(
  "Billing",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV1(),
      allowNull: false,
      primaryKey: true,
    },
    invoice_id: {
      type: DataTypes.STRING,
    },
    customer_id: {
      type: DataTypes.STRING,
    },
    paid_amount: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
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

module.exports = Billing;
