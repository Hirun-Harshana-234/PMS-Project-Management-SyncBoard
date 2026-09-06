const { mongoose, uuid, timestamps, model } = require("./modelUtils");

const requestSchema = new mongoose.Schema({
  _id: { type: String, default: uuid }, requester: { type: String, ref: "User" }, type: { type: String, default: "access" },
  status: { type: String, default: "pending" }, response: { type: String, default: "" }, reviewedBy: { type: String, ref: "User", default: null }, reviewedAt: { type: Date, default: null }
}, timestamps);

module.exports = model("AccessRequest", requestSchema, "accessRequests");