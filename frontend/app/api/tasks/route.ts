import { NextRequest, NextResponse } from 'next/server';
 import store from './store'; // Import the default export
const BACKEND_URL = "https://maham001-backend.hf.space";

// Get all tasks for a user
export async function GET(req: NextRequest) {
  const userEmail = req.headers.get('X-User-Email');

  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized: User email header is missing.' }, { status: 401 });
  }

  const tasks = await store.getTasksForUser(userEmail);
  return NextResponse.json(tasks);
}

// Add a new task for a user
export async function POST(req: NextRequest) {
  const userEmail = req.headers.get('X-User-Email');

  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized: User email header is missing.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newTask = await store.addTaskForUser(userEmail, { title, description });
    // addTaskForUser returns null if write fails, so handle that
    if (!newTask) {
      return NextResponse.json({ error: 'Failed to add task due to a database write issue.' }, { status: 500 });
    }
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('API POST task error:', error);
    return NextResponse.json({ error: 'Invalid request body or internal error.' }, { status: 400 });
  }
}

// Update an existing task for a user
export async function PUT(req: NextRequest) {
  const userEmail = req.headers.get('X-User-Email');

  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized: User email header is missing.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const updates = body; // body can contain partial Task fields

    const updatedTask = await store.updateTaskForUser(userEmail, parseInt(taskId), updates);

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found or failed to update.' }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('API PUT task error:', error);
    return NextResponse.json({ error: 'Invalid request body or internal error.' }, { status: 400 });
  }
}

// Delete a task for a user
export async function DELETE(req: NextRequest) {
  const userEmail = req.headers.get('X-User-Email');

  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized: User email header is missing.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const deleted = await store.deleteTaskForUser(userEmail, parseInt(taskId));

    if (!deleted) {
      return NextResponse.json({ error: 'Task not found or failed to delete.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('API DELETE task error:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
