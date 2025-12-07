# Yatrafy GenAI Travel Assistant - MVP

A full-stack AI-powered travel assistant built with Next.js, TypeScript, and Tailwind CSS. This MVP demonstrates an agentic architecture for trip planning, booking, and post-booking lifecycle management.

## Features

✨ **Conversational Trip Planning**: Natural language chat interface to describe your dream trip

🎯 **Smart Recommendations**: AI-powered trip options with bundled flights + hotels

💳 **Instant Booking**: One-click booking simulation with detailed itinerary

📊 **Real-time Analytics**: Dashboard tracking sessions, trips, bookings, and conversion rates

🔔 **Post-Booking Events**: Simulate T-1 reminders and flight delay notifications

📱 **Mobile-First Design**: Responsive, aesthetic UI with smooth animations

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom gradients and animations
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **Data**: In-memory store (simple Map-based storage)
- **Images**: Unsplash (via Next.js Image component)

## Project Structure

```
chotu_bantai_mvp/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   ├── plan-trip/route.ts    # Parse user message & return trip options
│   │   │   ├── book/route.ts         # Book a selected trip option
│   │   │   └── simulate-event/route.ts # Simulate post-booking events
│   │   └── analytics/
│   │       └── summary/route.ts      # Get analytics summary
│   ├── globals.css                   # Global styles with custom animations
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page with tab navigation
├── components/
│   ├── ChatAssistant.tsx            # Main chat interface
│   ├── TripOptionCard.tsx           # Beautiful trip option cards
│   ├── ItineraryCard.tsx            # Booking confirmation card
│   └── AnalyticsDashboard.tsx       # Analytics & metrics view
├── lib/
│   ├── store.ts                     # In-memory data store
│   ├── tools.ts                     # Internal agentic functions
│   └── parser.ts                    # Simple NLP message parser
├── data/
│   └── inventory.ts                 # Mock flights & hotels data
├── types/
│   └── index.ts                     # TypeScript type definitions
└── README.md
```

## Installation & Running

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### Chat Assistant

1. **Start a conversation**: Type a trip request like:
   - "Plan a 3-day trip to Goa next month, mid-range budget"
   - "I want a budget trip to Kerala for 5 days"
   - "Plan a luxury weekend to Jaipur"

2. **Review options**: The AI will show 2-3 bundled trip options with:
   - Flight details (airline, times, price)
   - Hotel details (name, location, rating, images)
   - Total price and personalized rationale

3. **Book a trip**: Click "Book Now" on any option

4. **View itinerary**: See your complete booking details

5. **Simulate events**: Try the post-booking event buttons:
   - "T-1 Day Reminder" - Get pre-trip reminder
   - "Flight Delay Alert" - Simulate flight delay handling

### Analytics Dashboard

Switch to the Analytics tab (bottom nav on mobile, sidebar on desktop) to see:

- Total sessions started
- Total trips created
- Total bookings
- Escalation count
- Booking conversion rate
- Real-time insights

## Architecture Overview

### Agentic Pipeline

The MVP implements a simplified agentic architecture:

1. **User Input** → Chat message
2. **Parse** → Extract destination, dates, budget, preferences
3. **Plan Trip** → Create TripObject
4. **Search Inventory** → Find matching flights & hotels
5. **Rank Options** → Score based on rating, price, safety, accessibility
6. **Present Options** → Show top 3 bundled packages
7. **Book** → Confirm selection & generate itinerary
8. **Post-Booking** → Handle reminders, delays, upsells

### Internal "Tools" (Functions)

Located in `lib/tools.ts`:

- `plan_trip()` - Validates and enriches trip object
- `search_inventory()` - Finds matching flights & hotels
- `rank_options()` - Scores and sorts options
- `book_itinerary()` - Marks trip as booked
- `post_booking_nudge()` - Generates helpful tips
- `replan_or_notify()` - Handles post-booking events

### Data Flow

```
User Message
    ↓
Parser (lib/parser.ts)
    ↓
TripObject
    ↓
Tools Pipeline (lib/tools.ts)
    ↓
API Routes (app/api/*)
    ↓
In-Memory Store (lib/store.ts)
    ↓
Response to Frontend
    ↓
UI Update (React Components)
```

## Example Trip Requests

Try these example prompts:

- "Plan a 3-day trip to Goa next month, mid-range budget"
- "I want a budget weekend getaway to Kerala"
- "Plan a luxury 5-day trip to Jaipur for 2 people"
- "Book a safe trip to Goa for solo female traveler"
- "Plan an adventure trip to Goa with accessible hotels"

## Simplifications (MVP vs Full Production)

| Feature | MVP | Full Production |
|---------|-----|-----------------|
| LLM Integration | Simple keyword parsing | GPT-4/Claude with RAG |
| Inventory | Mock data (hardcoded) | Live APIs (flights, hotels) |
| Payments | Simulated | Real payment gateway (Stripe, Razorpay) |
| Authentication | Fixed user ID | OAuth, JWT, session management |
| Database | In-memory Map | PostgreSQL, MongoDB, Redis |
| Image Storage | Unsplash URLs | CDN, S3, optimized assets |
| Search | Basic string matching | Elasticsearch, fuzzy search |
| Recommendations | Simple scoring | ML-based personalization |

## Future Extensions

### Phase 2 - LLM Integration
- Integrate OpenAI GPT-4 or Claude 3 for natural language understanding
- Implement RAG (Retrieval-Augmented Generation) with vector database
- Fine-tune on Yatrafy-specific data

### Phase 3 - Real Integrations
- Connect to flight APIs (Amadeus, Skyscanner)
- Integrate hotel booking APIs
- Add payment gateway (Stripe, Razorpay)
- Real user authentication & profiles

### Phase 4 - Advanced Features
- Multi-city trips
- Group travel coordination
- Corporate travel management
- Visa assistance
- Travel insurance
- Local experiences (SIM, tours, food)

### Phase 5 - Scale & Analytics
- A/B testing framework
- Advanced analytics & ML insights
- Predictive pricing
- Demand forecasting
- Personalization engine

## Design Highlights

### UI/UX Features

- **Gradient backgrounds** - Purple to blue theme throughout
- **Card hover effects** - Smooth elevation on hover
- **Glass morphism** - Backdrop blur on headers
- **Rich trip cards** - Images, ratings, prices, rationale
- **Responsive design** - Mobile-first with desktop enhancements
- **Smooth animations** - Bounce effects, transitions, loading states
- **Tab navigation** - Bottom nav (mobile) + sidebar (desktop)

### Color Palette

- Primary: Purple (#667eea) to Blue (#4f46e5)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Error: Red (#ef4444)
- Background: White with gradient overlays

## Performance

- Fast page loads with Next.js
- Optimized images with next/image
- Client-side routing for instant navigation
- Real-time analytics updates every 5 seconds

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT

## Credits

Built for the Yatrafy GenAI Travel Assistant MVP project.

---

**Enjoy planning your trips with Yatrafy!** ✈️🏨🌴
"# Yatrafy" 
