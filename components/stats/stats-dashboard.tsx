"use client";

import React from 'react';
import { useAnalytics } from '@/contexts/analytics-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Flame, Timer, Trophy, Calendar } from 'lucide-react';

export function StatsDashboard() {
    const { dailyStats, weeklyStats, totalSessions, currentStreak } = useAnalytics();

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    // Calculate max value for chart scaling
    const maxFocusTime = Math.max(...weeklyStats.map(d => d.totalFocusTime), 1);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
            {/* Overview Cards */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Focus</CardTitle>
                    <Timer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatDuration(dailyStats?.totalFocusTime || 0)}</div>
                    <p className="text-xs text-muted-foreground">in today&apos;s sessions</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalSessions}</div>
                    <p className="text-xs text-muted-foreground">lifetime completed</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                    <Flame className={currentStreak > 0 ? "h-4 w-4 text-orange-500" : "h-4 w-4 text-muted-foreground"} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentStreak} days</div>
                    <p className="text-xs text-muted-foreground">keep it burning!</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Graph</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="h-[80px] flex items-end justify-between gap-1 pt-2">
                    {weeklyStats.map((stat) => (
                        <div key={stat.date} className="relative flex-1 flex flex-col justify-end gap-1 group">
                            <div
                                className="w-full bg-primary/20 rounded-sm hover:bg-primary/40 transition-colors"
                                style={{ height: `${(stat.totalFocusTime / maxFocusTime) * 100}%`, minHeight: '4px' }}
                            ></div>
                            <span className="text-[10px] text-center text-muted-foreground opacity-0 group-hover:opacity-100 absolute -bottom-4 left-0 right-0">
                                {format(parseISO(stat.date), 'EEE')}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
