"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, AlertCircle } from "lucide-react";
import TripOptionCard from "./TripOptionCard";
import ItineraryCard from "./ItineraryCard";
import { TripOption, ChatMessage } from "@/types";

const USER_ID = "user_demo_001";

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Welcome to Yatrafy! I'm your AI travel assistant. Tell me about your dream trip and I'll help you plan it. For example: 'Plan a 3-day trip to Goa next month, mid-range budget'",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage, userId: USER_ID }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: data.message,
        tripOptions: data.options,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.tripObject) {
        setCurrentTripId(data.tripObject.id);
        setIsBooked(false);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: ChatMessage = {
        id: `msg_error_${Date.now()}`,
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookOption = async (option: TripOption) => {
    if (!currentTripId) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: currentTripId,
          optionId: option.id,
          userId: USER_ID,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: data.message,
        itinerary: data.itinerary,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsBooked(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateEvent = async (eventType: "T_MINUS_1" | "FLIGHT_DELAY") => {
    if (!currentTripId) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/simulate-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: currentTripId,
          eventType,
          userId: USER_ID,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Yatrafy</h1>
              <p className="text-xs text-gray-600">Your AI Travel Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-lg"
                    : "space-y-4 w-full"
                }`}
              >
                {message.role === "user" ? (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                ) : (
                  <>
                    <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-gray-100">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                    </div>

                    {/* Trip Options */}
                    {message.tripOptions && message.tripOptions.length > 0 && (
                      <div className="grid gap-4">
                        {message.tripOptions.map((option) => (
                          <TripOptionCard
                            key={option.id}
                            option={option}
                            onBook={() => handleBookOption(option)}
                          />
                        ))}
                      </div>
                    )}

                    {/* Itinerary */}
                    {message.itinerary && (
                      <ItineraryCard
                        flight={message.itinerary.flight}
                        hotel={message.itinerary.hotel}
                        startDate={message.itinerary.startDate}
                        endDate={message.itinerary.endDate}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Simulation Buttons (only show after booking) */}
          {isBooked && currentTripId && (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">
                  Simulate Post-Booking Events
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSimulateEvent("T_MINUS_1")}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 disabled:opacity-50 transition-colors"
                >
                  T-1 Day Reminder
                </button>
                <button
                  onClick={() => handleSimulateEvent("FLIGHT_DELAY")}
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 disabled:opacity-50 transition-colors"
                >
                  Flight Delay Alert
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-5 py-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Planning your trip...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200 sticky bottom-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Describe your dream trip..."
              className="flex-1 px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none bg-white shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
