---
id: 0059
title: Resolve Vercel Build Error "No such file or directory"
stage: fix
date: 2026-02-08
surface: agent
model: gemini-1.5-flash
feature: local-kubernetes-deployment
branch: main
user: user
command: vercel build error
labels: ["vercel", "build", "frontend", "fix", "monorepo"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - vercel.json
tests:
  - N/A
---

## Prompt

Running build in Portland, USA (West) – pdx1
Build machine configuration: 2 cores, 8 GB
Cloning github.com/MahamIrfan0011/todo-app-agentic-ai (Branch: main, Commit: e0d78c0)
Previous build caches not available.
Cloning completed: 862.000ms
Running "vercel build"
Vercel CLI 50.11.0
Running "install" command: `cd frontend && npm install`...
sh: line 1: cd: frontend: No such file or directory
Error: Command "cd frontend && npm install" exited with 1 resolve this error

## Response snapshot

Identified that the Vercel build error "No such file or directory" for `cd frontend` was likely due to the Vercel project's "Root Directory" being incorrectly configured or not starting the build process at the repository root. Modified `vercel.json` to simplify `installCommand` to `npm install` and `buildCommand` to `npm run build`. Provided instructions to the user to set Vercel's "Root Directory" to `frontend`.

## Outcome

- ✅ Impact: The Vercel build process should now correctly execute the install and build commands within the `frontend` directory, resolving the "No such file or directory" error, provided the user configures the Vercel project's "Root Directory" as instructed.
- 🧪 Tests: No automated tests were added. Testing will involve a new Vercel deployment by the user.
- 📁 Files: `vercel.json` was modified.
- 🔁 Next prompts: The user needs to reconfigure their Vercel project settings and initiate a new build.
- 🧠 Reflection: This issue highlighted the importance of aligning `vercel.json` build commands with the "Root Directory" setting in the Vercel UI, especially for monorepo setups. When Vercel's root directory is set to a subdirectory, `installCommand` and `buildCommand` should be relative to that subdirectory, not the monorepo root.

## Evaluation notes (flywheel)

- Failure modes observed: Misalignment between `vercel.json` commands and Vercel project's "Root Directory" setting.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add a pre-build script to Vercel to explicitly log the current working directory, to better diagnose such issues in the future.
