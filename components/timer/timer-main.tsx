"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTimer } from '@/contexts/timer-context';
import { useSettings } from '@/contexts/settings-context';
import { TimerProgressRing } from './timer-progress-ring';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have this utility

export function TimerMain() {
    const { timeLeft, progress, isActive, toggleTimer, resetTimer, skipSession, mode, updateTimeLeft, setMode, sessionsCompleted } = useTimer();
    const { timer } = useSettings(); // Need to import this hook in this file
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleTimeClick = () => {
        if (!isActive && mode !== 'stopwatch') {
            setIsEditing(true);
            setEditValue(formatTime(timeLeft));
        }
    };

    const handleTimeSubmit = () => {
        setIsEditing(false);
        if (!editValue) return;

        // Parse MM:SS or just MM
        const parts = editValue.split(':');
        let seconds = 0;
        if (parts.length === 2) {
            seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 1) {
            seconds = parseInt(parts[0]) * 60;
        }

        if (!isNaN(seconds) && seconds > 0) {
            updateTimeLeft(seconds);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTimeSubmit();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <TimerProgressRing progress={progress} size={400} strokeWidth={16}>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xl uppercase tracking-widest font-medium text-muted-foreground mt-2">
                            {mode.replace('_', ' ')}
                        </span>
                        {mode === 'work' && (
                            <span className="text-sm text-muted-foreground/60 font-mono mt-1">
                                Session {sessionsCompleted % timer.longBreakInterval + 1}/{timer.longBreakInterval}
                            </span>
                        )}
                    </div>
                    {isEditing ? (
                        <Input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleTimeSubmit}
                            onKeyDown={handleKeyDown}
                            className="text-8xl font-bold tracking-tighter text-center h-32 w-80 bg-background border-primary"
                        />
                    ) : (
                        <div
                            onClick={handleTimeClick}
                            className={cn(
                                "text-8xl font-bold tracking-tighter tabular-nums text-foreground transition-opacity",
                                !isActive && mode !== 'stopwatch' ? "cursor-pointer hover:opacity-80" : "cursor-default",
                                isActive && "hover:opacity-100"
                            )}
                            title={!isActive && mode !== 'stopwatch' ? "Click to edit time" : undefined}
                        >
                            {formatTime(timeLeft)}
                        </div>
                    )}
                    <div className="flex items-center gap-4 mt-4 min-h-[48px]">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={resetTimer}
                            className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                            title="Reset"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </Button>

                        <Button
                            size="lg"
                            onClick={toggleTimer}
                            className={cn(
                                "h-20 w-20 rounded-full shadow-lg hover:scale-105 transition-transform",
                                isActive ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                            )}
                        >
                            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </Button>

                        <div className="w-12 h-12 flex items-center justify-center">
                            {mode !== 'stopwatch' && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={skipSession}
                                    className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                                    title="Skip"
                                >
                                    <SkipForward className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </TimerProgressRing>

            {/* Mode Selector */}
            <div className="flex items-center gap-2 p-1 rounded-full bg-secondary/50 backdrop-blur-sm">
                <Button variant={mode === 'work' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('work')} className={cn("h-8 text-xs px-4 rounded-full transition-all", mode === 'work' && "bg-background shadow-sm")}>Work</Button>
                <Button variant={mode === 'short_break' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('short_break')} className={cn("h-8 text-xs px-4 rounded-full transition-all", mode === 'short_break' && "bg-background shadow-sm")}>Short</Button>
                <Button variant={mode === 'long_break' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('long_break')} className={cn("h-8 text-xs px-4 rounded-full transition-all", mode === 'long_break' && "bg-background shadow-sm")}>Long</Button>
                <Button variant={mode === 'stopwatch' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('stopwatch')} className={cn("h-8 text-xs px-4 rounded-full transition-all", mode === 'stopwatch' && "bg-background shadow-sm")}>Stopwatch</Button>
            </div>
        </div>
    );
}
