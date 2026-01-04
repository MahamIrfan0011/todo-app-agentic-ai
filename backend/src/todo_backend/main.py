from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware # Import CORSMiddleware
from sqlmodel import Session, select, SQLModel
from contextlib import asynccontextmanager
from typing import List

from .database import create_db_and_tables, get_session
from .models import User, Task, TaskCreate, TaskUpdate

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Context manager for application startup and shutdown events."""
    print("Creating database tables...")
    create_db_and_tables()
    print("Database tables created.")
    yield

app = FastAPI(
    title="Todo Backend API",
    version="0.1.0",
    description="FastAPI backend for the Todo application with user authentication and task management.",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, adjust in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Todo Backend API!"}

# Create an API router for /api/v1
api_v1_router = APIRouter(prefix="/api/v1")

# Task CRUD operations
@api_v1_router.post("/tasks/", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_create: TaskCreate,
    session: Session = Depends(get_session)
):
    # Temporarily set owner_id to 1 or a default value for no-auth mode
    # In a real app, this would be handled by a logged-in user
    new_task = Task(title=task_create.title, description=task_create.description, owner_id=1) 
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    return new_task

@api_v1_router.get("/tasks/", response_model=List[Task])
async def read_tasks(
    session: Session = Depends(get_session)
):
    tasks = session.exec(select(Task)).all()
    return tasks

@api_v1_router.get("/tasks/{task_id}", response_model=Task)
async def read_task(
    task_id: int,
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@api_v1_router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.completed is not None:
        task.completed = task_update.completed
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@api_v1_router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    session.delete(task)
    session.commit()
    return

@api_v1_router.patch("/tasks/{task_id}/complete", response_model=Task)
async def mark_task_complete(
    task_id: int,
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    task.completed = True
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@api_v1_router.patch("/tasks/{task_id}/incomplete", response_model=Task)
async def mark_task_incomplete(
    task_id: int,
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    task.completed = False
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

# Include the API router
app.include_router(api_v1_router)
