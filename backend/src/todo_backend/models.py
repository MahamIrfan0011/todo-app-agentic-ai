from typing import List, Optional
from datetime import datetime, timezone
from sqlmodel import Field, Relationship, SQLModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str

    tasks: List["Task"] = Relationship(back_populates="owner")

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True, min_length=1) # Added min_length validation
    description: Optional[str] = None
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    owner: Optional[User] = Relationship(back_populates="tasks")

# Pydantic Schemas for Task operations (SQLModel models can be used directly)
class TaskCreate(SQLModel):
    title: str = Field(min_length=1)
    description: Optional[str] = None

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = None
    completed: Optional[bool] = None

# Example for creating tables - this will be handled in database.py
if __name__ == "__main__":
    print("SQLModel definitions for User and Task created.")
