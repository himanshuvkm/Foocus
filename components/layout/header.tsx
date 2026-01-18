"use client";

import React from 'react';
import { Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { SettingsDialog } from '@/components/settings/settings-dialog';

export function Header() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xl">F</span>
                </div>
                <span className="font-bold text-xl tracking-tight">Foocus</span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
                <SettingsDialog />
            </div>
        </header>
    );
}
