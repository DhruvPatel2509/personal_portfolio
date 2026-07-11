const asyncHandler = require("express-async-handler");
const Settings = require("../models/Settings");
const {
  removeFile,
  storeUploadedFile,
  generateCloudinaryPath,
} = require("../utils/fileUtils");

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

  if (payload.seoKeywords && typeof payload.seoKeywords === "string") {
    try {
      payload.seoKeywords = JSON.parse(payload.seoKeywords);
    } catch {
      payload.seoKeywords = payload.seoKeywords.split(",").map((k) => k.trim());
    }
  }

  if (req.files?.logo?.[0]) {
    const customPath = generateCloudinaryPath("about");
    payload.logo = await storeUploadedFile(
      req.files.logo[0],
      "settings",
      customPath,
    );
    if (settings.logo) {
      await removeFile(settings.logo);
    }
  }
  if (req.files.favicon) {
    const customPath = generateCloudinaryPath("about");
    payload.favicon = await storeUploadedFile(
      req.files.favicon[0],
      "settings",
      customPath,
    );
    if (settings.favicon) {
      await removeFile(settings.favicon);
    }
  }

  const updated = await Settings.findByIdAndUpdate(settings._id, payload, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: updated });
});

module.exports = { getSettings, updateSettings };
