const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadResumeImport } = require('../middleware/uploadMiddleware');
const { parseResume, applyResumeImport } = require('../controllers/resumeImportController');

router.post('/parse', protect, uploadResumeImport().single('resume'), parseResume);
router.post('/apply', protect, applyResumeImport);

module.exports = router;
