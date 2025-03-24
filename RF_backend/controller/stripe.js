// Create service client module using ES6 syntax.
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  stripe,
};
