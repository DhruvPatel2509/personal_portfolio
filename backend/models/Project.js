const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    techStack: { type: [String], required: true, default: [] },
    images: { type: [String], default: [] },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    features: { type: [String], default: [] },
    challenges: { type: String, default: '' },
    learnings: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate a unique, URL-safe slug whenever the title changes.
projectSchema.pre('save', function setSlug(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
