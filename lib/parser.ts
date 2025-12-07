import { TripObject, BudgetBand } from "@/types";
import { destinations, origins } from "@/data/inventory";

export function parseUserMessage(message: string, userId: string): TripObject | null {
  const lowerMessage = message.toLowerCase();

  // Extract destination
  let destination = "";
  for (const dest of destinations) {
    if (lowerMessage.includes(dest.toLowerCase())) {
      destination = dest;
      break;
    }
  }

  if (!destination) {
    return null; // Could not parse destination
  }

  // Extract budget band
  let budgetBand: BudgetBand = "mid-range";
  if (lowerMessage.includes("budget") || lowerMessage.includes("cheap") || lowerMessage.includes("affordable")) {
    budgetBand = "budget";
  } else if (lowerMessage.includes("premium") || lowerMessage.includes("luxury") || lowerMessage.includes("5-star")) {
    budgetBand = "premium";
  }

  // Extract number of travelers
  let travelersCount = 1;
  const travelersMatch = lowerMessage.match(/(\d+)\s*(people|person|traveler|pax)/);
  if (travelersMatch) {
    travelersCount = parseInt(travelersMatch[1]);
  }

  // Extract purpose
  let purpose = "relaxation";
  if (lowerMessage.includes("work") || lowerMessage.includes("business")) {
    purpose = "business";
  } else if (lowerMessage.includes("adventure") || lowerMessage.includes("trek")) {
    purpose = "adventure";
  } else if (lowerMessage.includes("romantic") || lowerMessage.includes("honeymoon")) {
    purpose = "romantic";
  } else if (lowerMessage.includes("family")) {
    purpose = "family trip";
  }

  // Extract dates (simplified - just use near future)
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  // Check for "next month"
  if (lowerMessage.includes("next month")) {
    startDate.setMonth(today.getMonth() + 1);
    startDate.setDate(15);
  } else if (lowerMessage.includes("next week")) {
    startDate.setDate(today.getDate() + 7);
  } else {
    // Default to 2 weeks from now
    startDate.setDate(today.getDate() + 14);
  }

  // Extract duration
  let duration = 3; // Default 3 nights
  const durationMatch = lowerMessage.match(/(\d+)\s*(day|night)/);
  if (durationMatch) {
    duration = parseInt(durationMatch[1]);
  }

  endDate.setTime(startDate.getTime());
  endDate.setDate(startDate.getDate() + duration);

  // Check for safety or accessibility preferences
  const preferences: any = {};
  if (lowerMessage.includes("safe") || lowerMessage.includes("solo female")) {
    preferences.safetyPriority = true;
  }
  if (lowerMessage.includes("wheelchair") || lowerMessage.includes("accessible")) {
    preferences.accessibilityNeeds = ["wheelchair"];
  }

  const tripObject: TripObject = {
    id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    destination,
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    budgetBand,
    travelersCount,
    purpose,
    preferences: Object.keys(preferences).length > 0 ? preferences : undefined,
    status: "draft",
  };

  return tripObject;
}
