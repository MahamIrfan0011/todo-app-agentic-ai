# Implementation Plan: AI-Powered Todo Chatbot

**Branch**: `003-ai-chatbot` | **Date**: 2026-01-16 | **Spec**: [spec.md](./spec.md)

## Summary

This plan outlines the technical approach for creating an AI-powered chatbot to manage todo items via a conversational interface. The agent will interpret natural language commands to add and list tasks, integrating with the existing task management system. The frontend will be updated to include a chat component.

## Technical Context

**Language/Version**: TypeScript (Frontend), TypeScript/Node.js (Backend)
**Primary Dependencies**: Next.js, React, Zustand
**Storage**: In-memory store (for now), to be integrated with a persistent DB later.
**Testing**: Jest, React Testing Library
**Target Platform**: Web Browser
**Project Type**: Web application
**Constraints**: Chat responses should be near real-time (< 3 seconds).

## Project Structure

### Documentation (this feature)

```text
specs/003-ai-chatbot/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (repository root)

The existing frontend/backend structure will be augmented.

```text
frontend/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # New API endpoint for the chatbot
│   └── (existing components)...
├── src/
│   ├── components/
│   │   ├── ChatWindow.tsx    # New component for the chat interface
│   │   └── MessageList.tsx   # New component to display messages
│   └── contexts/
│       └── ChatContext.tsx   # New context for managing chat state
└── ...
```

**Structure Decision**: We will extend the existing Next.js application. A new API route `/api/chat` will be created to handle communication between the frontend chat component and the backend agent logic. New React components will be built for the chat interface itself.

## Implementation Phases

### 1. Backend: Chat API Endpoint & Agent Logic

- Create a new API route at `frontend/app/api/chat/route.ts`.
- This endpoint will receive messages from the user.
- A simple "agent" function will parse the user's message.
    - If the message contains "add task:", it will extract the task description and add it to the user's task list.
    - If the message contains "list tasks" or similar, it will fetch the user's current tasks.
- The agent will return a text response to be displayed to the user.
- Initially, this will be simple string matching, not a true AI model.

### 2. Frontend: Chat Interface

- Create a `ChatWindow.tsx` component that provides a text input for the user and a "Send" button.
- Create a `MessageList.tsx` component to display the conversation history (user messages and agent responses).
- Use a new `ChatContext.tsx` to manage the state of the conversation, including the list of messages and the user's input.
- The `ChatWindow` will be added to the main page (`page.tsx`) so it's always accessible.
- When the user sends a message, a `POST` request will be made to the `/api/chat` endpoint. The response will be added to the message list.

### 3. Integration

- The backend agent logic will need to access the same in-memory task store that the rest of the application uses to ensure consistency.
- The task list component (`TaskList.tsx`) should automatically update when a task is added via the chat interface. This can be achieved through the existing state management.
