# Data Model: In-Memory Python Console Application

**Feature Branch**: `001-console-todo-app`  
**Date**: 2025-12-31  
**Spec**: [specs/001-console-todo-app/spec.md]
**Plan**: [specs/001-console-todo-app/plan.md]

## Entities

### Task

**Description**: Represents a single todo item managed by the console application. This entity will be stored and manipulated in-memory.

**Attributes**:

-   **`id`**:
    -   **Type**: Integer
    -   **Constraints**: Auto-incremented, unique identifier. Assigned upon creation.
    -   **Purpose**: Used for identifying, updating, and deleting specific tasks.

-   **`title`**:
    -   **Type**: String
    -   **Constraints**: Required. Must not be empty.
    -   **Purpose**: A brief, descriptive name for the todo item.

-   **`description`**:
    -   **Type**: String
    -   **Constraints**: Optional. Can be empty.
    -   **Purpose**: Provides additional details or context for the todo item.

-   **`completed`**:
    -   **Type**: Boolean
    -   **Constraints**: Defaults to `false` upon creation.
    -   **Purpose**: Indicates whether the todo item has been completed.

-   **`created_at`**:
    -   **Type**: Timestamp (e.g., datetime object)
    -   **Constraints**: Automatically set upon task creation.
    -   **Purpose**: Records when the task was added to the list.

## Relationships

-   No explicit relationships between entities in Phase I (single `Task` entity).

## Example Data Structure (Conceptual)

A list of `Task` objects in Python:

```python
[
    Task(id=1, title="Buy groceries", description="Milk, eggs, bread", completed=False, created_at="2025-12-31T10:00:00Z"),
    Task(id=2, title="Walk the dog", description="", completed=True, created_at="2025-12-31T09:30:00Z"),
    # ... more Task objects
]
```
