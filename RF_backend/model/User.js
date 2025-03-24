const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV4(),
      allowNull: false,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      require: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      require: false,
    },
    country: {
      type: DataTypes.STRING,
      require: false,
    },
    state: {
      type: DataTypes.STRING,
      require: false,
    },
    address1: {
      type: DataTypes.STRING,
      require: false,
    },
    address2: {
      type: DataTypes.STRING,
      require: false,
    },
    city: {
      type: DataTypes.STRING,
      require: false,
    },
    company: {
      type: DataTypes.STRING,
      require: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      require: false,
    },
    email: {
      type: DataTypes.STRING,
      require: true,
    },
    role: {
      type: DataTypes.INTEGER,
      require: true,
    },
    userType: {
      type: DataTypes.INTEGER,
      require: true,
    },
    password: {
      type: DataTypes.STRING,
      require: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
    },
    verifyCode: {
      type: DataTypes.STRING,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    type: { type: DataTypes.STRING, require: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    stripe_subscription_id: {
      type: DataTypes.STRING,
    },
    // swapCount: {
    //   type: DataTypes.INTEGER,
    // },
    // swapAddCount: {
    //   type: DataTypes.INTEGER,
    // },
    // swapRemoveCount: {
    //   type: DataTypes.INTEGER,
    // },
    plan: {
      type: DataTypes.STRING,
    },
    remain: {
      type: DataTypes.FLOAT,
    },
    paymentType: {
      type: DataTypes.STRING,
    },
    subscription_status: {
      type: DataTypes.STRING,
    },
    selectedFences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    favoriteFences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      require: true,
    },
    onboardingPass: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // swapDate: {
    //   type: DataTypes.DATE,
    // },
    stripe_price_id: {
      type: DataTypes.STRING,
    },
    device: {
      type: DataTypes.STRING,
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
    },
    notificationSetting: {
      type: DataTypes.JSON,
    },
    interestLevel: {
      type: DataTypes.JSON,
    },
    isParent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    parentId: {
      type: DataTypes.STRING,
    },
    sessionId: {
      type: DataTypes.STRING,
    },
    endpointArn: {
      type: DataTypes.STRING,
    },
    mailchimp_member_id: {
      type: DataTypes.STRING,
    },
    simpletexting_contact_id: {
      type: DataTypes.STRING,
    },
    sms_allow: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sms_allow_updated_date: {
      type: DataTypes.DATE,
    },
    referralName: {
      type: DataTypes.STRING,
      default: "",
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

module.exports = User;
