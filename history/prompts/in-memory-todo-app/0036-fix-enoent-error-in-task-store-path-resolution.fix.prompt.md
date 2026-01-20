---
id: 0036
title: Fix ENOENT error in task store path resolution
stage: fix
date: 2026-01-17
surface: agent
model: Gemini
feature: in-memory-todo-app
branch: 003-title-implement-more
user: unknown
command: "N/A"
labels: [bugfix, path-resolution, file-io]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/api/tasks/store.ts
tests:
  - "N/A"
---

## Prompt

[STORE ERROR] Could not write DB in addTaskForUser for maham@gmail.com. Aborting. Error: ENOENT: no such file or directory, open 'F:\todo-app\frontend\frontend\app\api\.data\db.json'
    at async writeDb (app\api\tasks\store.ts:40:9)
    at async addTaskForUser (app\api\tasks\store.ts:79:9)
    at async POST (app\api\chat\route.ts:50:13)
  38 | async function writeDb(data: DbData): Promise<void> {
  39 |     try {
> 40 |         await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
     |         ^
  41 |     } catch (error) {
  42 |         console.error("!!! FAILED TO WRITE DB FILE !!!", error);
  43 |         throw error; {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'F:\\todo-app\\frontend\\frontend\\app\\api\\.data\\db.json'
}
Chat API error: Error: Failed to write database after adding task.
    at addTaskForUser (app\api\tasks\store.ts:82:15)
    at async POST (app\api\chat\route.ts:50:13)
  80 |     } catch (error) {
  81 |         console.error(`[STORE ERROR] Could not write DB in addTaskForUser for ${userEmail}. Aborting.`, error);
> 82 |         throw new Error("Failed to write database after adding task.");
     |               ^
  83 |     }
  84 | 
  85 |     return newTask;
 POST /api/chat 500 in 1690ms (compile: 473ms, render: 1217ms)
 GET / 200 in 409ms (compile: 87ms, render: 322ms)
 GET /auth/login 200 in 135ms (compile: 50ms, render: 84ms)
 POST /api/auth/login 200 in 145ms (compile: 9ms, render: 136ms)
 GET / 200 in 73ms (compile: 12ms, render: 62ms)
 GET /api/tasks 200 in 34ms (compile: 12ms, render: 22ms)
 GET /api/tasks 200 in 36ms (compile: 13ms, render: 23ms)
 POST /api/chat 400 in 5.2s (compile: 5.2s, render: 19ms)
 GET / 200 in 153ms (compile: 26ms, render: 126ms)
 GET /auth/login 200 in 150ms (compile: 58ms, render: 92ms)
 POST /api/auth/login 401 in 123ms (compile: 4ms, render: 119ms)
 POST /api/auth/login 200 in 122ms (compile: 5ms, render: 117ms)
 GET / 200 in 46ms (compile: 9ms, render: 36ms)
 GET /api/tasks 200 in 33ms (compile: 10ms, render: 23ms)
 GET /api/tasks 200 in 19ms (compile: 6ms, render: 13ms)
!!! FAILED TO WRITE DB FILE !!! Error: ENOENT: no such file or directory, open 'F:\todo-app\frontend\frontend\app\api\.data\db.json'
    at async writeDb (app\api\tasks\store.ts:40:9)
    at async addTaskForUser (app\api\tasks\store.ts:79:9)
    at async POST (app\api\chat\route.ts:41:13)
  38 | async function writeDb(data: DbData): Promise<void> {
  39 |     try {
> 40 |         await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
     |         ^
  41 |     } catch (error) {
  42 |         console.error("!!! FAILED TO WRITE DB FILE !!!", error);
  43 |         throw error; {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'F:\\todo-app\\frontend\\frontend\\app\\api\\.data\\db.json'
}
[STORE ERROR] Could not write DB in addTaskForUser for maham@gmail.com. Aborting. Error: ENOENT: no such file or directory, open 'F:\todo-app\frontend\frontend\app\api\.data\db.json'
    at async writeDb (app\api\tasks\store.ts:40:9)
    at async addTaskForUser (app\api\tasks\store.ts:79:9)
    at async POST (app\api\chat\route.ts:41:13)
  38 | async function writeDb(data: DbData): Promise<void> {
  39 |     try {
> 40 |         await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
     |         ^
  41 |     } catch (error) {
  42 |         console.error("!!! FAILED TO WRITE DB FILE !!!", error);
  43 |         throw error; {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'F:\\todo-app\\frontend\\frontend\\app\\api\\.data\\db.json'
}
Chat API error: Error: Failed to write database after adding task.
    at addTaskForUser (app\api\tasks\store.ts:82:15)
    at async POST (app\api\chat\route.ts:41:13)
  80 |     } catch (error) {
  81 |         console.error(`[STORE ERROR] Could not write DB in addTaskForUser for ${userEmail}. Aborting.`, error);
> 82 |         throw new Error("Failed to write database after adding task.");
     |               ^
  83 |     }
  84 | 
  85 |     return newTask;
Chat API error (detailed): {"stack":"Error: Failed to write database after adding task.\n    at addTaskForUser (F:\\todo-app\\frontend\\.next\\dev\\server\\chunks\[root-of-the-server]__76b58d24._.js:137:15)\n    at async POST (F:\\todo-app\\frontend\\.next\\dev\\server\\chunks\[root-of-the-server]__76b58d24._.js:201:17)\n    at async AppRouteRouteModule.do (F:\\todo-app\\frontend\\node_modules\\next\\dist\\compiled\\next-server\\app-route-turbo.runtime.dev.js:5:37866)\n    at async AppRouteRouteModule.handle (F:\\todo-app\\frontend\\node_modules\\next\\dist\\compiled\\next-server\\app-route-turbo.runtime.dev.js:5:45156)\n    at async responseGenerator (F:\\todo-app\\frontend\\.next\\dev\\server\\chunks\\node_modules_next_ea6542ff._.js:14843:38)\n    at async AppRouteRouteModule.handleResponse (F:\\todo-app\\frontend\\node_modules\\next\\dist\\compiled\\next-server\\app-route-turbo.runtime.dev.js:1:187713)\n    at async handleResponse (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\chunks\\node_modules_next_ea6542ff._.js:14906:32)\n    at async Module.handler (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\chunks\\node_modules_next_ea6542ff._.js:14959:13)\n    at async DevServer.renderToResponseWithComponentsImpl (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\base-server.js:1422:9)\n    at async DevServer.renderPageComponent (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\base-server.js:1474:24)\n    at async DevServer.renderToResponseImpl (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\base-server.js:1524:32)\n    at async DevServer.pipeImpl (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\base-server.js:1018:25)\n    at async NextNodeServer.handleCatchallRenderRequest (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\next-server.js:395:17)\n    at async DevServer.handleRequestImpl (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\base-server.js:909:17)\n    at async F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\dev\\next-dev-server.js:387:20\n    at async Span.traceAsyncFn (F:\\todo-app\\frontend\\node_modules\\next\\dist\\trace\\trace.js:157:20)\n    at async DevServer.handleRequest (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\dev\\next-dev-server.js:383:24)\n    at async invokeRender (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\lib\\router-server.js:248:21)\n    at async handleRequest (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\lib\\router-server.js:447:24)\n    at async requestHandlerImpl (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\lib\\router-server.js:496:13)\n    at async Server.requestListener (F:\\todo-app\\frontend\\node_modules\\next\\dist\\server\\lib\\start-server.js:226:13)","message":"Failed to write database after adding task."}