const asyncHandler = require('express-async-handler');
const Certification = require('../models/Certification');
const { removeFile, toRelativePath } = require('../utils/fileUtils');
const { fetchCourseraCertificateDetails } = require('../utils/courseraCertificate');
const { convertPdfFirstPageToPng } = require('../utils/pdfPreview');

const normalizeCertificationPayload = (body) => {
  const payload = { ...body };

  if (typeof payload.skills === 'string') {
    payload.skills = payload.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  } else if (Array.isArray(payload.skills)) {
    payload.skills = payload.skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  return payload;
};

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
const getCertifications = asyncHandler(async (req, res) => {
  const items = await Certification.find().sort({ order: 1, issueDate: -1 });
  res.json({ success: true, count: items.length, data: items });
});

// @desc    Get single certification
// @route   GET /api/certifications/:id
// @access  Public
const getCertification = asyncHandler(async (req, res) => {
  const item = await Certification.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Certification not found');
  }
  res.json({ success: true, data: item });
});

// @desc    Create certification (with optional image)
// @route   POST /api/certifications
// @access  Private
const createCertification = asyncHandler(async (req, res) => {
  const payload = normalizeCertificationPayload(req.body);
  if (req.file) {
    const previewFile = await convertPdfFirstPageToPng(req.file);
    payload.image = toRelativePath(previewFile, 'certificates');
  }

  const item = await Certification.create(payload);
  res.status(201).json({ success: true, data: item });
});

// @desc    Update certification (replaces image if a new one is uploaded)
// @route   PUT /api/certifications/:id
// @access  Private
const updateCertification = asyncHandler(async (req, res) => {
  const existing = await Certification.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error('Certification not found');
  }

  const payload = normalizeCertificationPayload(req.body);
  if (req.file) {
    const previewFile = await convertPdfFirstPageToPng(req.file);
    payload.image = toRelativePath(previewFile, 'certificates');
    removeFile(existing.image);
  }

  const item = await Certification.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: item });
});

// @desc    Delete certification and its image
// @route   DELETE /api/certifications/:id
// @access  Private
const deleteCertification = asyncHandler(async (req, res) => {
  const item = await Certification.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Certification not found');
  }
  removeFile(item.image);
  res.json({ success: true, message: 'Certification deleted successfully' });
});

// @desc    Fetch certificate details from a credential URL
// @route   POST /api/certifications/fetch-from-url
// @access  Private
const fetchCertificationFromUrl = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400);
    throw new Error('Credential URL is required');
  }

  const details = await fetchCourseraCertificateDetails(url);
  res.json({ success: true, data: details });
});

module.exports = {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
  fetchCertificationFromUrl,
};
