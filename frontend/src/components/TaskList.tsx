"use client";

import TaskItem from "./TaskItem";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  isAuthenticated: boolean; // Add isAuthenticated prop
}

export default function TaskList({ tasks, onEdit, onDelete, isAuthenticated }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-slate-400">No tasks yet. Add one to get started!</p>
      ) : (
        <ul className="divide-y divide-slate-700">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} isAuthenticated={isAuthenticated} />
          ))}
        </ul>
      )}
    </div>
  );
}

