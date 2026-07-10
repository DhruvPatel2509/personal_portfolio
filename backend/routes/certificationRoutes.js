const express = require('express');
const router = express.Router();
const {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
  fetchCertificationFromUrl,
} = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImagesOrPdf } = require('../middleware/uploadMiddleware');

const certImage = uploadImagesOrPdf('certificates').single('image');

router.post('/fetch-from-url', protect, fetchCertificationFromUrl);
router.route('/').get(getCertifications).post(protect, certImage, createCertification);
router
  .route('/:id')
  .get(getCertification)
  .put(protect, certImage, updateCertification)
  .delete(protect, deleteCertification);

module.exports = router;
