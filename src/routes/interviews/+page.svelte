<script lang="ts">
    import { afterNavigate } from '$app/navigation';
    import '$lib/firebase';

    import AddInterview from '$lib/assets/forms/AddInterview.svelte';
    import {
        deleteInterview,
        listInterviews,
        updateInterview
    } from '../../dataconnect-generated';

    import { notify } from '$lib/assets/components/notificationState.svelte';

    let loading = $state(true);
    let error = $state('');
    let interviews = $state<Interview[]>([]);
    let searchQuery = $state('');
    let showAddModal = $state(false);

    let editingId = $state<string | null>(null);
    let editInterviewerName = $state('');
    let editStartDate = $state('');
    let editEndDate = $state('');
    let editModality = $state('');

    const modalities = ['In-Person', 'Online'];

    let filteredInterviews = $derived.by(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return interviews;

        return interviews.filter((interview) => {
            return (
                interview.application.name.toLowerCase().includes(query) ||
                interview.application.email.toLowerCase().includes(query) ||
                interview.application.job.title.toLowerCase().includes(query) ||
                String(interview.interviewerName ?? '').toLowerCase().includes(query) ||
                String(interview.interviewModality ?? '').toLowerCase().includes(query)
            );
        });
    });

    afterNavigate(loadInterviews);

    function toDateTimeLocal(value?: string | null) {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 16);
    }

    function toIsoString(value: string) {
        return value ? new Date(value).toISOString() : null;
    }

    function formatDate(value?: string | null) {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    async function loadInterviews() {
        try {
            loading = true;
            error = '';

            const result = await listInterviews({ refresh: Date.now() });

            interviews = [...(result.data.interviews ?? [])].reverse();

            notify.success('Interviews loaded.');
        } catch (err) {
            console.error('loadInterviews error:', err);
            error = 'Failed to load interviews.';
            notify.error('Failed to load interviews.');
        } finally {
            loading = false;
        }
    }

    function openAddModal() {
        showAddModal = true;
        notify.info('Add interview form opened.');
    }

    function closeAddModal() {
        showAddModal = false;
        notify.info('Add interview cancelled.');
    }

    async function handleInterviewAdded() {
        showAddModal = false;
        notify.success('Interview created.');
        await loadInterviews();
    }

    function startEditing(interview: Interview) {
        editingId = interview.id;
        editInterviewerName = interview.interviewerName ?? '';
        editStartDate = toDateTimeLocal(interview.interviewStartDate);
        editEndDate = toDateTimeLocal(interview.interviewEndDate);
        editModality = interview.interviewModality ?? modalities[0];
        notify.info(`Editing interview for ${interview.application.name}.`);
    }

    function cancelEditing() {
        editingId = null;
        notify.info('Edit cancelled.');
    }

    async function saveEdit(id: string) {
        const interviewerName = editInterviewerName.trim() || null;
        const interviewStartDate = toIsoString(editStartDate);
        const interviewEndDate = toIsoString(editEndDate);
        const interviewModality = editModality || null;

        try {
            await updateInterview({
                id,
                interviewerName,
                interviewStartDate,
                interviewEndDate,
                interviewModality
            });

            editingId = null;
            await loadInterviews();

            notify.success('Interview updated.');
        } catch (err) {
            console.error('saveEdit error:', err);
            notify.error('Failed to update interview.');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this interview?')) {
            notify.info('Delete cancelled.');
            return;
        }

        try {
            await deleteInterview({ id });
            await loadInterviews();
            notify.success('Interview deleted.');
        } catch (err) {
            console.error('handleDelete error:', err);
            notify.error('Failed to delete interview.');
        }
    }
</script>

<svelte:head>
    <title>Interviews</title>
</svelte:head>

<section class="mx-auto max-w-7xl space-y-10 p-10">
    <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Interview Tracker
            </h1>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage interviews
            </p>
        </div>

        <div class="flex w-full items-center space-x-4 sm:w-auto">
            <div class="w-full sm:w-64">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search interviews..."
                    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <button
                onclick={openAddModal}
                class="whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
                + Add Interview
            </button>
        </div>
    </div>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p class="text-sm text-gray-600 dark:text-gray-400">Loading interviews...</p>
        </div>
    {:else if error}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900/50 dark:bg-red-900/20">
            <p class="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
        </div>
    {:else if filteredInterviews.length === 0}
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {#if interviews.length === 0}
                    No interviews found. Click "+ Add Interview" to get started!
                {:else}
                    No interviews match your search.
                {/if}
            </p>
        </div>
    {:else}
        <div class="overflow-hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <table class="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="w-36 px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Applicant
                        </th>
                        <th class="w-36 px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Job
                        </th>
                        <th class="w-36 px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Interviewer
                        </th>
                        <th class="w-44 px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Start
                        </th>
                        <th class="w-44 px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            End
                        </th>
                        <th class="w-32 px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Modality
                        </th>
                        <th class="w-24 px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {#each filteredInterviews as interview (interview.id)}
                        <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            {#if editingId === interview.id}
                                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {interview.application.name}
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {interview.application.job.title}
                                </td>

                                <td class="px-4 py-3">
                                    <input
                                        bind:value={editInterviewerName}
                                        placeholder="e.g. Jane Smith"
                                        class="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </td>

                                <td class="px-4 py-3">
                                    <input
                                        type="datetime-local"
                                        bind:value={editStartDate}
                                        class="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </td>

                                <td class="px-4 py-3">
                                    <input
                                        type="datetime-local"
                                        bind:value={editEndDate}
                                        class="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </td>

                                <td class="px-4 py-3">
                                    <select
                                        bind:value={editModality}
                                        class="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        {#each modalities as modality}
                                            <option value={modality}>{modality}</option>
                                        {/each}
                                    </select>
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex gap-3">
                                        <button
                                            onclick={() => saveEdit(interview.id)}
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border-2 border-green-500 hover:bg-green-100 dark:hover:bg-green-900"
                                            aria-label="save-interview"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-5 w-5 fill-green-500">
                                                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                            </svg>
                                        </button>

                                        <button
                                            onclick={cancelEditing}
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border-2 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900"
                                            aria-label="cancel-edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-5 w-5 fill-gray-500">
                                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            {:else}
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {interview.application.name}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {interview.application.job.title}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {interview.interviewerName || '-'}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {formatDate(interview.interviewStartDate)}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {formatDate(interview.interviewEndDate)}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {interview.interviewModality || '-'}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4">
                                    <div class="flex gap-3">
                                        <button
                                            onclick={() => startEditing(interview)}
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border-2 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                                            aria-label="edit-interview"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-5 w-5 fill-blue-500">
                                                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                            </svg>
                                        </button>

                                        <button
                                            onclick={() => handleDelete(interview.id)}
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border-2 border-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                                            aria-label="delete-interview"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-5 w-5 fill-red-500">
                                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            {/if}
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
        onclick={(e) => {
            if (e.target === e.currentTarget) closeAddModal();
        }}
    >
        <div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-800">
            <AddInterview
                onClose={closeAddModal}
                onSuccess={handleInterviewAdded}
            />
        </div>
    </div>
{/if}