const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessage,
  toggleReadStatus,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(createMessage).get(protect, getMessages);
router.route('/:id').get(protect, getMessage).delete(protect, deleteMessage);
router.patch('/:id/read', protect, toggleReadStatus);

module.exports = router;
