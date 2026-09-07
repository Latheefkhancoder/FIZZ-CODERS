const { healthService } = require("../../src/services");

describe("Health Service Unit Tests", () => {
  it("should return valid health status object", () => {
    const health = healthService.getHealthStatus();

    expect(health).toHaveProperty("status", "ok");
    expect(health).toHaveProperty("service", "FIZZ-CONNECT Backend API");
    expect(typeof health.uptime).toBe("number");
    expect(typeof health.timestamp).toBe("string");
  });
});
