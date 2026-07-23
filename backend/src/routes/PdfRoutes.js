const express = require('express');
const router = express.Router();
const isTeacher = require('../middlewares/isTeacher');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadPdf, handleMulterError } = require('../middlewares/upload');
const {
  createPdf,
  getAllPdfs,
  getPdfById,
  updatePdf,
  deletePdf,
} = require('../controllers/pdfController');

router.use(authMiddleware);

router.get('/', getAllPdfs);
router.get('/:id', getPdfById);

router.post('/', isTeacher, uploadPdf, handleMulterError, createPdf);
router.put('/:id', isTeacher, uploadPdf, handleMulterError, updatePdf);
router.delete('/:id', isTeacher, deletePdf);

module.exports = router;