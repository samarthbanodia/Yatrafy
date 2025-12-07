import { TripObject, AnalyticsEvent, ChatMessage } from "@/types";

class DataStore {
  private trips: Map<string, TripObject> = new Map();
  private analytics: AnalyticsEvent[] = [];
  private chatSessions: Map<string, ChatMessage[]> = new Map();
  private sessionCount = 0;

  // Trip operations
  saveTrip(trip: TripObject) {
    this.trips.set(trip.id, trip);
  }

  getTrip(id: string): TripObject | undefined {
    return this.trips.get(id);
  }

  getAllTrips(): TripObject[] {
    return Array.from(this.trips.values());
  }

  // Analytics operations
  logEvent(event: Omit<AnalyticsEvent, "id" | "timestamp">) {
    const analyticsEvent: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...event,
    };
    this.analytics.push(analyticsEvent);
  }

  getAnalytics(): AnalyticsEvent[] {
    return this.analytics;
  }

  // Chat session operations
  addMessage(userId: string, message: ChatMessage) {
    if (!this.chatSessions.has(userId)) {
      this.chatSessions.set(userId, []);
      this.sessionCount++;
      this.logEvent({ type: "session_started" });
    }
    const session = this.chatSessions.get(userId)!;
    session.push(message);
  }

  getMessages(userId: string): ChatMessage[] {
    return this.chatSessions.get(userId) || [];
  }

  getSessionCount(): number {
    return this.sessionCount;
  }
}

export const store = new DataStore();
