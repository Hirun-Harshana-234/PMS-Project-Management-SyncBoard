const { BaseModel } = require("../storage/baseModel");
class Activity extends BaseModel {
  static collectionName = "activities";
  static defaults() { return { metadata: {} }; }
  constructor(values, hydrated) { super(values, hydrated); this.board = String(this.board); this.actor = String(this.actor); this.targetId = String(this.targetId); }
  static async populate(activity, path) { if (path === "actor") activity.actor = await require("./User").findById(activity.actor); }
}
module.exports = Activity;
