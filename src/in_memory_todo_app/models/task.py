import datetime

class Task:
    _next_id = 1

    def __init__(self, title: str, description: str = "", completed: bool = False):
        self.id = Task._next_id
        Task._next_id += 1
        self.title = title
        self.description = description
        self.completed = completed
        self.created_at = datetime.datetime.now(datetime.timezone.utc)

    def __repr__(self):
        return (
            f"Task(id={self.id}, title='{self.title}', description='{self.description}', "
            f"completed={self.completed}, created_at='{self.created_at.isoformat()}')"
        )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "created_at": self.created_at.isoformat(),
        }