const http = require("http");
const env = require("./config/env");
const { initStore, closeStore } = require("./storage/mongoStore");
const { createApp } = require("./app");
const { attachSocketServer } = require("./services/socketServer");
const { ensureDemoWorkspace } = require("./seed");

async function start() {
  if (!env.mongoUri) throw new Error("MONGO_URI is required. Add your MongoDB connection string to .env.");
  await initStore();
  await ensureDemoWorkspace();
  const app = createApp();
  const server = http.createServer(app);
  attachSocketServer(server);

  server.once("error", async (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${env.port} is already in use. Stop the existing PMS API or set PORT to an available port in .env.`);
    } else {
      console.error("Unable to start HTTP server:", error);
    }
    await closeStore();
    process.exit(1);
  });
  server.listen(env.port, () => console.log(`PMS is running on port ${env.port}`));

  async function shutdown(signal) {
    console.log(`${signal} received. Shutting down safely.`);
    server.close(async () => {
      await closeStore();
      process.exit(0);
    });
  }
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((error) => {
  console.error("Unable to start PMS:", error);
  process.exit(1);
});
