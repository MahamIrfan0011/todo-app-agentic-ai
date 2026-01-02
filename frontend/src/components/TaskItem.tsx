"use client";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

interface TaskItemProps {
  task: Task;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskItemProps) {
  return (
    <li className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id, !task.completed)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <div className="ml-3">
          <p
            className={`text-lg font-medium text-gray-900 ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p
              className={`text-sm text-gray-500 ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onEdit(task.id)}
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
