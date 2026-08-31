const bcrypt = require("bcryptjs");
const { BaseModel } = require("../storage/baseModel");
class User extends BaseModel {
  static collectionName = "users";
  static defaults() { return { role: "user", jobTitle: "Project Member", department: "Project Team", progress: 0, active: true, avatarColor: "#3d73ff", avatarData: "", refreshTokens: [], lastSeenAt: new Date().toISOString() }; }
  constructor(values, hydrated) { super(values, hydrated); if (this.username) this.username = this.username.toLowerCase(); if (this.email) this.email = this.email.toLowerCase(); }
  async setPassword(password) { this.passwordHash = await bcrypt.hash(password, 12); }
  comparePassword(password) { return bcrypt.compare(password, this.passwordHash || ""); }
  toPublicJSON() { const { passwordHash, refreshTokens, ...user } = this.toObject(); return user; }
}
module.exports = User;
