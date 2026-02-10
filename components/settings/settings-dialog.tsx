"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/settings-context";
import { Settings as SettingsIcon } from "lucide-react";

export function SettingsDialog() {
    const { timer, notificationsEnabled, updateSettings, updateTimerSettings } = useSettings();

    // Local state for inputs to avoid jittery updates, commit on blur or change
    const [workMinutes, setWorkMinutes] = useState(timer.workDuration / 60);
    const [shortBreakMinutes, setShortBreakMinutes] = useState(timer.shortBreakDuration / 60);
    const [longBreakMinutes, setLongBreakMinutes] = useState(timer.longBreakDuration / 60);
    const [longBreakInterval, setLongBreakInterval] = useState(timer.longBreakInterval);

    // Sync from context when it changes (e.g. initial load)
    useEffect(() => {
        setWorkMinutes(timer.workDuration / 60);
        setShortBreakMinutes(timer.shortBreakDuration / 60);
        setLongBreakMinutes(timer.longBreakDuration / 60);
        setLongBreakInterval(timer.longBreakInterval);
    }, [timer]);

    const handleSave = () => {
        updateTimerSettings({
            workDuration: workMinutes * 60,
            shortBreakDuration: shortBreakMinutes * 60,
            longBreakDuration: longBreakMinutes * 60,
            longBreakInterval: longBreakInterval
        });
    };

    return (
        <Dialog onOpenChange={(open) => { if (!open) handleSave(); }}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <SettingsIcon className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">

                    <div className="space-y-4">
                        <h4 className="font-medium leading-none text-muted-foreground uppercase text-xs tracking-wider">Timer (Minutes)</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="work">Work</Label>
                                <Input id="work" type="number" value={workMinutes} onChange={(e) => setWorkMinutes(Number(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="short">Short Break</Label>
                                <Input id="short" type="number" value={shortBreakMinutes} onChange={(e) => setShortBreakMinutes(Number(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="long">Long Break</Label>
                                <Input id="long" type="number" value={longBreakMinutes} onChange={(e) => setLongBreakMinutes(Number(e.target.value))} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium leading-none text-muted-foreground uppercase text-xs tracking-wider">Behavior</h4>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="long-interval">Long Break Interval</Label>
                            <Input
                                id="long-interval"
                                type="number"
                                className="w-20 text-center"
                                value={longBreakInterval}
                                onChange={(e) => setLongBreakInterval(Number(e.target.value))}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="auto-start-breaks">Auto-start Breaks</Label>
                            <Switch
                                id="auto-start-breaks"
                                checked={timer.autoStartBreaks}
                                onCheckedChange={(checked) => updateTimerSettings({ autoStartBreaks: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="auto-start-work">Auto-start Work</Label>
                            <Switch
                                id="auto-start-work"
                                checked={timer.autoStartWork}
                                onCheckedChange={(checked) => updateTimerSettings({ autoStartWork: checked })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium leading-none text-muted-foreground uppercase text-xs tracking-wider">Application</h4>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notifications">Notifications</Label>
                            <Switch
                                id="notifications"
                                checked={notificationsEnabled}
                                onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
                            />
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
