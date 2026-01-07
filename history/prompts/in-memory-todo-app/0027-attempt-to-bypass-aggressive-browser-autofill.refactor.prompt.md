---
id: 0027
title: Attempt to bypass aggressive browser autofill
stage: refactor
date: 2026-01-07
surface: agent
model: gemini-pro
feature: in-memory-todo-app
branch: main
user: moriswalalaptop
command: still it is showing sample email and password remove the sample email and password leave the balnk space
labels: [ui, refactor, bug]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- frontend/app/auth/login/page.tsx
tests:
- none
---

## Prompt

still it is showing sample email and password remove the sample email and password leave the balnk space

## Response snapshot

I have added `key` props to both the email and password input fields in `frontend/app/auth/login/page.tsx`. This is an attempt to bypass aggressive browser autofill mechanisms.

## Outcome

- ✅ Impact: The login form should now display blank fields, overriding aggressive browser autofill.
- 🧪 Tests: No tests were run.
- 📁 Files: One file was modified.
- 🔁 Next prompts: Run `npm run dev` again in the `frontend` directory and clear browser autofill data.
- 🧠 Reflection: Browser autofill can be very persistent, and adding `key` props is a common workaround.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Confirm the fields are blank and, if not, investigate further browser-specific solutions.
