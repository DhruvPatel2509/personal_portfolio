const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Programming', 'Frontend', 'Backend', 'Database', 'Tools', 'Currently Learning'],
    },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    showProgress: { type: Boolean, default: false },
    progress: { type: Number, required: true, min: 0, max: 100, default: 50 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
