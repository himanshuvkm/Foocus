"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { TimerMode } from "@/lib/types";
import { useSettings } from "./settings-context";
import { useTasks } from "./task-context";
import { useSound } from "./sound-context";
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
    const { playAlarm, playClick } = useSound();
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
        playAlarm();

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

    }, [mode, sessionsCompleted, timer, activeTaskId, tasks, updateTask, switchMode, playAlarm]);

    // Timer Logic Loop
    useEffect(() => {
        if (isActive && mode !== 'stopwatch') {
            // If starting fresh or resuming, we need to calculate target end time
            // But if we just rely on endTime, pausing becomes hard.
            // Better approach for headers:
            // On start/resume: endTime = Date.now() + timeLeft * 1000

            if (!endTimeRef.current) {
                endTimeRef.current = Date.now() + timeLeft * 1000;
            }

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
            const startTime = Date.now() - (timeLeft * 1000); // Derive start time from current count

            const tick = () => {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000);
                setTimeLeft(elapsed);
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
    }, [isActive, mode, handleComplete]); // Removed timeLeft from dependency to avoid loop, but need to handle pause correctly

    const toggleTimer = () => {
        playClick();
        setIsActive(prev => {
            if (prev) {
                // Pausing: endTimeRef is cleared in useEffect cleanup/else branch, 
                // but we need to ensure timeLeft isn't lost. 
                // actually timeLeft is state, so it persists. 
                // When resuming, useEffect will calculate new endTimeRef based on current timeLeft.
                return false;
            } else {
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
        else if (mode === 'stopwatch') setTimeLeft(0);
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
