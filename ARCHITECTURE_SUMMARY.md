# Yatrafy MVP - Architecture Summary

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │   Chat Assistant     │      │  Analytics Dashboard │        │
│  │  - Message List      │      │  - Session Metrics   │        │
│  │  - Trip Option Cards │      │  - Conversion Rates  │        │
│  │  - Itinerary Display │      │  - Real-time Updates │        │
│  └──────────────────────┘      └──────────────────────┘        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ HTTP Requests
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                        │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ /plan-trip     │  │ /book          │  │ /simulate-event │  │
│  │ - Parse input  │  │ - Confirm trip │  │ - Send alerts   │  │
│  │ - Run pipeline │  │ - Save booking │  │ - Replan flow   │  │
│  └────────────────┘  └────────────────┘  └─────────────────┘  │
│                        ┌─────────────────┐                      │
│                        │ /analytics      │                      │
│                        │ - Get summary   │                      │
│                        └─────────────────┘                      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ Function Calls
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AGENTIC TOOLS LAYER                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  plan_trip()          - Validate & enrich trip         │    │
│  │  search_inventory()   - Find flights & hotels          │    │
│  │  rank_options()       - Score by rating, price, safety │    │
│  │  book_itinerary()     - Mark as booked                 │    │
│  │  post_booking_nudge() - Generate tips                  │    │
│  │  replan_or_notify()   - Handle events                  │    │
│  └────────────────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ Data Access
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  In-Memory Store │  │  Mock Inventory  │  │   Parser     │ │
│  │  - Trips Map     │  │  - Flights       │  │  - NLP Logic │ │
│  │  - Analytics []  │  │  - Hotels        │  │  - Extract   │ │
│  │  - Chat Sessions │  │  - Destinations  │  │    Intent    │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## End-to-End Flow

### 1. User Sends Trip Request
```
User: "Plan a 3-day trip to Goa next month, mid-range budget"
   ↓
ChatAssistant.tsx → handleSendMessage()
   ↓
POST /api/chat/plan-trip
```

### 2. Message Parsing
```
/api/chat/plan-trip → parseUserMessage()
   ↓
Extracts:
- destination: "Goa"
- budgetBand: "mid-range"
- duration: 3 nights
- startDate: calculated from "next month"
   ↓
Creates TripObject
```

### 3. Agentic Pipeline
```
TripObject
   ↓
plan_trip(trip)         → Validates trip
   ↓
search_inventory(trip)  → Finds matching flights + hotels
   ↓
rank_options(options)   → Scores by rating, price, safety
   ↓
Returns top 3 TripOptions
```

### 4. Response to User
```
TripOptions
   ↓
Saved to store with trip.status = "options_shown"
   ↓
Analytics event: "trip_created", "options_viewed"
   ↓
Response JSON → ChatAssistant
   ↓
Renders TripOptionCard components
```

### 5. User Books Trip
```
User clicks "Book Now" on Option 2
   ↓
POST /api/chat/book
   ↓
book_itinerary(trip, optionId)
   ↓
trip.status = "booked"
   ↓
Analytics event: "option_booked"
   ↓
Renders ItineraryCard
```

### 6. Post-Booking Events
```
User clicks "Simulate T-1 Reminder"
   ↓
POST /api/chat/simulate-event
   ↓
replan_or_notify(trip, "T_MINUS_1")
   ↓
Returns reminder message
   ↓
Displays in chat
```

---

## Core Domain Objects

### TripObject
The central data structure representing a trip request:
```typescript
{
  id: "trip_123",
  userId: "user_001",
  destination: "Goa",
  startDate: "2025-12-15",
  endDate: "2025-12-18",
  budgetBand: "mid-range",
  travelersCount: 1,
  purpose: "relaxation",
  candidateOptions: [...],
  selectedOptionId: "opt_2",
  status: "booked"
}
```

### TripOption
A bundled package (flight + hotel):
```typescript
{
  id: "opt_1",
  flight: { airline, from, to, times, price },
  hotel: { name, location, rating, price, images },
  totalPrice: 15000,
  rationale: "Perfect balance for mid-range..."
}
```

### AnalyticsEvent
Tracking user actions:
```typescript
{
  id: "evt_123",
  type: "option_booked",
  tripId: "trip_123",
  timestamp: "2025-12-07T..."
}
```

---

## Key Design Decisions

### 1. Agentic Tool Pattern
Each business logic function is isolated:
- `plan_trip()` - Trip validation
- `search_inventory()` - Inventory matching
- `rank_options()` - Scoring algorithm

**Why?** Makes it easy to replace with real LLM tools later.

### 2. In-Memory Store
Simple Map-based storage for MVP:
- Fast prototyping
- No database setup needed
- Easy to understand

**Production:** Replace with PostgreSQL + Redis.

### 3. Simple NLP Parser
Keyword-based extraction:
- Searches for destinations in text
- Detects budget keywords
- Regex for dates and counts

**Production:** Replace with GPT-4/Claude API.

### 4. Mock Inventory
Hardcoded arrays of flights & hotels:
- No external API dependencies
- Predictable demo data
- Instant responses

**Production:** Integrate Amadeus, Skyscanner APIs.

### 5. Mobile-First UI
Responsive design with Tailwind:
- Bottom navigation (mobile)
- Sidebar navigation (desktop)
- Touch-friendly card interactions

---

## Component Hierarchy

```
app/page.tsx (Main App)
├── ChatAssistant.tsx
│   ├── Message bubbles
│   ├── TripOptionCard.tsx (multiple)
│   ├── ItineraryCard.tsx
│   └── Input bar
└── AnalyticsDashboard.tsx
    ├── Stats cards
    ├── Conversion rate banner
    └── Insights panel
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat/plan-trip` | POST | Parse message & return trip options |
| `/api/chat/book` | POST | Confirm booking & create itinerary |
| `/api/chat/simulate-event` | POST | Trigger post-booking events |
| `/api/analytics/summary` | GET | Get real-time metrics |

---

## Scaling Path

### Phase 1: MVP (Current)
- In-memory storage
- Keyword parsing
- Mock inventory
- Single user

### Phase 2: Real Backend
- PostgreSQL database
- User authentication
- Session management
- Multi-user support

### Phase 3: LLM Integration
- OpenAI GPT-4 / Claude 3
- RAG with vector database
- Context-aware responses
- Personalization

### Phase 4: Live APIs
- Flight booking APIs
- Hotel reservation APIs
- Payment gateway
- Email notifications

### Phase 5: Production Scale
- Redis caching
- CDN for images
- Load balancing
- Monitoring & alerts

---

## Performance Characteristics

### Build Time
- **Development**: ~5 seconds
- **Production build**: ~4.9 seconds
- **Total bundle**: 114 KB (First Load JS)

### Response Times (MVP)
- API calls: < 50ms (in-memory)
- Page loads: Instant (static)
- Analytics refresh: 5 seconds interval

---

## Security Considerations

### Current (MVP)
- No real authentication
- Fixed user ID
- In-memory only (resets on restart)
- No payment processing

### Production Requirements
- OAuth 2.0 / JWT authentication
- HTTPS everywhere
- PCI-DSS compliance (payments)
- Data encryption at rest
- Rate limiting
- CORS policies
- Input validation & sanitization

---

## Extensibility Points

Where to plug in real services:

1. **LLM Integration** → `lib/parser.ts`
   - Replace `parseUserMessage()` with GPT-4 API call

2. **Flight API** → `data/inventory.ts`
   - Replace `mockFlights` with Amadeus API

3. **Hotel API** → `data/inventory.ts`
   - Replace `mockHotels` with Booking.com API

4. **Payment Gateway** → `app/api/chat/book/route.ts`
   - Add Stripe/Razorpay before `book_itinerary()`

5. **Database** → `lib/store.ts`
   - Replace Map with Prisma/TypeORM queries

6. **Analytics** → `lib/store.ts`
   - Send events to Mixpanel/Amplitude

---

## Success Metrics

The MVP tracks:
- **Session Count**: New chat sessions
- **Trip Created**: Successful parsing
- **Options Viewed**: User engagement
- **Bookings**: Conversion event
- **Conversion Rate**: Bookings / Trips

In production, add:
- Time to book
- Average trip value
- User satisfaction (CSAT)
- Abandonment rate
- Error rate

---

## Conclusion

This MVP demonstrates a production-ready architecture that:
- ✅ Simulates agentic AI behavior
- ✅ Provides end-to-end booking flow
- ✅ Tracks analytics in real-time
- ✅ Uses modern, scalable patterns
- ✅ Has clear extension points for real integrations

Ready to evolve into a full-scale GenAI travel platform!
