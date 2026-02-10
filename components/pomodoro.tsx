"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type TimerMode = "pomodoro" | "short" | "long"

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const switchMode = (newMode: TimerMode) => {
    const times = {
      pomodoro: 25 * 60,
      short: 5 * 60,
      long: 15 * 60,
    }
    setMode(newMode)
    setTimeLeft(times[newMode])
    setIsActive(false)
  }

  const handleStart = () => setIsActive(true)
  const handlePause = () => setIsActive(false)

  const handleReset = () => {
    setIsActive(false)
    const times = {
      pomodoro: 25 * 60,
      short: 5 * 60,
      long: 15 * 60,
    }
    setTimeLeft(times[mode])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl shadow-2xl">
      {/* Navigation Tabs */}
      <div className="flex justify-center gap-2 mb-12">
        <button
          onClick={() => switchMode("pomodoro")}
          className={cn(
            "px-4 py-1 rounded-full text-sm font-medium transition-all",
            mode === "pomodoro" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white",
          )}
        >
          Pomodoro
        </button>
        <button
          onClick={() => switchMode("short")}
          className={cn(
            "px-4 py-1 rounded-full text-sm font-medium transition-all",
            mode === "short" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white",
          )}
        >
          Short Break
        </button>
        <button
          onClick={() => switchMode("long")}
          className={cn(
            "px-4 py-1 rounded-full text-sm font-medium transition-all",
            mode === "long" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white",
          )}
        >
          Long Break
        </button>
      </div>

   
      <div className="text-center mb-12">
        <div className="text-[7rem] leading-none font-bold text-white tracking-tight">{formatTime(timeLeft)}</div>
      </div>


      <div className="flex gap-4">
        <button
          onClick={handleStart}
          className={cn(
            "flex-1 h-20 rounded-2xl bg-zinc-800 text-xl font-bold uppercase tracking-widest transition-colors",
            isActive ? "text-zinc-600 cursor-not-allowed" : "text-white hover:bg-zinc-700",
          )}
        >
          Start
        </button>
        <button
          onClick={handlePause}
          className={cn(
            "flex-1 h-20 rounded-2xl bg-zinc-800 text-xl font-bold uppercase tracking-widest transition-colors",
            !isActive ? "text-zinc-600 cursor-not-allowed" : "text-white hover:bg-zinc-700",
          )}
        >
          Pause
        </button>
        <button
          onClick={handleReset}
          className="flex-1 h-20 rounded-2xl bg-zinc-800 text-xl font-bold uppercase tracking-widest text-zinc-600 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          Stop
        </button>
      </div>
    </div>
  )
}