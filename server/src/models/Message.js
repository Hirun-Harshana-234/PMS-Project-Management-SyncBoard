const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  kind: { type: String, enum: ["message", "help"], default: "message" },
  readAt: { type: Date, default: null }
}, { timestamps: true });

messageSchema.index({ board: 1, sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, readAt: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
