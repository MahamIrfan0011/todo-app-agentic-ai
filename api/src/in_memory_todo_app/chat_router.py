from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict

from .services.task_manager import TaskManager
from .models.task import Task

# Pydantic model for incoming chat messages
class ChatMessage(BaseModel):
    message: str

router = APIRouter()

# Dependency to get TaskManager instance
def get_task_manager():
    return TaskManager()

@router.post("/chat")
async def chat_endpoint(chat_message: ChatMessage, task_manager: TaskManager = Depends(get_task_manager)):
    user_message = chat_message.message.lower().strip()
    reply = "Sorry, I didn't understand that command. Try 'add task: Buy groceries' or 'delete all tasks'."

    if user_message == "delete all tasks":
        tasks_before = task_manager.list_tasks()
        if not tasks_before:
            reply = "There are no tasks to clear."
        else:
            # Implement a method to delete all tasks in TaskManager
            # For now, let's assume a clear_all_tasks() method exists or will be added.
            # If TaskManager doesn't have it, we need to iterate and delete.
            for task in tasks_before:
                task_manager.delete_task(task.id)
            reply = "All tasks have been cleared."
    elif user_message.startswith("add task:"):
        task_title = user_message.replace("add task:", "", 1).strip()
        if task_title:
            new_task = task_manager.add_task(task_title, "")
            reply = f"Task '{new_task.title}' added."
        else:
            reply = "Please provide a task title to add."
    elif user_message.startswith("complete task:"):
        task_identifier = user_message.replace("complete task:", "", 1).strip()
        try:
            task_id = int(task_identifier)
            task = task_manager.get_task_by_id(task_id)
            if task:
                updated_task = task_manager.update_task(task.id, task.title, task.description, True)
                reply = f"Task '{updated_task.title}' (ID: {updated_task.id}) marked as completed."
            else:
                reply = f"Task with ID {task_id} not found."
        except ValueError:
            reply = "Please provide a valid task ID to complete. E.g., 'complete task: 1'."
    elif user_message.startswith("delete task:"):
        task_identifier = user_message.replace("delete task:", "", 1).strip()
        try:
            task_id = int(task_identifier)
            task = task_manager.get_task_by_id(task_id)
            if task:
                task_manager.delete_task(task_id)
                reply = f"Task '{task.title}' (ID: {task.id}) deleted."
            else:
                reply = f"Task with ID {task_id} not found."
        except ValueError:
            reply = "Please provide a valid task ID to delete. E.g., 'delete task: 1'."
    elif user_message == "list tasks":
        tasks = task_manager.list_tasks()
        if tasks:
            task_list_str = "
".join([f"- {t.title} (ID: {t.id}, Completed: {t.completed})" for t in tasks])
            reply = f"Here are your tasks:
{task_list_str}"
        else:
            reply = "You have no tasks."

    return {"reply": reply}
