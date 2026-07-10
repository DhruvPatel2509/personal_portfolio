const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');
const Message = require('../models/Message');

// @desc    Get aggregate dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalProjects, totalSkills, totalCertificates, unreadMessages, recentMessages] =
    await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Certification.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Message.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    success: true,
    data: {
      totalProjects,
      totalSkills,
      totalCertificates,
      unreadMessages,
      recentMessages,
    },
  });
});

module.exports = { getDashboardStats };
