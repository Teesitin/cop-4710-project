<script lang="ts">
    import { onMount } from 'svelte';

    import {
        listApplications
    } from '../../dataconnect-generated';

    import AddApplication from '$lib/assets/forms/AddApplication.svelte';

    type ApplicationRow = {
        id: string;
        name: string;
        email: string;
        jobId?: string;
        job: {
            id: string;
            title: string;
            status: string;
            salary?: string | null;
        };
        salaryProposed?: number | null;
        status: string;
        appliedDate: string;
    };

    let loading = $state(true);
    let error = $state('');
    let applications = $state<ApplicationRow[]>([]);
    let showAddModal = $state(false);

    onMount(() => {
        loadApplications();
    });

    function handleApplicationAdded(newApplication: ApplicationRow) {
        applications = [newApplication, ...applications];
        showAddModal = false;
    }

    async function loadApplications() {
        try {
            loading = true;
            error = '';

            const result = await listApplications();
            applications = result.data.applications ?? [];

        } catch (err) {
            console.error('loadApplications error:', err);
            error = 'Failed to load applications.';
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Applications</title>
</svelte:head>

<section class="mx-auto max-w-5xl p-10 space-y-10">
    <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Applications</h1>
        <p class="mt-1 text-sm">View all applications</p>
    </div>

    <div class="flex items-center justify-between">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Applications Database
        </h2>

        <button
            onclick={() => showAddModal = true}
            class="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
        >
            + Add Application
        </button>
    </div>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">
                Loading applications...
            </p>
        </div>

    {:else if error}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p class="text-sm font-medium text-red-700">{error}</p>
        </div>

    {:else if applications.length === 0}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">
                No applications found.
            </p>
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
                            Job
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Salary Proposed
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-700">
                    {#each applications as app (app.id)}
                        <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                {app.name}
                            </td>

                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {app.email}
                            </td>

                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {app.job?.title || '-'}
                            </td>

                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {app.salaryProposed ?? '-'}
                            </td>

                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {app.status}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</section>

{#if showAddModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm"
        onclick={(e) => {
            if (e.target === e.currentTarget) showAddModal = false;
        }}
    >
        <div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
            <AddApplication
                close={() => {
                    showAddModal = false;
                }}
                success={handleApplicationAdded}
            />
        </div>
    </div>
{/if}