export type NotifyType = 'success' | 'error' | 'warning' | 'info';

export type Alert = {
    id: string;
    message: string;
    type: NotifyType;
    duration: number;
};

let alerts = $state<Alert[]>([]);

function remove(id: string) {
    alerts = alerts.filter((alert) => alert.id !== id);
}

function push(message: string, type: NotifyType = 'info', duration = 3000) {
    const id = crypto.randomUUID();

    alerts = [
        ...alerts,
        {
            id,
            message,
            type,
            duration
        }
    ];

    if (duration > 0) {
        setTimeout(() => {
            remove(id);
        }, duration);
    }

    return id;
}

export const notify = {
    get alerts() {
        return alerts;
    },

    info(message: string, duration?: number) {
        return push(message, 'info', duration);
    },

    success(message: string, duration?: number) {
        return push(message, 'success', duration);
    },

    warning(message: string, duration?: number) {
        return push(message, 'warning', duration);
    },

    error(message: string, duration?: number) {
        return push(message, 'error', duration);
    },

    remove
};