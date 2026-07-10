const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Builds a disk-storage multer instance scoped to a subfolder of /uploads.
 * Files are renamed to `<fieldname>-<timestamp>-<random>.<ext>` to avoid collisions.
 */
const makeStorage = (subfolder) => {
  const dest = path.join(__dirname, '..', 'uploads', subfolder);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
    },
  });
};

const imageFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed'));
};

const imageOrPdfFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const imageAllowed = /jpeg|jpg|png|webp|gif/;
  const isImage = imageAllowed.test(ext) && imageAllowed.test(file.mimetype);
  const isPdf = ext === '.pdf' && file.mimetype === 'application/pdf';

  if (isImage || isPdf) return cb(null, true);
  cb(new Error('Only image files (jpg, jpeg, png, webp, gif) or PDF files are allowed'));
};

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') return cb(null, true);
  cb(new Error('Only PDF files are allowed'));
};

const resumeImportFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = ['text/plain', 'application/pdf'];
  if ((ext === '.txt' || ext === '.pdf') && allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only TXT or PDF resume files are allowed'));
};

const maxSize = parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024;

const uploadImages = (subfolder) =>
  multer({
    storage: makeStorage(subfolder),
    fileFilter: imageFileFilter,
    limits: { fileSize: maxSize },
  });

const uploadImagesOrPdf = (subfolder) =>
  multer({
    storage: makeStorage(subfolder),
    fileFilter: imageOrPdfFileFilter,
    limits: { fileSize: maxSize },
  });

const uploadResume = () =>
  multer({
    storage: makeStorage('resume'),
    fileFilter: pdfFileFilter,
    limits: { fileSize: maxSize },
  });

const uploadResumeImport = () =>
  multer({
    storage: makeStorage('resume-imports'),
    fileFilter: resumeImportFileFilter,
    limits: { fileSize: maxSize },
  });

module.exports = { uploadImages, uploadImagesOrPdf, uploadResume, uploadResumeImport };
