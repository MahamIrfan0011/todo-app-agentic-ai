# Use an official Python runtime as a parent image
FROM python:3.13-slim-bookworm

# Set the working directory in the container
WORKDIR /app
ENV PYTHONPATH=/app

# Copy requirements.txt first to leverage Docker cache
COPY requirements.txt /app/
COPY pyproject.toml /app/

# Create and make start.sh executable directly in the container
RUN printf '#!/bin/bash\nset -e\nexport PYTHONPATH="/app:${PYTHONPATH}"\ncd /app\nexec uvicorn src.in_memory_todo_app.main:app --host 0.0.0.0 --port 7860\n' > /app/start.sh && \
    chmod +x /app/start.sh




RUN pip install --no-cache-dir -r /app/requirements.txt


# Copy the rest of your application code
COPY . /app/

# Expose the port FastAPI will run on
EXPOSE 7860

# Command to run the application using uvicorn
# The command assumes your FastAPI app instance is named 'app'
# and is located in 'src.in_memory_todo_app.main'
CMD ["/bin/bash", "/app/start.sh"]
