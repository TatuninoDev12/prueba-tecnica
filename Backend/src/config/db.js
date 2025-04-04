const knex = require("knex");
const { attachPaginate } = require("knex-paginate");
const config = require("../../knexfile");
const db = knex(config.development);
attachPaginate();

module.exports = db;
