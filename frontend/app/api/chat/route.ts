// API route for the AI-powered chatbot
import { NextRequest, NextResponse } from 'next/server';
import store from '../tasks/store'; // Import the default export
import { Task } from '@/types';

// Helper to extract task title from a command
function extractTaskTitle(message: string): string {
    // Remove "add" and common filler words, then trim
    return message.replace(/add\s?(a\s)?task\s?/i, '').trim();
}

// Helper to find a task by its title (case-insensitive, partial match)
async function findTaskByTitle(userEmail: string, searchTerm: string): Promise<Task | null> {
  const tasks = await store.getTasksForUser(userEmail);
  const lowerSearchTerm = searchTerm.toLowerCase();

  const matchingTasks = tasks.filter(task => task.title.toLowerCase().includes(lowerSearchTerm));

  if (matchingTasks.length === 1) {
    return matchingTasks[0];
  } else if (matchingTasks.length > 1) {
    // If multiple tasks match, return null and let the chatbot ask for clarification
    return null;
  }
  return null; // No task found
}

export async function POST(req: NextRequest) {
  try {
    const userEmail = req.headers.get('X-User-Email');
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized: User email header is missing.' }, { status: 401 });
    }

    const body = await req.json();
    const userMessage: string = body.message;

    if (!userMessage) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let agentResponse: string;
    const lowerCaseMessage = userMessage.toLowerCase();

    // --- Task Management Commands ---

    // Delete All Tasks
    if (lowerCaseMessage.includes('delete all tasks') || lowerCaseMessage.includes('remove all tasks') || lowerCaseMessage.includes('clear all tasks')) {
      const allDeleted = await store.deleteAllTasksForUser(userEmail);
      if (allDeleted) {
        agentResponse = "Okay, I've cleared all your tasks.";
      } else {
        agentResponse = "Failed to clear all your tasks.";
      }
    }
    // Delete Single Task
    else if (lowerCaseMessage.startsWith('delete') || lowerCaseMessage.startsWith('remove')) {
      const deleteRegex = /^(?:delete|remove)(?:\s+the)?(?:\s+task)?\s+["']?(.+?)["']?$/i;
      const match = userMessage.match(deleteRegex);

      let taskTitleToFind: string | undefined;
      if (match) {
        taskTitleToFind = match[1].trim();
      }

      if (taskTitleToFind) {

        const taskToDelete = await findTaskByTitle(userEmail, taskTitleToFind);
        if (!taskToDelete) {
          agentResponse = `I couldn't find a unique task matching "${taskTitleToFind}". Please be more specific or list your tasks.`;
        } else {
          const deleted = await store.deleteTaskForUser(userEmail, taskToDelete.id);
          if (deleted) {
            agentResponse = `Okay, I've deleted "${taskToDelete.title}" from your tasks.`;
          } else {
            agentResponse = `Failed to delete "${taskToDelete.title}".`;
          }
        }
      } else { // Handle cases where regex doesn't match
        agentResponse = "To delete a task, please say 'delete [task title]' or 'remove [task title]'.";
      }
    }
    // Mark as Complete
    else if (lowerCaseMessage.startsWith('complete') || lowerCaseMessage.includes('mark as complete')) {
      const completeRegex = /^(?:complete|mark(?:\s+the)?\s+task|mark(?:\s+this)?\s+task\s+as\s+complete)\s+(?:["']?)(.+?)(?:["']?)(?:\s+as\s+complete)?$/i;
      const match = userMessage.match(completeRegex);

      let taskTitleToFind: string | undefined;
      if (match) {
        taskTitleToFind = match[1].trim(); // Adjusted to match the new capturing group
      }

      if (taskTitleToFind) {

        const taskToComplete = await findTaskByTitle(userEmail, taskTitleToFind);
        if (!taskToComplete) {
          agentResponse = `I couldn't find a unique task matching "${taskTitleToFind}". Please be more specific or list your tasks.`;
        } else if (taskToComplete.completed) {
          agentResponse = `"${taskToComplete.title}" is already complete.`;
        }
        else {
          const updatedTask = await store.updateTaskForUser(userEmail, taskToComplete.id, { completed: true });
          if (updatedTask) {
            agentResponse = `Great! I've marked "${updatedTask.title}" as complete.`;
          } else {
            agentResponse = `Failed to mark "${taskToComplete.title}" as complete.`;
          }
        }
      } else { // Handle cases where regex doesn't match
        agentResponse = "To mark a task as complete, please say 'complete [task title]' or 'mark [task title] as complete'.";
      }
    }
    // Mark as Incomplete
    else if (lowerCaseMessage.startsWith('uncomplete') || lowerCaseMessage.includes('mark as incomplete') || lowerCaseMessage.includes('reopen')) {
      const incompleteRegex = /^(?:uncomplete|reopen|mark(?:\s+the)?\s+task|mark(?:\s+this)?\s+task\s+as\s+incomplete)\s+(?:["']?)(.+?)(?:["']?)(?:\s+as\s+incomplete)?$/i;
      const match = userMessage.match(incompleteRegex);

      let taskTitleToFind: string | undefined;
      if (match) {
        taskTitleToFind = match[1].trim(); // Adjusted to match the new capturing group
      }

      if (taskTitleToFind) {

        const taskToIncomplete = await findTaskByTitle(userEmail, taskTitleToFind);
        if (!taskToIncomplete) {
          agentResponse = `I couldn't find a unique task matching "${taskTitleToFind}". Please be more specific or list your tasks.`;
        } else if (!taskToIncomplete.completed) {
          agentResponse = `"${taskToIncomplete.title}" is already incomplete.`;
        }
        else {
          const updatedTask = await store.updateTaskForUser(userEmail, taskToIncomplete.id, { completed: false });
          if (updatedTask) {
            agentResponse = `Okay, I've marked "${updatedTask.title}" as incomplete.`;
          } else {
            agentResponse = `Failed to mark "${taskToIncomplete.title}" as incomplete.`;
          }
        }
      } else { // Handle cases where regex doesn't match
        agentResponse = "To mark a task as incomplete, please say 'uncomplete [task title]' or 'mark [task title] as incomplete'.";
      }
    }
    // Edit Task
    else if (lowerCaseMessage.startsWith('edit') || lowerCaseMessage.startsWith('change')) {
      const editRegex = /^(?:edit|change)(?:\s+the)?(?:\s+task)?\s+["']?(.+?)["']?\s+(?:to|with)\s+["']?(.+?)["']?$/i;
      const match = userMessage.match(editRegex);

      let oldTitle: string | undefined;
      let newTitle: string | undefined;

      if (match) {
        oldTitle = match[1].trim();
        newTitle = match[2].trim();
      }

      if (oldTitle && newTitle) {
        const taskToEdit = await findTaskByTitle(userEmail, oldTitle);
        if (!taskToEdit) {
          agentResponse = `I couldn't find a unique task matching "${oldTitle}". Please be more specific or list your tasks.`;
        } else {
          const updatedTask = await store.updateTaskForUser(userEmail, taskToEdit.id, { title: newTitle });
          if (updatedTask) {
            agentResponse = `Alright, I've changed "${taskToEdit.title}" to "${updatedTask.title}".`;
          } else {
            agentResponse = `Failed to change "${taskToEdit.title}" to "${newTitle}".`;
          }
        }
      } else {
        agentResponse = "To edit a task, please say 'edit [old task title] to [new task title]'.";
      }
    }
    // --- Existing Commands ---
    else if (lowerCaseMessage.includes('list') || lowerCaseMessage.includes('show')) {
        const tasks = await store.getTasksForUser(userEmail);
        const incompleteTasks = tasks.filter(t => !t.completed);
        if (incompleteTasks.length === 0) {
            agentResponse = "You have no active tasks. Great job!";
        } else {
            const taskTitles = incompleteTasks.map((t, i) => `${i + 1}. ${t.title}`).join('\n');
            agentResponse = "Here are your active tasks:\n" + taskTitles;
        }
    } else if (lowerCaseMessage.startsWith('add')) {
        const taskTitle = extractTaskTitle(userMessage);
        if (taskTitle) {
            const newTask = await store.addTaskForUser(userEmail, { title: taskTitle });
            if (newTask) {
              agentResponse = `Okay, I've added "${taskTitle}" to your task list.`;
            } else {
              agentResponse = `Failed to add "${taskTitle}" to your task list.`;
            }
        } else {
            agentResponse = "It looks like you want to add a task, but the title is empty.";
        }
    } else {
        // Default to adding the whole message as a task
        const taskTitle = userMessage.trim();
        if (taskTitle) {
            const newTask = await store.addTaskForUser(userEmail, { title: taskTitle });
            if (newTask) {
              agentResponse = `Okay, I've added "${taskTitle}" to your task list.`;
            } else {
              agentResponse = `Failed to add "${taskTitle}" to your task list.`;
            }
        } else {
            agentResponse = "I'm not sure what you mean. You can say 'add [your task]', 'list tasks', 'delete [task]', 'complete [task]', 'uncomplete [task]', or 'edit [old task] to [new task]'.";
        }
    }

    return NextResponse.json({ reply: agentResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Chat API error (detailed):', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
