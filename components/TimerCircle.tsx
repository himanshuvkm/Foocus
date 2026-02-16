"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

interface TimerRectProps {
  progress: number; // 0–1
  mode: "focus" | "short" | "long";
  isRunning: boolean;
}

const WIDTH = 700;
const HEIGHT = 320;
const STROKE = 6;
const RADIUS = 24; // corner roundness

// Rectangle perimeter formula
const PERIMETER = 2 * (WIDTH + HEIGHT - 2 * RADIUS * 2) + 2 * Math.PI * RADIUS;

export function TimerCircle({
  progress,
  mode,
  isRunning,
}: TimerRectProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    const offset = PERIMETER * (1 - progress);

    controls.start({
      strokeDashoffset: offset,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  }, [progress, controls]);

  const activeStroke =
    mode === "focus"
      ? "rgba(255,255,255,0.9)"
      : "rgba(255,255,255,0.4)";

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={WIDTH}
        height={HEIGHT}
        className="relative"
      >
        {/* Background Track */}
        <rect
          x={STROKE}
          y={STROKE}
          width={WIDTH - STROKE * 2}
          height={HEIGHT - STROKE * 2}
          rx={RADIUS}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={STROKE}
          fill="transparent"
        />

        {/* Animated Progress Border */}
        <motion.rect
          x={STROKE}
          y={STROKE}
          width={WIDTH - STROKE * 2}
          height={HEIGHT - STROKE * 2}
          rx={RADIUS}
          stroke={activeStroke}
          strokeWidth={STROKE}
          fill="transparent"
          strokeDasharray={PERIMETER}
          initial={{ strokeDashoffset: PERIMETER }}
          animate={controls}
        />
      </svg>

      {/* Inner Core */}
      <motion.div
        className="absolute inset-8 bg-black flex items-center justify-center"
        animate={{
          scale: isRunning ? 1.01 : 1,
        }}
        transition={{
          duration: 1.2,
          repeat: isRunning ? Infinity : 0,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {/* Time rendered by parent */}
      </motion.div>
    </div>
  );
}
