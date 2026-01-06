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
}

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
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
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onEdit(task)}
          className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg shadow-sm transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
