const express = require('express');
const router = express.Router();
const {
  getCodingProfiles,
  updateCodingProfiles,
} = require('../controllers/codingProfileController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getCodingProfiles).put(protect, updateCodingProfiles);

module.exports = router;
