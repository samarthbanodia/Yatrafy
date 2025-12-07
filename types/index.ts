export type BudgetBand = "budget" | "mid-range" | "premium";
export type TripStatus = "draft" | "options_shown" | "booked";
export type AnalyticsEventType =
  | "session_started"
  | "trip_created"
  | "options_viewed"
  | "option_booked"
  | "escalated_to_human";

export interface TripPreferences {
  stayType?: "hotel" | "villa" | "glamping";
  safetyPriority?: boolean;
  accessibilityNeeds?: string[];
}

export interface Flight {
  id: string;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  price: number;
  airline: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  imageUrl?: string;
  safetyScore?: number;
  accessibilityScore?: number;
}

export interface TripOption {
  id: string;
  flight: Flight;
  hotel: Hotel;
  totalPrice: number;
  rationale: string;
}

export interface TripObject {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetBand: BudgetBand;
  travelersCount: number;
  purpose: string;
  preferences?: TripPreferences;
  candidateOptions?: TripOption[];
  selectedOptionId?: string;
  status: TripStatus;
}

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  tripId?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  tripOptions?: TripOption[];
  itinerary?: {
    flight: Flight;
    hotel: Hotel;
    startDate: string;
    endDate: string;
  };
  timestamp: string;
}

export interface AnalyticsSummary {
  totalSessions: number;
  totalTrips: number;
  totalBookings: number;
  escalationCount: number;
  bookingConversionRate: number;
}
