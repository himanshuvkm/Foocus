"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type Task = {
  id: string;
  title: string;
  done: boolean;
};

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const title = input.trim();
    if (!title) return;
    onAddTask(title);
    setInput("");
  };

  return (
    <section className="w-full mt-10 border-t border-neutral-900 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-600">
          Tasks
        </span>
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          placeholder="Define next focus block…"
          className="flex-1 bg-black border-b border-neutral-800 
                     focus:outline-none focus:border-white
                     text-sm text-white placeholder:text-neutral-700 
                     py-2 transition-colors"
        />

        <button
          type="button"
          onClick={handleAdd}
          className="text-[11px] uppercase tracking-wider text-neutral-500 hover:text-white transition-colors"
        >
          Add
        </button>
      </div>

      {/* List */}
      <div className="space-y-4 text-sm">
        {tasks.length === 0 && (
          <p className="text-[11px] text-neutral-700">
            No tasks yet.
          </p>
        )}

        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="group flex items-center justify-between border-b border-neutral-900 pb-3"
            >
              <button
                type="button"
                onClick={() => onToggleTask(task.id)}
                className="flex-1 text-left"
              >
                <span
                  className={`transition-all duration-200 ${
                    task.done
                      ? "text-neutral-700 line-through"
                      : "text-neutral-200"
                  }`}
                >
                  {task.title}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="ml-4 opacity-0 group-hover:opacity-100 text-neutral-700 hover:text-white transition-all duration-200"
                aria-label="Delete task"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
