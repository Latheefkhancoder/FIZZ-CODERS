const request = require("supertest");
const app = require("../../src/app");

describe("Health Check Integration Tests", () => {
  it("GET /api/health - should return 200 and healthy status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("message");
    expect(response.body.data).toHaveProperty("status", "ok");
    expect(response.body.data).toHaveProperty("service", "FIZZ-CONNECT Backend API");
    expect(response.body.data).toHaveProperty("uptime");
    expect(response.body.data).toHaveProperty("timestamp");
  });

  it("GET /api/nonexistent - should return 404 for unknown routes", async () => {
    const response = await request(app).get("/api/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body.message).toContain("Route not found");
  });
});
