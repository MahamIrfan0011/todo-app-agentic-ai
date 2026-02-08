from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import sys
from dotenv import load_dotenv

# Get the directory of the current script (main.py)
current_script_dir = os.path.dirname(os.path.abspath(__file__))
# Navigate up two directories to reach the project root
project_root = os.path.abspath(os.path.join(current_script_dir, '..', '..'))
# Construct the path to the .env file
dotenv_path = os.path.join(project_root, '.env')

load_dotenv(dotenv_path=dotenv_path) # Load environment variables from .env file

from .services.task_manager import TaskManager
from .models.task import Task
from typing import List, Dict

app = FastAPI()

origins = [
    "http://localhost:3000", # Allow frontend development server
    "https://maham001-backend.hf.space" # Allow self for potential redirects/internal calls if necessary.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

task_manager = TaskManager()

@app.get("/")
async def read_root():
    return {"message": "Todo App Backend is running!"}

@app.post("/tasks/", response_model=Task)
async def create_task(task: Task):
    return task_manager.add_task(task.title, task.description)

@app.get("/tasks/", response_model=List[Task])
async def read_tasks():
    return task_manager.list_tasks()

@app.get("/tasks/{task_id}", response_model=Task)
async def read_task(task_id: int):
    task = task_manager.get_task_by_id(task_id)
    return task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task: Task):
    updated_task = task_manager.update_task(task_id, task.title, task.description, task.completed)
    return updated_task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    task_manager.delete_task(task_id)
    return {"message": f"Task {task_id} deleted"}
