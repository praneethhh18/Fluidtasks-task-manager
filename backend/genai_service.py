import random
from datetime import datetime

def generate_subtasks_heuristic(task_title: str) -> list[str]:
    """
    Heuristic rule-based subtask generation.
    Returns a list of 3-5 subtask titles.
    """
    title_lower = task_title.lower()
    
    if "study" in title_lower or "exam" in title_lower or "learn" in title_lower:
        return [
            "Review core concepts",
            "Practice practice problems",
            "Summarize notes",
            "Take a mock test"
        ]
    elif "buy" in title_lower or "shop" in title_lower or "grocery" in title_lower:
        return [
            "Check current inventory",
            "Make a shopping list",
            "Compare prices online",
            "Go to the store"
        ]
    elif "project" in title_lower or "code" in title_lower or "app" in title_lower:
        return [
            "Define requirements",
            "Set up development environment",
            "Create initial prototype",
            "Test and debug",
            "Deploy or share"
        ]
    elif "write" in title_lower or "essay" in title_lower or "blog" in title_lower:
        return [
            "Research topic",
            "Create an outline",
            "Draft the content",
            "Proofread and edit"
        ]
    else:
        # Fallback generic subtasks
        return [
            f"Prepare for {task_title}",
            "Execute main step",
            "Review and finalize"
        ]

def analyze_priority_heuristic(task_title: str, due_date: datetime = None) -> tuple[str, str]:
    """
    Heuristic priority analysis.
    Returns (Priority, Reasoning).
    """
    title_lower = task_title.lower()
    urgent_keywords = ["urgent", "asap", "deadline", "important", "exam", "client"]
    learning_keywords = ["study", "learn", "course"]
    
    # 1. Check Keywords
    if any(k in title_lower for k in urgent_keywords):
        return "High", "Marked High Priority because keywords indicate urgency or importance."
    
    # 2. Check Due Date
    if due_date:
        # Make comparison timezone-naive to avoid crashes
        due_date_naive = due_date.replace(tzinfo=None) if due_date.tzinfo else due_date
        now = datetime.now()
        diff = due_date_naive - now
        if diff.total_seconds() < 8 * 3600: # Less than 8 hours
            return "High", "Marked High Priority because the due date is very soon (within 8 hours)."
        elif diff.days < 3:
            return "Medium", "Marked Medium Priority because the due date is approaching."
    
    # 3. Content Analysis
    if any(k in title_lower for k in learning_keywords):
        return "Medium", "Marked Medium Priority to encourage consistent learning progress."
    
    return "Low", "Marked Low Priority as it appears to be a routine or non-urgent task."

def generate_reminder_heuristic(task_title: str, due_date: datetime) -> str:
    """
    Generates a friendly reminder message based on time remaining.
    """
    if not due_date:
        return f"Don't forget to work on '{task_title}' when you have a moment!"
        
    # Make comparison timezone-naive
    due_date_naive = due_date.replace(tzinfo=None) if due_date.tzinfo else due_date
    now = datetime.now()
    diff = due_date_naive - now
    minutes_left = int(diff.total_seconds() / 60)
    
    if minutes_left <= 15 and minutes_left > 0:
        return f"⏰ Reminder: You have {minutes_left} minutes left to finish '{task_title}'. A small push now can save stress later!"
    elif minutes_left <= 60 and minutes_left > 0:
        return f"⏳ Heads up: '{task_title}' is due in less than an hour. Good luck!"
    elif minutes_left < 0:
         return f"⚠️ The deadline for '{task_title}' has passed. Better late than never!"
    else:
        return f"📅 Upcoming: '{task_title}' is due on {due_date.strftime('%b %d, %I:%M %p')}."
