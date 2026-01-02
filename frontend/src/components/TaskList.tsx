"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { api } from "@/lib/api";
import { auth } from "@/lib/auth"; // Added missing import
import { useAuth } from "@/lib/AuthContext";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

export default function TaskList() {
  const { isAuthenticated, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setLoading(false);
      router.push("/auth/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = auth.getToken();
      if (!token) {
        throw new Error("No authentication token found.");
      }
      const data = await api.get("/tasks/", token);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string, description?: string) => {
    setError("");
    try {
      const token = auth.getToken();
      if (!token) {
        throw new Error("No authentication token found.");
      }
      await api.post("/tasks/", { title, description }, token);
      fetchTasks();
    } catch (err: any) {
      setError(err.message || "Failed to add task.");
    }
  };

  const handleUpdateTask = async (
    id: number,
    title: string,
    description?: string,
    completed?: boolean
  ) => {
    setError("");
    try {
      const token = auth.getToken();
      if (!token) {
        throw new Error("No authentication token found.");
      }
      await api.put(
        `/tasks/${id}`,
        { title, description, completed },
        token
      );
      setEditingTask(null);
      fetchTasks();
    } catch (err: any) {
      setError(err.message || "Failed to update task.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    setError("");
    try {
      const token = auth.getToken();
      if (!token) {
        throw new Error("No authentication token found.");
      }
      await api.delete(`/tasks/${id}`, token);
      fetchTasks();
    } catch (err: any) {
      setError(err.message || "Failed to delete task.");
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    setError("");
    try {
      const token = auth.getToken();
      if (!token) {
        throw new Error("No authentication token found.");
      }
      if (completed) {
        await api.patch(`/tasks/${id}/complete`, {}, token);
      } else {
        await api.patch(`/tasks/${id}/incomplete`, {}, token);
      }
      fetchTasks();
    } catch (err: any) {
      setError(err.message || "Failed to toggle task completion.");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editingTask ? "Edit Task" : "Add New Task"}
        </h2>
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          initialData={editingTask}
          onCancel={() => setEditingTask(null)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <li className="p-4 text-center text-gray-500">No tasks yet. Add one above!</li>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
