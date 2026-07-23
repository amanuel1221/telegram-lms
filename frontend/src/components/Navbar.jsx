import React from "react";
import { BookOpen, Shield, Sparkles } from "lucide-react";

export default function Navbar({ user, activeTab, setActiveTab, onDevRoleSwitch }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-2 rounded-xl shadow-md shadow-blue-500/20">
            <BookOpen size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">
              Telegram LMS
            </h1>
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              Course Portal <Sparkles size={10} className="text-blue-400" />
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-3">
            {/* Tab navigation for Teachers */}
            {user.role === "teacher" && (
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
                <button
                  onClick={() => setActiveTab("home")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeTab === "home"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab("admin")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeTab === "admin"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Upload
                </button>
              </div>
            )}

            <div className="text-right">
              <span
                className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                  user.role === "teacher"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {user.role}
              </span>
            </div>

            {onDevRoleSwitch && (
              <button
                onClick={onDevRoleSwitch}
                title="Switch Role (Dev Mode)"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                <Shield size={15} />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}