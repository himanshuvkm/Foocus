"use client";

import React from 'react';
import { Task } from '@/lib/types';
import { useTasks } from '@/contexts/task-context';
import { useTimer } from '@/contexts/timer-context';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Trash2, PlayCircle, PauseCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskItemProps {
    task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
    const { toggleTaskCompletion, deleteTask } = useTasks();
    const { activeTaskId, setActiveTaskId, isActive } = useTimer();

    const isCompleted = task.status === 'completed';
    const isActiveTask = activeTaskId === task.id;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "group flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                isActiveTask ? "border-primary/50 bg-primary/5 shadow-sm" : "border-border bg-card hover:border-border/80",
                isCompleted && "opacity-60 bg-muted/50"
            )}
        >
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                >
                    {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                        <Circle className="w-6 h-6" />
                    )}
                </button>

                <div className="flex flex-col gap-1">
                    <span className={cn(
                        "font-medium text-base transition-all",
                        isCompleted && "line-through text-muted-foreground"
                    )}>
                        {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-0.5 rounded-full font-medium uppercase tracking-wider text-[10px]">
                            {task.pomodorosCompleted} / {task.pomodorosEstimated} 🍅
                        </span>
                        {isActiveTask && <span className="text-primary font-bold animate-pulse">Running</span>}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isCompleted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveTaskId(isActiveTask ? null : task.id)}
                        className={cn("h-8 w-8", isActiveTask ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                    >
                        {isActiveTask ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
