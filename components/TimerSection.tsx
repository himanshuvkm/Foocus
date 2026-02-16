"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Keyboard,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimerCircle } from "@/components/TimerCircle";

type Mode = "focus" | "short" | "long";

interface TimerSectionProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  formattedTime: string;
  progress: number;
  isRunning: boolean;
  onStartPause: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  focusMode: boolean;
  onEnterFocus: () => void;
}

/* ---------------- Digit Animation Component ---------------- */

function AnimatedDigit({ digit }: { digit: string }) {
  return (
    <div className="relative w-[0.65em] h-[1em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Timer Section ---------------- */

export function TimerSection({
  mode,
  onModeChange,
  formattedTime,
  progress,
  isRunning,
  onStartPause,
  onReset,
  isMuted,
  onToggleMute,
  focusMode,
  onEnterFocus,
}: TimerSectionProps) {
  return (
    <motion.div
      className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12 py-16 bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header (Hidden in Focus Mode) */}
      {!focusMode && (
        <div className="w-full flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-600">
          <div className="space-y-2">
            <h1 className="tracking-[0.4em] text-neutral-500">
              Pomodoro
            </h1>
            <p className="flex items-center gap-2 normal-case tracking-normal text-neutral-600">
              <Keyboard className="h-3 w-3" />
              Space · R · 1/2/3 · Esc
            </p>
          </div>

          <button
            type="button"
            onClick={onEnterFocus}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Focus
          </button>
        </div>
      )}

      {/* Mode Switch */}
      {!focusMode && (
        <div className="flex gap-8 text-[11px] uppercase tracking-[0.25em]">
          {(["focus", "short", "long"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`relative transition-colors ${
                mode === m
                  ? "text-white"
                  : "text-neutral-600 hover:text-neutral-300"
              }`}
            >
              {m === "focus"
                ? "Focus"
                : m === "short"
                ? "Short"
                : "Long"}

              {mode === m && (
                <motion.div
                  layoutId="modeUnderline"
                  className="absolute -bottom-2 left-0 right-0 h-[1px] bg-white"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Timer Circle */}
      <div className="relative mt-4">
        <TimerCircle
          progress={progress}
          mode={mode}
          isRunning={isRunning}
        />

        {/* Time Display */}
        <div className="absolute inset-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex font-mono font-light text-7xl sm:text-8xl tracking-tight">
            {formattedTime.split("").map((char, index) =>
              char === ":" ? (
                <span
                  key={index}
                  className="px-2 opacity-60 select-none"
                >
                  :
                </span>
              ) : (
                <AnimatedDigit key={index} digit={char} />
              )
            )}
          </div>

          <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-neutral-600">
            {mode}
          </p>
        </div>
      </div>

      {/* Controls (Hidden in Focus Mode) */}
      {!focusMode && (
        <div className="flex items-center gap-8 mt-4">
          <Button
            onClick={onStartPause}
            className="px-12 py-6 rounded-full bg-white text-black hover:bg-neutral-200 transition-all"
          >
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <button
            onClick={onReset}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={onToggleMute}
            className="text-[10px] uppercase tracking-wider text-neutral-600 hover:text-white"
          >
            {isMuted ? "Sound Off" : "Sound On"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
