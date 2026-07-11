const asyncHandler = require("express-async-handler");
const Achievement = require("../models/Achievement");
const {
  removeFile,
  storeUploadedFile,
  generateCloudinaryPath,
} = require("../utils/fileUtils");

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = asyncHandler(async (req, res) => {
  const items = await Achievement.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
const getAchievement = asyncHandler(async (req, res) => {
  const item = await Achievement.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Achievement not found");
  }
  res.json({ success: true, data: item });
});

// @desc    Create achievement (with optional image)
// @route   POST /api/achievements
// @access  Private
const createAchievement = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    const customPath = generateCloudinaryPath("achievement");
    payload.image = await storeUploadedFile(
      req.file,
      "achievements",
      customPath,
    );
  }

  const item = await Achievement.create(payload);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update achievement (replaces image if a new one is uploaded)
// @route   PUT /api/achievements/:id
// @access  Private
const updateAchievement = asyncHandler(async (req, res) => {
  const existing = await Achievement.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error("Achievement not found");
  }

  const payload = { ...req.body };
  if (req.file) {
    const customPath = generateCloudinaryPath("achievement");
    payload.image = await storeUploadedFile(
      req.file,
      "achievements",
      customPath,
    );
    if (existing.image) {
      await removeFile(existing.image);
    }
  }

  const item = await Achievement.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: item });
});

// @desc    Delete achievement and its image
// @route   DELETE /api/achievements/:id
// @access  Private
const deleteAchievement = asyncHandler(async (req, res) => {
  const item = await Achievement.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Achievement not found");
  }
  await removeFile(item.image);
  res.json({ success: true, message: "Achievement deleted successfully" });
});

module.exports = {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
