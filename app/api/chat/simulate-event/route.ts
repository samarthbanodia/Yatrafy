import { NextRequest, NextResponse } from "next/server";
import { replan_or_notify } from "@/lib/tools";
import { store } from "@/lib/store";
import { ChatMessage } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { tripId, eventType, userId } = await request.json();

    if (!tripId || !eventType || !userId) {
      return NextResponse.json(
        { error: "tripId, eventType, and userId are required" },
        { status: 400 }
      );
    }

    // Get the trip
    const trip = store.getTrip(tripId);

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    // Generate event message
    const eventMessage = replan_or_notify(trip, eventType);

    // Add assistant message to chat
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: eventMessage,
      timestamp: new Date().toISOString(),
    };

    store.addMessage(userId, assistantMessage);

    return NextResponse.json({
      message: eventMessage,
    });
  } catch (error) {
    console.error("Error in simulate-event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
