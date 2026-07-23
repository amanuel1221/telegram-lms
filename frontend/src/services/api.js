import api from "./axios";

/**
 * AUTH ENDPOINTS
 */

// Authenticate via Telegram initData or mock user in dev mode
const authenticateTelegram = (initDataRaw, mockUser = null) =>
  api.post("/auth/telegram", { initDataRaw, mockUser });

// Fetch current user profile
const getMe = () => api.get("/auth/me");

// Logout user
const logout = () => api.post("/auth/logout");


/**
 * COURSE MATERIAL (PDF) ENDPOINTS
 */

// Get all PDFs with optional query filters
const getPdfs = (subject = "", semester = "", search = "") =>
  api.get(
    `/pdfs?subject=${encodeURIComponent(subject)}&semester=${encodeURIComponent(
      semester
    )}&search=${encodeURIComponent(search)}`
  );

// Get single PDF by ID
const getPdfById = (id) => api.get(`/pdfs/${id}`);

// Upload a new PDF material (Teacher only)
const uploadPdf = (formData, onUploadProgress) =>
  api.post("/pdfs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });

// Update PDF metadata
const updatePdf = (id, data) => api.patch(`/pdfs/${id}`, data);

// Delete PDF (Teacher only)
const deletePdf = (id) => api.delete(`/pdfs/${id}`);

export {
  authenticateTelegram,
  getMe,
  logout,
  getPdfs,
  getPdfById,
  uploadPdf,
  updatePdf,
  deletePdf,
};