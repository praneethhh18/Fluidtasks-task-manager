# FluidTasks

A productivity task management app with gamification features.

## Overview

FluidTasks is a full-stack application that helps users manage their tasks with an engaging gamification system. It includes features like task prioritization, subtask breakdowns, smart reminders, and progress tracking.

## Project Structure

- **frontend/**: React + Vite application
  - Uses Tailwind CSS for styling
  - Axios for API calls (proxied through Vite to backend)
  - Components: TaskBoard, Calendar, Reports, Gamification panels

- **backend/**: Python FastAPI application
  - In-memory task storage
  - RESTful API endpoints for task management
  - Gamification stats tracking

## Running the Application

The app runs with two workflows:
1. **Frontend**: React dev server on port 5000 (exposed to users)
2. **Backend API**: FastAPI server on port 8000 (internal, proxied via Vite)

## API Proxy

Frontend API calls to `/api/*` are proxied to the backend at `http://localhost:8000`.

## Recent Changes

- December 16, 2025: Initial Replit environment setup
  - Configured Vite to run on port 5000 with host 0.0.0.0
  - Added allowedHosts: true for Replit proxy compatibility
  - Set up API proxy in Vite config
  - Installed Node.js and Python dependencies
