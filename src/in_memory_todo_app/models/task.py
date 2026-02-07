from typing import Optional
from pydantic import BaseModel, Field
import datetime

class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: Optional[datetime.datetime] = None

    class Config:
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat()
        }
        # Allow population by field names (e.g. 'id') as well as aliases (e.g. 'task_id')
        # This is more relevant when using field aliases, but good practice.
        populate_by_name = True

    # This is an example of how you might handle default ID generation
    # within your application logic, not directly in the Pydantic model if it's an input model.
    # For a database model, the ID would typically be set by the DB.
    # For our in-memory TaskManager, we'll generate it there.

    # We remove the __init__ and _next_id logic from here,
    # as Pydantic's BaseModel handles initialization and validation.
    # The TaskManager will be responsible for setting `id` and `created_at`.