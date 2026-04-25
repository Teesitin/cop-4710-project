<script lang="ts">
    import { onMount } from 'svelte';
    import '$lib/firebase';
    import AddInterview from '$lib/assets/forms/AddInterview.svelte';
    import { listInterviews, deleteInterview, updateInterview } from '../../dataconnect-generated';
    import { notify } from '$lib/assets/components/notificationState.svelte';

    type InterviewRow = {
        id: string;
        applicationId: string;
        applicantName: string;
        jobTitle: string;
        interviewerName: string | null;
        interviewStartDate: string | null;
        interviewEndDate: string | null;
        interviewModality: string | null;
    };

    let loading = $state(true);
    let error = $state('');
    let interviews = $state<InterviewRow[]>([]);
    let searchQuery = $state('');
    let showAddModal = $state(false);

    const modalities = ['In-Person', 'Online'];

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
            const result = await listInterviews();
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
            notify.success('Interviews loaded.');
        } catch (err) {
            console.error('loadInterviews error:', err);
            error = 'Failed to load interviews.';
            notify.error('Failed to load interviews.');
        } finally {
            loading = false;
        }
    }

    function handleInterviewAdded(newInterview: InterviewRow) {
        interviews = [newInterview, ...interviews];
        showAddModal = false;
        notify.success('Interview created.');
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this interview?')) {
            notify.info('Delete cancelled.');
            return;
        }
        try {
            await deleteInterview({ id });
            interviews = interviews.filter(i => i.id !== id);
            notify.success('Interview deleted.');
        } catch (err) {
            console.error(err);
            notify.error('Failed to delete interview.');
        }
    }

    function formatDate(ts: string | null) {
        if (!ts) return '-';
        return new Date(ts).toLocaleString();
    }

    onMount(loadInterviews);

    let editingId = $state<string | null>(null);
    let editInterviewerName = $state('');
    let editStartDate = $state('');
    let editEndDate = $state('');
    let editModality = $state('');

    function startEditing(interview: InterviewRow) {
    editingId = interview.id;
    editInterviewerName = interview.interviewerName ?? '';
    editStartDate = interview.interviewStartDate ? new Date(interview.interviewStartDate).toISOString().slice(0, 16) : '';
    editEndDate = interview.interviewEndDate ? new Date(interview.interviewEndDate).toISOString().slice(0, 16) : '';
    editModality = interview.interviewModality ?? '';
    notify.info(`Editing interview for "${interview.applicantName}"`);
}
function cancelEditing() {
    editingId = null;
    notify.info('Edit cancelled.');
}

async function saveEdit(id: string) {
    try {
        await updateInterview({
            id,
            interviewerName: editInterviewerName.trim() || null,
            interviewStartDate: editStartDate ? new Date(editStartDate).toISOString() : null,
            interviewEndDate: editEndDate ? new Date(editEndDate).toISOString() : null,
            interviewModality: editModality || null,
        });

        interviews = interviews.map(i =>
            i.id === id ? {
                ...i,
                interviewerName: editInterviewerName.trim() || null,
                interviewStartDate: editStartDate ? new Date(editStartDate).toISOString() : null,
                interviewEndDate: editEndDate ? new Date(editEndDate).toISOString() : null,
                interviewModality: editModality || null,
            } : i
        );

        editingId = null;
        notify.success('Interview updated.');
    } catch (err) {
        console.error(err);
        notify.error('Failed to update interview.');
    }
}
</script>

<svelte:head>
    <title>Interviews</title>
</svelte:head>

<section class="mx-auto max-w-7xl p-10 space-y-10">
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
                    placeholder="Search interviews..."
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
        <div class="overflow-x-auto overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Applicant</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Job</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Interviewer</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Start</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">End</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Modality</th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {#each filteredInterviews as interview (interview.id)}
    <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
        {#if editingId === interview.id}
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{interview.applicantName}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{interview.jobTitle}</td>
            <td class="px-4 py-3">
                <input bind:value={editInterviewerName} placeholder="e.g. Jane Smith"
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" />
            </td>
            <td class="px-4 py-3">
                <input type="datetime-local" bind:value={editStartDate}
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" />
            </td>
            <td class="px-4 py-3">
                <input type="datetime-local" bind:value={editEndDate}
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" />
            </td>
            <td class="px-4 py-3">
                <select bind:value={editModality}
                    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500">
                    {#each modalities as m}
                        <option value={m}>{m}</option>
                    {/each}
                </select>
            </td>
            <td class="whitespace-nowrap px-6 py-4 flex gap-3">
                <button onclick={() => saveEdit(interview.id)} class="border-2 border-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="save-interview">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-green-500">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                    </svg>
                </button>
                <button onclick={cancelEditing} class="border-2 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="cancel-edit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-gray-500">
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                    </svg>
                </button>
            </td>
        {:else}
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{interview.applicantName}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{interview.jobTitle}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{interview.interviewerName || '-'}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(interview.interviewStartDate)}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(interview.interviewEndDate)}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{interview.interviewModality || '-'}</td>
            <td class="whitespace-nowrap px-6 py-4 flex gap-3">
                <button onclick={() => startEditing(interview)} class="border-2 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="edit-interview">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-blue-500">
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                    </svg>
                </button>
                <button onclick={() => handleDelete(interview.id)} class="border-2 border-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="delete-interview">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-red-500">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                </button>
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