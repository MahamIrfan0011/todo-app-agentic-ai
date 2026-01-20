# Tasks: AI-Powered Todo Chatbot

**Input**: Design documents from `specs/003-ai-chatbot/`
**Prerequisites**: `plan.md`, `spec.md`

## Phase 1: Backend API for Chat

**Goal**: Create the API endpoint that will receive user messages and return agent responses.

- [ ] **T001**: Create the file `frontend/app/api/chat/route.ts`.
- [ ] **T002**: In `route.ts`, implement a `POST` request handler that receives a JSON object with a "message" field.
- [ ] **T003**: Implement basic agent logic inside the `POST` handler to parse the message. For now, it will be a placeholder that echoes the message back.
- [ ] **T004**: Ensure the `POST` handler returns a JSON response containing the agent's reply.

---

## Phase 2: Frontend Chat Interface

**Goal**: Build the UI components for the user to interact with the chatbot.

- [ ] **T005**: Create the file `frontend/src/components/ChatWindow.tsx`.
- [ ] **T006**: In `ChatWindow.tsx`, create a form with a text input and a "Send" button.
- [ ] **T007**: Create the file `frontend/src/components/MessageList.tsx` to display an array of messages.
- [ ] **T008**: Create the file `frontend/src/contexts/ChatContext.tsx` to manage the chat state (messages, input value).
- [ ] **T009**: Integrate `ChatContext`, `ChatWindow`, and `MessageList` into the main page at `frontend/app/page.tsx`.
- [ ] **T010**: Wire the `ChatWindow`'s "Send" button to make a `POST` request to `/api/chat` and update the `ChatContext`.

---

## Phase 3: Agent Logic and Task Integration (User Story 1 & 2)

**Goal**: Implement the core logic for adding and listing tasks.

- [ ] **T011** [US1]: In `frontend/app/api/chat/route.ts`, enhance the agent logic to detect "add task:" commands. It should extract the task description and add it to the in-memory task store.
- [ ] **T012** [US2]: In the same file, enhance the agent logic to detect "list tasks" commands. It should fetch the current user's tasks from the in-memory store and format them into a string.
- [ ] **T013**: Make sure the global task state (in `TaskContext` or similar) is updated and the main `TaskList.tsx` component re-renders automatically when a task is added via chat.

---

## Phase 4: Polish

**Goal**: Refine the user experience.

- [ ] **T014**: Style the `ChatWindow` and `MessageList` components to match the application's theme.
- [ ] **T015**: Implement loading and error states in the chat window.
- [ ] **T016**: Ensure the conversation history is persisted in the `ChatContext` for the duration of the session.
