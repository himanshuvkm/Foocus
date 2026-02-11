"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

type TaskPanelProps = {
  onActiveTaskChange?: (title: string | null) => void;
};

export function TaskPanel({ onActiveTaskChange }: TaskPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  // Keep parent informed of current active task title
  useEffect(() => {
    if (!onActiveTaskChange) return;
    const active = tasks.find((t) => t.id === activeTaskId) ?? null;
    onActiveTaskChange(active ? active.title : null);
  }, [tasks, activeTaskId, onActiveTaskChange]);

  const handleAddTask = () => {
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: trimmed,
        done: false,
      },
    ]);
    setNewTaskTitle("");
  };

  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setActiveTaskId((prev) => (prev === id ? null : prev));
  };

  const remainingCount = tasks.filter((t) => !t.done).length;
  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <section className="flex flex-col h-full">
      <header className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-800">
            Tasks
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Plan what you&apos;ll focus on in each session.
          </p>
        </div>
      </header>

      {/* Add Task */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTask();
            }
          }}
          placeholder="Add a task and press Enter"
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-inner shadow-black/5 outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
        />
        <button
          onClick={handleAddTask}
          className="inline-flex items-center justify-center rounded-2xl bg-[#f97362] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(248,113,113,0.35)] transition hover:bg-[#f9604d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fb923c]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8fafc]"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {tasks.length === 0 ? (
          <p className="px-1 py-3 text-[11px] text-slate-500">
            No tasks yet. Start by adding one thing you want to complete.
          </p>
        ) : (
          tasks.map((task) => {
            const isActive = activeTaskId === task.id;
            return (
              <div
                key={task.id}
                className={`group flex items-center gap-3 rounded-2xl bg-white px-3 py-3 text-xs sm:text-sm shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition ${
                  isActive
                    ? "ring-1 ring-[#f97362]/40"
                    : "hover:translate-y-[1px] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)]"
                }`}
              >
                <div className="h-9 w-1.5 rounded-full bg-gradient-to-b from-[#f97362] to-[#fb923c]" />
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold transition ${
                    task.done
                      ? "border-emerald-400 bg-emerald-400 text-slate-950"
                      : "border-slate-300 text-slate-400 group-hover:border-slate-400"
                  }`}
                  aria-label={task.done ? "Mark as incomplete" : "Mark as done"}
                >
                  {task.done ? "✓" : ""}
                </button>
                <button
                  onClick={() =>
                    setActiveTaskId((prev) => (prev === task.id ? null : task.id))
                  }
                  className="flex-1 text-left"
                >
                  <span
                    className={`block text-[13px] ${
                      task.done
                        ? "text-slate-400 line-through"
                        : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </span>
                  {isActive && (
                    <span className="mt-0.5 inline-block text-[10px] font-medium uppercase tracking-[0.16em] text-[#f97362]">
                      Active
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-1 rounded-full p-1 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-50 hover:text-slate-500"
                  aria-label="Delete task"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <footer className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          {remainingCount} remaining • {completedCount} completed
        </span>
        <button
          type="button"
          onClick={() => {
            setTasks((prev) => prev.filter((t) => !t.done));
            setActiveTaskId((prev) => {
              const stillExists = tasks.some((t) => t.id === prev && !t.done);
              return stillExists ? prev : null;
            });
          }}
          className="underline-offset-2 hover:underline"
        >
          Clear completed
        </button>
      </footer>
    </section>
  );
}

