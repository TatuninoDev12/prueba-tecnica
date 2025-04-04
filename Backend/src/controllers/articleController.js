const knex = require("../config/db");

exports.createArticle = async (req, res) => {
  try {
    const { barcode, name, manufacturer, price, warehouseId, description } =
      req.body;

    // validate required fields
    const requiredFields = [
      "barcode",
      "name",
      "manufacturer",
      "price",
      "warehouseId",
      "description",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Check if the article already exists
    const existingArticle = await knex("tblArticulo")
      .where({ barcode })
      .first();
    if (existingArticle) {
      return res.status(400).json({
        error: "Article with this barcode already exists",
      });
    }
    // Check if the warehouse exists
    const existingWarehouse = await knex("warehouse")
      .where({ warehouseId })
      .first();
    if (!existingWarehouse) {
      return res.status(400).json({
        error: "Warehouse with this ID does not exist",
      });
    }
    // get the warehouse name
    const warehouseName = existingWarehouse.name;

    // Insert the article

    const [article] = await knex("tblArticulo")
      .insert({
        barcode,
        name,
        manufacturer,
        price,
        warehouseId,
        warehouseName,
        description,
      })
      .returning("*");
    res.status(201).json({
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Error creating article",
      error,
    });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const query = knex("tblArticulo")
      .select(
        "tblArticulo.*",
        "warehouse.name as warehouseName",
        "warehouse.location as warehouseLocation",
        "warehouse.manager as warehouseManager"
      )
      .join("warehouse", "tblArticulo.warehouseId", "warehouse.warehouseId")
      .modify((queryBuilder) => {
        if (req.query.barcode) {
          queryBuilder.where("barcode", req.query.barcode);
        }
        if (req.query.manufacturer) {
          queryBuilder.where(
            "manufacturer",
            "like",
            `%${req.query.manufacturer}%`
          );
        }
        if (req.query.name) {
          queryBuilder.where("name", "like", `%${req.query.name}%`);
        }
        if (req.query.price) {
          queryBuilder.where("price", "like", `%${req.query.price}%`);
        }
        if (req.query.warehouseId) {
          queryBuilder.where("warehouseId", req.query.warehouseId);
        }
        if (req.query.warehouseName) {
          queryBuilder.where("warehouseName", req.query.warehouseName);
        }
        if (req.query.id) {
          queryBuilder.where("ArticuloId", req.query.id);
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

exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the article exists
    const existingArticle = await knex("tblArticulo")
      .where({ ArticuloId: id })
      .first();

    if (!existingArticle) {
      return res.status(404).json({
        error: "Article not found",
      });
    }

    // Check if the warehouse exists
    if (req.body.warehouseId) {
      const existingWarehouse = await knex("warehouse")
        .where({ warehouseId: req.body.warehouseId })
        .first();
      if (!existingWarehouse) {
        return res.status(400).json({
          error: "Warehouse with this ID does not exist",
        });
      }
      // get the warehouse name
      const warehouseName = existingWarehouse.name;
      const warehouseId = existingWarehouse.warehouseId;
      const updatedArticle = await knex("tblArticulo")
        .where({ ArticuloId: id })
        .update({
          ...req.body,
          warehouseName,
          warehouseId,
        });
      if (updatedArticle) {
        const article = await knex("tblArticulo")
          .where({ ArticuloId: id })
          .first();
        return res.status(200).json({
          message: "Article updated successfully",
          article,
        });
      }
      return res.status(400).json({
        error: "Error updating article",
      });
    }
    // Update the article
    const updatedArticle = await knex("tblArticulo")
      .where({ ArticuloId: id })
      .update(req.body);
    if (updatedArticle) {
      const article = await knex("tblArticulo")
        .where({ ArticuloId: id })
        .first();
      return res.status(200).json({
        message: "Article updated successfully",
        article,
      });
    }
    return res.status(400).json({
      error: "Error updating article",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Error updating article",
      error,
    });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the article exists
    const existingArticle = await knex("tblArticulo")
      .where({ ArticuloId: id })
      .first();

    if (!existingArticle) {
      return res.status(404).json({
        error: "Article not found",
      });
    }

    // Delete the article
    await knex("tblArticulo").where({ ArticuloId: id }).del();
    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Error deleting article",
      error,
    });
  }
};
