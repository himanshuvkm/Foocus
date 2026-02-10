"use client";

import { useEffect, useRef, useState } from "react";

export function useAudio(src: string, { volume = 1, loop = false }: { volume?: number; loop?: boolean } = {}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(src);
        audioRef.current.loop = loop;
        audioRef.current.volume = volume;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [src, loop]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const play = async () => {
        if (audioRef.current) {
            try {
                audioRef.current.currentTime = 0;
                await audioRef.current.play();
            } catch (e) {
                // Browsers often block autoplay without interaction
                console.error("Audio play failed", e);
            }
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // For ambient sound that needs to just start/pause without resetting
    const toggle = (shouldPlay: boolean) => {
        if (!audioRef.current) return;

        if (shouldPlay) {
            audioRef.current.play().catch(console.error);
        } else {
            audioRef.current.pause();
        }
    }

    return { play, stop, toggle };
}
