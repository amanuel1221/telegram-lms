const Pdf = require('../models/Pdf');
const { uploadPdfToCloudinary, deletePdfFromCloudinary } = require('../services/cloudinaryService');
const { notifyNewPdf } = require('../services/telegramService');

const createPdf = async (req, res) => {
  try {
    const { title, description, subject, semester } = req.body;

    if (!title || !subject || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject, and semester are required.',
        data: null,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required.',
        data: null,
      });
    }

    const uploadResult = await uploadPdfToCloudinary(req.file.buffer);

    const pdf = await Pdf.create({
      title,
      description: description || '',
      subject,
      semester,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      uploadedBy: req.user._id,
    });

    notifyNewPdf(pdf).catch((err) => console.error('Telegram Notify Exception:', err));

    return res.status(201).json({
      success: true,
      message: 'PDF uploaded successfully.',
      data: pdf,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
      data: null,
    });
  }
};

const getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find()
      .select('title description subject semester createdAt fileUrl')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'PDFs retrieved successfully.',
      data: pdfs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
      data: null,
    });
  }
};

const getPdfById = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF document not found.',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'PDF retrieved successfully.',
      data: pdf,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
      data: null,
    });
  }
};

const updatePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subject, semester } = req.body;

    let pdf = await Pdf.findById(id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found.',
        data: null,
      });
    }

    if (title) pdf.title = title;
    if (description !== undefined) pdf.description = description;
    if (subject) pdf.subject = subject;
    if (semester) pdf.semester = semester;

    if (req.file) {
      await deletePdfFromCloudinary(pdf.publicId);
      const uploadResult = await uploadPdfToCloudinary(req.file.buffer);
      pdf.fileUrl = uploadResult.secure_url;
      pdf.publicId = uploadResult.public_id;
    }

    await pdf.save();

    return res.status(200).json({
      success: true,
      message: 'PDF updated successfully.',
      data: pdf,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
      data: null,
    });
  }
};

const deletePdf = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found.',
        data: null,
      });
    }

    await deletePdfFromCloudinary(pdf.publicId);
    await pdf.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'PDF deleted successfully.',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error.',
      data: null,
    });
  }
};

module.exports = {
  createPdf,
  getAllPdfs,
  getPdfById,
  updatePdf,
  deletePdf,
};