const asyncHandler = require('express-async-handler');
const CodingProfile = require('../models/CodingProfile');

const getOrCreateProfile = async () => {
  let profile = await CodingProfile.findOne();
  if (!profile) profile = await CodingProfile.create({});
  return profile;
};

// @desc    Get coding profile links
// @route   GET /api/coding-profiles
// @access  Public
const getCodingProfiles = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  res.json({ success: true, data: profile });
});

// @desc    Update coding profile links
// @route   PUT /api/coding-profiles
// @access  Private
const updateCodingProfiles = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  const updated = await CodingProfile.findByIdAndUpdate(profile._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: updated });
});

module.exports = { getCodingProfiles, updateCodingProfiles };
