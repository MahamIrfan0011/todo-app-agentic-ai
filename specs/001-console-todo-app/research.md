# Research Findings: In-Memory Python Console Application

**Feature Branch**: `001-console-todo-app`  
**Date**: 2025-12-31  
**Plan**: [specs/001-console-todo-app/plan.md]

## Research Questions & Decisions

### 1. What specific Python CLI framework should be used for user interaction?

**Decision**: Use Python's built-in `input()` and `print()` for console interaction.

**Rationale**:
-   **Simplicity**: For a foundational console application, `input()` and `print()` are the most straightforward and direct methods for user interaction.
-   **No External Dependencies**: This approach avoids introducing external libraries like `click` or `argparse` in Phase I, keeping the project minimal and focused on core logic. This aligns with the "minimal viable product" and "controlled scope expansion" principles.
-   **Alignment with Foundational Phase**: Suitable for establishing basic functionality without unnecessary overhead.

**Alternatives Considered**:
-   `click`: Offers powerful CLI creation, but is an external dependency not needed at this stage.
-   `argparse`: Standard for command-line argument parsing, but overkill for simple interactive menu.

---

### 2. What is the preferred approach for handling in-memory data structures for a todo list?

**Decision**: Use a list of custom `Task` class instances to store todo items in memory.

**Rationale**:
-   **Encapsulation**: A `Task` class provides better encapsulation of task attributes (`id`, `title`, `description`, `completed`, `created_at`) and can include methods for task-specific logic (e.g., `mark_complete()`).
-   **Type Hinting & Readability**: Improves code readability and allows for better type hinting, which enhances maintainability and reduces errors.
-   **Maintainability**: Easier to manage and extend properties of tasks compared to manipulating raw dictionaries.
-   **Scalability for Future Phases**: While simple for in-memory, this object-oriented approach lays a better foundation for persistence or more complex operations in later phases.

**Alternatives Considered**:
-   **List of dictionaries**: Simpler for very small projects, but lacks type safety and encapsulation benefits.
-   **Simple dictionary mapping IDs to tasks**: Useful for quick lookups by ID, but a `list` allows for easier iteration and maintains order if needed, while still being able to implement ID-based access logic within the application.

---

### 3. What Python testing framework will be used for unit tests?

**Decision**: Use `pytest` as the Python testing framework for unit tests.

**Rationale**:
-   **Modern and Feature-Rich**: `pytest` offers a more modern and Pythonic way to write tests compared to `unittest`, with powerful features like fixtures, parametrization, and custom assertions.
-   **Simpler Syntax**: Tests often require less boilerplate code, making them quicker to write and easier to read.
-   **Widespread Adoption**: `pytest` is widely adopted in the Python community, providing access to a rich ecosystem of plugins and community support.
-   **Improved Developer Experience**: Contributes to a more efficient and enjoyable testing workflow.

**Alternatives Considered**:
-   `unittest`: Python's built-in testing framework. While functional, it often requires more boilerplate and can be less ergonomic for complex test setups than `pytest`.
