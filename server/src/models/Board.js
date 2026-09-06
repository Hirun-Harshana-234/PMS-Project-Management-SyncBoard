const { mongoose, uuid, timestamps, model } = require("./modelUtils");

const memberSchema = new mongoose.Schema({ user: { type: String, ref: "User" }, role: String, joinedAt: { type: Date, default: Date.now } }, { _id: false });
const boardSchema = new mongoose.Schema({
  _id: { type: String, default: uuid }, title: String, description: { type: String, default: "" },
  color: { type: String, default: "#3d73ff" }, owner: { type: String, ref: "User" },
  members: { type: [memberSchema], default: [] }, archived: { type: Boolean, default: false }
}, timestamps);

module.exports = model("Board", boardSchema, "boards");