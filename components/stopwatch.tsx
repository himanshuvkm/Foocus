"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils"; // remove if not using cn()

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const formatTime = (ms: number) => {
    const milliseconds = Math.floor((ms % 1000) / 10)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor(ms / 60000)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const addLap = () => {
    if (!running) return;
    setLaps((prev) => [...prev, time]);
  };

  const reset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl shadow-2xl text-white">

      <h2 className="text-center text-xl font-semibold text-zinc-300 mb-10 tracking-wide">
        Stopwatch
      </h2>

     
      <div className="text-center mb-10">
        <div className="text-[5rem] leading-none font-bold tracking-tight">
          {formatTime(time)}
        </div>
      </div>

   
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => setRunning(true)}
          className={cn(
            "flex-1 h-16 rounded-2xl bg-zinc-800 text-lg font-bold uppercase tracking-widest transition-all",
            running ? "text-zinc-600 cursor-not-allowed" : "text-white hover:bg-zinc-700"
          )}
          disabled={running}
        >
          Start
        </button>

        <button
          onClick={() => setRunning(false)}
          className={cn(
            "flex-1 h-16 rounded-2xl bg-zinc-800 text-lg font-bold uppercase tracking-widest transition-all",
            !running ? "text-zinc-600 cursor-not-allowed" : "text-white hover:bg-zinc-700"
          )}
          disabled={!running}
        >
          Pause
        </button>

        <button
          onClick={reset}
          className="flex-1 h-16 rounded-2xl bg-zinc-800 text-lg font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
        >
          Reset
        </button>
      </div>

      <button
        onClick={addLap}
        disabled={!running}
        className={cn(
          "w-full h-14 mb-6 rounded-2xl bg-zinc-800 text-lg font-semibold uppercase tracking-wide transition-all",
          running ? "text-white hover:bg-zinc-700" : "text-zinc-600 cursor-not-allowed"
        )}
      >
        Add Flag
      </button>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {laps.length === 0 ? (
          <p className="text-center text-zinc-500"></p>
        ) : (
          laps.map((lap, index) => (
            <div
              key={index}
              className="flex justify-between bg-zinc-800 px-5 py-3 rounded-xl border border-zinc-700"
            >
              <span className="font-medium text-zinc-400">Flag {index + 1}</span>
              <span className="font-mono text-white">{formatTime(lap)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
