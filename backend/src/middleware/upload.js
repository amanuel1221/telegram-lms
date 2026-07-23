const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter,
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 20 MB limit.',
        data: null,
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
      data: null,
    });
  }

  if (err && err.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      message: 'Only PDF files are allowed.',
      data: null,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error.',
      data: null,
    });
  }

  next();
};

module.exports = {
  uploadPdf: upload.single('pdf'),
  handleMulterError,
};