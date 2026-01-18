"use client";

import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { Task, Priority } from "@/lib/types";
import { getDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type TaskAction =
    | { type: "SET_TASKS"; payload: Task[] }
    | { type: "ADD_TASK"; payload: Task }
    | { type: "UPDATE_TASK"; payload: Task }
    | { type: "DELETE_TASK"; payload: string };

interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    createTask: (title: string, priority?: Priority, pomodorosEstimated?: number) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTaskCompletion: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

function taskReducer(state: Task[], action: TaskAction): Task[] {
    switch (action.type) {
        case "SET_TASKS":
            return action.payload;
        case "ADD_TASK":
            return [...state, action.payload];
        case "UPDATE_TASK":
            return state.map((t) => (t.id === action.payload.id ? action.payload : t));
        case "DELETE_TASK":
            return state.filter((t) => t.id !== action.payload);
        default:
            return state;
    }
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, dispatch] = useReducer(taskReducer, []);
    const [loading, setLoading] = React.useState(true);

    const loadTasks = useCallback(async () => {
        try {
            const db = await getDB();
            const allTasks = await db.getAll("tasks");
            dispatch({ type: "SET_TASKS", payload: allTasks });
        } catch (error) {
            console.error("Failed to load tasks", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const createTask = async (title: string, priority: Priority = 'medium', pomodorosEstimated: number = 1) => {
        const newTask: Task = {
            id: uuidv4(),
            title,
            priority,
            status: "active",
            pomodorosEstimated,
            pomodorosCompleted: 0,
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const db = await getDB();
        await db.put("tasks", newTask);
        dispatch({ type: "ADD_TASK", payload: newTask });
    };

    const updateTask = async (task: Task) => {
        const updatedTask = { ...task, updatedAt: Date.now() };
        const db = await getDB();
        await db.put("tasks", updatedTask);
        dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    };

    const deleteTask = async (id: string) => {
        const db = await getDB();
        await db.delete("tasks", id);
        dispatch({ type: "DELETE_TASK", payload: id });
    };

    const toggleTaskCompletion = async (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        const newStatus = task.status === "active" ? "completed" : "active";
        await updateTask({ ...task, status: newStatus });
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                loading,
                createTask,
                updateTask,
                deleteTask,
                toggleTaskCompletion,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) throw new Error("useTasks must be used within a TaskProvider");
    return context;
}
