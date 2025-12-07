"use client";

import { useState } from "react";
import ChatAssistant from "@/components/ChatAssistant";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { MessageCircle, BarChart3 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "analytics">("chat");

  return (
    <div className="h-screen flex flex-col">
      {activeTab === "chat" ? (
        <ChatAssistant />
      ) : (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <AnalyticsDashboard />
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 safe-area-bottom md:hidden shadow-lg z-50">
        <div className="flex items-center justify-around px-4 py-3">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-2 space-y-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title="Chat Assistant"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title="Analytics Dashboard"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
