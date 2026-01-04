"use client";

import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: Date; // Change to Date object for in-memory handling
}

let nextId = 1; // Simple ID counter

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks from localStorage on initial render (optional persistence)
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const parsedTasks: Task[] = JSON.parse(storedTasks).map((task: any) => ({
        ...task,
        created_at: new Date(task.created_at), // Convert string back to Date object
      }));
      setTasks(parsedTasks);
      // Find the max ID to ensure nextId is unique
      if (parsedTasks.length > 0) {
        nextId = Math.max(...parsedTasks.map(task => task.id)) + 1;
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);


  const handleAddTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: nextId++,
      title,
      description,
      completed: false,
      created_at: new Date(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleUpdateTask = (
    id: number,
    title: string,
    description?: string,
    completed?: boolean
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title, description, completed } : task
      )
    );
    setEditingTask(null);
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id: number, completed: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed } : task))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
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

