const { BaseModel } = require("../storage/baseModel");
class Task extends BaseModel {
  static collectionName = "tasks";
  static defaults() { return { description: "", status: "todo", priority: "medium", category: "General", progress: 0, assignee: null, dueDate: null, tags: [], position: Date.now(), revision: 0, comments: [] }; }
  constructor(values, hydrated) { super(values, hydrated); this.board = String(this.board); this.createdBy = String(this.createdBy); this.assignee = this.assignee ? String(this.assignee) : null; }
  static async populate(task, path) { const User = require("./User"); if (path === "assignee" && task.assignee) task.assignee = await User.findById(task.assignee); if (path === "createdBy") task.createdBy = await User.findById(task.createdBy); if (path === "comments.author") for (const comment of task.comments) comment.author = await User.findById(comment.author); }
}
module.exports = Task;
