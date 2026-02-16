"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TimerSection } from "@/components/TimerSection";
import { Task, TaskList } from "@/components/TaskList";

type Mode = "focus" | "short" | "long";

type Settings = {
  focusMinutes: number;
  shortMinutes: number;
  longMinutes: number;
};

const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  shortMinutes: 5,
  longMinutes: 15,
};

const STORAGE_KEY_STATE = "ff-state-v1";

const TICK_SOUND_URL =
  "https://cdn.jsdelivr.net/gh/john-smilga/javascript-basic-projects@master/09-counter/sounds/click.wav";

export default function HomePage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<Mode>("focus");
  const [remainingSeconds, setRemainingSeconds] = useState(
    DEFAULT_SETTINGS.focusMinutes * 60
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------- Init ---------------- */

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_STATE);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const loadedSettings = parsed.settings ?? DEFAULT_SETTINGS;
      setSettings(loadedSettings);
      setRemainingSeconds(loadedSettings.focusMinutes * 60);
    } catch { }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_STATE,
      JSON.stringify({ settings })
    );
  }, [settings]);

  /* ---------------- Audio Setup ---------------- */

  useEffect(() => {
    audioRef.current = new Audio(TICK_SOUND_URL);
    audioRef.current.volume = 0.25;
  }, []);

  const playTick = useCallback(() => {
    if (isMuted || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  }, [isMuted]);

  /* ---------------- Timer Logic ---------------- */

  const totalSeconds = useMemo(() => {
    if (mode === "focus") return settings.focusMinutes * 60;
    if (mode === "short") return settings.shortMinutes * 60;
    return settings.longMinutes * 60;
  }, [mode, settings]);

  const progress = 1 - remainingSeconds / totalSeconds;

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleComplete = useCallback(() => {
    stopTimer();
    setIsRunning(false);
    playTick();
  }, [playTick]);

  useEffect(() => {
    if (!isRunning) {
      stopTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }

        playTick();
        return prev - 1;
      });
    }, 1000);

    return stopTimer;
  }, [isRunning, handleComplete, playTick]);

  /* ---------------- Controls ---------------- */

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    stopTimer();
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const switchMode = (next: Mode) => {
    stopTimer();
    setIsRunning(false);
    setMode(next);

    const base =
      next === "focus"
        ? settings.focusMinutes
        : next === "short"
          ? settings.shortMinutes
          : settings.longMinutes;

    setRemainingSeconds(base * 60);
  };

  /* ---------------- Formatting ---------------- */

  const formattedTime = useMemo(() => {
    const h = Math.floor(remainingSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((remainingSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (remainingSeconds % 60)
      .toString()
      .padStart(2, "0");

    return `${h}:${m}:${s}`;
  }, [remainingSeconds]);

  /* ---------------- Keyboard Shortcuts ---------------- */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleStartPause();
      }
      if (e.key === "r") handleReset();
      if (e.key === "1") switchMode("focus");
      if (e.key === "2") switchMode("short");
      if (e.key === "3") switchMode("long");
      if (e.key === "Escape") exitFocusMode();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [totalSeconds]);

  /* ---------------- Focus Mode ---------------- */

  useEffect(() => {
    if (!focusMode) {
      setCursorHidden(false);
      return;
    }

    let timeout: number;

    const handleMove = () => {
      setCursorHidden(false);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => setCursorHidden(true), 2000);
    };

    window.addEventListener("mousemove", handleMove);
    timeout = window.setTimeout(() => setCursorHidden(true), 2000);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearTimeout(timeout);
    };
  }, [focusMode]);

  const enterFocusMode = () => {
    setFocusMode(true);
    document.documentElement.requestFullscreen?.();
  };

  const exitFocusMode = () => {
    setFocusMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  };

  /* ---------------- Tasks ---------------- */

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  /* ---------------- UI ---------------- */

  return (
    <main
      className={`min-h-screen bg-black text-white px-4 transition-colors ${focusMode && cursorHidden ? "cursor-none" : ""
        }`}
    >
      <TimerSection
        mode={mode}
        onModeChange={switchMode}
        formattedTime={formattedTime}
        progress={progress}
        isRunning={isRunning}
        onStartPause={handleStartPause}
        onReset={handleReset}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((m) => !m)}
        focusMode={focusMode}
        onEnterFocus={enterFocusMode}
      />

      {!focusMode && (
        <div className="w-full max-w-3xl mx-auto">
          <TaskList
            tasks={tasks}
            onAddTask={(title) =>
              setTasks((prev) => [
                { id: crypto.randomUUID(), title, done: false },
                ...prev,
              ])
            }
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </div>
      )}
    </main>
  );
}
