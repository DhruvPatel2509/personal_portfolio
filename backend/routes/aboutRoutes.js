const express = require('express');
const router = express.Router();
const { getAbout, updateAbout, uploadResumeFile } = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImages, uploadResume } = require('../middleware/uploadMiddleware');

router.get('/', getAbout);
router.put('/', protect, uploadImages('about').single('profilePhoto'), updateAbout);
router.put('/resume', protect, uploadResume().single('resume'), uploadResumeFile);

module.exports = router;
