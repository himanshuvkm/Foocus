"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getDB } from "@/lib/db";
import { format, subDays } from "date-fns";

interface DailyStats {
    date: string; // YYYY-MM-DD
    totalFocusTime: number; // in seconds
    sessionsCompleted: number;
}

interface AnalyticsContextType {
    dailyStats: DailyStats | null;
    weeklyStats: DailyStats[];
    totalSessions: number;
    currentStreak: number;
    logSession: (duration: number) => Promise<void>;
    refreshStats: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
    const [totalSessions, setTotalSessions] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);

    const refreshStats = useCallback(async () => {
        try {
            const db = await getDB();
            const today = format(new Date(), "yyyy-MM-dd");

            // 1. Get Today's Stats
            const todayRecord = await db.get("analytics", today);
            if (todayRecord) {
                setDailyStats(todayRecord);
            } else {
                setDailyStats({ date: today, totalFocusTime: 0, sessionsCompleted: 0 });
            }

            // 2. Get Weekly Stats (Last 7 days)
            const weekStats: DailyStats[] = [];
            for (let i = 6; i >= 0; i--) {
                const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
                const record = await db.get("analytics", dateStr);
                weekStats.push(record || { date: dateStr, totalFocusTime: 0, sessionsCompleted: 0 });
            }
            setWeeklyStats(weekStats);

            // 3. Calculate Streak
            // Simple logic: Check days backwards until a day with 0 sessions (or just missing)
            // Note: If today is 0 sessions, streak includes yesterday? 
            // Usually streak is "consecutive days with activity". 
            // If I haven't done anything today yet, my streak is technically still active from yesterday if I did something yesterday.
            // distinct days with activity
            // Check broadly
            const allRecords = await db.getAll("analytics");
            // Sort by date desc
            allRecords.sort((a, b) => b.date.localeCompare(a.date));

            // Total sessions
            const total = allRecords.reduce((acc, curr) => acc + curr.sessionsCompleted, 0);
            setTotalSessions(total);

            // Calc streak
            // We need to check continuity from today or yesterday
            if (allRecords.length > 0) {
                const todayStr = format(new Date(), "yyyy-MM-dd");
                const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");

                let currentCheck = new Date();
                // If today has activity, start checking from today.
                // If today has NO activity, start checking from yesterday.
                // If neither, streak is 0.

                const hasToday = allRecords.find(r => r.date === todayStr && r.sessionsCompleted > 0);
                const hasYesterday = allRecords.find(r => r.date === yesterdayStr && r.sessionsCompleted > 0);

                if (hasToday) {
                    // Streak starts from today
                    currentCheck = new Date();
                } else if (hasYesterday) {
                    // Streak starts from yesterday
                    currentCheck = subDays(new Date(), 1);
                } else {
                    setCurrentStreak(0);
                    return;
                }

                let tempStreak = 0;
                while (true) {
                    const checkDateStr = format(currentCheck, "yyyy-MM-dd");
                    const record = allRecords.find(r => r.date === checkDateStr && r.sessionsCompleted > 0);
                    if (record) {
                        tempStreak++;
                        currentCheck = subDays(currentCheck, 1);
                    } else {
                        break;
                    }
                }
                setCurrentStreak(tempStreak);
            }

        } catch (error) {
            console.error("Failed to load analytics", error);
        }
    }, []);

    useEffect(() => {
        refreshStats();
    }, [refreshStats]);

    const logSession = async (duration: number) => {
        const db = await getDB();
        const today = format(new Date(), "yyyy-MM-dd");
        const current = await db.get("analytics", today);

        const newRecord: DailyStats = {
            date: today,
            totalFocusTime: (current?.totalFocusTime || 0) + duration,
            sessionsCompleted: (current?.sessionsCompleted || 0) + 1
        };

        await db.put("analytics", newRecord);
        await refreshStats();
    };

    return (
        <AnalyticsContext.Provider
            value={{
                dailyStats,
                weeklyStats,
                totalSessions,
                currentStreak,
                logSession,
                refreshStats
            }}
        >
            {children}
        </AnalyticsContext.Provider>
    );
}

export function useAnalytics() {
    const context = useContext(AnalyticsContext);
    if (!context) throw new Error("useAnalytics must be used within an AnalyticsProvider");
    return context;
}
