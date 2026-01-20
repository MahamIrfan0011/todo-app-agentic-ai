---
id: 0041
title: Replace Show/Hide Text with Eye Icons on Login Page
stage: refactor
date: 2026-01-18
surface: agent
model: unknown
feature: in-memory-todo-app
branch: unknown
user: unknown
command: unknown
labels: []
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/auth/login/page.tsx
tests:
  - "none"
---

## Prompt

in login page the show option is showing i want an eye option not written show option

## Response snapshot

I have successfully replaced the "Show" and "Hide" text with SVG eye icons on the login page.

## Outcome

- ✅ Impact: Improved UI/UX on the login page by using more intuitive eye icons for password visibility.
- 🧪 Tests: No new tests were added.
- 📁 Files: Modified `frontend/app/auth/login/page.tsx` to replace text with SVG icons.
- 🔁 Next prompts: none
- 🧠 Reflection: This change was a direct UI improvement based on user feedback, enhancing the visual language of the application.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
