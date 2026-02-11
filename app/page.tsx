"use client";

import { useState } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { TimerPanel } from "./components/TimerPanel";
import { TaskPanel } from "./components/TaskPanel";

export default function Home() {
  const [activeTaskTitle, setActiveTaskTitle] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-slate-900 flex items-center justify-center px-4 py-8 font-sans">
      <main className="w-full max-w-5xl">
        <div className="relative rounded-[32px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden">
          {/* Top bar */}
          <header className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#ffe2dd] flex items-center justify-center text-[18px]">
                🍅
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  Pomodoro
                </h1>
                <p className="text-[11px] text-slate-400">
                  Stay focused, one session at a time.
                </p>
              </div>
            </div>
            <ThemeToggle />
          </header>

          {/* Content split */}
          <div className="grid gap-0 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="px-8 py-6">
              <TimerPanel activeTaskTitle={activeTaskTitle} />
            </div>
            <div className="border-t md:border-t-0 md:border-l border-slate-100 bg-[#f8fafc] px-8 py-6">
              <TaskPanel onActiveTaskChange={setActiveTaskTitle} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

