const db = require("../config/db");

exports.createPurchase = async (req, res) => {
  try {
    const { ClienteId, ArticuloId, units } = req.body;
    // Validate required fields
    const requiredFields = ["ClienteId", "ArticuloId", "units"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // validate client
    const client = await db("tblcliente").where("ClienteId", ClienteId).first();
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // search price article
    const article = await db("tblArticulo")
      .where("ArticuloId", ArticuloId)
      .first();
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // search warehouse
    const warehouse = await db("warehouse")
      .where("warehouseId", article.warehouseId)
      .first();
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    const [newPurchase] = await db("tblpedido")
      .insert({
        ClienteId,
        ArticuloId,
        units,
        warehouseId: warehouse.warehouseId,
        price: article.price,
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

exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    // validate purchaseId

    const purchase = await db("tblpedido").where("purchaseId", id).first();
    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }
    const { units } = req.body;
    if (!units) {
      return res.status(400).json({ error: "Missing required units" });
    }
    const [updatedPurchase] = await db("tblpedido")
      .where("purchaseId", id)
      .update({
        units,
        total: units * purchase.price,
      })
      .returning("*");

    res.status(200).json(updatedPurchase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await db("tblpedido").where("purchaseId", id).first();
    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    await db("tblpedido").where("purchaseId", id).del();

    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
