const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    organization: { type: String, required: true },
    issueDate: { type: Date, required: true },
    credentialId: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    skills: [{ type: String }],
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certification', certificationSchema);
