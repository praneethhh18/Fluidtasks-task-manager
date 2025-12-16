from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import uvicorn
from contextlib import asynccontextmanager
from datetime import datetime, date, timedelta

from models import Task, TaskCreate, SubTask, PriorityResponse, GamificationStats, TaskToggleResponse
import genai_service

# --- In-Memory Storage ---
TASKS: Dict[str, Task] = {}
STATS = GamificationStats(level=1, xp=0, streak_days=0, tasks_completed_today=0, badges=[])
# Mock simple persistence for demo continuity if server restarts (optional, but skipping for pure in-memory speed)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Pre-populate some data for demo purposes
    demo_task = Task(title="Explore FluidTasks App", priority="High", priority_reasoning="Welcome to your new productivity tool!", due_date=None)
    TASKS[demo_task.id] = demo_task
    yield
    # Shutdown

app = FastAPI(title="FluidTasks API", description="Backend for FluidTasks Productivity App", lifespan=lifespan)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes ---

@app.get("/")
def read_root():
    return {"message": "FluidTasks API is running 🚀"}

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return list(TASKS.values())

@app.post("/tasks", response_model=Task)
def create_task(task_in: TaskCreate):
    # Auto-detect priority if not set or default
    priority, reasoning = genai_service.analyze_priority_heuristic(task_in.title, task_in.due_date)
    
    task_data = task_in.dict()
    task_data["priority"] = priority
    task_data["priority_reasoning"] = reasoning
    
    new_task = Task(**task_data)
    TASKS[new_task.id] = new_task
    return new_task

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    return TASKS[task_id]

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_update: TaskCreate):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update fields provided
    existing_task = TASKS[task_id]
    updated_data = task_update.dict(exclude_unset=True)
    
    # If title changed, maybe re-check priority? Keeping it simple for now.
    
    updated_task = existing_task.copy(update=updated_data)
    TASKS[task_id] = updated_task
    return updated_task

@app.put("/tasks/{task_id}/toggle", response_model=TaskToggleResponse)
def toggle_task_complete(task_id: str):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = TASKS[task_id]
    task.completed = not task.completed
    
    xp_gained = 0
    achievement_msg = None

    # Gamification Logic
    if task.completed:
        xp_gained = 10
        STATS.xp += xp_gained
        STATS.tasks_completed_today += 1
        
        # Simple level up logic
        if STATS.xp >= STATS.level * 100:
            STATS.level += 1
            STATS.badges.append(f"Level {STATS.level}")
            achievement_msg = f"Level Up! You reached Level {STATS.level} 🏆"
            
    TASKS[task_id] = task
    return TaskToggleResponse(task=task, achievement_update=achievement_msg, xp_gained=xp_gained)

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    del TASKS[task_id]
    return {"message": "Task deleted"}

# --- GenAI Feature Routes ---

@app.post("/tasks/{task_id}/breakdown", response_model=List[SubTask])
def generate_breakdown(task_id: str):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = TASKS[task_id]
    # Check if subtasks already exist to avoid overwriting manually added ones? 
    # For now, just append or return generated ones.
    
    subtask_titles = genai_service.generate_subtasks_heuristic(task.title)
    new_subtasks = [SubTask(title=t) for t in subtask_titles]
    
    task.subtasks.extend(new_subtasks)
    TASKS[task_id] = task
    return task.subtasks

@app.get("/tasks/{task_id}/reminder")
def get_smart_reminder(task_id: str):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = TASKS[task_id]
    if not task.due_date:
         return {"message": "No due date set for this task."}
         
    message = genai_service.generate_reminder_heuristic(task.title, task.due_date)
    return {"message": message}

# --- Gamification & Reports ---

@app.get("/gamification/stats", response_model=GamificationStats)
def get_gamification_stats():
    return STATS

@app.get("/reports/weekly")
def get_weekly_report():
    # Mock data for the chart
    # Aggregate data from TASKS
    today = date.today()
    timeline = { (today - timedelta(days=i)).strftime("%a"): {"completed": 0, "pending": 0} for i in range(6, -1, -1) }
    
    for task in TASKS.values():
        t_date = task.created_at.date() if task.created_at else today # Fallback
        # Only count if within last 7 days
        diff = (today - t_date).days
        if 0 <= diff <= 6:
            day_label = t_date.strftime("%a")
            if task.completed:
                timeline[day_label]["completed"] += 1
            else:
                timeline[day_label]["pending"] += 1
                
    # Format for frontend
    return {
        "labels": list(timeline.keys()),
        "completed": [d["completed"] for d in timeline.values()],
        "pending": [d["pending"] for d in timeline.values()],
        "total": len(TASKS),
        "total_completed": sum(1 for t in TASKS.values() if t.completed)
    }
import random  # Needed for mock report

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
