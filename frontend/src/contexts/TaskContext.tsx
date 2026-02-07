'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Task } from '@/types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  fetchTasks: () => void;
  addTask: (taskData: { title: string; description?: string }) => Promise<void>;
  updateTask: (taskId: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

      const fetchTasks = useCallback(async () => {
      if (!user) {
        setTasks([]);
        return;
      }
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
        return;
      }
      const response = await fetch(`${backendUrl}/tasks`, {
        headers: { 'X-User-Email': user.email },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    }, [user]);
  
    // Fetch tasks when the component mounts or user changes
    useEffect(() => {
      fetchTasks();
    }, [user, fetchTasks]);
  
    const addTask = async (taskData: { title: string; description?: string }) => {
      if (!user) throw new Error("User not authenticated");
  
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
        return;
      }
      const response = await fetch(`${backendUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': user.email,
        },
        body: JSON.stringify(taskData),
      });
  
      if (response.ok) {
        await fetchTasks(); // Refetch tasks to get the latest list
      } else {
        console.error("Failed to add task");
      }
    };
  
    const updateTask = async (taskId: number, updates: Partial<Task>) => {
      if (!user) throw new Error("User not authenticated");
  
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
        return;
      }
      const response = await fetch(`${backendUrl}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': user.email,
        },
        body: JSON.stringify(updates),
      });
  
      if (response.ok) {
        await fetchTasks(); // Refetch tasks to get the latest list
      } else {
        console.error(`Failed to update task ${taskId}`);
      }
    };
  
    const deleteTask = async (taskId: number) => {
      if (!user) throw new Error("User not authenticated");
  
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        console.error("NEXT_PUBLIC_BACKEND_URL is not defined.");
        return;
      }
      const response = await fetch(`${backendUrl}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Email': user.email,
        },
      });
    if (response.ok) {
      await fetchTasks(); // Refetch tasks to get the latest list
    } else {
      console.error(`Failed to delete task ${taskId}`);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}
