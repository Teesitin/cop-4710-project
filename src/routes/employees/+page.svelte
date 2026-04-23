<script lang="ts">
    import { onMount } from 'svelte';
    import { initializeApp } from 'firebase/app';
    import { getDataConnect, executeQuery } from 'firebase/data-connect';

    import {
        listEmployees,
        connectorConfig
    } from '../../dataconnect-generated';

    const app = initializeApp({
        projectId: 'cop-4710-ab900'
    });

    const dc = getDataConnect(connectorConfig);

    type EmployeeRow = {
        id: string;
        name: string;
        email: string;
        role: string;
    };

    let loading = $state(true);
    let error = $state('');
    let employees = $state<EmployeeRow[]>([]);

    // Dark mode
    let darkMode = $state(false);

    onMount(() => {
        darkMode = localStorage.getItem('theme') === 'dark';
        loadEmployees();
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

    async function loadEmployees() {
        try {
            loading = true;
            error = '';

            const result = await listEmployees();
            employees = result.data.employees ?? [];

        } catch (err) {
            console.error('loadEmployees error:', err);
            error = 'Failed to load employees.';
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Employees</title>
</svelte:head>

<section class="mx-auto max-w-5xl p-10 space-y-10">
    <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Employees</h1>
        <p class="mt-1 text-sm">View all employees</p>
    </div>

    <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Employees Database
    </h2>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">Loading employees...</p>
        </div>

    {:else if error}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p class="text-sm font-medium text-red-700">{error}</p>
        </div>

    {:else if employees.length === 0}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">No employees found.</p>
        </div>

    {:else}
        <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Role
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-700">
                    {#each employees as emp (emp.id)}
                        <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                {emp.name}
                            </td>

                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {emp.email}
                            </td>

                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {emp.role}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</section>