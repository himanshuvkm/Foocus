"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useSettings } from "./settings-context";

// Placeholder URLs for ambient sounds - in a real app these would be local assets or hosted files
const AMBIENT_SOUNDS = {
    rain: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3",
    forest: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3",
    cafe: "https://assets.mixkit.co/sfx/preview/mixkit-restaurant-ambience-loop-sound-2139.mp3",
    lofi: "https://assets.mixkit.co/sfx/preview/mixkit-tech-house-vibes-130.mp3", // Just a beat for example
    none: null
};

interface SoundContextType {
    playClick: () => void;
    playAlarm: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const { sound } = useSettings();
    const ambientRef = useRef<HTMLAudioElement | null>(null);
    const clickRef = useRef<HTMLAudioElement | null>(null);
    const alarmRef = useRef<HTMLAudioElement | null>(null);

    // Initialize one-shot sounds
    useEffect(() => {
        clickRef.current = new Audio("/sounds/click.mp3"); // Ensure these files exist in public/sounds
        alarmRef.current = new Audio("/sounds/alarm.mp3");
    }, []);

    // Handle Volume Changes for one-shots
    useEffect(() => {
        if (clickRef.current) clickRef.current.volume = sound.volume;
        if (alarmRef.current) alarmRef.current.volume = sound.volume;
    }, [sound.volume]);

    // Handle Ambient Sound
    useEffect(() => {
        // Stop current ambient if exists
        if (ambientRef.current) {
            ambientRef.current.pause();
            ambientRef.current = null;
        }

        if (sound.enabled && sound.ambient && sound.ambient !== 'none') {
            const src = AMBIENT_SOUNDS[sound.ambient as keyof typeof AMBIENT_SOUNDS];
            if (src) {
                ambientRef.current = new Audio(src);
                ambientRef.current.loop = true;
                ambientRef.current.volume = sound.volume;
                ambientRef.current.play().catch(e => console.log("Ambient autoplay blocked:", e));
            }
        }
    }, [sound.ambient, sound.enabled]);

    // Update ambient volume on the fly
    useEffect(() => {
        if (ambientRef.current) {
            ambientRef.current.volume = sound.volume;
        }
    }, [sound.volume]);

    const playClick = () => {
        if (sound.enabled && clickRef.current) {
            clickRef.current.currentTime = 0;
            clickRef.current.play().catch(() => { });
        }
    };

    const playAlarm = () => {
        if (sound.enabled && alarmRef.current) {
            alarmRef.current.currentTime = 0;
            alarmRef.current.play().catch(() => { });
        }
    };

    return (
        <SoundContext.Provider value={{ playClick, playAlarm }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (!context) throw new Error("useSound must be used within a SoundProvider");
    return context;
}
