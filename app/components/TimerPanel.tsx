"use client";

import { useEffect, useMemo, useState } from "react";

type TimerMode = "focus" | "short" | "long";

type Durations = {
  focus: number; // minutes
  short: number;
  long: number;
};

type TimerPanelProps = {
  activeTaskTitle: string | null;
};

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function TimerPanel({ activeTaskTitle }: TimerPanelProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [durations, setDurations] = useState<Durations>({
    focus: 25,
    short: 5,
    long: 15,
  });
  const [secondsLeft, setSecondsLeft] = useState(durations.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Reset timer when mode changes
  useEffect(() => {
    setSecondsLeft(durations[mode] * 60);
    setIsRunning(false);
  }, [mode, durations]);

  // Main timer interval
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const totalSecondsForMode = useMemo(
    () => durations[mode] * 60,
    [durations, mode]
  );

  const progress = useMemo(() => {
    if (!totalSecondsForMode) return 0;
    return ((totalSecondsForMode - secondsLeft) / totalSecondsForMode) * 100;
  }, [secondsLeft, totalSecondsForMode]);

  const handleStartPause = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSecondsForMode);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setSecondsLeft(totalSecondsForMode);
    setIsRunning(false);
  };

  const handleDurationChange = (key: keyof Durations, value: string) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) return;

    const safe = Math.min(Math.max(parsed, 1), 180); // 1–180 minutes
    setDurations((prev) => {
      const next = { ...prev, [key]: safe };
      if (key === mode) {
        setSecondsLeft(next[mode] * 60);
        setIsRunning(false);
      }
      return next;
    });
  };

  const modeLabel =
    mode === "focus" ? "Focus" : mode === "short" ? "Short Break" : "Long Break";

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-2 py-1">
          <span className="h-2 w-2 rounded-full bg-[#f97362]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Focus mode
          </span>
        </div>
        {activeTaskTitle && (
          <div className="max-w-xs text-right">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
              Current task
            </p>
            <p className="mt-1 text-xs sm:text-sm font-medium line-clamp-2 text-slate-800">
              {activeTaskTitle}
            </p>
          </div>
        )}
      </header>

      {/* Mode Switcher */}
      <div className="inline-flex items-center gap-2 rounded-full bg-[#f5f5f7] p-1 text-[11px] font-medium text-slate-500">
        {([
          ["focus", "Focus"],
          ["short", "Short break"],
          ["long", "Long break"],
        ] as [TimerMode, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={`px-3 sm:px-4 py-1.5 rounded-full transition-all ${
              mode === value
                ? "bg-[#f97362] text-white shadow-[0_10px_18px_rgba(248,113,113,0.4)]"
                : "bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative h-52 w-52">
          <div className="absolute inset-0 rounded-full bg-transparent" />
          <div
            className="absolute inset-[4px] rounded-full border border-[#f97362]/20"
            style={{
              backgroundImage:
                "conic-gradient(#f97362 " +
                progress +
                "%, #fee2e2 " +
                progress +
                "%)",
            }}
          />
          <div className="absolute inset-[18px] rounded-full bg-white flex items-center justify-center shadow-[0_20px_40px_rgba(148,163,184,0.28)]">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400 mb-2">
                {modeLabel}
              </p>
              <p className="text-5xl sm:text-6xl font-semibold tabular-nums tracking-tight text-slate-900">
                {formatTime(secondsLeft)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={handleStartPause}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#f97362] px-10 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(248,113,113,0.6)] transition hover:bg-[#f9604d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fb923c]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {isRunning ? "Pause" : secondsLeft === 0 ? "Restart" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-xs sm:text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Reset
        </button>
      </div>

      {/* Timer settings */}
      <div className="mt-2 mb-2">
        <button
          type="button"
          onClick={() => setShowSettings((prev) => !prev)}
          className="mx-auto flex items-center gap-1 text-[11px] font-medium text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
        >
          {showSettings ? "Hide timer settings" : "Edit timer durations"}
        </button>
      </div>

      {showSettings && (
        <div className="mb-1 grid grid-cols-1 gap-3 text-[11px] text-slate-500 sm:grid-cols-3">
          {(
            [
              ["focus", "Focus"],
              ["short", "Short break"],
              ["long", "Long break"],
            ] as [keyof Durations, string][]
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <span className="flex items-center justify-between">
                <span>{label}</span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Min
                </span>
              </span>
              <input
                type="number"
                min={1}
                max={180}
                value={durations[key]}
                onChange={(e) => handleDurationChange(key, e.target.value)}
                className="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-right text-xs text-slate-900 outline-none focus-visible:ring-1 focus-visible:ring-[#fb923c]/70"
              />
            </label>
          ))}
        </div>
      )}

      <p className="mt-1 text-[11px] text-center text-slate-400">
        Keep your sessions short and intentional. Tap Start to begin focusing.
      </p>
    </section>
  );
}

