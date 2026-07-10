const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');

// @desc    Submit contact form message
// @route   POST /api/messages
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('All fields (name, email, subject, message) are required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  const newMessage = await Message.create({ name, email, subject, message });
  res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully!',
    data: newMessage,
  });
});

// @desc    Get all messages (supports ?search= & ?isRead=)
// @route   GET /api/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { search, isRead } = req.query;
  const filter = {};
  if (isRead !== undefined) filter.isRead = isRead === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
  }

  const messages = await Message.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, data: messages });
});

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private
const getMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) {
    res.status(404);
    throw new Error('Message not found');
  }
  res.json({ success: true, data: msg });
});

// @desc    Mark a message as read/unread
// @route   PATCH /api/messages/:id/read
// @access  Private
const toggleReadStatus = asyncHandler(async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) {
    res.status(404);
    throw new Error('Message not found');
  }
  msg.isRead = req.body.isRead !== undefined ? req.body.isRead : !msg.isRead;
  await msg.save();
  res.json({ success: true, data: msg });
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) {
    res.status(404);
    throw new Error('Message not found');
  }
  res.json({ success: true, message: 'Message deleted successfully' });
});

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  toggleReadStatus,
  deleteMessage,
};
