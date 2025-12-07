MVP Architecture 
The Yatrafy GenAI assistant runs on a modular, agentic architecture built for in-app conversational interaction and full trip execution. At its core is an LLM orchestrator (GPT-4 or Claude 3) fine-tuned via Retrieval-Augmented Generation (RAG) with Yatrafy’s live inventory APIs (flights, hotels, pricing, availability) and past user behavior data. The LLM parses user messages into a structured Trip Object, which flows through a chain of task-specific function tools: plan_trip, search_inventory, rank_options, book_itinerary, and post_booking_nudge. Each tool calls Yatrafy’s backend services via secure APIs (PCI-compliant for payments, encrypted for user profile/booking data). A context manager ensures session continuity across multi-turn queries (e.g., refining hotel options or adding meal preferences). A decision engine governs escalation, handing off to human agents when detecting safety/accessibility/group queries. An event listener layer subscribes to real-time signals like flight delays or weather changes, triggering replan_or_notify tools mid-trip. All interaction logs flow into a custom analytics layer for real-time measurement of KPIs (adoption, conversion, escalation rate, fallback rate), and continuous feedback fine-tunes recommendations and model prompts over time. The entire pipeline is optimized for mobile-first performance, with rich cards (e.g., hotel with image + reviews) rendered directly in chat.


End-to-End Flow (agentic lifecycle)
1. User Entry & Intent Capture
   └── User opens chat from in-app CTA (e.g. “Plan my next trip”)
   └── LLM parses free-form input → generates structured TripObject
   └── Example: {"destination": "Goa", "start_date": "Oct 24", "budget": "Mid-range", "purpose": "relaxation"}


2. Smart Trip Planning & Recommendations
   └── LLM calls:
         → `search_flights(TripObject)` → real-time API call to flight inventory
         → `search_hotels(TripObject)` → filters Yatrafy + glamping stays
   └── Contextual inference via `rank_options()`:
         → applies social proof (“73% of solo travelers like you booked this”)
         → includes accessibility & safety scores if relevant
   └── LLM formats top 2–3 bundled trip plans (flight + hotel) with clear rationale


3. Booking & Payment Execution
   └── On user confirmation (e.g. “Book Option 2”):
         → `book_flight()` + `book_hotel()` triggered sequentially
         → `initiate_payment()` via credit card (MVP-scope)
         → `confirm_booking()` → saves full TripObject with metadata


4. Post-Booking Lifecycle Engagement
   └── `generate_itinerary(TripObject)` with all confirmations, maps, check-in info
   └── Scheduled pings:
         → T-1 day reminder (“Here’s your flight. Weather shows rain in Goa.”)
         → In-trip alerts (flight delay, rebook flow if needed)
         → Mid-trip upsell tool (`suggest_add_ons()` for SIM, spa, local food tour)
   └── Post-trip: `request_feedback()` + show “Next trip” offers


5. Escalation & Support Fallbacks
   └── If LLM detects:
         → safety concern (“Is this safe for solo female?”)
         → accessibility query (“Is there an elevator?”)
         → group or corporate use case
         → complex refund/rebooking
   └── Then triggers `escalate_to_human()` → live agent via shared chat view


6. Analytics, Learning & Feedback Loop
   └── Every trip interaction logs:
         → TripObject metadata
         → selected/rejected options
         → booking outcome
         → fallback/escalation events
         → user satisfaction (CSAT/NPS)
   └── Feeds into `update_user_profile()` + fine-tunes `rank_options()` for future trips



 This pipeline ensures a low-latency, feedback-driven, agentic flow where the assistant doesn’t just suggest but acts — planning, booking, reminding, adapting — with measurable checkpoints from trip start to return.


