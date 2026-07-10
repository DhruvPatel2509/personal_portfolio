const htmlEntityMap = {
  amp: '&',
  quot: '"',
  apos: "'",
  '#39': "'",
  lt: '<',
  gt: '>',
};

const decodeHtml = (value = '') =>
  value
    .replace(/\\u002F/g, '/')
    .replace(/\\u0026/g, '&')
    .replace(/\\u003D/g, '=')
    .replace(/&([^;]+);/g, (match, entity) => htmlEntityMap[entity] || match);

const normalizeText = (value = '') =>
  decodeHtml(value)
    .replace(/\\n/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

const assertCourseraUrl = (rawUrl) => {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (error) {
    throw new Error('Please enter a valid Coursera certificate URL');
  }

  const host = parsed.hostname.replace(/^www\./, '');
  if (host !== 'coursera.org') {
    throw new Error('Only Coursera certificate links are supported right now');
  }

  return parsed.toString();
};

const fetchHtml = async (url) => {
  const response = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Coursera returned ${response.status}`);
  }

  return response.text();
};

const getFirstMatch = (html, patterns) => {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return normalizeText(match[1]);
  }
  return '';
};

const getCredentialCode = (url, html) =>
  getFirstMatch(html, [
    /byCode\(\{\\"code\\":\\"([^"]+)\\"\}\)/,
    /\/account\/accomplishments\/(?:specialization|certificate|verify)\/([A-Z0-9]+)/,
    /"verifyCode":"([^"]+)"/,
  ]) ||
  getFirstMatch(url, [
    /\/account\/accomplishments\/(?:specialization|certificate|verify)\/([A-Z0-9]+)/,
  ]);

const getIssueDate = (html) => {
  const timestamps = [...html.matchAll(/"grantedAt":(\d{10,})/g)]
    .map((match) => Number(match[1]))
    .filter(Number.isFinite);

  if (!timestamps.length) return '';

  return new Date(Math.max(...timestamps)).toISOString().slice(0, 10);
};

const inferSkills = (name, description) => {
  const haystack = `${name} ${description}`.toLowerCase();
  const skillMap = [
    ['GitHub', /\bgithub\b/],
    ['Git', /\bgit\b/],
    ['Version Control', /version control/],
    ['Pull Requests', /pull request/],
    ['Branching', /\bbranching\b|\bbranches\b/],
    ['Repository Management', /\brepositor/],
  ];

  return skillMap.filter(([, pattern]) => pattern.test(haystack)).map(([skill]) => skill);
};

const fetchCourseraCertificateDetails = async (rawUrl) => {
  const credentialUrl = assertCourseraUrl(rawUrl);
  const html = await fetchHtml(credentialUrl);

  const name = getFirstMatch(html, [
    /"OnDemandSpecializationsV1:[^"]+":\{[\s\S]*?"name":"([^"]+)"/,
    /"OnDemandCoursesV1:[^"]+":\{[\s\S]*?"name":"([^"]+)"/,
    /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/,
    /<title[^>]*>(.*?)<\/title>/,
  ]);

  const organization = getFirstMatch(html, [/"PartnersV1:[^"]+":\{[^}]*"name":"([^"]+)"/]);
  const credentialCode = getCredentialCode(credentialUrl, html);
  const issueDate = getIssueDate(html);
  const description = getFirstMatch(html, [/"certificateDescription":"([^"]+)"/, /"description":"([^"]+)"/]);

  if (!name || /coursera\s*\|/i.test(name)) {
    throw new Error('Could not find certificate details on this Coursera page');
  }

  return {
    name,
    organization: organization || 'Coursera',
    issueDate,
    credentialUrl,
    credentialId: credentialCode,
    credentialCode,
    skills: inferSkills(name, description),
    description,
    platform: 'Coursera',
  };
};

module.exports = { fetchCourseraCertificateDetails };
