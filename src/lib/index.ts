export type TimestampFormat = 'date' | 'datetime' | 'time';

export function formatTimestamp(
    timestamp?: string | Date | null,
    format: TimestampFormat = 'date'
) {
    if (!timestamp) return '-';

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

    if (Number.isNaN(date.getTime())) return '-';

    if (format === 'datetime') {
        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    if (format === 'time') {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
}