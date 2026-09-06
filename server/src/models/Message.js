const { mongoose, uuid, timestamps, model } = require("./modelUtils");

const messageSchema = new mongoose.Schema({
  _id: { type: String, default: uuid }, board: { type: String, ref: "Board" }, sender: { type: String, ref: "User" },
  recipient: { type: String, ref: "User" }, body: String, kind: { type: String, default: "message" }, readAt: { type: Date, default: null }
}, timestamps);

module.exports = model("Message", messageSchema, "messages");