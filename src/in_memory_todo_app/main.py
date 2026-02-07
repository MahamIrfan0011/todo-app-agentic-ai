from fastapi import FastAPI
from .services.task_manager import TaskManager
from .models.task import Task
from typing import List, Dict

app = FastAPI()
task_manager = TaskManager()

@app.get("/")
async def read_root():
    return {"message": "Todo App Backend is running!"}

@app.post("/tasks/", response_model=Task)
async def create_task(task: Task):
    return task_manager.add_task(task.description)

@app.get("/tasks/", response_model=List[Task])
async def read_tasks():
    return task_manager.list_tasks()

@app.get("/tasks/{task_id}", response_model=Task)
async def read_task(task_id: int):
    task = task_manager.get_task(task_id)
    return task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task: Task):
    updated_task = task_manager.update_task(task_id, task.description, task.completed)
    return updated_task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    task_manager.delete_task(task_id)
    return {"message": f"Task {task_id} deleted"}
