from typing import Optional
from pydantic import BaseModel, Field
import datetime

class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: Optional[datetime.datetime] = None # It will be set by TaskManager

    class Config:
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat()
        }
        populate_by_name = True