from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime, timedelta
import uuid

class SubTask(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    completed: bool = False

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[Literal["Low", "Medium", "High"]] = "Medium"
    tags: List[str] = []

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    completed: bool = False
    subtasks: List[SubTask] = []
    created_at: datetime = Field(default_factory=datetime.now)
    priority_reasoning: Optional[str] = None

class PriorityResponse(BaseModel):
    priority: Literal["Low", "Medium", "High"]
    reasoning: str

class GamificationStats(BaseModel):
    level: int
    xp: int
    streak_days: int
    tasks_completed_today: int
    badges: List[str]

class TaskToggleResponse(BaseModel):
    task: Task
    achievement_update: Optional[str] = None
    xp_gained: int = 0
