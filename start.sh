#!/bin/bash
set -e

# Explicitly add the application root to PYTHONPATH
export PYTHONPATH="/app:${PYTHONPATH}"

# Navigate to the application root
cd /app

# Execute the uvicorn command
exec uvicorn src.in_memory_todo_app.main:app --host 0.0.0.0 --port 7860
