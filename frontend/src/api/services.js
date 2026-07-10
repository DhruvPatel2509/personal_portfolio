import api from './axios';

/* ---------- Auth ---------- */
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

/* ---------- About ---------- */
export const aboutAPI = {
  get: () => api.get('/about'),
  update: (formData) =>
    api.put('/about', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadResume: (formData) =>
    api.put('/about/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

/* ---------- Resume Import ---------- */
export const resumeImportAPI = {
  parse: (formData) =>
    api.post('/resume-import/parse', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  apply: (data) => api.post('/resume-import/apply', data),
};

/* ---------- Skills ---------- */
export const skillsAPI = {
  getAll: (params) => api.get('/skills', { params }),
  getOne: (id) => api.get(`/skills/${id}`),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

/* ---------- Projects ---------- */
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (formData) =>
    api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/projects/${id}`),
  deleteImage: (id, imagePath) => api.delete(`/projects/${id}/images`, { data: { imagePath } }),
};

/* ---------- Education ---------- */
export const educationAPI = {
  getAll: () => api.get('/education'),
  create: (data) => api.post('/education', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
};

/* ---------- Experience ---------- */
export const experienceAPI = {
  getAll: () => api.get('/experience'),
  create: (data) => api.post('/experience', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

/* ---------- Certifications ---------- */
export const certificationsAPI = {
  getAll: () => api.get('/certifications'),
  fetchFromUrl: (url) => api.post('/certifications/fetch-from-url', { url }),
  create: (formData) =>
    api.post('/certifications', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/certifications/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/certifications/${id}`),
};

/* ---------- Achievements ---------- */
export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  create: (formData) =>
    api.post('/achievements', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/achievements/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/achievements/${id}`),
};

/* ---------- Coding Profiles ---------- */
export const codingProfilesAPI = {
  get: () => api.get('/coding-profiles'),
  update: (data) => api.put('/coding-profiles', data),
};

/* ---------- Messages ---------- */
export const messagesAPI = {
  send: (data) => api.post('/messages', data),
  getAll: (params) => api.get('/messages', { params }),
  getOne: (id) => api.get(`/messages/${id}`),
  toggleRead: (id, isRead) => api.patch(`/messages/${id}/read`, { isRead }),
  delete: (id) => api.delete(`/messages/${id}`),
};

/* ---------- Settings ---------- */
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (formData) =>
    api.put('/settings', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

/* ---------- Dashboard ---------- */
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};
