# FluidTasks - Intelligent Task Management 

FluidTasks is a modern, full-stack productivity application built to demonstrate clean architecture, premium UI, and GenAI-inspired features. It combines a robust **FastAPI** backend with a polished **React** frontend.

## Key Features

### Visual & UX Excellence
- **Premium Glassmorphism Design**: Modern, translucent UI components with subtle gradients.
- **Dark Mode Support**: Fully responsive dark/light theme switching.
- **Interactive Onboarding**: A dedicated welcome flow to capture user details (Name, Gender, Interests) and personalize the experience.
- **Smooth Animations**: Powered by Framer Motion for delightful interactions (entry, exit, hover).

### Core Productivity
- **Task Board**: 
  - Add tasks with "Smart Priority" analysis.
  - Mark as complete with satisfying animations.
  - **Instant Delete**: One-click deletion with undo-ready architecture.
  - **Filtering**: Search by text or filter by tags.
- **Workplace Dock**: 
  - A collapsible, Mac-style dock for quick access to tools (Gmail, Notion, etc.).
  - **Customizable**: Add your own app shortcuts with auto-fetched favicons.
- **Edit Profile**: Update your persona and interests anytime from the sidebar.

### Gamification
- **XP System**: Earn XP for every task completed.
- **Level Up**: Visual notifications and sound effects when you level up.
- **Streak Counter**: Tracks your daily activity.

### GenAI-Inspired Logic (Prototype)
- **Automatic Priority**: The backend heuristically assigns High/Medium/Low priority based on keywords (e.g., "urgent", "deadline").
- **Task Breakdown**: "Break Down" button to split complex tasks into actionable steps.
- **Smart Reminders**: Context-aware messages based on due dates.

## Tech Stack

### Backend (Python FastAPI)
- **FastAPI**: For high-performance, easy-to-read API endpoints.
- **Pydantic**: For robust data validation.
- **In-Memory Storage**: Python dictionaries for fast, runtime-persistence (resets on restart).

### Frontend (React Ecosystem)
- **Vite**: For lightning-fast development.
- **Tailwind CSS**: For utility-first, responsive styling.
- **Framer Motion**: For complex animations.
- **Lucide React**: For beautiful, consistent iconography.

Folder Structure

```text
fluid-tasks/
├── backend/                  # Python FastAPI Backend
│   ├── main.py              # Main application entry point & API routes
│   ├── models.py            # Pydantic data models (Task, SubTask, etc.)
│   ├── genai_service.py     # Logic for "AI" heuristic features
│   └── requirements.txt     # Python dependencies
│
└── frontend/                 # React Frontend
    ├── src/
    │   ├── components/       # UI Components
    │   │   ├── TaskBoard.jsx        # Main Dashboard
    │   │   ├── TaskCard.jsx         # Individual Task Item
    │   │   ├── Sidebar.jsx          # Navigation & Profile
    │   │   ├── WorkplaceSection.jsx # App Dock (Gmail, etc.)
    │   │   ├── Onboarding.jsx       # Welcome Flow
    │   │   ├── ... (Other views)
    │   ├── lib/
    │   │   └── utils.js             # Tailwind class merger
    │   ├── App.jsx           # Main Routing Logic
    │   ├── main.jsx          # React Entry Point
    │   └── api.js            # Axios Setup
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js

## How to Run

### 1. Backend
```bash
cd fluid-tasks/backend
pip install -r requirements.txt
python main.py
```
*Server runs at: `http://localhost:8000`*

### 2. Frontend
```bash
cd fluid-tasks/frontend
npm install
npm run dev
```
*App runs at: `http://localhost:5173` (or similar port)*

---
*Built as a showcase of Full-Stack Python + React capabilities.*

## Future Enhancements

- **LLM Integration for Task Intelligence**  
  Replace rule-based heuristics with large language models to generate richer task breakdowns, improved priority reasoning, and context-aware productivity suggestions.

- **User Authentication & Persistent Storage**  
  Add secure authentication and database-backed storage to persist tasks, user progress, and preferences across sessions and devices.

- **Advanced Notification System**  
  Enable background reminders through email or push notifications so users are notified even when the application is not actively open.

- **Collaborative Task Management**  
  Support shared tasks, comments, and real-time updates to enable team-based workflows.

- **Personalized Productivity Insights**  
  Use historical task data to provide AI-driven focus recommendations and weekly productivity summaries.

- **Mobile-First & Offline Support**  
  Improve mobile responsiveness and add offline-first capabilities with background synchronization.

- **Third-Party Integrations**  
  Integrate with tools such as Google Calendar, Slack, or Notion for seamless task synchronization.

- **Role-Based Dashboards & Analytics**  
  Introduce role-based views for individuals and teams, along with advanced productivity analytics.
