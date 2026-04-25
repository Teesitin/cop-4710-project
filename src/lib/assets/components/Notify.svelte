<script lang="ts">
    import { notify, type Alert } from './notificationState.svelte.ts';

    function getStyles(type: Alert['type']) {
        switch (type) {
            case 'success':
                return 'border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'error':
                return 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'warning':
                return 'border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            default:
                return 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        }
    }
</script>

<div class="fixed bottom-4 right-4 z-50 flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-3 z-20">
    {#each notify.alerts as alert (alert.id)}
        <div class="flex items-start gap-3 rounded-xl border-l-4 p-4 text-sm font-medium shadow-lg {getStyles(alert.type)}">
            <span class="flex-1">{alert.message}</span>

            <button
                type="button"
                class="text-xs opacity-60 hover:opacity-100"
                onclick={() => notify.remove(alert.id)}
            >
                ✕
            </button>
        </div>
    {/each}
</div>