const Sequelize = require("sequelize");
const env = require("dotenv");
env.config();

const dbUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(dbUrl, {
  logging: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 20, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    acquire: 30000, // Maximum time (ms) that a connection can be idle before being released
    idle: 10000, // Maximum time (ms) that a connection can be idle before being closed
  },
});

module.exports = sequelize;
