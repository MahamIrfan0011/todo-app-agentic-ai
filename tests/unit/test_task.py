from in_memory_todo_app.models.task import Task
import datetime

def test_task_creation():
    task = Task("Buy groceries", "Milk, eggs, bread")
    assert task.id is not None
    assert task.title == "Buy groceries"
    assert task.description == "Milk, eggs, bread"
    assert task.completed is False
    assert isinstance(task.created_at, datetime.datetime)

def test_task_creation_defaults():
    task = Task("Read a book")
    assert task.title == "Read a book"
    assert task.description == ""
    assert task.completed is False

def test_task_to_dict():
    task = Task("Walk the dog", completed=True)
    task_dict = task.to_dict()
    assert task_dict["id"] == task.id
    assert task_dict["title"] == "Walk the dog"
    assert task_dict["description"] == ""
    assert task_dict["completed"] is True
    assert isinstance(task_dict["created_at"], str) # Should be ISO format string

def test_task_id_auto_increment():
    # Reset _next_id for isolated test
    original_next_id = Task._next_id
    Task._next_id = 1
    
    task1 = Task("Task 1")
    task2 = Task("Task 2")
    assert task1.id == 1
    assert task2.id == 2
    
    Task._next_id = original_next_id # Restore original

def test_task_repr():
    task = Task("Test Repr", "Description Repr")
    assert f"Task(id={task.id}, title='Test Repr', description='Description Repr', completed=False, created_at='{task.created_at.isoformat()}')" == repr(task)
