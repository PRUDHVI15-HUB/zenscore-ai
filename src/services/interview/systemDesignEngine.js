/**
 * systemDesignEngine.js
 * System Design Engine for ZenScore AI (Product 6 - Sprint D).
 * Defines canonical HLD and LLD problems, architectural components, and evaluation parameters.
 */

export const SYSTEM_DESIGN_PROBLEMS = {
  HLD: [
    { id: 'hld_yt', title: 'Design YouTube Video Streaming Platform', company: 'Google', difficulty: 'Hard' },
    { id: 'hld_wa', title: 'Design WhatsApp Real-time Chat Architecture', company: 'Meta', difficulty: 'Hard' },
    { id: 'hld_ub', title: 'Design Uber Ride Matching Engine', company: 'Uber', difficulty: 'Hard' },
    { id: 'hld_url', title: 'Design High-Scale URL Shortener (TinyURL)', company: 'Amazon', difficulty: 'Medium' },
  ],
  LLD: [
    { id: 'lld_park', title: 'Design Parking Lot System (Object Oriented)', company: 'Amazon', difficulty: 'Medium' },
    { id: 'lld_food', title: 'Design Swiggy / Zomato Food Order Dispatch', company: 'Swiggy', difficulty: 'Medium' },
    { id: 'lld_book', title: 'Design Hotel Booking & Reservation Engine', company: 'Atlassian', difficulty: 'Medium' },
  ],
}

export function getSystemDesignProblems(type = 'HLD') {
  return SYSTEM_DESIGN_PROBLEMS[type] || SYSTEM_DESIGN_PROBLEMS['HLD']
}
