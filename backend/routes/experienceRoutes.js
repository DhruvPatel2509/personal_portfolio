const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(experienceController.getAll).post(protect, experienceController.createOne);
router
  .route('/:id')
  .get(experienceController.getOne)
  .put(protect, experienceController.updateOne)
  .delete(protect, experienceController.deleteOne);

module.exports = router;
