const fs = require('fs');
const path = require('path');

/**
 * Safely removes an uploaded file given its stored relative path
 * (e.g. "/uploads/projects/xyz.png"). Silently ignores missing files
 * so cleanup never crashes a request.
 */
const removeFile = (relativePath) => {
  if (!relativePath) return;
  const absolutePath = path.join(__dirname, '..', relativePath.replace(/^\/+/, ''));
  fs.unlink(absolutePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Failed to delete file ${absolutePath}:`, err.message);
    }
  });
};

/**
 * Converts a multer file object into the relative URL path we store in Mongo.
 */
const toRelativePath = (file, subfolder) => `/uploads/${subfolder}/${file.filename}`;

module.exports = { removeFile, toRelativePath };
