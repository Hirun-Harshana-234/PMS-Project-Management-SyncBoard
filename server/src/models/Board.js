const { BaseModel } = require("../storage/baseModel");
class Board extends BaseModel {
  static collectionName = "boards";
  static defaults() { return { description: "", color: "#3d73ff", members: [], archived: false }; }
  constructor(values, hydrated) { super(values, hydrated); this.owner = String(this.owner); this.members = (this.members || []).map((member) => ({ joinedAt: new Date().toISOString(), role: "editor", ...member, user: String(member.user) })); }
  static async populate(board, path) { const User = require("./User"); if (path === "owner") board.owner = await User.findById(board.owner); if (path === "members.user") for (const member of board.members) member.user = await User.findById(member.user); }
}
module.exports = Board;
