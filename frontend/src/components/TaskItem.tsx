"use client";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  isAuthenticated: boolean; // Add isAuthenticated prop
}

export default function TaskItem({ task, onEdit, onDelete, isAuthenticated }: TaskItemProps) {
  return (
    <li
      className={`p-4 my-2 rounded-lg shadow-sm flex items-center justify-between transition-colors duration-200 ${
        task.completed ? "bg-slate-700" : "bg-slate-800"
      }`}
    >
      <div className="flex-grow">
        <h3
          className={`text-lg font-semibold ${
            task.completed ? "line-through text-slate-500" : "text-slate-50"
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={`text-sm mt-1 ${
              task.completed ? "line-through text-slate-600" : "text-slate-400"
            }`}
          >
            {task.description}
          </p>
        )}
      </div>
    </li>
  );
}