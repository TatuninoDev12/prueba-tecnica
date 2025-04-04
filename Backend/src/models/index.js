const knex = require("../config/db");

module.exports = {
  getClientById: async (id) => {
    return knex("tblcliente").where({ ClienteId: id }).first();
  },
  createClient: async (clientData) => {
    return knex("tblcliente").insert(clientData).returning("*");
  },
  // Add other model methods as needed
};
