--- 
id: 0033
title: Improve Chatbot Flexibility for Adding Tasks
stage: refactor
date: 2026-01-16
surface: agent
model: gemini-cli
feature: in-memory-todo-app
branch: main
user: "unknown"
command: "I'm a simple bot. You can say \"add task: [your task]\" or \"list tasks\". i want when user add a task in just one word that homework so bot add a task without giving that message shown above and when a user add a line that add a task homework so bot add that task too in simple words if user give one word task bot add it and if user give a line to add task bot also add that too"
labels: ["chatbot", "refactor", "nlp"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/api/chat/route.ts
tests:
  - "none"
---

## Prompt

I'm a simple bot. You can say "add task: [your task]" or "list tasks". i want when user add a task in just one word that homework so bot add a task without giving that message shown above and when a user add a line that add a task homework so bot add that task too in simple words if user give one word task bot add it and if user give a line to add task bot also add that too

## Response snapshot

I have updated the chat API's logic to be more flexible when adding tasks. It can now handle single-word tasks (e.g., "homework") and more natural sentences (e.g., "add a task homework") without requiring the strict "add task:" prefix.

## Outcome

- ✅ Impact: Refactored the chatbot's command parsing logic to be more intuitive for the user. It no longer relies on a rigid prefix for adding tasks, improving the user experience.
- 🧪 Tests: No tests were added.
- 📁 Files: Modified `frontend/app/api/chat/route.ts` to implement the new parsing logic.
- 🔁 Next prompts: The user might want to improve the chatbot's understanding of other commands, or add new capabilities like deleting or marking tasks as complete.
- 🧠 Reflection: The change was straightforward and significantly improves the usability of the chatbot. Moving from a strict prefix-based system to a keyword and default-action system is a common pattern in simple conversational AI.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Implement a "complete task" command.
