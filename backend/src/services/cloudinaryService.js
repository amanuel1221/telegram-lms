const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const uploadPdfToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'telegram-lms/pdfs',
        resource_type: 'raw',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const deletePdfFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    throw error;
  }
};

module.exports = {
  uploadPdfToCloudinary,
  deletePdfFromCloudinary,
};