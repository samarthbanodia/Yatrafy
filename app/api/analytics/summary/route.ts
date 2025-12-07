import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { AnalyticsSummary } from "@/types";

export async function GET() {
  try {
    const events = store.getAnalytics();
    const trips = store.getAllTrips();

    const totalSessions = store.getSessionCount();
    const totalTrips = events.filter((e) => e.type === "trip_created").length;
    const totalBookings = events.filter((e) => e.type === "option_booked").length;
    const escalationCount = events.filter(
      (e) => e.type === "escalated_to_human"
    ).length;

    const bookingConversionRate =
      totalTrips > 0 ? (totalBookings / totalTrips) * 100 : 0;

    const summary: AnalyticsSummary = {
      totalSessions,
      totalTrips,
      totalBookings,
      escalationCount,
      bookingConversionRate: Math.round(bookingConversionRate * 10) / 10,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error in analytics summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
