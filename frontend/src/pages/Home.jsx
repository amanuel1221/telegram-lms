import React, { useEffect, useState } from "react";
import { getPdfs, deletePdf } from "../services/api";
import PdfCard from "../components/PdfCard";
import { Search, FileText } from "lucide-react";

export default function Home({ user, refreshTrigger }) {
  const [pdfs, setPdfs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchMaterials = async (searchTerm = "") => {
    try {
      setLoading(true);
      const res = await getPdfs("", "", searchTerm);
      setPdfs(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials(search);
  }, [refreshTrigger, search]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this material?")) return;
    try {
      setDeletingId(id);
      await deletePdf(id);
      setPdfs((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes by subject or title..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium">Fetching materials...</span>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl text-center text-xs font-medium border border-rose-500/20">
          {error}
        </div>
      ) : pdfs.length === 0 ? (
        <div className="bg-slate-900/40 rounded-2xl p-8 text-center border border-slate-800/80">
          <FileText className="mx-auto text-slate-600 mb-2" size={32} />
          <p className="text-xs font-semibold text-slate-300">
            No materials found
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Try adjusting your search query.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pdfs.map((pdf) => (
            <PdfCard
              key={pdf._id}
              pdf={pdf}
              user={user}
              onDelete={handleDelete}
              isDeleting={deletingId === pdf._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}