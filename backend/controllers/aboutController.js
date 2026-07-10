const asyncHandler = require('express-async-handler');
const About = require('../models/About');
const { removeFile, toRelativePath } = require('../utils/fileUtils');

/**
 * About is a singleton collection — there should only ever be one document.
 * This helper fetches it, creating a default one on first access.
 */
const getOrCreateAbout = async () => {
  let about = await About.findOne();
  if (!about) about = await About.create({});
  return about;
};

// @desc    Get about info
// @route   GET /api/about
// @access  Public
const getAbout = asyncHandler(async (req, res) => {
  const about = await getOrCreateAbout();
  res.json({ success: true, data: about });
});

// @desc    Update about info (profilePhoto upload optional)
// @route   PUT /api/about
// @access  Private
const updateAbout = asyncHandler(async (req, res) => {
  const about = await getOrCreateAbout();

  const payload = { ...req.body };

  // socialLinks may arrive as a JSON string from multipart/form-data
  if (payload.socialLinks && typeof payload.socialLinks === 'string') {
    try {
      payload.socialLinks = JSON.parse(payload.socialLinks);
    } catch {
      delete payload.socialLinks;
    }
  }
  if (payload.typingRoles && typeof payload.typingRoles === 'string') {
    try {
      payload.typingRoles = JSON.parse(payload.typingRoles);
    } catch {
      delete payload.typingRoles;
    }
  }

  if (req.file) {
    payload.profilePhoto = toRelativePath(req.file, 'about');
    removeFile(about.profilePhoto);
  }

  const updated = await About.findByIdAndUpdate(about._id, payload, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: updated });
});

// @desc    Upload/replace resume PDF
// @route   PUT /api/about/resume
// @access  Private
const uploadResumeFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a PDF file');
  }

  const about = await getOrCreateAbout();
  removeFile(about.resume);

  about.resume = toRelativePath(req.file, 'resume');
  await about.save();

  res.json({ success: true, data: about });
});

module.exports = { getAbout, updateAbout, uploadResumeFile };
