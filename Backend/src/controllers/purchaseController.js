const db = require("../config/db");

exports.createPurchase = async (req, res) => {
  try {
    const { ClienteId, ArticuloId, units, warehouse } = req.body;
    // Validate required fields
    const requiredFields = ["ClienteId", "ArticuloId", "units", "warehouse"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // search price article
    const article = await db("tblArticulo")
      .where("ArticuloId", ArticuloId)
      .first();
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const [newPurchase] = await db("tblpedido")
      .insert({
        ClienteId,
        ArticuloId,
        units,
        warehouse,
        total: units * article.price,
      })
      .returning("*");

    res.status(201).json(newPurchase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getClientPurchases = async (req, res) => {
  try {
    const purchases = await db("tblpedido")
      .join("tblArticulo", "tblpedido.ArticuloId", "tblArticulo.ArticuloId")
      .join("warehouse", "tblArticulo.warehouseId", "warehouse.warehouseId")
      .join("tblcliente", "tblpedido.ClienteId", "tblcliente.ClienteId")
      .select(
        "tblcliente.name as clientName",
        "tblcliente.phone as clientPhone",
        "tblpedido.*",
        "tblArticulo.*",
        "warehouse.name as warehouseName",
        "warehouse.location as warehouseLocation",
        "warehouse.manager as warehouseManager"
      )
      .modify((queryBuilder) => {
        if (req.query.ArticuloId) {
          queryBuilder.where("tblArticulo.ArticuloId", req.query.ArticuloId);
        }
        if (req.query.ArticuloName) {
          queryBuilder.where(
            "tblArticulo.name",
            "like",
            `%${req.query.ArticuloName}%`
          );
        }
        if (req.query.ArticuloPrice) {
          queryBuilder.where("tblArticulo.price", req.query.ArticuloPrice);
        }
      })
      .paginate({
        perPage: req.query.perPage || 10,
        currentPage: req.query.page || 1,
      });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
