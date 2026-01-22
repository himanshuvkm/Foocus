"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { TimerMode } from "@/lib/types";
import { useSettings } from "./settings-context";
import { useTasks } from "./task-context";
import { useAudio } from "@/hooks/use-audio";

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
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
    const { timer, soundEnabled } = useSettings();
    const { tasks, updateTask } = useTasks();

    const [mode, setMode] = useState<TimerMode>("work");
    const [timeLeft, setTimeLeft] = useState(timer.workDuration);
    const [isActive, setIsActive] = useState(false);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const { play: playAlarm } = useAudio("/sounds/alarm.mp3"); // Placeholder path
    const { play: playClick } = useAudio("/sounds/click.mp3");

    const startTimeRef = useRef<number | null>(null);

    // Initialize timer when settings invoke
    useEffect(() => {
        if (!isActive) {
            if (mode === 'work') setTimeLeft(timer.workDuration);
            if (mode === 'short_break') setTimeLeft(timer.shortBreakDuration);
            if (mode === 'long_break') setTimeLeft(timer.longBreakDuration);
        }
    }, [timer, mode, isActive]);

    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        if (newMode === 'work') setTimeLeft(timer.workDuration);
        else if (newMode === 'short_break') setTimeLeft(timer.shortBreakDuration);
        else if (newMode === 'long_break') setTimeLeft(timer.longBreakDuration);
        else if (newMode === 'stopwatch') setTimeLeft(0);
        setIsActive(false);
    }, [timer]);

    const handleComplete = useCallback(() => {
        setIsActive(false);
        if (soundEnabled) playAlarm();

        // Update Task stats if working
        if (mode === 'work' && activeTaskId) {
            const task = tasks.find(t => t.id === activeTaskId);
            if (task) {
                updateTask({ ...task, pomodorosCompleted: task.pomodorosCompleted + 1 });
            }
        }

        // Determine next mode
        if (mode === 'work') {
            const newSessions = sessionsCompleted + 1;
            setSessionsCompleted(newSessions);
            if (newSessions % timer.longBreakInterval === 0) {
                switchMode('long_break');
                if (timer.autoStartBreaks) setIsActive(true);
            } else {
                switchMode('short_break');
                if (timer.autoStartBreaks) setIsActive(true);
            }
        } else {
            // Break is over, back to work
            switchMode('work');
            if (timer.autoStartWork) setIsActive(true);
        }

    }, [mode, sessionsCompleted, timer, activeTaskId, tasks, updateTask, switchMode, soundEnabled, playAlarm]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            if (mode === 'stopwatch') {
                // Stopwatch mode: count up
                interval = setInterval(() => {
                    setTimeLeft((prev) => prev + 1);
                }, 1000);
            } else if (timeLeft > 0) {
                // Timer modes: count down
                interval = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            handleComplete();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, handleComplete, mode]);

    const toggleTimer = () => {
        if (soundEnabled) playClick();
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'work') setTimeLeft(timer.workDuration);
        else if (mode === 'short_break') setTimeLeft(timer.shortBreakDuration);
        else if (mode === 'long_break') setTimeLeft(timer.longBreakDuration);
        else if (mode === 'stopwatch') setTimeLeft(0);
    };

    const skipSession = () => {
        handleComplete();
    };

    const updateTimeLeft = (seconds: number) => {
        setTimeLeft(seconds);
        setIsActive(false);
    };

    // Calculate progress for UI ring
    let progress = 0;
    if (mode === 'stopwatch') {
        progress = 1; // Always full for stopwatch
    } else {
        const totalTime = mode === 'work' ? timer.workDuration : (mode === 'short_break' ? timer.shortBreakDuration : timer.longBreakDuration);
        progress = 1 - (timeLeft / totalTime);
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
                progress
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
