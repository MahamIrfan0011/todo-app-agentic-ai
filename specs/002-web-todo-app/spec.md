# Phase II: Full-Stack Web Application Specification

## 1. Objective

Transform the existing in-memory console Todo application into a multi-user web application with persistent storage, user authentication, and a responsive frontend.

## 2. Features

### 2.1 Task Management
- **Add Task:** Authenticated users can create new tasks with a title and optional description.
- **View Tasks:** Authenticated users can view a list of their tasks. Tasks should be isolated per user.
- **Update Task:** Authenticated users can modify the title, description, and completion status of their tasks.
- **Delete Task:** Authenticated users can delete their tasks.
- **Mark Task Complete/Incomplete:** Authenticated users can toggle the completion status of their tasks.

### 2.2 User Authentication & Authorization
- **User Registration:** Allow new users to create an account.
- **User Login:** Allow registered users to log in and obtain a JWT token.
- **Authenticated Access:** All task management operations (CRUD) require a valid JWT token.
- **Per-User Task Isolation:** Users can only access, modify, or delete their own tasks.

### 2.3 Responsive Frontend UI
- A web interface for user registration and login.
- A dashboard or page to display the user's tasks.
- Forms/modals for adding and updating tasks.
- UI elements to mark tasks as complete/incomplete and delete tasks.
- Clear feedback messages for user actions (success, error, loading).

## 3. Technology Stack

- **Frontend:** Next.js (App Router)
- **Backend:** FastAPI
- **ORM:** SQLModel
- **Database:** Neon Serverless PostgreSQL
- **Authentication:** Better Auth (JWT-based)
- **AI:** Gemini + Spec-Kit Plus

## 4. API Endpoints (Backend - FastAPI)

### 4.1 Authentication
- `POST /auth/register`:
    - **Request:** `{"username": "string", "password": "string"}`
    - **Response:** `{"message": "User registered successfully"}` or `{"detail": "Username already registered"}`
- `POST /auth/login`:
    - **Request:** `{"username": "string", "password": "string"}`
    - **Response:** `{"access_token": "string", "token_type": "bearer"}` or `{"detail": "Incorrect username or password"}`

### 4.2 Task Management (Requires Authentication)
- `POST /tasks/`:
    - **Request:** `{"title": "string", "description": "string (optional)"}`
    - **Response:** `{"id": int, "title": "string", "description": "string", "completed": bool, "created_at": "datetime_iso"}`
- `GET /tasks/`:
    - **Request:** (Authenticated, no body)
    - **Response:** `[{"id": int, "title": "string", "description": "string", "completed": bool, "created_at": "datetime_iso"}, ...]`
- `GET /tasks/{task_id}`:
    - **Request:** (Authenticated)
    - **Response:** `{"id": int, "title": "string", "description": "string", "completed": bool, "created_at": "datetime_iso"}` or `{"detail": "Task not found"}`
- `PUT /tasks/{task_id}`:
    - **Request:** `{"title": "string (optional)", "description": "string (optional)", "completed": bool (optional)}`
    - **Response:** `{"id": int, "title": "string", "description": "string", "completed": bool, "created_at": "datetime_iso"}` or `{"detail": "Task not found"}`
- `DELETE /tasks/{task_id}`:
    - **Request:** (Authenticated)
    - **Response:** `{"message": "Task deleted successfully"}` or `{"detail": "Task not found"}`
- `PATCH /tasks/{task_id}/complete`:
    - **Request:** (Authenticated, no body)
    - **Response:** `{"id": int, "title": "string", "description": "string", "completed": true, "created_at": "datetime_iso"}` or `{"detail": "Task not found"}`
- `PATCH /tasks/{task_id}/incomplete`:
    - **Request:** (Authenticated, no body)
    - **Response:** `{"id": int, "title": "string", "description": "string", "completed": false, "created_at": "datetime_iso"}` or `{"detail": "Task not found"}`

## 5. Data Models (SQLModel)

### 5.1 User Model
- `id: int` (Primary Key, auto-increment)
- `username: str` (Unique)
- `hashed_password: str`
- `tasks: List[Task]` (Relationship)

### 5.2 Task Model
- `id: int` (Primary Key, auto-increment)
- `title: str`
- `description: str` (Optional)
- `completed: bool` (Default: False)
- `created_at: datetime` (Default: current UTC time)
- `owner_id: int` (Foreign Key to User.id)
- `owner: User` (Relationship)

## 6. Frontend UI Components (Next.js)

- **Layout:** Standard header (app title, user info, logout button), main content area.
- **Auth Forms:**
    - Login form (username, password, submit button).
    - Registration form (username, password, submit button).
- **Task List:**
    - Displays user-specific tasks with title, description, completion status.
    - Button to add new task.
    - Actions per task: toggle complete, edit, delete.
- **Task Form (Add/Edit):**
    - Input fields for title and description.
    - Checkbox for completion status (for edit).
    - Submit/Cancel buttons.
- **Global State Management:** For user authentication status and task list.

## 7. Architectural Rules Adherence

- **JWT Security:** All backend task endpoints will require a valid JWT in the `Authorization: Bearer <token>` header.
- **User Identity Validation:** The backend will extract user ID from the JWT to ensure task ownership.
- **Data Filtering:** All task queries will automatically filter results based on the authenticated user's ID.

