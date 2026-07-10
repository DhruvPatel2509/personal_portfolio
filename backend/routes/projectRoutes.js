const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImages } = require('../middleware/uploadMiddleware');

const projectImages = uploadImages('projects').array('images', 10);

router.route('/').get(getProjects).post(protect, projectImages, createProject);
router
  .route('/:id')
  .get(getProject)
  .put(protect, projectImages, updateProject)
  .delete(protect, deleteProject);
router.delete('/:id/images', protect, deleteProjectImage);

module.exports = router;
