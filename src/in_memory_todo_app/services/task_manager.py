import datetime
import json
import os
from typing import List, Optional
from ..models.task import Task

TASK_FILE = os.getenv("TASK_FILE_PATH", "tasks.json") # Define the file where tasks will be stored

class TaskManager:
    def __init__(self):
        self._tasks: List[Task] = []
        self._next_id = 1
        self._load_tasks() # Load tasks from file on initialization

    def _load_tasks(self):
        """Loads tasks from the TASK_FILE."""
        print(f"DEBUG: Attempting to load tasks from {TASK_FILE}")
        if os.path.exists(TASK_FILE):
            try:
                with open(TASK_FILE, 'r') as f:
                    tasks_data = json.load(f)
                    self._tasks = [Task(**task_data) for task_data in tasks_data]
                if self._tasks:
                    self._next_id = max(task.id for task in self._tasks if task.id is not None) + 1
                    print(f"DEBUG: Loaded {len(self._tasks)} tasks. Next ID: {self._next_id}")
                else:
                    self._next_id = 1
                    print("DEBUG: Task file exists but is empty. Next ID: 1")
            except json.JSONDecodeError as e:
                print(f"ERROR: JSONDecodeError loading tasks from {TASK_FILE}: {e}")
                self._tasks = []
                self._next_id = 1
            except Exception as e:
                print(f"ERROR: Unexpected error loading tasks: {e}")
                self._tasks = []
                self._next_id = 1
        else:
            print(f"DEBUG: Task file {TASK_FILE} not found. Starting with empty tasks.")
            self._tasks = []
            self._next_id = 1

    def _save_tasks(self):
        """Saves current tasks to the TASK_FILE."""
        try:
            # Ensure the directory exists before writing
            os.makedirs(os.path.dirname(TASK_FILE), exist_ok=True)
            with open(TASK_FILE, 'w') as f:
                json.dump([task.model_dump() for task in self._tasks], f, indent=4)
            print(f"DEBUG: Saved {len(self._tasks)} tasks to {TASK_FILE}")
        except Exception as e:
            print(f"ERROR: Failed to save tasks to {TASK_FILE}: {e}")

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        """Adds a new task to the list."""
        if not title:
            raise ValueError("Task title cannot be empty.")
        task = Task(id=self._next_id, title=title, description=description, created_at=datetime.datetime.now(datetime.timezone.utc))
        self._tasks.append(task)
        self._next_id += 1 # Increment _next_id after assigning it
        self._save_tasks() # Save tasks after adding
        return task

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """Retrieves a task by its ID."""
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None

    def list_tasks(self) -> List[Task]:
        """Returns all tasks."""
        return self._tasks

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None, completed: Optional[bool] = None) -> Optional[Task]:
        """Updates an existing task."""
        task = self.get_task_by_id(task_id)
        if task:
            if title is not None:
                if not title:
                    raise ValueError("Task title cannot be empty.")
                task.title = title
            if description is not None:
                task.description = description
            if completed is not None:
                task.completed = completed
            self._save_tasks() # Save tasks after updating
            return task
        return None

    def delete_task(self, task_id: int) -> bool:
        """Deletes a task by its ID."""
        initial_len = len(self._tasks)
        self._tasks = [task for task in self._tasks if task.id != task_id]
        if len(self._tasks) < initial_len:
            self._save_tasks() # Save tasks after deleting
            return True
        return False

    def mark_task_complete(self, task_id: int) -> Optional[Task]:
        """Marks a task as complete."""
        task = self.get_task_by_id(task_id)
        if task:
            task.completed = True
            self._save_tasks() # Save tasks after marking complete
            return task
        return None

    def mark_task_incomplete(self, task_id: int) -> Optional[Task]:
        """Marks a task as incomplete."""
        task = self.get_task_by_id(task_id)
        if task:
            task.completed = False
            self._save_tasks() # Save tasks after marking incomplete
            return task
        return None