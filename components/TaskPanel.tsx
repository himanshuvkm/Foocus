"use client";

import { motion, Reorder } from "framer-motion";
import { Plus, CheckCircle2, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type Task = {
  id: string;
  title: string;
  estimate: number;
  completedPomodoros: number;
  done: boolean;
};

interface TaskPanelProps {
  tasks: Task[];
  onChange(tasks: Task[]): void;
  onSelectTask?(id: string | null): void;
  activeTaskId: string | null;
}

export function TaskPanel({
  tasks,
  onChange,
  activeTaskId,
  onSelectTask,
}: TaskPanelProps) {
  const [draftTitle, setDraftTitle] = useState("");
  const [draftEstimate, setDraftEstimate] = useState(1);

  const handleAdd = () => {
    if (!draftTitle.trim()) return;
    const next: Task = {
      id: crypto.randomUUID(),
      title: draftTitle.trim(),
      estimate: Math.max(1, draftEstimate),
      completedPomodoros: 0,
      done: false,
    };
    onChange([next, ...tasks]);
    setDraftTitle("");
    setDraftEstimate(1);
  };

  const toggleDone = (id: string) => {
    onChange(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done,
            }
          : t
      )
    );
  };

  const removeTask = (id: string) => {
    onChange(tasks.filter((t) => t.id !== id));
    if (activeTaskId === id && onSelectTask) onSelectTask(null);
  };

  const handleReorder = (next: Task[]) => {
    onChange(next);
  };

  return (
    <motion.section
      layout
      className="glass-card h-full flex flex-col p-4 sm:p-5 lg:p-6 gap-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            Tasks
          </h2>
          <p className="text-xs text-slate-500">
            Plan your focus with Pomodoros
          </p>
        </div>
        <span className="chip px-3 py-1 text-[11px] text-slate-300">
          {tasks.filter((t) => !t.done).length} active ·{" "}
          {tasks.filter((t) => t.done).length} done
        </span>
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            placeholder="Define your next deep work block…"
            className="flex-1 rounded-full bg-slate-900/80 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <input
            type="number"
            min={1}
            max={12}
            value={draftEstimate}
            onChange={(e) =>
              setDraftEstimate(Math.max(1, Number(e.target.value) || 1))
            }
            className="w-16 rounded-full bg-slate-900/80 border border-slate-700/80 px-3 py-2 text-xs text-center text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          />
          <Button
            type="button"
            size="md"
            variant="primary"
            onClick={handleAdd}
            className="hidden sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
          <Button
            type="button"
            size="icon"
            variant="primary"
            onClick={handleAdd}
            className="sm:hidden"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[11px] text-slate-500 flex items-center justify-between">
          <span>Estimate in Pomodoros</span>
          <span className="text-slate-400">
            1 Pomodoro ≈ 25 minutes of focus
          </span>
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pt-1">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-xs text-slate-500 gap-2">
            <p>No tasks yet.</p>
            <p className="text-slate-600">
              Use the input above to create your first focus block.
            </p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={tasks}
            onReorder={handleReorder}
            className="flex flex-col gap-2"
          >
            {tasks.map((task) => (
              <Reorder.Item
                key={task.id}
                value={task}
                className={`group rounded-2xl border px-3 py-2.5 text-sm flex items-center gap-2 cursor-pointer transition-colors ${
                  task.done
                    ? "bg-slate-900/60 border-slate-800/80"
                    : "bg-slate-900/40 border-slate-700/70 hover:bg-slate-900/80"
                } ${
                  activeTaskId === task.id
                    ? "ring-1 ring-accent/70 ring-offset-1 ring-offset-slate-950"
                    : ""
                }`}
                onClick={() => onSelectTask?.(task.id)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDone(task.id);
                  }}
                  className="rounded-full p-1 text-slate-500 hover:text-accent hover:bg-slate-800/80 transition-colors"
                >
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      task.done ? "text-accent" : "text-slate-500"
                    }`}
                  />
                </button>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate ${
                        task.done
                          ? "text-slate-500 line-through decoration-slate-700"
                          : "text-slate-100"
                      }`}
                    >
                      {task.title}
                    </p>
                    <span className="chip px-2 py-0.5 text-[10px] text-slate-300">
                      {task.completedPomodoros}/{task.estimate} pomos
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {Math.round(task.estimate * 0.4)}–{task.estimate * 0.5}h
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTask(task.id);
                  }}
                  className="rounded-full p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <span className="ml-1 text-slate-600 group-hover:text-slate-400 transition-colors">
                  <GripVertical className="h-4 w-4" />
                </span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
    </motion.section>
  );
}

