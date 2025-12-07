"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { AnalyticsSummary } from "@/types";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analytics/summary");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Refresh every 5 seconds
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      icon: Users,
      label: "Total Sessions",
      value: analytics.totalSessions,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: BarChart3,
      label: "Trips Created",
      value: analytics.totalTrips,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: ShoppingBag,
      label: "Bookings",
      value: analytics.totalBookings,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: AlertTriangle,
      label: "Escalations",
      value: analytics.escalationCount,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time metrics and performance insights
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion Rate Card */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Booking Conversion Rate</h3>
            <p className="text-sm text-white/80">
              Percentage of trips that resulted in bookings
            </p>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold">
            {analytics.bookingConversionRate}%
          </span>
          <span className="text-lg mb-2 text-white/80">conversion</span>
        </div>
        <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${analytics.bookingConversionRate}%` }}
          />
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Quick Insights
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              {analytics.totalBookings > 0
                ? `Great job! You've successfully booked ${analytics.totalBookings} ${
                    analytics.totalBookings === 1 ? "trip" : "trips"
                  }.`
                : "Start planning trips to see bookings here."}
            </p>
          </div>
          {analytics.bookingConversionRate > 50 && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                Excellent conversion rate! More than half of trip plans result in bookings.
              </p>
            </div>
          )}
          {analytics.escalationCount > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">
                {analytics.escalationCount} {analytics.escalationCount === 1 ? "query has" : "queries have"} been escalated to human agents.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
