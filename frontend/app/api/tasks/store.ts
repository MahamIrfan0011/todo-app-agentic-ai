// File-based store for tasks
import { Task } from '@/types';
import fs from 'fs/promises';

type DbData = Record<string, Task[]>;

// Path to our simple JSON database
const dbPath = path.resolve(process.cwd(), 'app/api/.data', 'db.json');

// Helper to read the entire database
async function readDb(): Promise<DbData> {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        // Handle empty file case
        if (data.trim() === '') {
            return {};
        }
    return JSON.parse(data) as DbData;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, which is fine, return empty DB
      return {};
    }
    if (error instanceof SyntaxError) {
      console.error('!!! FAILED TO PARSE DB FILE AS JSON DUE TO CORRUPTION OR INVALID DATA !!!', error);
      // If the file is corrupted JSON, return an empty object to reset the state
      return {};
    }
    console.error('!!! FAILED TO READ DB FILE !!!', error);
    throw error;
  }
}

// Helper to write the entire database
async function writeDb(data: DbData): Promise<void> {
    try {
        await fs.mkdir(path.dirname(dbPath), { recursive: true }); // Ensure directory exists
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("!!! FAILED TO WRITE DB FILE !!!", error);
        throw error;
    }
}

const getTasksForUser = async (userEmail: string): Promise<Task[]> => {
    const db = await readDb();
    return db[userEmail] || [];
};

const addTaskForUser = async (userEmail: string, taskData: { title: string; description?: string }): Promise<Task | null> => {
    let db: DbData;
    try {
        db = await readDb();
    } catch (error) {
        console.error(`[STORE ERROR] Could not read DB in addTaskForUser for ${userEmail}. Starting with empty DB.`, error);
        db = {}; // Start with an empty database if read fails
    }

    const userTasks = db[userEmail] || [];
    
    const newTask: Task = {
        id: Date.now(),
        title: taskData.title,
        description: taskData.description,
        completed: false,
    };

    db[userEmail] = [...userTasks, newTask];
    
    try {
        await writeDb(db);
        return newTask;
    } catch (error) {
        console.error(`[STORE ERROR] Could not write DB in addTaskForUser for ${userEmail}. Task not saved.`, error);
        return null; // Indicate that the task was not saved
    }
};

const updateTaskForUser = async (userEmail: string, taskId: number, updates: Partial<Task>): Promise<Task | null> => {
    let db: DbData;
    try {
        db = await readDb();
    } catch (error) {
        console.error(`[STORE ERROR] Could not read DB in updateTaskForUser for ${userEmail}. Aborting.`, error);
        return null;
    }

    const userTasks = db[userEmail] || [];
    const taskIndex = userTasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return null; // Task not found
    }

    const updatedTask = { ...userTasks[taskIndex], ...updates };
    userTasks[taskIndex] = updatedTask;
    db[userEmail] = userTasks;

    try {
        await writeDb(db);
        return updatedTask;
    } catch (error) {
        console.error(`[STORE ERROR] Could not write DB in updateTaskForUser for ${userEmail}. Task not updated.`, error);
        return null;
    }
};

const deleteTaskForUser = async (userEmail: string, taskId: number): Promise<boolean> => {
    let db: DbData;
    try {
        db = await readDb();
    } catch (error) {
        console.error(`[STORE ERROR] Could not read DB in deleteTaskForUser for ${userEmail}. Aborting.`, error);
        return false;
    }

    const userTasks = db[userEmail] || [];
    const initialLength = userTasks.length;
    const updatedTasks = userTasks.filter(task => task.id !== taskId);

    if (updatedTasks.length === initialLength) {
        return false; // Task not found
    }

    db[userEmail] = updatedTasks;

    try {
        await writeDb(db);
        return true;
    } catch (error) {
        console.error(`[STORE ERROR] Could not write DB in deleteTaskForUser for ${userEmail}. Task not deleted.`, error);
        return false;
    }
};

const deleteAllTasksForUser = async (userEmail: string): Promise<boolean> => {
    let db: DbData;
    try {
        db = await readDb();
    } catch (error) {
        console.error(`[STORE ERROR] Could not read DB in deleteAllTasksForUser for ${userEmail}. Aborting.`, error);
        return false;
    }

    // Set the user's tasks to an empty array
    db[userEmail] = [];

    try {
        await writeDb(db);
        return true;
    } catch (error) {
        console.error(`[STORE ERROR] Could not write DB in deleteAllTasksForUser for ${userEmail}. Tasks not cleared.`, error);
        return false;
    }
};

export default {
    getTasksForUser,
    addTaskForUser,
    updateTaskForUser,
    deleteTaskForUser,
    deleteAllTasksForUser,
};
