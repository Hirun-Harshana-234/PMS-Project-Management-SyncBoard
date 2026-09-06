const bcrypt = require("bcryptjs");
const { mongoose, uuid, timestamps, model } = require("./modelUtils");

const refreshTokenSchema = new mongoose.Schema({ tokenHash: String, expiresAt: Date }, { _id: false });
const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuid }, displayName: String,
  username: { type: String, lowercase: true }, email: { type: String, lowercase: true },
  passwordHash: { type: String, select: false }, role: { type: String, default: "user" },
  jobTitle: { type: String, default: "Project Member" }, department: { type: String, default: "Project Team" },
  progress: { type: Number, default: 0 }, active: { type: Boolean, default: true },
  avatarColor: { type: String, default: "#3d73ff" }, avatarData: { type: String, default: "" },
  refreshTokens: { type: [refreshTokenSchema], default: [] }, lastSeenAt: { type: Date, default: Date.now }
}, timestamps);

userSchema.methods.setPassword = async function setPassword(password) { this.passwordHash = await bcrypt.hash(password, 12); };
userSchema.methods.comparePassword = function comparePassword(password) { return bcrypt.compare(password, this.passwordHash || ""); };
userSchema.methods.toPublicJSON = function toPublicJSON() { const value = this.toObject(); delete value.passwordHash; delete value.refreshTokens; return value; };

module.exports = model("User", userSchema, "users");