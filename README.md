# ZenScore AI — Frontend

Your Complete AI-Powered Student Ecosystem

## Tech Stack
- React 18 + Vite
- React Router v6
- Firebase Auth (Google Login)
- Tailwind CSS

## Setup

```bash
npm install
```

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
VITE_YOUTUBE_API_KEY=your_youtube_key
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
npm run dev
```

## Pages
- `/` — Home/Landing
- `/dashboard` — Student Dashboard
- `/academics` — CGPA Tracker + Resources
- `/careers` — Career Paths
- `/skills` — Skill Tracker
- `/jobs` — Job Listings
- `/productivity` — Productivity Tools
- `/courses` — Course Library
- `/ai-tutor` — AI Tutor (Groq/Llama)
- `/profile` — User Profile