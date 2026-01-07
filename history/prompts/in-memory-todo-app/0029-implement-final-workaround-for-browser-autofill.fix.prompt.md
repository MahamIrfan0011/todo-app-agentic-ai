---
id: 0029
title: Implement final workaround for browser autofill
stage: fix
date: 2026-01-07
surface: agent
model: gemini-pro
feature: in-memory-todo-app
branch: main
user: moriswalalaptop
command: again it is showing sample email and password
labels: [bug, fix, ui]
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

again it is showing sample email and password

## Response snapshot

I have now implemented the following changes in `frontend/app/auth/login/page.tsx`:

1.  The password input field now starts as `type="text"` and changes to `type="password"` on focus.
2.  Both the email and password input fields have `autocomplete="new-password"`.

These are the final workarounds I can implement to combat your browser's aggressive autofill.

## Outcome

- ✅ Impact: The login form should now be blank, as a last-ditch effort to trick the browser's autofill.
- 🧪 Tests: No tests were run.
- 📁 Files: One file was modified.
- 🔁 Next prompts: Run `npm run dev` again and, if the issue persists, to clear browser autofill data.
- 🧠 Reflection: Browser autofill is a known difficult issue, and this workaround is not guaranteed to work on all browsers.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Confirm if the workaround was successful.
