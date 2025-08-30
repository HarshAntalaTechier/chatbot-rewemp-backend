const { Sequelize } = require('@sequelize/core');
const { DATABASE, DATABASEUSERNAME, DATABASEPASSWORD, DATABASEHOST, DATABASEPORT } = require('./config/index');

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: DATABASE,
  user: DATABASEUSERNAME, // ✅ Corrected key name
  password: DATABASEPASSWORD,
  host: DATABASEHOST,
  port: DATABASEPORT,
  ssl: false, // ✅ Proper SSL handling
  clientMinMessages: 'notice'
});

module.exports = sequelize;
