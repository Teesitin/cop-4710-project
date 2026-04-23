<script lang="ts">
    import { onMount } from 'svelte';

    let darkMode = $state(false);

    onMount(() => {
        darkMode = localStorage.getItem('theme') === 'dark';
    });

    $effect(() => {
        const html = document.documentElement;

        if (darkMode) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        window.dispatchEvent(new Event('theme-change'));
    });
</script>

<svelte:head>
    <title>Settings</title>
</svelte:head>

<section class="mx-auto max-w-xl p-10">
    <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
        <p class="mt-1 text-sm">Change local settings</p>
    </div>

    <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-6 shadow rounded-2xl">
        <div class="flex items-center justify-between">
            <span class="font-medium">
                Dark Mode
            </span>

            <button title="dark mode toggle" onclick={() => darkMode = !darkMode} class="w-12 h-6 flex items-center bg-gray-300 dark:bg-accent-700 rounded-full p-1 transition">
                <div class="w-4 h-4 bg-white rounded-full shadow transform transition  {darkMode ? 'translate-x-6' : ''}"></div>
            </button>
        </div>
    </div>
</section>