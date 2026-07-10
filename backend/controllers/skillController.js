const asyncHandler = require('express-async-handler');
const Skill = require('../models/Skill');

// @desc    Get all skills (optionally filtered by category)
// @route   GET /api/skills
// @access  Public
const getSkills = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  const skills = await Skill.find(filter).sort({ category: 1, order: 1 });
  res.json({ success: true, count: skills.length, data: skills });
});

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
const getSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }
  res.json({ success: true, data: skill });
});

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, data: skill });
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }
  res.json({ success: true, data: skill });
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }
  res.json({ success: true, message: 'Skill deleted successfully' });
});

module.exports = { getSkills, getSkill, createSkill, updateSkill, deleteSkill };
