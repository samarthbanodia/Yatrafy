Here’s a ready-to-paste prompt for Claude.
When you use it, just put **this prompt + the architecture text you shared** into the same message.

---

**PROMPT FOR CLAUDE (YATRAFY MVP PROTOTYPE)**

You are a senior full-stack engineer tasked with building a **working MVP prototype** for the “Yatrafy GenAI Travel Assistant”.

I will paste an **architecture description** of the ideal system (agentic, LLM-orchestrated, multi-tool, analytics, etc.).
Your job is to build a **simplified but working version** of that architecture with:

* A real **frontend** (web, mobile-first)
* A real **backend** (API with basic state + logic)
* No real LLM or payments — those can be **stubbed / mocked** but the flow must be realistic and clickable end-to-end.

---

### 1. Overall Goal

Build a small full-stack app that demonstrates that the Yatrafy assistant can:

1. Take a **free-form user prompt** in a chat UI (e.g., “Plan a 3-day Goa trip next month, mid-range budget”).
2. Convert it into a **TripObject** (structured trip request).
3. Run that TripObject through a **simplified agentic pipeline**:

   * plan_trip
   * search_inventory
   * rank_options
   * book_itinerary
   * post_booking_nudge
4. Return **rich, bundled options** (flight + hotel) as cards in the chat.
5. Let the user **confirm a booking** (“Book Option 2”) and then:

   * “Book” the trip (in backend state)
   * Generate a basic itinerary screen / message
6. Simulate **post-booking events** (e.g., T-1 reminder, flight delay replan) through simple buttons or mock events.
7. Show a tiny **analytics view** (even basic numbers) to prove we can track:

   * # of sessions, trips created, bookings, fallbacks/escalations.

This is a **demo/prototype**: the focus is **clean architecture and believable flow**, not production-grade security.

---

### 2. Tech Stack (suggested – you can stick to this)

Use a modern but simple stack:

* **Frontend**: React (or Next.js app router) with a mobile-first UI
* **Backend**: Node.js + Express (or Next.js API routes)
* **Data**: In-memory store or simple JSON files for:

  * Inventory (flights, hotels)
  * Users
  * Trips
  * Analytics events

If you want to propose a slightly different but equally simple stack, briefly explain and then proceed.

---

### 3. Core Domain Objects

Define and use a minimal but explicit schema for:

1. **TripObject** (what the “LLM orchestrator” creates)

   Example fields (you can refine slightly, but keep it simple):

   ```ts
   TripObject {
     id: string;
     userId: string;
     destination: string;
     startDate: string;
     endDate: string;
     budgetBand: "budget" | "mid-range" | "premium";
     travelersCount: number;
     purpose: string; // e.g. "relaxation", "workation"
     preferences?: {
       stayType?: "hotel" | "villa" | "glamping";
       safetyPriority?: boolean;
       accessibilityNeeds?: string[];
     };
     candidateOptions?: TripOption[];
     selectedOptionId?: string;
     status: "draft" | "options_shown" | "booked";
   }
   ```

2. **TripOption** (bundled plan)

   ```ts
   TripOption {
     id: string;
     flight: {
       id: string;
       from: string;
       to: string;
       departTime: string;
       arriveTime: string;
       price: number;
       airline: string;
     };
     hotel: {
       id: string;
       name: string;
       location: string;
       pricePerNight: number;
       rating: number;
       imageUrl?: string;
       safetyScore?: number;
       accessibilityScore?: number;
     };
     totalPrice: number;
     rationale: string; // e.g. "Good balance of price and rating for mid-range budget"
   }
   ```

3. **AnalyticsEvent**

   ```ts
   AnalyticsEvent {
     id: string;
     type: "session_started" | "trip_created" | "options_viewed" | "option_booked" | "escalated_to_human";
     tripId?: string;
     timestamp: string;
   }
   ```

Use these (or very close variants) throughout the code so the flow stays coherent.

---

### 4. Backend Requirements

Implement a small backend with **clear routes** that simulate the agentic lifecycle.

#### 4.1 Endpoints

Create REST (or Next.js API) endpoints such as:

1. `POST /api/chat/plan-trip`

   * Input: `{ message: string, userId: string }`
   * Behavior:

     * “Parse” the message into a TripObject using simple deterministic rules (no real LLM).

       * e.g., search for a known list of destinations, detect date keywords like “next month”, detect words like “budget/mid-range/luxury”.
     * Persist TripObject in memory.
     * Call internal helper functions that represent tools:

       * `plan_trip(trip)`
       * `search_inventory(trip)` → uses mock flights/hotels JSON
       * `rank_options(trip)` → rank by simple heuristic (rating vs price)
     * Return:

       * Updated TripObject
       * 2–3 TripOptions
       * Response messages to show in chat

2. `POST /api/chat/book`

   * Input: `{ tripId: string, optionId: string }`
   * Behavior:

     * Mark TripObject as `booked`.
     * Create a simple “booking record”.
     * Generate a basic itinerary object.
     * Emit analytics events (`option_booked`).
     * Return confirmation data to frontend.

3. `POST /api/chat/simulate-event`

   * Input: `{ tripId: string, eventType: "T_MINUS_1" | "FLIGHT_DELAY" }`
   * Behavior:

     * For `"T_MINUS_1"`: return a reminder message + weather stub.
     * For `"FLIGHT_DELAY"`: show a mock delay and call a `replan_or_notify(trip)` helper that proposes an alternate flight.
   * Return messages that frontend shows in chat.

4. `GET /api/analytics/summary`

   * Behavior:

     * Aggregate in-memory AnalyticsEvent data.
     * Return simple metrics:

       * totalSessions
       * totalTrips
       * totalBookings
       * escalationCount (even if we don’t fully implement escalation)
       * bookingConversionRate

5. (Optional but nice): `POST /api/chat/escalate`

   * Marks a trip as “escalated_to_human” and logs an event.

#### 4.2 Internal “Tools” as Functions

In the backend code, implement pure functions that mimic the tools from the architecture:

* `plan_trip(trip: TripObject): TripObject`
* `search_inventory(trip): TripOption[]`

  * Pick flights + hotels from static JSON arrays based on destination and budget band.
* `rank_options(options, trip): TripOption[]`

  * Simple scoring function: rating, price, maybe “safetyScore”.
* `book_itinerary(trip, optionId)`
* `post_booking_nudge(trip)`
* `replan_or_notify(trip, eventType)`

You don’t need real microservices; just keep these as separate functions or modules to make the architecture visible in the code.

---

### 5. Frontend Requirements

Build a minimal but **polished, mobile-first** frontend.

#### 5.1 Pages / Views

1. **Chat Assistant Screen (main)**

   * Components:

     * Chat message list
     * Input box (“Describe your trip…”)
     * Send button

   * When user sends their first message:

     * Call `POST /api/chat/plan-trip`
     * Show:

       * A bot message summarizing the understood TripObject (“3 nights in Goa, mid-range budget, from Mumbai between X and Y”).
       * Rich cards for 2–3 bundled options:

         * Flight details
         * Hotel details (image, rating, price)
         * Total price
         * Rationale text
       * Each card should have a “Book this option” button that calls `POST /api/chat/book`.

   * After booking:

     * Show a confirmation message in the chat.
     * Show a simple itinerary block:

       * Flight info
       * Hotel info
       * Dates
       * “Download / View itinerary” button (can just open a detailed view).

   * Add buttons to simulate post-booking events:

     * “Simulate T-1 Reminder”
     * “Simulate Flight Delay”
     * These call `POST /api/chat/simulate-event` and append bot messages.

2. **Analytics / Admin View**

   * A simple page or side panel that calls `GET /api/analytics/summary` and displays:

     * # of sessions
     * # of trips created
     * # of bookings
     * Conversion rate (bookings / trips)
   * This can just be basic cards or simple text; no need for charts unless you want to add them.

#### 5.2 UI / UX Notes

* Make it **mobile-first**:

  * Single-column layout
  * Sticky input bar at bottom for the chat
* Use **rich cards** for trip options:

  * Hotel image (you can use placeholder URLs)
  * Price + rating
  * Short rationale badge
* Keep the design clean but don’t overcomplicate — this is for a **demo**.

---

### 6. Simplifications vs Full Architecture

When implementing, assume:

* No actual LLM calls:

  * “LLM parsing” is just your backend logic turning the text into a TripObject.
* No external APIs:

  * Flights and hotels are from small mock datasets (hardcoded arrays or JSON files).
* No real payments:

  * `initiate_payment()` is simulated by a simple delay or instant “Payment successful” response.
* No real auth:

  * Use a fixed `userId` or simple in-memory session.

However, structure the code in a way that makes it obvious where a real LLM, real payment gateway, or real inventory API would plug in.

---

### 7. Output Format & Delivery

Please structure your answer in **clear sections**, in this order:

1. **High-Level Overview**

   * Briefly restate the architecture you’ll implement (components + data flow).
2. **Backend Design & Code**

   * Explain endpoints and show full example code (Node + Express or Next.js API).
   * Include mock inventory data.
   * Show how internal “tool” functions are structured.
3. **Frontend Design & Code**

   * Show React / Next.js components for:

     * Chat screen
     * Option cards
     * Analytics view
   * Include API calls to the backend.
4. **Run Instructions**

   * How to install dependencies
   * How to start backend and frontend
   * Any environment variables (if used)
5. **Future Extensions (short)**

   * Brief bullet list of how this prototype could be extended toward the full Yatrafy architecture (real LLM, RAG, payments, etc.)

Focus on making the prototype **actually runnable** with as little extra configuration as possible.

---

**Use the architecture text I provide next as your main product spec and align your code and naming with it wherever reasonable.**
