import React, { useEffect, useState } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { authenticateTelegram } from "./services/api";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

export default function App() {
  const telegram = useTelegram();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!telegram) return;

    const performAuth = async () => {
      try {
        setLoading(true);
        setError("");

        const { initDataRaw, user: tgUser } = telegram;

        if (initDataRaw) {
          const res = await authenticateTelegram(initDataRaw);
          if (res.data?.token) {
            localStorage.setItem("lms_token", res.data.token);
          }
          setDbUser(res.data?.user || res.data);
        } else {
          // Fallback mock mode for web development
          const mockUser = {
            telegramId: tgUser?.id || "999888777",
            firstName: tgUser?.firstName || "Dev",
            lastName: tgUser?.lastName || "User",
            role: "teacher",
          };
          const res = await authenticateTelegram(null, mockUser);
          if (res.data?.token) {
            localStorage.setItem("lms_token", res.data.token);
          }
          setDbUser(res.data?.user || res.data);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError(err.response?.data?.message || "Failed to authenticate with LMS server.");
      } finally {
        setLoading(false);
      }
    };

    performAuth();
  }, [telegram]);

  const handleDevRoleSwitch = async () => {
    if (!dbUser) return;
    const nextRole = dbUser.role === "teacher" ? "student" : "teacher";
    const mockUser = {
      telegramId: telegram?.user?.id || "999888777",
      firstName: telegram?.user?.firstName || "Dev",
      lastName: telegram?.user?.lastName || "User",
      role: nextRole,
    };

    try {
      setLoading(true);
      const res = await authenticateTelegram(null, mockUser);
      setDbUser(res.data?.user || res.data);
      setActiveTab("home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!telegram || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-xs font-medium">Connecting to LMS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-white">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 max-w-xs text-center space-y-3">
          <p className="text-xs font-bold text-rose-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12 selection:bg-blue-500/30">
      <Navbar
        user={dbUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDevRoleSwitch={!telegram.initDataRaw ? handleDevRoleSwitch : null}
      />

      <main className="max-w-md mx-auto px-4 pt-5">
        {activeTab === "home" ? (
          <Home user={dbUser} refreshTrigger={refreshTrigger} />
        ) : (
          <Admin
            onUploadSuccess={() => {
              setRefreshTrigger((prev) => prev + 1);
              setActiveTab("home");
            }}
          />
        )}
      </main>
    </div>
  );
}