// tests/api.test.js
const request = require("supertest");
const app = require("../../server");
const knex = require("../config/db");
const jwt = require("jsonwebtoken");

let adminToken;
let testClientId;
let testArticleId;
let testPurchaseId;
let testWarehouseId;

beforeAll(async () => {
  await knex.migrate.latest();
  await knex.seed.run();

  // Login to get token
  const res = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin", password: "password" });

  adminToken = res.body.token;
});

afterAll(async () => {
  await knex.destroy();
});

describe("Auth API", () => {
  it("POST /register - should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "Testpass123!",
      name: "Test User",
      phone: "1234567890",
      bloodType: "O+",
      role: "user",
    });
    expect(res.statusCode).toEqual(201);
    // expect(res.body).toHaveProperty("token");
  });

  it("POST /login - should authenticate user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "password" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});

describe("Clients API", () => {
  it("POST /clients - should create a new client", async () => {
    const res = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "John Doe",
        phone: "555-1234",
        type: "vip",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.ClienteId).toBe(1);
    console.log(res.body);

    testClientId = res.body.ClienteId;
    console.log(testClientId);
  });

  it("GET /clients - should get all clients", async () => {
    const res = await request(app)
      .get("/api/clients")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("PUT /clients/:id - should update client", async () => {
    const res = await request(app)
      .put(`/api/clients/${testClientId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ type: "regular" });
    expect(res.statusCode).toEqual(200);
    console.log(res.body);
    expect(res.body[0].type).toBe("regular");
  });

  it("DELETE /clients/:id - should delete client", async () => {
    const res = await request(app)
      .delete(`/api/clients/${testClientId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe("Warehouse API", () => {
  it("POST /warehouses - should create warehouse", async () => {
    const res = await request(app)
      .post("/api/warehouse")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Main Warehouse",
        location: "Test City",
        manager: "Warehouse Manager",
      });
    expect(res.statusCode).toEqual(201);
  });

  it("GET /warehouses - should list warehouses", async () => {
    const res = await request(app)
      .get("/api/warehouse")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("DELETE /warehouses/:id - should prevent delete with articles", async () => {
    const res = await request(app)
      .delete(`/api/warehouse/${testWarehouseId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe("Articles API", () => {
  it("POST /articles - should create new article", async () => {
    const wh = await request(app)
      .post("/api/warehouse")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Main Warehouse",
        location: "Test City",
        manager: "Warehouse Manager",
      });
    console.log(wh.body);
    testWarehouseId = wh.body.warehouse.warehouseId;

    const res = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        barcode: "123456789",
        description: "Test Article",
        manufacturer: "Test Co",
        name: "Test Product",
        price: 29.99,
        stock: 100,
        warehouseId: testWarehouseId,
      });
    expect(res.statusCode).toEqual(201);

    testArticleId = res.body.article.ArticuloId;
  });

  it("GET /articles - should get paginated articles", async () => {
    const res = await request(app)
      .get("/api/articles?page=1&perPage=10")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  it("PUT /articles/:id - should update article", async () => {
    const res = await request(app)
      .put(`/api/articles/${testArticleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ stock: 150 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.article.stock).toBe(150);
  });

  it("DELETE /articles/:id - should delete article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${testArticleId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe("Purchases API", () => {
  beforeAll(async () => {
    // Create test data
    const client = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "John Doe",
        phone: "555-1234",
        type: "vip",
      });

    const article = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        barcode: "1234567894",
        description: "Test Article",
        manufacturer: "Test Co",
        name: "Test Product",
        price: 29.99,
        stock: 100,
        warehouseId: testWarehouseId,
      });

    testClientId = client.body.ClienteId;
    testArticleId = article.body.article.ArticuloId;
  });

  it("POST /purchases - should create new purchase", async () => {
    const res = await request(app)
      .post("/api/purchases")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        ClienteId: testClientId,
        ArticuloId: testArticleId,
        units: 5,
      });
    expect(res.statusCode).toEqual(201);
    testPurchaseId = res.body.purchaseId;
  });

  it("GET /purchases - should get purchases", async () => {
    const res = await request(app)
      .get(`/api/clients`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  it("PUT /purchases/:id - should update purchase", async () => {
    const res = await request(app)
      .put(`/api/purchases/${testPurchaseId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ units: 10 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.units).toBe(10);
  });

  it("DELETE /purchases/:id - should delete purchase", async () => {
    const res = await request(app)
      .delete(`/api/purchases/${testPurchaseId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });
});
