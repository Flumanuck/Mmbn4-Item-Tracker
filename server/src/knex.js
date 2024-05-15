const config = require('../knexfile.js');
const knex = require('knex');

const environment = (process.env.NODE_ENV && process.env.NODE_ENV === "production") ? "production" : "development";
module.exports = knex(config[environment]);
