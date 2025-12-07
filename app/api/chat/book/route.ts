import { NextRequest, NextResponse } from "next/server";
import { book_itinerary, post_booking_nudge } from "@/lib/tools";
import { store } from "@/lib/store";
import { ChatMessage } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { tripId, optionId, userId } = await request.json();

    if (!tripId || !optionId || !userId) {
      return NextResponse.json(
        { error: "tripId, optionId, and userId are required" },
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

    // Find the selected option
    const selectedOption = trip.candidateOptions?.find(
      (opt) => opt.id === optionId
    );

    if (!selectedOption) {
      return NextResponse.json(
        { error: "Option not found" },
        { status: 404 }
      );
    }

    // Book the itinerary
    const bookedTrip = book_itinerary(trip, optionId);
    store.saveTrip(bookedTrip);

    // Log analytics
    store.logEvent({ type: "option_booked", tripId: bookedTrip.id });

    // Generate nudge message
    const nudgeMessage = post_booking_nudge(bookedTrip);

    // Create confirmation message
    const confirmationMessage = `🎉 Booking Confirmed!\n\nYour trip to ${bookedTrip.destination} is all set! Here are your details:\n\n✈️ Flight: ${selectedOption.flight.airline} - ${selectedOption.flight.from} to ${selectedOption.flight.to}\n🏨 Hotel: ${selectedOption.hotel.name}, ${selectedOption.hotel.location}\n📅 Dates: ${bookedTrip.startDate} to ${bookedTrip.endDate}\n💰 Total: ₹${selectedOption.totalPrice.toLocaleString()}\n\n${nudgeMessage}`;

    // Add assistant message to chat
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: confirmationMessage,
      itinerary: {
        flight: selectedOption.flight,
        hotel: selectedOption.hotel,
        startDate: bookedTrip.startDate,
        endDate: bookedTrip.endDate,
      },
      timestamp: new Date().toISOString(),
    };

    store.addMessage(userId, assistantMessage);

    return NextResponse.json({
      message: confirmationMessage,
      trip: bookedTrip,
      itinerary: {
        flight: selectedOption.flight,
        hotel: selectedOption.hotel,
        startDate: bookedTrip.startDate,
        endDate: bookedTrip.endDate,
      },
    });
  } catch (error) {
    console.error("Error in book:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
