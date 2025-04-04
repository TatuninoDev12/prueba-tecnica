exports.up = function (knex) {
  return knex.schema
    .createTable("tblPY1", (table) => {
      table.increments("UserId").primary();
      table.string("username").notNullable().unique();
      table.string("password").notNullable();
      table.string("name").notNullable();
      table.string("phone").notNullable();
      table.string("bloodType").notNullable();
      table.enum("role", ["admin", "user"]).defaultTo("user");
    })
    .createTable("tblcliente", (table) => {
      table.increments("ClienteId").primary();
      table.string("name").notNullable();
      table.string("phone").notNullable();
      table.enum("type", ["regular", "vip"]).defaultTo("regular");
    })
    .createTable("warehouse", (table) => {
      table.increments("warehouseId").primary();
      table.string("name").notNullable();
      table.string("location").notNullable();
      table.string("manager").notNullable();
    })
    .createTable("tblArticulo", (table) => {
      table.increments("ArticuloId").primary();
      table.string("barcode").unique().notNullable();
      table.string("description").notNullable();
      table.string("manufacturer").notNullable();
      table.string("name").notNullable();
      table.decimal("price", 10, 2).notNullable();
      table.integer("stock").defaultTo(0);
      table
        .string("warehouseName")
        .notNullable()
        .references("name")
        .inTable("warehouse");
      table
        .string("warehouseId")
        .notNullable()
        .references("warehouseId")
        .inTable("warehouse");
    })
    .createTable("tblpedido", (table) => {
      table.increments("purchaseId").primary();
      table.integer("ClienteId").references("ClienteId").inTable("tblcliente");
      table.integer("ArticuloId").notNullable();
      table.string("warehouse").notNullable();
      table.integer("units").defaultTo(0);
      table.integer("total").defaultTo(0);
      table
        .foreign("ArticuloId")
        .references("ArticuloId")
        .inTable("tblArticulo");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("tblPY1")
    .dropTableIfExists("warehouse")
    .dropTableIfExists("tblcliente")
    .dropTableIfExists("employees")
    .dropTableIfExists("tblArticulo")
    .dropTableIfExists("tblpedido");
};
