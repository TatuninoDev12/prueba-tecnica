require("dotenv").config();

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: process.env.DB_FILENAME || "./dev.sqlite3",
    },
    migrations: {
      directory: "./src/migrations",
    },
    useNullAsDefault: true,
  },
  test: {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
    migrations: {
      directory: "./src/migrations",
    },
  },
};
