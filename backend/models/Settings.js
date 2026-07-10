const mongoose = require('mongoose');

// Singleton-style collection for site-wide configuration.
const settingsSchema = new mongoose.Schema(
  {
    websiteTitle: { type: String, default: 'Dhruv Patel | Full Stack Developer' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    seoKeywords: { type: [String], default: [] },
    themeColor: { type: String, default: '#3B82F6' },
    footerText: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
