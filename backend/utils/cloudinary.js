const cloudinary = require("cloudinary").v2;

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log(
    `[Cloudinary] ✅ Configured with cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`,
  );
} else {
  console.warn(
    "[Cloudinary] ❌ Not configured - Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET",
  );
}

const isCloudinaryEnabled = () => isConfigured;

const uploadFile = async (file, folderPath) => {
  if (!isConfigured) {
    console.error(
      "[Cloudinary] Upload attempted but Cloudinary not configured",
    );
    throw new Error("Cloudinary is not configured.");
  }

  const uploadOptions = {
    folder: folderPath,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: "auto",
    timeout: 30000,
  };

  console.log(`[Cloudinary] 📤 Starting upload: ${file.originalname}`);
  console.log(`[Cloudinary]    Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`[Cloudinary]    Folder: ${folderPath}`);
  console.log(`[Cloudinary]    File size: ${file.size} bytes`);

  try {
    const result = await cloudinary.uploader.upload(file.path, uploadOptions);
    console.log(`[Cloudinary] ✅ Upload successful: ${result.secure_url}`);
    return result;
  } catch (err) {
    console.error(`[Cloudinary] ❌ Upload failed for ${file.originalname}`);
    console.error(`[Cloudinary]    Error: ${err.message}`);
    console.error(`[Cloudinary]    Status: ${err.http_code}`);
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
};

const getPublicIdFromUrl = (url) => {
  if (typeof url !== "string") return null;
  const match = url.match(
    /cloudinary\.com\/[^/]+\/(?:image|video|raw|auto)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i,
  );
  if (!match || !match[1]) return null;
  return match[1];
};

const deleteFile = async (storedUrl) => {
  if (!isConfigured || typeof storedUrl !== "string") return;
  const publicId = getPublicIdFromUrl(storedUrl);
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
};

module.exports = { isCloudinaryEnabled, uploadFile, deleteFile };
