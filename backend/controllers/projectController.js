const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const { removeFile, toRelativePath } = require('../utils/fileUtils');

// @desc    Get all projects (supports ?tech=, ?search=, ?featured=, ?page=, ?limit=)
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const { tech, search, featured, page = 1, limit = 12 } = req.query;

  const filter = {};
  if (tech) filter.techStack = { $regex: new RegExp(`^${tech}$`, 'i') };
  if (featured === 'true') filter.featured = true;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { techStack: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 12, 1);
  const skip = (pageNum - 1) * limitNum;

  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limitNum),
    Project.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: projects.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: projects,
  });
});

// @desc    Get single project by id or slug
// @route   GET /api/projects/:id
// @access  Public
const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const project = isObjectId ? await Project.findById(id) : await Project.findOne({ slug: id });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json({ success: true, data: project });
});

// Helper to normalize array-like fields that may arrive as JSON strings
// (common with multipart/form-data since it can't send native arrays).
const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value.split(',').map((v) => v.trim()).filter(Boolean);
    }
  }
  return [];
};

// @desc    Create project (multiple images)
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.techStack) payload.techStack = parseArrayField(payload.techStack);
  if (payload.features) payload.features = parseArrayField(payload.features);

  if (req.files && req.files.length > 0) {
    payload.images = req.files.map((file) => toRelativePath(file, 'projects'));
  }

  const project = await Project.create(payload);
  res.status(201).json({ success: true, data: project });
});

// @desc    Update project (new images are appended unless replaceImages=true)
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const existing = await Project.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error('Project not found');
  }

  const payload = { ...req.body };
  if (payload.techStack) payload.techStack = parseArrayField(payload.techStack);
  if (payload.features) payload.features = parseArrayField(payload.features);

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => toRelativePath(file, 'projects'));
    if (req.body.replaceImages === 'true') {
      existing.images.forEach(removeFile);
      payload.images = newImages;
    } else {
      payload.images = [...existing.images, ...newImages];
    }
  }

  const project = await Project.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: project });
});

// @desc    Delete project and its images
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  (project.images || []).forEach(removeFile);
  res.json({ success: true, message: 'Project deleted successfully' });
});

// @desc    Remove a single image from a project
// @route   DELETE /api/projects/:id/images
// @access  Private
const deleteProjectImage = asyncHandler(async (req, res) => {
  const { imagePath } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  project.images = project.images.filter((img) => img !== imagePath);
  await project.save();
  removeFile(imagePath);
  res.json({ success: true, data: project });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
};
