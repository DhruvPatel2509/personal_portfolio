const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;
const { isCloudinaryEnabled, uploadFile, deleteFile } = require("./cloudinary");

/**
 * Safely removes a stored file or Cloudinary asset.
 * Local paths are `/uploads/...`; remote URLs are deleted via Cloudinary.
 */
const removeFile = async (storedPath) => {
  if (!storedPath || typeof storedPath !== "string") return;

  if (storedPath.startsWith("http://") || storedPath.startsWith("https://")) {
    try {
      await deleteFile(storedPath);
    } catch (err) {
      console.error(
        `Failed to delete Cloudinary asset ${storedPath}:`,
        err.message,
      );
    }
    return;
  }

  const absolutePath = path.join(
    __dirname,
    "..",
    storedPath.replace(/^\/+/, ""),
  );
  try {
    await fsPromises.unlink(absolutePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Failed to delete file ${absolutePath}:`, err.message);
    }
  }
};

/**
 * Converts a multer file object into the relative local URL path we store in Mongo.
 */
const toRelativePath = (file, subfolder) =>
  `/uploads/${subfolder}/${file.filename}`;

/**
 * Generates folder paths based on resource type and name.
 * Examples:
 * - generateCloudinaryPath('project', 'MyProject') => 'projects/MyProject/images'
 * - generateCloudinaryPath('certificate', 'AWS Cert') => 'certificates/AWS Cert/images'
 * - generateCloudinaryPath('resume') => 'personal-portfolio/resume'
 */
const generateCloudinaryPath = (type, name = "") => {
  // Sanitize folder names - remove special characters
  const sanitizeName = (str) =>
    str.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
  const safeName = name ? sanitizeName(name) : "default";

  const paths = {
    project: () => `portfolio/projects/${safeName}/images`,
    certificate: () => `portfolio/certificates/${safeName}/images`,
    resume: () => `portfolio/resume`,
    about: () => `portfolio/about`,
    skill: () => `portfolio/skills`,
    experience: () => `portfolio/experience`,
    education: () => `portfolio/education`,
    achievement: () => `portfolio/achievements`,
    message: () => `portfolio/messages`,
  };
  const result = (paths[type] || (() => `portfolio/${type}`))();
  console.log(`[FileUtils] Generated Cloudinary path for ${type}:`, result);
  return result;
};

const storeUploadedFile = async (file, subfolder, customPath = null) => {
  if (!file) return "";
  if (isCloudinaryEnabled()) {
    try {
      // Use customPath if provided (for organized structure), otherwise use subfolder
      const folderPath = customPath || subfolder;
      console.log(
        `[FileUtils] Storing file: ${file.originalname}, Cloudinary: true, Folder: ${folderPath}`,
      );
      const result = await uploadFile(file, folderPath);
      // Clean up temp file after successful upload
      try {
        await fsPromises.unlink(file.path);
      } catch (e) {
        // Ignore cleanup errors
      }
      console.log(`[FileUtils] File stored successfully: ${result.secure_url}`);
      return result.secure_url;
    } catch (err) {
      console.error(
        `[FileUtils] Cloudinary upload failed for ${file.originalname}:`,
        err.message,
      );
      // Fallback to local storage if Cloudinary fails
      console.log(
        `[FileUtils] Falling back to local storage for ${file.originalname}`,
      );
      return toRelativePath(file, subfolder);
    }
  }
  console.log(
    `[FileUtils] Cloudinary disabled, storing locally: ${file.originalname}`,
  );
  return toRelativePath(file, subfolder);
};

module.exports = {
  removeFile,
  toRelativePath,
  storeUploadedFile,
  generateCloudinaryPath,
};
