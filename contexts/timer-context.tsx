"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { TimerMode } from "@/lib/types";
import { useSettings } from "./settings-context";
import { useTasks } from "./task-context";
import { useAnalytics } from "./analytics-context";

interface TimerContextType {
    mode: TimerMode;
    timeLeft: number;
    isActive: boolean;
    activeTaskId: string | null;
    setActiveTaskId: (id: string | null) => void;
    setMode: (mode: TimerMode) => void;
    toggleTimer: () => void;
    resetTimer: () => void;
    skipSession: () => void;
    updateTimeLeft: (seconds: number) => void;
    progress: number; // 0 to 1 scale
    sessionsCompleted: number;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
    const { timer } = useSettings();
    const { tasks, updateTask } = useTasks();
    const { logSession } = useAnalytics();

    const [mode, setMode] = useState<TimerMode>("work");
    const [timeLeft, setTimeLeft] = useState(timer.workDuration);
    const [isActive, setIsActive] = useState(false);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    // Refs for accurate timing (drift correction)
    const endTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const initialDurationRef = useRef<number>(timer.workDuration);
    const stopwatchStartRef = useRef<number | null>(null);

    // Initialize timer duration when settings or mode change (if not active)
    useEffect(() => {
        if (!isActive) {
            let newTime = 0;
            if (mode === 'work') newTime = timer.workDuration;
            else if (mode === 'short_break') newTime = timer.shortBreakDuration;
            else if (mode === 'long_break') newTime = timer.longBreakDuration;
            else if (mode === 'stopwatch') newTime = 0;

            setTimeLeft(newTime);
            initialDurationRef.current = newTime === 0 && mode !== 'stopwatch' ? 1 : newTime;
        }
    }, [timer, mode, isActive]);

    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        setIsActive(false);
        // Time will be updated by the useEffect above
    }, []);

    const handleComplete = useCallback(() => {
        setIsActive(false);

        // Update Task stats if working
        if (mode === 'work') {
            const newSessions = sessionsCompleted + 1;
            setSessionsCompleted(newSessions);

            if (activeTaskId) {
                const task = tasks.find(t => t.id === activeTaskId);
                if (task) {
                    updateTask({ ...task, pomodorosCompleted: task.pomodorosCompleted + 1 });
                }
            }

            // Log session to analytics
            logSession(timer.workDuration);

            // Determine next mode
            if (newSessions % timer.longBreakInterval === 0) {
                switchMode('long_break');
                if (timer.autoStartBreaks) setTimeout(() => setIsActive(true), 100);
            } else {
                switchMode('short_break');
                if (timer.autoStartBreaks) setTimeout(() => setIsActive(true), 100);
            }
        } else {
            // Break is over, back to work
            switchMode('work');
            if (timer.autoStartWork) setTimeout(() => setIsActive(true), 100);
        }

    }, [mode, sessionsCompleted, timer, activeTaskId, tasks, updateTask, switchMode, logSession]);

    // Timer Logic Loop
    useEffect(() => {
        if (isActive && mode !== 'stopwatch') {
            const tick = () => {
                const now = Date.now();
                if (endTimeRef.current) {
                    const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
                    setTimeLeft(remaining);

                    if (remaining <= 0) {
                        endTimeRef.current = null;
                        handleComplete();
                        return;
                    }
                }
                rafRef.current = requestAnimationFrame(tick);
            };

            rafRef.current = requestAnimationFrame(tick);

            return () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
            };
        } else if (isActive && mode === 'stopwatch') {
            // Stopwatch logic (count up)
            const tick = () => {
                const now = Date.now();
                if (stopwatchStartRef.current != null) {
                    const elapsed = Math.floor((now - stopwatchStartRef.current) / 1000);
                    setTimeLeft(elapsed);
                }
                rafRef.current = requestAnimationFrame(tick);
            }
            rafRef.current = requestAnimationFrame(tick);

            return () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
            };
        } else {
            // Paused
            endTimeRef.current = null;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        }
    }, [isActive, mode, handleComplete]);

    const toggleTimer = () => {
        setIsActive(prev => {
            if (prev) {
                // Pausing: endTimeRef is cleared in useEffect cleanup/else branch,
                // but we need to ensure timeLeft isn't lost.
                // timeLeft is state, so it persists.
                return false;
            } else {
                const now = Date.now();
                if (mode === 'stopwatch') {
                    // Derive start time from current elapsed seconds
                    stopwatchStartRef.current = now - timeLeft * 1000;
                } else {
                    // Countdown: derive planned end time from remaining seconds
                    endTimeRef.current = now + timeLeft * 1000;
                }
                return true;
            }
        });
    };

    const resetTimer = () => {
        setIsActive(false);
        endTimeRef.current = null;
        if (mode === 'work') setTimeLeft(timer.workDuration);
        else if (mode === 'short_break') setTimeLeft(timer.shortBreakDuration);
        else if (mode === 'long_break') setTimeLeft(timer.longBreakDuration);
        else if (mode === 'stopwatch') {
            setTimeLeft(0);
            stopwatchStartRef.current = null;
        }
    };

    const skipSession = () => {
        endTimeRef.current = null;
        handleComplete();
    };

    const updateTimeLeft = (seconds: number) => {
        setTimeLeft(seconds);
        setIsActive(false);
        endTimeRef.current = null;
    };

    // Calculate progress for UI ring
    let progress = 0;
    if (mode === 'stopwatch') {
        progress = 1;
    } else {
        const totalTime = mode === 'work' ? timer.workDuration : (mode === 'short_break' ? timer.shortBreakDuration : timer.longBreakDuration);
        progress = totalTime > 0 ? (timeLeft / totalTime) : 0;
    }

    return (
        <TimerContext.Provider
            value={{
                mode,
                timeLeft,
                isActive,
                activeTaskId,
                setActiveTaskId,
                setMode: switchMode,
                toggleTimer,
                resetTimer,
                skipSession,
                updateTimeLeft,
                progress,
                sessionsCompleted
            }}
        >
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const context = useContext(TimerContext);
    if (!context) throw new Error("useTimer must be used within a TimerProvider");
    return context;
}
