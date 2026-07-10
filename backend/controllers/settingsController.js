const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');
const { removeFile, toRelativePath } = require('../utils/fileUtils');

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, data: settings });
});

// @desc    Update site settings (logo/favicon upload optional)
// @route   PUT /api/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const payload = { ...req.body };

  if (payload.seoKeywords && typeof payload.seoKeywords === 'string') {
    try {
      payload.seoKeywords = JSON.parse(payload.seoKeywords);
    } catch {
      payload.seoKeywords = payload.seoKeywords.split(',').map((k) => k.trim());
    }
  }

  if (req.files?.logo?.[0]) {
    payload.logo = toRelativePath(req.files.logo[0], 'settings');
    removeFile(settings.logo);
  }
  if (req.files?.favicon?.[0]) {
    payload.favicon = toRelativePath(req.files.favicon[0], 'settings');
    removeFile(settings.favicon);
  }

  const updated = await Settings.findByIdAndUpdate(settings._id, payload, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: updated });
});

module.exports = { getSettings, updateSettings };
