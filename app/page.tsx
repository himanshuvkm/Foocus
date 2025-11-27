"use client"

import Header from "@/components/Header";
import { PomodoroTimer } from "@/components/pomodoro";
import Stopwatch from "@/components/stopwatch";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("timer");

  return (
   <div className="flex min-h-screen flex-col ">
  
  <div>
    <Header />
  </div>

     <div className="w-full py-10 flex flex-col items-center gap-6 ">

      <div className="flex bg-zinc-900 p-2 rounded-full shadow-lg gap-2">
        
        <button
          onClick={() => setMode("timer")}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all",
            mode === "timer"
              ? "bg-zinc-800 text-white shadow-md"
              : "text-zinc-400 hover:text-white"
          )}
        >
          Timer
        </button>

        <button
          onClick={() => setMode("stopwatch")}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all",
            mode === "stopwatch"
              ? "bg-zinc-800 text-white shadow-md"
              : "text-zinc-400 hover:text-white"
          )}
        >
          Stopwatch
        </button>

      </div>

      {mode === "timer" ? <PomodoroTimer /> : <Stopwatch />}
    </div>

</div>

  )
}

