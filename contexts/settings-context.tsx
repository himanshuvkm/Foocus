"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppSettings, DEFAULT_SETTINGS, TimerSettings } from "@/lib/types";

interface SettingsContextType extends AppSettings {
    updateSettings: (settings: Partial<AppSettings>) => void;
    updateTimerSettings: (settings: Partial<TimerSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("foocus-settings");
        if (saved) {
            try {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem("foocus-settings", JSON.stringify(settings));
        }
    }, [settings, loaded]);

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    const updateTimerSettings = (newTimerSettings: Partial<TimerSettings>) => {
        setSettings((prev) => ({
            ...prev,
            timer: { ...prev.timer, ...newTimerSettings },
        }));
    };

    if (!loaded) return null; // Or a loading spinner

    return (
        <SettingsContext.Provider
            value={{
                ...settings,
                updateSettings,
                updateTimerSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within a SettingsProvider");
    return context;
}
