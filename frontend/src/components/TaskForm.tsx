"use client";

import { useState, useEffect } from "react";

interface TaskFormProps {
  onSubmit: (id: number | null, title: string, description?: string, completed?: boolean) => void;
  initialData?: { id: number; title: string; description?: string; completed: boolean } | null;
  onCancel?: () => void;
  isAuthenticated: boolean; // Add isAuthenticated prop
}

export default function TaskForm({ onSubmit, initialData, onCancel, isAuthenticated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setCompleted(initialData.completed || false);
    } else {
      setTitle("");
      setDescription("");
      setCompleted(false);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Optionally, show a visual cue that the form is disabled due to not being logged in
      return;
    }
    onSubmit(initialData?.id ?? null, title, description, completed);
    if (!initialData) {
      setTitle("");
      setDescription("");
      setCompleted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-slate-50"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={!isAuthenticated} // Disable if not authenticated
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-300">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-slate-50"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!isAuthenticated} // Disable if not authenticated
        ></textarea>
      </div>
      {initialData && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-slate-600 rounded"
            disabled={!isAuthenticated} // Disable if not authenticated
          />
          <label htmlFor="completed" className="ml-2 block text-sm font-semibold text-slate-300">
            Completed
          </label>
        </div>
      )}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-50 bg-slate-600 border border-slate-500 rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled={!isAuthenticated} // Disable if not authenticated
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-lg shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          disabled={!isAuthenticated} // Disable if not authenticated
        >
          {initialData ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
}