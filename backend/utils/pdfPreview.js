const fs = require('fs/promises');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const isPdfUpload = (file) =>
  file?.mimetype === 'application/pdf' || path.extname(file?.originalname || '').toLowerCase() === '.pdf';

const convertPdfFirstPageToPng = async (file) => {
  if (!isPdfUpload(file)) return file;

  const data = await fs.readFile(file.path);
  const parser = new PDFParse({ data });

  try {
    const result = await parser.getScreenshot({
      first: 1,
      imageBuffer: true,
      imageDataUrl: false,
      desiredWidth: 1000,
    });
    const pngBuffer = result.pages?.[0]?.data;

    if (!pngBuffer) {
      throw new Error('Could not render PDF certificate preview');
    }

    const parsedPath = path.parse(file.path);
    const filename = `${parsedPath.name}.png`;
    const outputPath = path.join(parsedPath.dir, filename);

    await fs.writeFile(outputPath, pngBuffer);
    await fs.unlink(file.path).catch(() => {});

    return {
      ...file,
      path: outputPath,
      filename,
      mimetype: 'image/png',
      originalname: file.originalname.replace(/\.pdf$/i, '.png'),
    };
  } finally {
    await parser.destroy();
  }
};

module.exports = { convertPdfFirstPageToPng, isPdfUpload };
