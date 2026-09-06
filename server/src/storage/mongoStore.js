const mongoose = require("mongoose");
const env = require("../config/env");

async function initStore() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(env.mongoUri, { dbName: env.mongoDatabase || undefined, serverSelectionTimeoutMS: 10000 });
  return mongoose.connection;
}

async function closeStore() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}

async function resetStore() {
  await Promise.all(Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({})));
}

module.exports = { initStore, closeStore, resetStore };