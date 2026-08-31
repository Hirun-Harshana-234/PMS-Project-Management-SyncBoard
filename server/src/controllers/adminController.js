const mongoose = require("mongoose");
const User = require("../models/User");
const Board = require("../models/Board");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const AccessRequest = require("../models/AccessRequest");
const AppError = require("../utils/AppError");
const { mapUser, mapBoard } = require("../utils/presenters");
const { validateRegistration, requiredString } = require("../utils/validation");
const { emitToBoard, emitToUsers } = require("../services/realtimeService");
const { recordActivity } = require("../services/activityService");

const userFields = "displayName username email role jobTitle department progress active avatarColor avatarData lastSeenAt createdAt";

async function summary(_req, res) {
  const [users, activeUsers, boards, tasks, completed, ongoing, assigned, pendingRequests, recentActivity, progressRows] = await Promise.all([
    User.countDocuments(), User.countDocuments({ active: true }), Board.countDocuments({ archived: false }),
    Task.countDocuments(), Task.countDocuments({ status: "done" }), Task.countDocuments({ status: "doing" }), Task.countDocuments({ status: "todo" }), AccessRequest.countDocuments({ status: "pending" }), Activity.find().populate("actor", "displayName username avatarColor avatarData").sort({ createdAt: -1 }).limit(12).lean(),
    Task.aggregate([{ $group: { _id: "$status", averageProgress: { $avg: "$progress" }, count: { $sum: 1 } } }])
  ]);
  const byStatus = Object.fromEntries(progressRows.map((row) => [row._id, row]));
  const averageProgress = tasks ? Math.round(progressRows.reduce((sum, row) => sum + row.averageProgress * row.count, 0) / tasks) : 0;
  const analytics = [
    { key: "project", label: "Project average", value: averageProgress },
    { key: "assigned", label: "Assigned", value: Math.round(byStatus.todo?.averageProgress || 0) },
    { key: "ongoing", label: "Ongoing", value: Math.round(byStatus.doing?.averageProgress || 0) },
    { key: "completed", label: "Completed", value: completed ? 100 : 0 }
  ];
  res.json({ summary: { users, activeUsers, boards, tasks, completed, ongoing, assigned, pendingRequests, averageProgress, analytics }, recentActivity });
}

async function listUsers(_req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users: users.map(mapUser) });
}

async function createUser(req, res) {
  const input = validateRegistration(req.body);
  const exists = await User.findOne({ $or: [{ email: input.email }, { username: input.username }] });
  if (exists) throw new AppError(409, exists.email === input.email ? "Email is already registered." : "Username is already registered.");

  const boardId = String(req.body.boardId || "").trim();
  let board = null;
  if (boardId) {
    if (!mongoose.isValidObjectId(boardId)) throw new AppError(422, "Select a valid project board.");
    board = await Board.findOne({ _id: boardId, archived: false });
    if (!board) throw new AppError(404, "Project board not found.");
  }

  const user = new User({
    displayName: input.displayName,
    username: input.username,
    email: input.email,
    jobTitle: typeof req.body.jobTitle === "string" && req.body.jobTitle.trim() ? req.body.jobTitle.trim().slice(0, 80) : "Project Member",
    department: typeof req.body.department === "string" && req.body.department.trim() ? req.body.department.trim().slice(0, 80) : "Project Team",
    avatarColor: /^#[0-9a-fA-F]{6}$/.test(req.body.avatarColor || "") ? req.body.avatarColor : "#3d73ff"
  });
  await user.setPassword(input.password);
  await user.save();

  if (boardId) {
    const role = ["editor", "viewer"].includes(req.body.boardRole) ? req.body.boardRole : "editor";
    if (!board.members.some((member) => member.user.toString() === user._id.toString())) {
      board.members.push({ user: user._id, role });
      await board.save();
    }
    const populatedBoard = await Board.findById(board._id).populate("owner", userFields).populate("members.user", userFields);
    const outputBoard = mapBoard(populatedBoard);
    emitToBoard(board._id.toString(), "board:updated", { board: outputBoard });
    emitToUsers([user._id.toString()], "board:created", { board: outputBoard });
    await recordActivity({ board: board._id, actor: req.user._id, action: "member.added", targetType: "member", targetId: user._id, summary: `created ${user.displayName}'s member account and added them to the board` });
  }
  res.status(201).json({ user: mapUser(user), boardId: board?._id?.toString() || null });
}

async function updateUser(req, res) {
  const user = await User.findById(req.params.userId);
  if (!user) throw new AppError(404, "User not found.");
  if (user._id.toString() === req.user._id.toString() && req.body.active === false) throw new AppError(422, "You cannot deactivate your own account.");
  if (req.body.role !== undefined) {
    if (!["user", "admin"].includes(req.body.role)) throw new AppError(422, "Select a valid system role.");
    user.role = req.body.role;
  }
  if (req.body.active !== undefined) user.active = Boolean(req.body.active);
  if (req.body.password !== undefined) {
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new AppError(422, "Password must be at least 8 characters and contain a letter and number.");
    }
    await user.setPassword(password);
  }
  await user.save();
  res.json({ user: mapUser(user) });
}

async function listRequests(req, res) {
  return require("./requestController").listAll(req, res);
}

async function reviewRequest(req, res) {
  return require("./requestController").reviewRequest(req, res);
}

module.exports = { summary, listUsers, createUser, updateUser, listRequests, reviewRequest };
