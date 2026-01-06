"use client";

import { useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('all');

  const handleAddTask = (id: number | null, title: string, description?: string, completed: boolean = false) => {
    if (id !== null) {
      setTasks(tasks.map((task) => (task.id === id ? { ...task, title, description, completed } : task)));
      setEditingTask(null);
    } else {
      const newTask: Task = {
        id: Date.now(),
        title,
        description,
        completed,
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') {
      return task.completed;
    }
    if (filter === 'incomplete') {
      return !task.completed;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <header className="bg-slate-900 shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-50">TaskTracker</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-slate-50">{editingTask ? "Edit Task" : "Add a New Task"}</h2>
              <TaskForm
                onSubmit={handleAddTask}
                initialData={editingTask}
                onCancel={editingTask ? handleCancelEdit : undefined}
              />
            </div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg mt-8">
              <h2 className="text-xl font-semibold mb-4 text-slate-50">Filter Tasks</h2>
              <div className="flex space-x-4">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${filter === 'all' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>All</button>
                <button onClick={() => setFilter('incomplete')} className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${filter === 'incomplete' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Incomplete</button>
                <button onClick={() => setFilter('completed')} className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${filter === 'completed' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Completed</button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-slate-50">Tasks</h2>
              <TaskList tasks={filteredTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
