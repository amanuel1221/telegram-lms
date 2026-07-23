import React, { useState } from "react";
import { uploadPdf } from "../services/api";
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AdminUpload({ onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    semester: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setStatus({ type: "error", message: "Only PDF files are supported." });
        setFile(null);
        return;
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        setStatus({ type: "error", message: "File size must be under 20MB." });
        setFile(null);
        return;
      }
      setStatus({ type: "", message: "" });
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: "error", message: "Please attach a PDF file." });
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatus({ type: "", message: "" });

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("subject", formData.subject);
    data.append("semester", formData.semester);
    data.append("pdf", file);

    try {
      const res = await uploadPdf(data, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percent);
      });

      setStatus({
        type: "success",
        message: res.data?.message || "Notes uploaded successfully!",
      });
      setFormData({ title: "", description: "", subject: "", semester: "" });
      setFile(null);
      setProgress(0);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to upload PDF.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
        <UploadCloud className="text-blue-400" size={20} />
        <h2 className="text-sm font-bold text-slate-100">Publish Study Material</h2>
      </div>

      {status.message && (
        <div
          className={`flex items-start space-x-2 p-3 rounded-xl mb-4 text-xs font-medium border ${
            status.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle size={16} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Chapter 3: Advanced Trees"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Data Structures"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Semester *
            </label>
            <input
              type="text"
              name="semester"
              required
              value={formData.semester}
              onChange={handleChange}
              placeholder="e.g. Sem 4"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs text-slate-100 placeholder:text-slate-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Summary of topics covered..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs text-slate-100 placeholder:text-slate-600 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            PDF Document *
          </label>
          <div className="relative border border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-950/50 hover:bg-slate-950 transition-colors">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-1">
              <FileText size={22} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-300">
                {file ? file.name : "Select or drag PDF file"}
              </span>
              {file && (
                <span className="text-[10px] text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Uploading Material...</span>
            </>
          ) : (
            <span>Publish Document</span>
          )}
        </button>
      </form>
    </div>
  );
}