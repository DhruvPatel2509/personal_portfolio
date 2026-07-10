const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImages } = require('../middleware/uploadMiddleware');

const settingsImages = uploadImages('settings').fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
]);

router.route('/').get(getSettings).put(protect, settingsImages, updateSettings);

module.exports = router;
