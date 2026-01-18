"use client";

import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { cn } from '@/lib/utils';

export function GoogleCalendarConnect() {
    const [isConnected, setIsConnected] = useState(false);
    // In a real app we'd store the token securely, or refresh token in backend. 
    // For this client-side demo, we'll keep it in memory or localStorage (not recommended for prod but ok for prototype)

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            setIsConnected(true);
            localStorage.setItem('google_access_token', tokenResponse.access_token);
        },
        scope: 'https://www.googleapis.com/auth/calendar.events',
    });

    return (
        <Button
            variant={isConnected ? "outline" : "default"}
            onClick={() => login()}
            className={cn("gap-2", isConnected && "border-green-500 text-green-500")}
        >
            <Calendar className="w-4 h-4" />
            {isConnected ? "Connected" : "Connect Calendar"}
        </Button>
    );
}
