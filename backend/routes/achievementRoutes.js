const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImages } = require('../middleware/uploadMiddleware');

const achievementImage = uploadImages('achievements').single('image');

router.route('/').get(getAchievements).post(protect, achievementImage, createAchievement);
router
  .route('/:id')
  .get(getAchievement)
  .put(protect, achievementImage, updateAchievement)
  .delete(protect, deleteAchievement);

module.exports = router;
