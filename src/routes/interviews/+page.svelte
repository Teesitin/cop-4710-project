<script lang="ts">
    import { onMount } from 'svelte';
    import { initializeApp } from 'firebase/app';
    import { getDataConnect, executeQuery, executeMutation } from 'firebase/data-connect';
    import AddInterview from "$lib/assets/forms/AddInterview.svelte";
    import {
        listInterviewsRef,
        deleteInterviewRef,
        connectorConfig,
    } from '../../dataconnect-generated';

    type interviewRow = {
        id: string;
        applicationId: string;
        applicantName: string;
        jobTitle: string;
        interviewerName: string | null;
        interviewStartDate: string | null;
        interviewEndDate: string | null;
        interviewModality: string | null;
    };

    let interviews = $state<interviewRow[]>([]);
    let searchQuery = $state('');
    let showAddModal = $state(false);
    let error = $state('');
    let loading = $state(true);

    function handleInterviewAdded(newInterview: interviewRow) {
        interviews = [newInterview, ...interviews];
        showAddModal = false;
    };

    let filteredInterviews = $derived.by(() => {
        const query = searchQuery.toLowerCase();
        return interviews.filter(i =>
            (i.applicantName ?? '').toLowerCase().includes(query) ||
            (i.jobTitle ?? '').toLowerCase().includes(query) ||
            (i.interviewerName ?? '').toLowerCase().includes(query) ||
            (i.interviewModality ?? '').toLowerCase().includes(query)
        );
    });

    async function loadInterviews() {
        try {
            loading = true;
            error = '';
            const result = await executeQuery(listInterviewsRef());
            interviews = (result.data.interviews ?? []).reverse().map((i: any) => ({
                id: i.id,
                applicationId: i.application.id,
                applicantName: i.application.name,
                jobTitle: i.application.job.title,
                interviewerName: i.interviewerName ?? null,
                interviewStartDate: i.interviewStartDate ?? null,
                interviewEndDate: i.interviewEndDate ?? null,
                interviewModality: i.interviewModality ?? null,
            }));
        } catch (err) {
            console.error('loadInterviews error:', err);
            error = 'Failed to load interviews.';
        } finally {
            loading = false;
        }
    }
    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this interview?')) return;
        try {
            await executeMutation(deleteInterviewRef({ id }));
            interviews = interviews.filter(i => i.id !== id);
        } catch (err) {
            console.error('Failed to delete interview', err);
            alert('Could not delete interview.');
        }
    }
    function formatDate(ts: string | null) {
        if (!ts) return '-';
        return new Date(ts).toLocaleString();
    }
    onMount(() => {
        loadInterviews();
    });
</script>

<svelte:head>
    <title>Interviews</title>
</svelte:head>

<section class="mx-auto max-w-5xl p-10 space-y-10">
    <div class="mb-2">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Interview Tracker</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage interviews</p>
    </div>

        <div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Interview Database</h2>
        
        <div class="flex items-center space-x-4 w-full sm:w-auto">
            <div class="w-full sm:w-64">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search interviews"
                    class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500"
                />
            </div>
            
            <button 
                onclick={() => showAddModal = true}
                class="whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
            >
                + Add Interview
            </button>
        </div>    
    </div>
    {#if loading}
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-400">Loading interviews...</p>
        </div>
    {:else if error}
        <div class="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-6 shadow-sm">
            <p class="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
        </div>
    {:else if filteredInterviews.length === 0}
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {#if interviews.length === 0}
                    No interviews found. Click "+ Add Interview" to get started!
                {:else}
                    No interviews match your search.
                {/if}
            </p>
        </div>
    {:else}
        <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Applicant</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Job</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Interviewer</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Start</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">End</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Modality</th>
                        <th class="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {#each filteredInterviews as interview (interview.id)}
                        <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{interview.applicantName}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{interview.jobTitle}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{interview.interviewerName || '-'}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(interview.interviewStartDate)}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(interview.interviewEndDate)}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{interview.interviewModality || '-'}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-right">
                                <button onclick={() => handleDelete(interview.id)} class="text-sm font-medium text-red-500 hover:text-red-400 transition">Delete</button>
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm transition-opacity"
        onclick={(e) => { if (e.target === e.currentTarget) showAddModal = false; }}
    >
        <div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <AddInterview 
                onClose={() => showAddModal = false} 
                onSuccess={handleInterviewAdded} 
            />
        </div>
    </div>
    
{/if}