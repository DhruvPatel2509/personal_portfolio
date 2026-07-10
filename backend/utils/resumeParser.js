const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const SKILL_CATEGORIES = {
  Programming: ['javascript', 'typescript', 'java', 'python', 'c', 'c++', 'php', 'ruby', 'go'],
  Frontend: ['html', 'css', 'react', 'redux', 'next.js', 'tailwind', 'bootstrap', 'vite'],
  Backend: ['node.js', 'express', 'nestjs', 'django', 'laravel', 'spring boot', 'rest api', 'jwt'],
  Database: ['mongodb', 'mysql', 'postgresql', 'firebase', 'redis', 'sqlite'],
  Tools: ['git', 'github', 'docker', 'postman', 'figma', 'vercel', 'render', 'aws', 'canva', 'oop'],
  'Currently Learning': ['machine learning', 'ai', 'tensorflow', 'pytorch'],
};

const SKILL_LABELS = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java: 'Java',
  python: 'Python',
  c: 'C',
  'c++': 'C++',
  php: 'PHP',
  ruby: 'Ruby',
  go: 'Go',
  html: 'HTML',
  css: 'CSS',
  react: 'React.js',
  redux: 'Redux',
  'next.js': 'Next.js',
  tailwind: 'Tailwind CSS',
  bootstrap: 'Bootstrap',
  vite: 'Vite',
  'node.js': 'Node.js',
  express: 'Express.js',
  nestjs: 'NestJS',
  django: 'Django',
  laravel: 'Laravel',
  'spring boot': 'Spring Boot',
  'rest api': 'REST API',
  jwt: 'JWT',
  mongodb: 'MongoDB',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  firebase: 'Firebase',
  redis: 'Redis',
  sqlite: 'SQLite',
  git: 'Git',
  github: 'GitHub',
  docker: 'Docker',
  postman: 'Postman',
  figma: 'Figma',
  vercel: 'Vercel',
  render: 'Render',
  aws: 'AWS',
  canva: 'Canva',
  oop: 'OOP',
  'machine learning': 'Machine Learning',
  ai: 'AI',
  tensorflow: 'TensorFlow',
  pytorch: 'PyTorch',
};

const SECTION_ALIASES = {
  summary: ['summary', 'profile', 'objective', 'about me', 'professional summary'],
  skills: ['skills', 'technical skills', 'technologies', 'tech stack'],
  education: ['education', 'academic background', 'academics'],
  experience: ['experience', 'work experience', 'employment', 'internship', 'internships'],
  projects: ['projects', 'project work'],
};

const normalizeText = (text) =>
  text
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const cleanLine = (line) => line.replace(/^[\s\-–*•]+/, '').trim();

const isPageMarker = (line) => /^--\s*\d+\s+of\s+\d+\s*--$/i.test(line.trim());

const isHeading = (line) => {
  const value = line.trim().replace(/:$/, '').toLowerCase();
  return Object.values(SECTION_ALIASES).some((aliases) => aliases.includes(value));
};

const getSectionKey = (line) => {
  const value = line.trim().replace(/:$/, '').toLowerCase();
  return Object.entries(SECTION_ALIASES).find(([, aliases]) => aliases.includes(value))?.[0] || null;
};

const splitSections = (text) => {
  const sections = { header: [] };
  let current = 'header';

  text.split('\n').forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      if (sections[current]?.length) sections[current].push('');
      return;
    }

    const key = getSectionKey(line);
    if (key) {
      current = key;
      sections[current] = sections[current] || [];
      return;
    }

    sections[current] = sections[current] || [];
    sections[current].push(rawLine);
  });

  return sections;
};

const findEmail = (text) => text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';

const findPhone = (text) =>
  text.match(/(?:\+\d{1,3}[\s-]?)?\d{5}[\s-]?\d{5}/)?.[0] ||
  text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3,5}\)?[\s-]?)?\d{3,5}[\s-]?\d{4}/)?.[0] ||
  '';

const findUrl = (text, domain) =>
  text.match(new RegExp(`https?:\\/\\/[^\\s]*${domain}[^\\s]*|(?:www\\.)?[^\\s]*${domain}[^\\s]*`, 'i'))?.[0] || '';

const findUrls = (text) => [...new Set([...text.matchAll(/https?:\/\/[^\s)<>]+/gi)].map((match) => match[0]))];

const findLocation = (sections) => {
  const contactLine = (sections.header || []).find((line) => /\|/.test(line) && /@|\+?\d|📍/.test(line));
  if (!contactLine) return '';

  const firstPart = contactLine.split('|')[0].replace(/[📍☎✉]/g, '').trim();
  return /[a-z]/i.test(firstPart) && !findPhone(firstPart) && !findEmail(firstPart) ? firstPart : '';
};

const parseAbout = (text, sections) => {
  const headerLines = (sections.header || []).map(cleanLine).filter(Boolean).filter((line) => !isHeading(line) && !isPageMarker(line));
  const name = headerLines.find((line) => !findEmail(line) && !findPhone(line) && !line.includes('://')) || '';
  const title = headerLines.find((line) => line !== name && !findEmail(line) && !findPhone(line) && !line.includes('://')) || '';
  const summary = (sections.summary || []).map(cleanLine).filter(Boolean).join(' ');

  return {
    name,
    title,
    bio: summary,
    email: findEmail(text),
    phone: findPhone(text),
    location: findLocation(sections),
    socialLinks: {
      github: findUrl(text, 'github.com'),
      linkedin: findUrl(text, 'linkedin.com'),
      twitter: '',
      instagram: '',
    },
    typingRoles: title ? [title] : [],
  };
};

const parseSkills = (text, sections) => {
  const skillsText = (sections.skills || []).join(' ') || text;
  const lower = skillsText.toLowerCase();
  const seen = new Set();
  const skills = [];

  const hasSkill = (name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (name === 'html' || name === 'css') {
      return new RegExp(`(^|[^a-z0-9+#])${escaped}\\d*($|[^a-z0-9+#])`, 'i').test(lower);
    }
    return new RegExp(`(^|[^a-z0-9+#])${escaped}($|[^a-z0-9+#])`, 'i').test(lower);
  };

  Object.entries(SKILL_CATEGORIES).forEach(([category, names]) => {
    names.forEach((name) => {
      if (hasSkill(name.toLowerCase()) && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        skills.push({
          category,
          name: SKILL_LABELS[name.toLowerCase()] || name.replace(/\b\w/g, (char) => char.toUpperCase()),
          icon: '',
          progress: 70,
          order: skills.length,
        });
      }
    });
  });

  return skills;
};

const MONTH = '(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)';
const DATE_PART = `(?:${MONTH}\\.?\\s+)?\\d{4}`;

const findDuration = (line) =>
  line.match(new RegExp(`${DATE_PART}\\s*(?:-|to|–)\\s*(?:present|current|${DATE_PART})`, 'i'))?.[0] ||
  line.match(/expected\s+\d{4}/i)?.[0] ||
  line.match(/\d{4}\s*(?:-|to|–)\s*(?:present|current|\d{4})/i)?.[0] ||
  '';

const groupEntries = (lines) => {
  const entries = [];
  let current = [];

  lines.forEach((line) => {
    const cleaned = cleanLine(line);
    if (!cleaned) {
      if (current.length) {
        entries.push(current);
        current = [];
      }
      return;
    }

    if (findDuration(cleaned) && current.some((currentLine) => findDuration(currentLine))) {
      entries.push(current);
      current = [];
    }
    current.push(cleaned);
  });

  if (current.length) entries.push(current);
  return entries;
};

const isEducationDegreeLine = (line) => /degree|bachelor|master|mca|bca|b\.?tech|m\.?tech|diploma|school|college|application/i.test(line);

const groupEducationEntries = (lines) => {
  const entries = [];
  let current = [];

  lines.map(cleanLine).filter((line) => line && !isPageMarker(line)).forEach((line) => {
    if (isEducationDegreeLine(line) && current.some(isEducationDegreeLine)) {
      entries.push(current);
      current = [];
    }
    current.push(line);
  });

  if (current.length) entries.push(current);
  return entries;
};

const cleanDegree = (line, duration, grade) =>
  line
    .replace(duration, '')
    .replace(grade, '')
    .replace(/(?:\s*[|–-]\s*)+$/, '')
    .trim();

const parseEducation = (sections) =>
  groupEducationEntries(sections.education || [])
    .map((entry, index) => {
      const joined = entry.join(' | ');
      const duration = findDuration(joined);
      const degreeLine = entry.find(isEducationDegreeLine) || entry[0] || '';
      const grade =
        joined.match(/(?:cgpa|gpa|grade|percentage|percent)[:\s-]*[A-Z0-9.%-]+/i)?.[0] ||
        degreeLine.match(/first class|second class|distinction/i)?.[0] ||
        '';
      const degree = cleanDegree(degreeLine, duration, grade);
      const college = entry.find((line) => line !== degreeLine && /university|college|institute|school/i.test(line)) || entry.find((line) => line !== degreeLine) || '';

      return { degree, college, university: '', duration, grade, order: index };
    })
    .filter((item) => item.degree && item.college && item.duration);

const parseExperience = (sections) =>
  groupEntries(sections.experience || [])
    .map((entry, index) => {
      const joined = entry.join(' | ');
      const duration = findDuration(joined);
      const first = entry[0] || '';
      const [left, right] = first.split(/\s+(?:at|@|\|)\s+/i);
      const role = right ? left : first.replace(duration, '').trim();
      const company = right || entry.find((line) => line !== first && !line.startsWith('-')) || '';
      const description = entry.slice(1).filter((line) => line !== company).join('\n');

      return { company, role, duration, description, order: index };
    })
    .filter((item) => item.company && item.role && item.duration);

const parseProjectTech = (line) =>
  line
    .replace(/^technologies\s*:/i, '')
    .replace(/\([^)]*\)/g, '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parseProjects = (sections, text) => {
  const projectLines = (sections.projects || []).map(cleanLine).filter((line) => line && !isPageMarker(line));
  const entries = [];
  let current = [];

  projectLines.forEach((line) => {
    if (/^\d+\.\s+/.test(line) && current.length) {
      entries.push(current);
      current = [];
    }
    current.push(line);
  });
  if (current.length) entries.push(current);

  const socialUrls = [findUrl(text, 'github.com'), findUrl(text, 'linkedin.com')].filter(Boolean);
  const projectUrls = findUrls(text).filter((url) => !socialUrls.includes(url));
  let urlIndex = 0;

  return entries
    .map((entry, index) => {
      const heading = entry[0] || '';
      const title = heading.replace(/^\d+\.\s+/, '').split(/\s+[–-]\s+/)[0].trim();
      const techLine = entry.find((line) => /^technologies\s*:/i.test(line)) || '';
      const techStack = parseProjectTech(techLine);
      const features = entry.slice(1).filter((line) => !/^technologies\s*:/i.test(line));
      const description = features[0] || `${title} project`;
      const url = projectUrls[urlIndex++] || '';
      const isGithub = /github/i.test(heading) || /github\.com/i.test(url);

      return {
        title,
        description,
        techStack,
        features,
        githubUrl: isGithub ? url : '',
        liveUrl: isGithub ? '' : url,
        featured: index < 2,
        displayOrder: index,
      };
    })
    .filter((item) => item.title && item.description && item.techStack.length);
};

const parseResumeText = (text) => {
  const normalized = normalizeText(text);
  const sections = splitSections(normalized);

  return {
    about: parseAbout(normalized, sections),
    education: parseEducation(sections),
    experience: parseExperience(sections),
    projects: parseProjects(sections, normalized),
    skills: parseSkills(normalized, sections),
    rawText: normalized,
  };
};

const extractEmbeddedUrls = (filePath) => {
  const pdfBytes = fs.readFileSync(filePath).toString('latin1');
  return [...new Set([...pdfBytes.matchAll(/https?:[^\s)<>]+/gi)].map((match) => match[0]))];
};

const extractResumeText = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.txt') return fs.readFileSync(filePath, 'utf8');
  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      const urls = extractEmbeddedUrls(filePath);
      return [result.text || '', urls.join('\n')].filter(Boolean).join('\n');
    } finally {
      await parser.destroy();
    }
  }
  throw new Error('Unsupported resume file type');
};

module.exports = { extractResumeText, parseResumeText };
