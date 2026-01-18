"use client";

import React, { useState } from 'react';
import { useTasks } from '@/contexts/task-context';
import { TaskItem } from './task-item';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export function TaskList() {
    const { tasks, createTask, loading } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [estPomodoros, setEstPomodoros] = useState(1);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        await createTask(newTaskTitle, 'medium', estPomodoros);
        setNewTaskTitle("");
        setEstPomodoros(1);
    };

    const activeTasks = tasks.filter(t => t.status === 'active').sort((a, b) => b.createdAt - a.createdAt);
    const completedTasks = tasks.filter(t => t.status === 'completed').sort((a, b) => b.updatedAt - a.updatedAt);

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading tasks...</div>;

    return (
        <div className="w-full max-w-xl mx-auto space-y-8">

            {/* Add Task Form */}
            <form onSubmit={handleCreate} className="relative group">
                <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="pr-24 h-14 rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-border transition-all pl-6 text-lg"
                />
                <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={estPomodoros}
                        onChange={(e) => setEstPomodoros(parseInt(e.target.value))}
                        className="w-12 h-10 rounded-lg bg-transparent text-center text-sm font-medium focus:outline-none"
                        title="Estimated Pomodoros"
                    />
                    <Button type="submit" size="icon" className="h-10 w-10 rounded-xl shadow-sm">
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
            </form>

            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pl-2">Active Tasks</h3>
                <AnimatePresence mode="popLayout">
                    {activeTasks.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground/50 italic">No active tasks. Time to focus!</div>
                    ) : (
                        activeTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {completedTasks.length > 0 && (
                <div className="space-y-4 pt-8 opacity-60 hover:opacity-100 transition-opacity">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pl-2">Completed</h3>
                    <AnimatePresence>
                        {completedTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
