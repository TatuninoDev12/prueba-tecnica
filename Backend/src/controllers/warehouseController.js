const knex = require("../config/db");

exports.createWarehouse = async (req, res) => {
  try {
    console.log("Creating warehouse with data:", req.body);

    const [warehouse] = await knex("warehouse").insert(req.body).returning("*");
    res.status(201).json({
      message: "Warehouse created successfully",
      warehouse,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Error creating warehouse",
      error,
    });
  }
};

exports.getWarehouses = async (req, res) => {
  try {
    const query = knex("warehouse")
      .select("*")
      .modify((queryBuilder) => {
        if (req.query.name) {
          queryBuilder.where("name", "like", `%${req.query.name}%`);
        }
        if (req.query.location) {
          queryBuilder.where("location", "like", `%${req.query.location}%`);
        }
      })
      .paginate({
        perPage: req.query.perPage || 10,
        currentPage: req.query.page || 1,
      });

    const results = await query;
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
