const db = require("../config/db");

exports.createClient = async (req, res) => {
  try {
    const requiredFields = ["name", "phone", "type"];
    const { name, phone, type } = req.body;
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const [client] = await db("tblcliente")
      .insert({ name, phone, type })
      .returning("*");

    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const { page = 1, perPage = 10, type, name, id } = req.query;

    const query = db("tblcliente")
      .select("*")
      .modify((queryBuilder) => {
        if (type) queryBuilder.where("type", type);
        if (id) queryBuilder.where("ClienteId", id);
        if (name) queryBuilder.where("name", "like", `%${name}%`);
      })
      .paginate({
        perPage: parseInt(perPage),
        currentPage: parseInt(page),
      });

    const results = await query;
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientPurchases = async (req, res) => {
  try {
    const { id } = req.params;

    const purchases = await db("tblpedido")
      .where("tblpedido.ClienteId", id)
      .join("tblArticulo", "tblpedido.ArticuloId", "tblArticulo.ArticuloId")
      .join("warehouse", "tblArticulo.warehouseId", "warehouse.warehouseId")
      .select(
        "tblpedido.*",
        "tblArticulo.description",
        "tblArticulo.manufacturer",
        "tblArticulo.price",
        "tblArticulo.name",
        "warehouse.name as warehouseName",
        "warehouse.location as warehouseLocation"
      )
      .modify((queryBuilder) => {
        if (type) queryBuilder.where("type", type);
        if (req.params.PedidoId)
          queryBuilder.where("tblpedido.id", req.params.PedidoId);
        if (req.params.manufacturer)
          queryBuilder.where(
            "tblArticulo.manufacturer",
            "like",
            `%$req.params.manufacturer}%`
          );
      })
      .paginate({
        perPage: req.query.perPage || 10,
        currentPage: req.query.page || 1,
      });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({
      error: `Error retrieving purchases: ${error.message}`,
    });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    //validate if the client exists
    const client = await db("tblcliente").where("ClienteId", id).first();
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const updatedClient = await db("tblcliente")
      .where("ClienteId", id)
      .update(req.body)
      .returning("*");

    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    //validate if the client exists
    const client = await db("tblcliente").where("ClienteId", id).first();
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const deletedClient = await db("tblcliente")
      .where("ClienteId", id)
      .del()
      .returning("*");

    if (!deletedClient) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully " });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
