const { mongoose, uuid, timestamps, model } = require("./modelUtils");

const commentSchema = new mongoose.Schema({
  _id: { type: String, default: uuid }, author: { type: String, ref: "User" }, message: String, createdAt: { type: Date, default: Date.now }
}, { _id: false });
const taskSchema = new mongoose.Schema({
  _id: { type: String, default: uuid }, board: { type: String, ref: "Board" }, title: String,
  description: { type: String, default: "" }, status: { type: String, default: "todo" }, priority: { type: String, default: "medium" },
  category: { type: String, default: "General" }, progress: { type: Number, default: 0 }, assignee: { type: String, ref: "User", default: null },
  createdBy: { type: String, ref: "User" }, dueDate: { type: Date, default: null }, tags: { type: [String], default: [] },
  position: { type: Number, default: Date.now }, revision: { type: Number, default: 0 }, comments: { type: [commentSchema], default: [] }
}, timestamps);

module.exports = model("Task", taskSchema, "tasks");