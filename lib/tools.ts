import { TripObject, TripOption, BudgetBand } from "@/types";
import { mockFlights, mockHotels } from "@/data/inventory";

export function plan_trip(trip: TripObject): TripObject {
  // This function validates and enriches the trip object
  // In a real system, this would involve LLM-based planning
  return {
    ...trip,
    status: "draft",
  };
}

export function search_inventory(trip: TripObject): TripOption[] {
  // Find matching flights
  const matchingFlights = mockFlights.filter(
    (flight) =>
      flight.to.toLowerCase() === trip.destination.toLowerCase() &&
      new Date(flight.departTime) >= new Date(trip.startDate)
  );

  // Find matching hotels based on destination and budget
  const matchingHotels = mockHotels.filter((hotel) => {
    const isDestinationMatch = hotel.location
      .toLowerCase()
      .includes(trip.destination.toLowerCase());

    const isBudgetMatch = checkBudgetMatch(hotel.pricePerNight, trip.budgetBand);

    return isDestinationMatch && isBudgetMatch;
  });

  // Create bundled options (combine flights and hotels)
  const options: TripOption[] = [];

  const flightsToUse = matchingFlights.slice(0, 3);
  const hotelsToUse = matchingHotels.slice(0, 3);

  for (let i = 0; i < Math.min(flightsToUse.length, hotelsToUse.length); i++) {
    const flight = flightsToUse[i];
    const hotel = hotelsToUse[i];

    const nights = Math.max(
      1,
      Math.ceil(
        (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const totalPrice = flight.price * 2 + hotel.pricePerNight * nights; // Round trip

    options.push({
      id: `opt_${i + 1}`,
      flight,
      hotel,
      totalPrice,
      rationale: generateRationale(flight, hotel, trip.budgetBand, trip.purpose),
    });
  }

  return options;
}

function checkBudgetMatch(pricePerNight: number, budgetBand: BudgetBand): boolean {
  switch (budgetBand) {
    case "budget":
      return pricePerNight < 3000;
    case "mid-range":
      return pricePerNight >= 3000 && pricePerNight <= 6000;
    case "premium":
      return pricePerNight > 6000;
    default:
      return true;
  }
}

function generateRationale(
  flight: any,
  hotel: any,
  budgetBand: BudgetBand,
  purpose: string
): string {
  const rationales = [
    `Perfect for ${purpose}! This ${budgetBand} option offers great value with a ${hotel.rating}-star rated hotel.`,
    `Excellent choice for travelers seeking ${budgetBand} comfort. ${hotel.name} has high safety scores.`,
    `Best balance of price and quality. ${flight.airline} offers reliable service and ${hotel.name} is well-reviewed.`,
    `Ideal ${budgetBand} package. Great location at ${hotel.location} with comfortable amenities.`,
  ];

  return rationales[Math.floor(Math.random() * rationales.length)];
}

export function rank_options(
  options: TripOption[],
  trip: TripObject
): TripOption[] {
  // Score each option based on multiple factors
  const scoredOptions = options.map((option) => {
    let score = 0;

    // Hotel rating weight
    score += option.hotel.rating * 10;

    // Price consideration (lower is better for budget)
    const priceScore = trip.budgetBand === "budget"
      ? (50000 - option.totalPrice) / 1000
      : option.hotel.rating * 5;
    score += priceScore;

    // Safety priority
    if (trip.preferences?.safetyPriority && option.hotel.safetyScore) {
      score += option.hotel.safetyScore * 2;
    }

    // Accessibility needs
    if (trip.preferences?.accessibilityNeeds?.length && option.hotel.accessibilityScore) {
      score += option.hotel.accessibilityScore * 2;
    }

    return { option, score };
  });

  // Sort by score (highest first)
  scoredOptions.sort((a, b) => b.score - a.score);

  return scoredOptions.map((s) => s.option);
}

export function book_itinerary(trip: TripObject, optionId: string): TripObject {
  return {
    ...trip,
    selectedOptionId: optionId,
    status: "booked",
  };
}

export function post_booking_nudge(trip: TripObject): string {
  const messages = [
    "Don't forget to check-in online 24 hours before your flight!",
    "Pro tip: Download offline maps for your destination.",
    "We'll send you a reminder 1 day before your trip with weather updates.",
    "Your trip is confirmed! Get ready for an amazing experience.",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

export function replan_or_notify(
  trip: TripObject,
  eventType: "T_MINUS_1" | "FLIGHT_DELAY"
): string {
  if (eventType === "T_MINUS_1") {
    return `⏰ Reminder: Your trip to ${trip.destination} starts tomorrow! Current weather: Sunny, 28°C. Have a great journey!`;
  } else {
    return `⚠️ Flight Update: Your flight has been delayed by 2 hours. We're checking alternate options. New departure time: 10:00 AM.`;
  }
}
