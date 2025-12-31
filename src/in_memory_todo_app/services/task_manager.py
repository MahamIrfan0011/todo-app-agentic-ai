from typing import List, Optional
from in_memory_todo_app.models.task import Task

class TaskManager:
    def __init__(self):
        self._tasks: List[Task] = []
        self._next_id = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """Adds a new task to the list."""
        if not title:
            raise ValueError("Task title cannot be empty.")
        task = Task(title, description)
        self._tasks.append(task)
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
            return task
        return None

    def delete_task(self, task_id: int) -> bool:
        """Deletes a task by its ID."""
        initial_len = len(self._tasks)
        self._tasks = [task for task in self._tasks if task.id != task_id]
        return len(self._tasks) < initial_len

    def mark_task_complete(self, task_id: int) -> Optional[Task]:
        """Marks a task as complete."""
        task = self.get_task_by_id(task_id)
        if task:
            task.completed = True
            return task
        return None

    def mark_task_incomplete(self, task_id: int) -> Optional[Task]:
        """Marks a task as incomplete."""
        task = self.get_task_by_id(task_id)
        if task:
            task.completed = False
            return task
        return None