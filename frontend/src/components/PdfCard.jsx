import React from "react";
import { ExternalLink, Trash2, Calendar, BookOpen, Layers } from "lucide-react";

export default function PdfCard({ pdf, user, onDelete, isDeleting }) {
  const handleOpenPdf = (url) => {
    if (window.Telegram?.WebApp?.openLink) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="bg-slate-900/70 rounded-2xl p-4 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BookOpen size={10} className="mr-1" />
            {pdf.subject}
          </span>

          <span className="inline-flex items-center text-[10px] text-slate-500 font-medium">
            <Calendar size={10} className="mr-1" />
            {new Date(pdf.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-100 mb-1 leading-snug">
          {pdf.title}
        </h3>

        {pdf.description && (
          <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
            {pdf.description}
          </p>
        )}

        <div className="flex items-center space-x-3 text-[10px] text-slate-500 mb-3 font-medium">
          <span className="flex items-center">
            <Layers size={11} className="mr-1 text-slate-600" />
            {pdf.semester}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/60">
        <button
          onClick={() => handleOpenPdf(pdf.fileUrl)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/10"
        >
          <span>Read Document</span>
          <ExternalLink size={13} />
        </button>

        {user?.role === "teacher" && (
          <button
            onClick={() => onDelete(pdf._id)}
            disabled={isDeleting}
            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors border border-rose-500/20 disabled:opacity-50"
            title="Delete Document"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}