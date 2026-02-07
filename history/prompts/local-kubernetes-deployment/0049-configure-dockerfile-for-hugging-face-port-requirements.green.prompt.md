---
phr_id: 0049
phr_title: Configure Dockerfile for Hugging Face port requirements
phr_stage: green
phr_date: 2026-02-07
phr_surface: agent
phr_model: 
phr_feature: local-kubernetes-deployment
phr_branch: 
phr_user: 
phr_command: "i want to deploy my backend on hugging face and in Docker file my file contains the port 3000 which is not acceptable in huggingface it requires the port 7860 if its required then change it without changing any logic of my code if not tell me why is it"
phr_labels: ["docker", "huggingface", "port"]
phr_links: 
phr_files_yaml:
  - frontend/Dockerfile
phr_tests_yaml:
phr_prompt_text: "i want to deploy my backend on hugging face and in Docker file my file contains the port 3000 which is not acceptable in huggingface it requires the port 7860 if its required then change it without changing any logic of my code if not tell me why is it"
phr_response_text: "I have modified the Dockerfile in `frontend/Dockerfile` to change the exposed port from `3000` to `7860` and to set the `PORT` environment variable to `7860` for the Next.js application.

Here's a summary of the changes:
- `EXPOSE 3000` changed to `EXPOSE 7860`.
- Added `ENV PORT=7860` before the `CMD ["npm", "start"]` instruction.

These changes ensure that your frontend application will listen on port `7860`, which is the default port expected by Hugging Face Spaces for Docker deployments.

I have completed the task."
---
