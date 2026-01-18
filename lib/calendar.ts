export async function createCalendarEvent(accessToken: string, event: {
    summary: string;
    description?: string;
    startTime: string; // ISO string
    endTime: string;   // ISO string
}) {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            summary: event.summary,
            description: event.description,
            start: {
                dateTime: event.startTime,
            },
            end: {
                dateTime: event.endTime,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create calendar event');
    }

    return await response.json();
}
