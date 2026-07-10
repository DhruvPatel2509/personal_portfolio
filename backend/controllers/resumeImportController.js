const asyncHandler = require('express-async-handler');
const About = require('../models/About');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const { extractResumeText, parseResumeText } = require('../utils/resumeParser');
const { removeFile } = require('../utils/fileUtils');

const cleanObject = (value = {}) =>
  Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null && entryValue !== ''));

const text = (value) => (typeof value === 'string' ? value.trim() : '');

const getOrCreateAbout = async () => {
  let about = await About.findOne();
  if (!about) about = await About.create({});
  return about;
};

const parseResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a TXT resume file');
  }

  try {
    const text = await extractResumeText(req.file.path);
    const parsed = parseResumeText(text);
    res.json({ success: true, data: parsed });
  } finally {
    removeFile(`/uploads/resume-imports/${req.file.filename}`);
  }
});

const applyResumeImport = asyncHandler(async (req, res) => {
  const { about = {}, education = [], experience = [], projects = [], skills = [] } = req.body;
  const currentAbout = await getOrCreateAbout();
  const fallbackName = currentAbout.name || 'Portfolio Owner';
  const fallbackTitle = currentAbout.title || 'Portfolio Profile';
  const fallbackBio = currentAbout.bio || about.title || about.name || 'Portfolio profile details imported from resume.';

  const aboutPayload = {
    name: about.name?.trim() || fallbackName,
    title: about.title?.trim() || fallbackTitle,
    bio: about.bio?.trim() || fallbackBio,
    phone: about.phone?.trim() || currentAbout.phone || '',
    email: about.email?.trim() || currentAbout.email || '',
    location: about.location?.trim() || currentAbout.location || '',
    socialLinks: { ...currentAbout.socialLinks?.toObject?.(), ...cleanObject(about.socialLinks || {}) },
    typingRoles: Array.isArray(about.typingRoles) ? about.typingRoles.filter(Boolean) : undefined,
  };

  const updatedAbout = await About.findByIdAndUpdate(currentAbout._id, aboutPayload, {
    new: true,
    runValidators: true,
  });

  const createdEducation = await Education.insertMany(
    education
      .filter((item) => text(item.degree) && text(item.college) && text(item.duration))
      .map((item, index) => ({
        degree: text(item.degree),
        college: text(item.college),
        university: text(item.university),
        duration: text(item.duration),
        grade: text(item.grade),
        order: Number(item.order ?? index),
      }))
  );

  const createdExperience = await Experience.insertMany(
    experience
      .filter((item) => text(item.company) && text(item.role) && text(item.duration))
      .map((item, index) => ({
        company: text(item.company),
        role: text(item.role),
        duration: text(item.duration),
        description: text(item.description),
        order: Number(item.order ?? index),
      }))
  );

  const createdSkills = await Skill.insertMany(
    skills
      .filter((item) => text(item.name) && text(item.category))
      .map((item, index) => ({
        category: text(item.category),
        name: text(item.name),
        icon: text(item.icon),
        progress: Number(item.progress ?? 70),
        order: Number(item.order ?? index),
      }))
  );

  const createdProjects = await Project.insertMany(
    projects
      .filter(
        (item) =>
          text(item.title) &&
          text(item.description) &&
          Array.isArray(item.techStack) &&
          item.techStack.some((tech) => text(tech))
      )
      .map((item, index) => ({
        title: text(item.title),
        description: text(item.description),
        techStack: item.techStack.map(text).filter(Boolean),
        images: [],
        githubUrl: text(item.githubUrl),
        liveUrl: text(item.liveUrl),
        features: Array.isArray(item.features) ? item.features.map(text).filter(Boolean) : [],
        challenges: text(item.challenges),
        learnings: text(item.learnings),
        featured: Boolean(item.featured),
        displayOrder: Number(item.displayOrder ?? index),
      }))
  );

  res.status(201).json({
    success: true,
    data: {
      about: updatedAbout,
      education: createdEducation,
      experience: createdExperience,
      projects: createdProjects,
      skills: createdSkills,
    },
  });
});

module.exports = { parseResume, applyResumeImport };
