const { isValidId } = require("../utils/ids");
const Message = require("../models/Message");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const { requiredString } = require("../utils/validation");
const { mapMessage } = require("../utils/presenters");
const { emitToUsers } = require("../services/realtimeService");

const userFields = "displayName username email role jobTitle department progress active avatarColor avatarData lastSeenAt createdAt";

function boardMemberIds(board) {
  return board.members.map((member) => member.user.toString());
}

async function listMessages(req, res) {
  const currentUserId = req.user._id.toString();
  const withUser = String(req.query.with || "").trim();
  const query = {
    board: req.board._id,
    $or: [{ sender: req.user._id }, { recipient: req.user._id }]
  };
  if (withUser) {
    if (!isValidId(withUser) || !boardMemberIds(req.board).includes(withUser)) {
      throw new AppError(422, "Select a member of this project.");
    }
    query.$or = [
      { sender: req.user._id, recipient: withUser },
      { sender: withUser, recipient: req.user._id }
    ];
  }
  const messages = await Message.find(query)
    .populate("sender", userFields)
    .populate("recipient", userFields)
    .sort({ createdAt: -1 })
    .limit(150);
  res.json({ messages: messages.reverse().map(mapMessage), currentUserId });
}

async function createMessage(req, res) {
  const recipientId = String(req.body.recipientId || "").trim();
  if (!isValidId(recipientId) || !boardMemberIds(req.board).includes(recipientId)) {
    throw new AppError(422, "Select a member of this project.");
  }
  if (recipientId === req.user._id.toString()) throw new AppError(422, "Choose another member to contact.");
  const recipient = await User.findOne({ _id: recipientId, active: true });
  if (!recipient) throw new AppError(404, "That member is no longer available.");
  const body = requiredString(req.body.body, "Message", 2000);
  const kind = req.body.kind === "help" ? "help" : "message";
  const message = await Message.create({ board: req.board._id, sender: req.user._id, recipient: recipient._id, body, kind });
  const populated = await Message.findById(message._id).populate("sender", userFields).populate("recipient", userFields);
  const output = mapMessage(populated);
  emitToUsers([req.user._id.toString(), recipient._id.toString()], "message:created", { message: output, boardId: req.board._id.toString() });
  res.status(201).json({ message: output });
}

async function markRead(req, res) {
  const message = await Message.findOneAndUpdate(
    { _id: req.params.messageId, board: req.board._id, recipient: req.user._id },
    { $set: { readAt: new Date() } },
    { new: true }
  ).populate("sender", userFields).populate("recipient", userFields);
  if (!message) throw new AppError(404, "Message not found.");
  const output = mapMessage(message);
  emitToUsers([req.user._id.toString()], "message:read", { message: output, boardId: req.board._id.toString() });
  res.json({ message: output });
}

module.exports = { listMessages, createMessage, markRead };
