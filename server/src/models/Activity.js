const { mongoose, uuid, timestamps, model } = require("./modelUtils");

const activitySchema = new mongoose.Schema({
  _id: { type: String, default: uuid }, board: { type: String, ref: "Board" }, actor: { type: String, ref: "User" },
  action: String, targetType: String, targetId: String, summary: String, metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, timestamps);

module.exports = model("Activity", activitySchema, "activities");