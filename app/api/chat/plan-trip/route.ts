import { NextRequest, NextResponse } from "next/server";
import { parseUserMessage } from "@/lib/parser";
import {
  plan_trip,
  search_inventory,
  rank_options,
} from "@/lib/tools";
import { store } from "@/lib/store";
import { ChatMessage } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Message and userId are required" },
        { status: 400 }
      );
    }

    // Parse the user message into a TripObject
    const tripObject = parseUserMessage(message, userId);

    if (!tripObject) {
      return NextResponse.json({
        message: "I couldn't understand your trip request. Please mention a destination like Goa, Kerala, or Jaipur, and provide details like dates and budget.",
        tripObject: null,
        options: [],
      });
    }

    // Run through the agentic pipeline
    const plannedTrip = plan_trip(tripObject);
    const inventoryOptions = search_inventory(plannedTrip);
    const rankedOptions = rank_options(inventoryOptions, plannedTrip);

    // Take top 3 options
    const topOptions = rankedOptions.slice(0, 3);

    // Update trip with options
    plannedTrip.candidateOptions = topOptions;
    plannedTrip.status = "options_shown";

    // Save trip to store
    store.saveTrip(plannedTrip);

    // Log analytics
    store.logEvent({ type: "trip_created", tripId: plannedTrip.id });
    store.logEvent({ type: "options_viewed", tripId: plannedTrip.id });

    // Create response message
    const nights = Math.ceil(
      (new Date(plannedTrip.endDate).getTime() -
        new Date(plannedTrip.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const responseMessage = `Perfect! I've found great options for your ${nights}-night trip to ${plannedTrip.destination} with a ${plannedTrip.budgetBand} budget. Here are my top ${topOptions.length} recommendations:`;

    // Add assistant message to chat
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: responseMessage,
      tripOptions: topOptions,
      timestamp: new Date().toISOString(),
    };

    store.addMessage(userId, assistantMessage);

    return NextResponse.json({
      message: responseMessage,
      tripObject: plannedTrip,
      options: topOptions,
    });
  } catch (error) {
    console.error("Error in plan-trip:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
