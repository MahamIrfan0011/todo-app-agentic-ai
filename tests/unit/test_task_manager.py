import pytest
from in_memory_todo_app.services.task_manager import TaskManager
from in_memory_todo_app.models.task import Task
from typing import List, Optional

# Reset Task._next_id for consistent test IDs
@pytest.fixture(autouse=True)
def reset_task_id_counter():
    original_next_id = Task._next_id
    Task._next_id = 1
    yield
    Task._next_id = original_next_id

@pytest.fixture
def task_manager():
    return TaskManager()

def test_add_task(task_manager):
    task = task_manager.add_task("Buy groceries")
    assert task.title == "Buy groceries"
    assert len(task_manager.list_tasks()) == 1
    assert task_manager.get_task_by_id(task.id) == task

def test_add_task_with_description(task_manager):
    task = task_manager.add_task("Buy groceries", "Milk, eggs, bread")
    assert task.description == "Milk, eggs, bread"

def test_add_task_empty_title_raises_error(task_manager):
    with pytest.raises(ValueError, match="Task title cannot be empty."):
        task_manager.add_task("")

def test_get_task_by_id(task_manager):
    task1 = task_manager.add_task("Task 1")
    task2 = task_manager.add_task("Task 2")
    
    retrieved_task = task_manager.get_task_by_id(task1.id)
    assert retrieved_task == task1
    assert retrieved_task.title == "Task 1"

def test_get_task_by_id_not_found(task_manager):
    task_manager.add_task("Task 1")
    assert task_manager.get_task_by_id(999) is None

def test_list_tasks_empty(task_manager):
    tasks = task_manager.list_tasks()
    assert len(tasks) == 0

def test_list_tasks_multiple(task_manager):
    task_manager.add_task("Task 1")
    task_manager.add_task("Task 2")
    tasks = task_manager.list_tasks()
    assert len(tasks) == 2
    assert tasks[0].title == "Task 1"
    assert tasks[1].title == "Task 2"

def test_update_task_title(task_manager):
    task = task_manager.add_task("Old Title")
    updated_task = task_manager.update_task(task.id, title="New Title")
    assert updated_task.title == "New Title"
    assert task_manager.get_task_by_id(task.id).title == "New Title"

def test_update_task_description(task_manager):
    task = task_manager.add_task("Task", description="Old Desc")
    updated_task = task_manager.update_task(task.id, description="New Desc")
    assert updated_task.description == "New Desc"

def test_update_task_completed_status(task_manager):
    task = task_manager.add_task("Task")
    updated_task = task_manager.update_task(task.id, completed=True)
    assert updated_task.completed is True
    assert task_manager.get_task_by_id(task.id).completed is True

    updated_task = task_manager.update_task(task.id, completed=False)
    assert updated_task.completed is False
    assert task_manager.get_task_by_id(task.id).completed is False

def test_update_task_multiple_fields(task_manager):
    task = task_manager.add_task("T1", "D1")
    updated_task = task_manager.update_task(task.id, title="T2", description="D2", completed=True)
    assert updated_task.title == "T2"
    assert updated_task.description == "D2"
    assert updated_task.completed is True

def test_update_task_not_found(task_manager):
    task_manager.add_task("Task 1")
    assert task_manager.update_task(999, title="Non-existent") is None

def test_update_task_empty_title_raises_error(task_manager):
    task = task_manager.add_task("Original Title")
    with pytest.raises(ValueError, match="Task title cannot be empty."):
        task_manager.update_task(task.id, title="")
    # Ensure task title was not changed
    assert task_manager.get_task_by_id(task.id).title == "Original Title"

def test_delete_task(task_manager):
    task1 = task_manager.add_task("Task 1")
    task_manager.add_task("Task 2")
    
    deleted = task_manager.delete_task(task1.id)
    assert deleted is True
    assert len(task_manager.list_tasks()) == 1
    assert task_manager.get_task_by_id(task1.id) is None

def test_delete_task_not_found(task_manager):
    task_manager.add_task("Task 1")
    deleted = task_manager.delete_task(999)
    assert deleted is False
    assert len(task_manager.list_tasks()) == 1

def test_mark_task_complete(task_manager):
    task = task_manager.add_task("Task")
    marked_task = task_manager.mark_task_complete(task.id)
    assert marked_task.completed is True
    assert task_manager.get_task_by_id(task.id).completed is True

def test_mark_task_complete_not_found(task_manager):
    task_manager.add_task("Task")
    assert task_manager.mark_task_complete(999) is None

def test_mark_task_incomplete(task_manager):
    task = task_manager.add_task("Task")
    task.completed = True # Manually set to True for this test scenario
    marked_task = task_manager.mark_task_incomplete(task.id)
    assert marked_task.completed is False
    assert task_manager.get_task_by_id(task.id).completed is False

def test_mark_task_incomplete_not_found(task_manager):
    task_manager.add_task("Task")
    assert task_manager.mark_task_incomplete(999) is None
