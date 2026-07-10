const mongoose = require('mongoose');

// Singleton-style collection holding links to external coding profiles.
const codingProfileSchema = new mongoose.Schema(
  {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: 'https://leetcode.com/u/Dhruv_Patel25/' },
    hackerrank: { type: String, default: 'https://www.hackerrank.com/profile/www_dhruvpatelp1' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodingProfile', codingProfileSchema);
