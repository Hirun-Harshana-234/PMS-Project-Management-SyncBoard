const { BaseModel } = require("../storage/baseModel");
class Message extends BaseModel {
  static collectionName = "messages";
  static defaults() { return { kind: "message", readAt: null }; }
  constructor(values, hydrated) { super(values, hydrated); this.board = String(this.board); this.sender = String(this.sender); this.recipient = String(this.recipient); }
  static async populate(message, path) { if ((path === "sender" || path === "recipient") && message[path]) message[path] = await require("./User").findById(message[path]); }
}
module.exports = Message;
