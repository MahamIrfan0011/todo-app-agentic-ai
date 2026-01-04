from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware # Import CORSMiddleware
from sqlmodel import Session, select, SQLModel
from contextlib import asynccontextmanager
from typing import Annotated, List

from .database import create_db_and_tables, get_session
from .models import User, Task, TaskCreate, TaskUpdate
from .auth import create_access_token, get_password_hash, verify_password, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

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

# Pydantic model for token response
class Token(SQLModel):
    access_token: str
    token_type: str

# Pydantic model for user registration
class UserCreate(SQLModel):
    username: str
    password: str

@api_v1_router.post("/auth/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register_user(user_create: UserCreate, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == user_create.username)).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user_create.password)
    new_user = User(username=user_create.username, hashed_password=hashed_password)
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

@api_v1_router.post("/auth/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route to get current user
@api_v1_router.get("/users/me/", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user

# Task CRUD operations
@api_v1_router.post("/tasks/", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_create: TaskCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    new_task = Task(title=task_create.title, description=task_create.description, owner_id=current_user.id)
    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    return new_task

@api_v1_router.get("/tasks/", response_model=List[Task])
async def read_tasks(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    tasks = session.exec(select(Task).where(Task.owner_id == current_user.id)).all()
    return tasks

@api_v1_router.get("/tasks/{task_id}", response_model=Task)
async def read_task(
    task_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id, Task.owner_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@api_v1_router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id, Task.owner_id == current_user.id)).first()
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
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id, Task.owner_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    session.delete(task)
    session.commit()
    return

@api_v1_router.patch("/tasks/{task_id}/complete", response_model=Task)
async def mark_task_complete(
    task_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id, Task.owner_id == current_user.id)).first()
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
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id, Task.owner_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    task.completed = False
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

# Include the API router
app.include_router(api_v1_router)
