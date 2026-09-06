const crypto = require("crypto");
const mongoose = require("mongoose");

const uuid = () => crypto.randomUUID();
const timestamps = { timestamps: true, versionKey: false, strict: false };
const model = (name, schema, collection) => mongoose.models[name] || mongoose.model(name, schema, collection);

module.exports = { mongoose, uuid, timestamps, model };