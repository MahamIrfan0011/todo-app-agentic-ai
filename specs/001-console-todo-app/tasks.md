---

description: "Task list for In-Memory Python Console Application"
---

# Tasks: In-Memory Python Console Application

**Input**: Design documents from `/specs/001-console-todo-app/`
**Prerequisites**: implementation-plan.md, spec.md, research.md, data-model.md

**Tests**: Unit tests are required as specified in `research.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Python project structure (`src/`, `tests/`)
- [ ] T002 Initialize Python project with `uv` (`pyproject.toml`)
- [ ] T003 [P] Configure `ruff` for linting in `pyproject.toml`
- [ ] T004 [P] Configure `black` for formatting in `pyproject.toml`
- [ ] T005 [P] Create `Task` class in `src/models/task.py` (based on `data-model.md`)
- [ ] T006 [P] Create in-memory `TaskManager` class in `src/services/task_manager.py` (initially empty methods for task operations)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Setup `pytest` for unit testing in `pyproject.toml`
- [ ] T008 Implement basic console input/output utility functions in `src/cli/utils.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Manage Todo Tasks in Console (Priority: P1) 🎯 MVP

**Goal**: Enable users to perform all basic CRUD operations on Todo tasks via the console.

**Independent Test**: The application can be run, and all listed features (Add, Delete, Update, View, Mark Complete/Incomplete) can be exercised via console input. The corresponding console output can be observed to verify correct behavior for each operation.

### Tests for User Story 1 (Using pytest) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] Write unit tests for `Task` class in `tests/unit/test_task.py`
- [ ] T010 [P] [US1] Write unit tests for `TaskManager` in `tests/unit/test_task_manager.py`

### Implementation for User Story 1

- [ ] T011 [US1] Implement "Add Task" logic in `src/services/task_manager.py`
- [ ] T012 [US1] Implement "View Task List" logic in `src/services/task_manager.py`
- [ ] T013 [US1] Implement "Update Task" logic in `src/services/task_manager.py`
- [ ] T014 [US1] Implement "Delete Task" logic in `src/services/task_manager.py`
- [ ] T015 [US1] Implement "Mark Task Complete/Incomplete" logic in `src/services/task_manager.py`
- [ ] T016 [US1] Create main CLI entry point in `src/cli/main.py`
- [ ] T017 [US1] Implement console UI for "Add Task" in `src/cli/main.py` (using `src/cli/utils.py`)
- [ ] T018 [US1] Implement console UI for "View Task List" in `src/cli/main.py` (using `src/cli/utils.py`)
- [ ] T019 [US1] Implement console UI for "Update Task" in `src/cli/main.py` (using `src/cli/utils.py`)
- [ ] T020 [US1] Implement console UI for "Delete Task" in `src/cli/main.py` (using `src/cli/utils.py`)
- [ ] T021 [US1] Implement console UI for "Mark Task Complete/Incomplete" in `src/cli/main.py` (using `src/cli/utils.py`)
- [ ] T022 [US1] Implement input validation logic for all console inputs in `src/cli/main.py` (using `src/cli/utils.py`)
- [ ] T023 [US1] Implement error handling and user-friendly console output in `src/cli/main.py`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T024 Create `README.md` for the console application.
- [ ] T025 Code cleanup and refactoring in `src/` for maintainability.
- [ ] T026 Run all unit tests and ensure 100% pass rate.
- [ ] T027 Validate overall CLI usability and user experience through manual testing.
- [ ] T028 Update AI instruction file for Gemini (equivalent to `CLAUDE.md` mentioned in Constitution)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Tests (T009, T010) MUST be written and FAIL before implementation (T011-T023)
- `Task` class (T005) before `TaskManager` (T006)
- `TaskManager` logic (T011-T015) before console UI integration (T016-T023)
- Console `utils` (T008) before console UI integration (T016-T023)

### Parallel Opportunities

- Tasks T003, T004, T005, T006 (Setup Phase) can run in parallel
- Tasks T009, T010 (Tests for US1) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)

### Parallel Team Strategy

Not applicable for a single-story MVP.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence