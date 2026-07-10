const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(educationController.getAll).post(protect, educationController.createOne);
router
  .route('/:id')
  .get(educationController.getOne)
  .put(protect, educationController.updateOne)
  .delete(protect, educationController.deleteOne);

module.exports = router;
