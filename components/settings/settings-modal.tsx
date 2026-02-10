"use client";

import React from 'react';
import { useSettings } from '@/contexts/settings-context';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Volume2, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export function SettingsModal() {
    const { timer, sound, updateTimerSettings, updateSoundSettings, theme, updateSettings } = useSettings();
    const { setTheme } = useTheme();

    // Helper to convert seconds to minutes for input
    const toMin = (sec: number) => Math.floor(sec / 60);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50">
                    <Settings className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">

                    {/* Timer Settings */}
                    <div className="space-y-4">
                        <h4 className="font-medium leading-none border-b pb-2">Timer</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="work">Work (min)</Label>
                                <Input
                                    id="work"
                                    type="number"
                                    value={toMin(timer.workDuration)}
                                    onChange={(e) => updateTimerSettings({ workDuration: parseInt(e.target.value) * 60 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="short">Short Break</Label>
                                <Input
                                    id="short"
                                    type="number"
                                    value={toMin(timer.shortBreakDuration)}
                                    onChange={(e) => updateTimerSettings({ shortBreakDuration: parseInt(e.target.value) * 60 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="long">Long Break</Label>
                                <Input
                                    id="long"
                                    type="number"
                                    value={toMin(timer.longBreakDuration)}
                                    onChange={(e) => updateTimerSettings({ longBreakDuration: parseInt(e.target.value) * 60 })}
                                />
                            </div>
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

                    {/* Sound Settings */}
                    <div className="space-y-4">
                        <h4 className="font-medium leading-none border-b pb-2">Sound</h4>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="sound-enabled">Master Sound</Label>
                            <Switch
                                id="sound-enabled"
                                checked={sound.enabled}
                                onCheckedChange={(checked) => updateSoundSettings({ enabled: checked })}
                            />
                        </div>

                        {sound.enabled && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label>Volume</Label>
                                        <span className="text-xs text-muted-foreground">{Math.round(sound.volume * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={sound.volume}
                                        onChange={(e) => updateSoundSettings({ volume: parseFloat(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Ambient Sound</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['none', 'rain', 'forest', 'cafe', 'lofi'].map((mode) => (
                                            <Button
                                                key={mode}
                                                variant={sound.ambient === mode ? "secondary" : "outline"}
                                                size="sm"
                                                onClick={() => updateSoundSettings({ ambient: mode as any })}
                                                className="capitalize h-8"
                                            >
                                                {mode}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
