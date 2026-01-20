"use client";

import Link from "next/link";
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
  isAuthenticated: boolean;
}

export default function TaskList({ tasks, onEdit, onDelete, isAuthenticated }: TaskListProps) {
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const mainNoTasksMessage = (
    <p className="text-center text-slate-400">
      You’re all set to begin!  Add your first task and stay organized.
      {!isAuthenticated && (
        <>
          {' '}
          <Link href='/auth/login' className='underline'>Log in</Link> to start managing your tasks.
        </>
      )}
    </p>
  );

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        mainNoTasksMessage
      ) : (
        <>
          {/* Incomplete Tasks Section */}
          <div>
            {incompleteTasks.length === 0 ? (
              <p className="text-center text-slate-400">No incomplete tasks.</p>
            ) : (
              <ul className="divide-y divide-slate-700 border border-slate-700 rounded-md">
                {incompleteTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} isAuthenticated={isAuthenticated} isCompleted={task.completed} />
                ))}
              </ul>
            )}
          </div>

          {/* Completed Tasks Section */}
          <div>
            {completedTasks.length === 0 ? (
              <p className="text-center text-slate-400">No completed tasks.</p>
            ) : (
              <ul className="divide-y divide-slate-700 border border-slate-700 rounded-md">
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} isAuthenticated={isAuthenticated} isCompleted={task.completed} />
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

