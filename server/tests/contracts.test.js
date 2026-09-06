const request = require("supertest");
const { createApp } = require("../src/app");

const app = createApp();

describe("public API contracts", () => {
  test("reports a healthy API without exposing implementation details", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true, service: "pms-api", name: "PMS - Project Management SyncBoard" });
  });

  test("allows development clients served from another local origin", async () => {
    const response = await request(app).get("/api/health").set("Origin", "http://127.0.0.1:5173");
    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("http://127.0.0.1:5173");
  });

  test("rejects a protected board request before database access", async () => {
    const response = await request(app).get("/api/boards");
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/authentication required/i);
  });

  test("validates registration input at the HTTP boundary", async () => {
    const response = await request(app).post("/api/auth/register").send({
      displayName: "A",
      username: "bad username",
      email: "not-an-email",
      password: "short"
    });
    expect(response.status).toBe(422);
    expect(response.body.message).toMatch(/username/i);
  });

  test("returns a consistent JSON 404 response for unknown API routes", async () => {
    const response = await request(app).get("/api/does-not-exist");
    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
  });
});
