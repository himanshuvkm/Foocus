"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTimer } from '@/contexts/timer-context';
import { TimerProgressRing } from './timer-progress-ring';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have this utility

export function TimerMain() {
    const { timeLeft, progress, isActive, toggleTimer, resetTimer, skipSession, mode, updateTimeLeft } = useTimer();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleTimeClick = () => {
        if (!isActive) {
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

    const modeColors = {
        work: 'text-primary',
        short_break: 'text-chart-2', // Variant color
        long_break: 'text-chart-4',  // Variant color
    };

    // Dynamic color for ring could be passed down, but for now simple class toggle
    const ringColorRaw = mode === 'work' ? 'var(--primary)' : (mode === 'short_break' ? 'var(--chart-2)' : 'var(--chart-4)');

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <TimerProgressRing progress={progress} size={400} strokeWidth={16}>
                <div className="flex flex-col items-center gap-4">
                    <span className="text-xl uppercase tracking-widest font-medium text-muted-foreground">
                        {mode.replace('_', ' ')}
                    </span>
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
                                "text-8xl font-bold tracking-tighter tabular-nums text-foreground cursor-pointer hover:opacity-80 transition-opacity",
                                isActive && "cursor-default hover:opacity-100"
                            )}
                            title={!isActive ? "Click to edit time" : undefined}
                        >
                            {formatTime(timeLeft)}
                        </div>
                    )}
                    <div className="flex items-center gap-4 mt-4">
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

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={skipSession}
                            className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                            title="Skip"
                        >
                            <SkipForward className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </TimerProgressRing>
        </div>
    );
}
