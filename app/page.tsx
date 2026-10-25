"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mode, TimerSection } from "@/components/TimerSection";
import { Task, TaskList } from "@/components/TaskList";
import { Settings, SettingsModal } from "@/components/SettingsModal";

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
  const [timerSeconds, setTimerSeconds] = useState(
    DEFAULT_SETTINGS.focusMinutes * 60
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------- Hydration & Persistence ---------------- */

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_STATE);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.settings) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSettings(parsed.settings);
          setTimerSeconds(parsed.settings.focusMinutes * 60);
        }
        if (Array.isArray(parsed.tasks)) {
          setTasks(parsed.tasks);
        }
      } catch {
        // Fall back to defaults
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(
      STORAGE_KEY_STATE,
      JSON.stringify({ settings, tasks })
    );
  }, [settings, tasks, isHydrated]);

  /* ---------------- Audio Setup ---------------- */

  useEffect(() => {
    audioRef.current = new Audio(TICK_SOUND_URL);
    audioRef.current.volume = 0.25;
  }, []);

  const playTick = useCallback(() => {
    if (isMuted || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play().catch(() => {});
  }, [isMuted]);

  const playCompletionChime = useCallback(() => {
    if (isMuted) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Two warm harmonic bell tones: C5 (523.25Hz) and E5 (659.25Hz)
      [523.25, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.2, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 1.2);
      });
    } catch {
      // AudioContext policy fallback
    }
  }, [isMuted]);

  const triggerNotification = useCallback(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification("Foocus", {
        body: `${
          mode === "focus" ? "Focus session" : "Break"
        } complete! Take a breath.`,
        icon: "/favicon.ico",
      });
    }
  }, [mode]);

  const requestNotificationPermission = () => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      void Notification.requestPermission();
    }
  };

  /* ---------------- Timer Calculations ---------------- */

  const totalSeconds = useMemo(() => {
    if (mode === "focus") return settings.focusMinutes * 60;
    if (mode === "short") return settings.shortMinutes * 60;
    if (mode === "long") return settings.longMinutes * 60;
    return 0;
  }, [mode, settings]);

  const progress = useMemo(() => {
    if (mode === "stopwatch") return 1;
    if (totalSeconds <= 0) return 0;
    return 1 - timerSeconds / totalSeconds;
  }, [mode, timerSeconds, totalSeconds]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleComplete = useCallback(() => {
    stopTimer();
    setIsRunning(false);
    playCompletionChime();
    triggerNotification();
  }, [stopTimer, playCompletionChime, triggerNotification]);

  useEffect(() => {
    if (!isRunning) {
      stopTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      if (mode === "stopwatch") {
        setTimerSeconds((prev) => {
          playTick();
          return prev + 1;
        });
      } else {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          playTick();
          return prev - 1;
        });
      }
    }, 1000);

    return stopTimer;
  }, [isRunning, mode, handleComplete, playTick, stopTimer]);

  /* ---------------- Controls ---------------- */

  const handleStartPause = useCallback(() => {
    requestNotificationPermission();
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    stopTimer();
    setIsRunning(false);
    if (mode === "stopwatch") {
      setTimerSeconds(0);
    } else {
      setTimerSeconds(totalSeconds);
    }
  }, [stopTimer, mode, totalSeconds]);

  const switchMode = useCallback(
    (next: Mode) => {
      stopTimer();
      setIsRunning(false);
      setMode(next);

      if (next === "stopwatch") {
        setTimerSeconds(0);
      } else {
        const base =
          next === "focus"
            ? settings.focusMinutes
            : next === "short"
            ? settings.shortMinutes
            : settings.longMinutes;
        setTimerSeconds(base * 60);
      }
    },
    [stopTimer, settings]
  );

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    if (!isRunning) {
      if (mode === "focus") setTimerSeconds(newSettings.focusMinutes * 60);
      if (mode === "short") setTimerSeconds(newSettings.shortMinutes * 60);
      if (mode === "long") setTimerSeconds(newSettings.longMinutes * 60);
    }
  };

  /* ---------------- Formatting ---------------- */

  const formattedTime = useMemo(() => {
    const h = Math.floor(timerSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((timerSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (timerSeconds % 60).toString().padStart(2, "0");

    return `${h}:${m}:${s}`;
  }, [timerSeconds]);

  /* ---------------- Document Title ---------------- */

  useEffect(() => {
    if (isRunning) {
      const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1);
      document.title = `${formattedTime} - ${modeLabel} | Foocus`;
    } else {
      document.title = "Foocus";
    }
  }, [isRunning, formattedTime, mode]);

  /* ---------------- Focus Mode ---------------- */

  const enterFocusMode = () => {
    setFocusMode(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const exitFocusMode = useCallback(() => {
    setFocusMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFocusMode(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    if (!focusMode) return;

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
      setCursorHidden(false);
    };
  }, [focusMode]);

  /* ---------------- Keyboard Shortcuts ---------------- */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in any input/textarea
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleStartPause();
      }
      if (e.key === "r" || e.key === "R") {
        handleReset();
      }
      if (e.key === "1") switchMode("focus");
      if (e.key === "2") switchMode("short");
      if (e.key === "3") switchMode("long");
      if (e.key === "4") switchMode("stopwatch");
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else {
          exitFocusMode();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    handleStartPause,
    handleReset,
    switchMode,
    isSettingsOpen,
    exitFocusMode,
  ]);

  /* ---------------- Tasks ---------------- */

  const addTask = (title: string) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    setTasks((prev) => [{ id, title, done: false }, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  /* ---------------- UI ---------------- */

  return (
    <main
      className={`min-h-screen bg-black text-white px-4 transition-colors ${
        focusMode
          ? `flex flex-col items-center justify-center h-screen overflow-hidden ${
              cursorHidden ? "cursor-none" : ""
            }`
          : ""
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
        onToggleMute={() => {
          requestNotificationPermission();
          setIsMuted((m) => !m);
        }}
        focusMode={focusMode}
        cursorHidden={cursorHidden}
        onEnterFocus={enterFocusMode}
        onExitFocus={exitFocusMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {!focusMode && (
        <div className="w-full max-w-3xl mx-auto pb-16">
          <TaskList
            tasks={tasks}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </main>
  );
}
