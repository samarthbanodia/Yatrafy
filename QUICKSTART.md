# Quick Start Guide - Yatrafy MVP

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to **http://localhost:3000**

---

## Try It Out!

### Example 1: Basic Trip
Type in the chat:
```
Plan a 3-day trip to Goa next month, mid-range budget
```

You'll see:
- AI understanding of your request
- 2-3 bundled trip options with flights + hotels
- Beautiful cards with images, ratings, and prices
- Click "Book Now" to confirm

### Example 2: Budget Travel
```
I want a budget weekend getaway to Kerala
```

### Example 3: Luxury Trip
```
Plan a luxury 5-day trip to Jaipur for 2 people
```

### Example 4: Safety-Focused
```
Book a safe trip to Goa for solo female traveler
```

---

## Features to Explore

### Chat Assistant (Main Tab)
1. **Plan a trip** - Natural language input
2. **Review options** - Browse beautiful trip cards
3. **Book instantly** - One-click booking
4. **View itinerary** - See complete travel details
5. **Simulate events** - Try T-1 reminders or flight delays

### Analytics Dashboard (Second Tab)
- Real-time session tracking
- Trip creation metrics
- Booking conversion rates
- Escalation monitoring

---

## Keyboard Shortcuts

- **Enter** - Send message in chat
- Click bottom navigation tabs (mobile) or sidebar (desktop) to switch views

---

## What's Next?

After booking a trip, try:
1. Click **"Simulate T-1 Reminder"** to see pre-trip notifications
2. Click **"Simulate Flight Delay"** to see how the app handles disruptions
3. Switch to **Analytics** tab to see your activity metrics update in real-time

---

## Supported Destinations

- Goa
- Kerala
- Jaipur
- Dubai
- Bali
- Thailand

## Supported Budget Levels

- **Budget** - Affordable stays under ₹3,000/night
- **Mid-range** - Comfortable stays ₹3,000-6,000/night
- **Premium/Luxury** - High-end stays above ₹6,000/night

---

## Troubleshooting

### Port Already in Use?
Kill the process on port 3000 and restart:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then restart
npm run dev
```

### Dependencies Not Installing?
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors?
Check TypeScript compilation:
```bash
npx next build
```

---

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

---

## Have Fun! ✈️

Explore the agentic architecture, test the booking flow, and see how AI-powered travel planning works in a production-ready MVP!
