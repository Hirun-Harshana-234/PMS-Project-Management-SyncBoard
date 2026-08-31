const { BaseModel } = require("../storage/baseModel");
class AccessRequest extends BaseModel {
  static collectionName = "accessRequests";
  static defaults() { return { type: "access", status: "pending", response: "", reviewedBy: null, reviewedAt: null }; }
  constructor(values, hydrated) { super(values, hydrated); this.requester = String(this.requester); this.reviewedBy = this.reviewedBy ? String(this.reviewedBy) : null; }
  static async populate(request, path) { if ((path === "requester" || path === "reviewedBy") && request[path]) request[path] = await require("./User").findById(request[path]); }
}
module.exports = AccessRequest;
