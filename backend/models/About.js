const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: 'Dhruv Patel' },
    title: { type: String, required: true, default: 'Full Stack Developer | MCA Student' },
    bio: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    location: { type: String, default: '' },
    resume: { type: String, default: '' },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    typingRoles: {
      type: [String],
      default: [
        'MERN Developer',
        'Full Stack Developer',
        'React Developer',
        'Currently Learning AI & Machine Learning',
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('About', aboutSchema);
