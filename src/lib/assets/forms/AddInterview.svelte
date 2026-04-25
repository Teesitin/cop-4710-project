<script lang="ts">
    import { onMount } from 'svelte';
    import { executeMutation, executeQuery } from 'firebase/data-connect';
    import {createInterviewRef, listApplicationsRef, connectorConfig } from '../../../dataconnect-generated';
    import { getDataConnect } from 'firebase/data-connect';
    import { app } from '../../../lib/firebase';

        let { onClose, onSuccess } = $props<{
        onClose: () => void;
        onSuccess: (interview: any) => void;
    }>();

        type ApplicationOption = {
        id: string;
        applicantName: string;
        jobTitle: string;
    };

    let applications = $state<ApplicationOption[]>([]);
    let selectedApplicationId = $state('');
    let interviewerName = $state('');
    let interviewStartDate = $state('');
    let interviewEndDate = $state('');
    let interviewModality = $state('');
    let saving = $state(false);
    let loadingApps = $state(true);
    let formError = $state('');

    const modalities = ['In-Person', 'Online'];

   onMount(async () => {
    try {
        const dc = getDataConnect(app, connectorConfig);
        const result = await executeQuery(listApplicationsRef(dc));
        applications = (result.data.applications ?? []).map((a: any) => ({
            id: a.id,
            applicantName: a.name,
            jobTitle: a.job.title
        }));
        if (applications.length > 0) {
            selectedApplicationId = applications[0].id;
        }
    } catch (err) {
        console.error('Failed to load applications: ', err);
        formError = 'Could not load applications.';
    } finally {
        loadingApps = false;
    }
});

    async function handleSubmit() {
        formError = '';

        if (!selectedApplicationId) {
            formError = 'Please select an application.';
            return;
        }

        try {
            saving = true;

            const createInterviewResult = await executeMutation(
                createInterviewRef({
                    applicationId: selectedApplicationId,
                    interviewerName: interviewerName.trim() || null,
                    interviewStartDate: interviewStartDate ? new Date(interviewStartDate).toISOString() : null,
                    interviewEndDate: interviewEndDate ? new Date(interviewEndDate).toISOString() : null,
                    interviewModality: interviewModality
                })
            );

            const selectedApp = applications.find(a => a.id === selectedApplicationId);

            onSuccess({
                id: createInterviewResult.data.interview_insert.id,
                applicationId: selectedApplicationId,
                applicantName: selectedApp?.applicantName ?? '',
                jobTitle: selectedApp?.jobTitle ?? '',
                interviewerName: interviewerName.trim() || null,
                interviewStartDate: interviewStartDate ? new Date(interviewStartDate).toISOString() : null,
                interviewEndDate: interviewEndDate ? new Date(interviewEndDate).toISOString() : null,
                interviewModality: interviewModality
            });

        } catch (err) {
            console.error('handleSubmit error:', err);
            formError = 'Failed to create interview.';
        } finally {
            saving = false;
        }
    }
</script>

<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add New Interview</h2>

<div class="space-y-5">
    <div>
        <label for="applicationId" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Application *</label>
        {#if loadingApps}
            <p class="text-sm text-gray-400">Loading applications...</p>
        {:else if applications.length === 0}
            <p class="text-sm text-red-500">No applications found.</p>
        {:else}
            <select
                id="applicationId"
                bind:value={selectedApplicationId}
                class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                {#each applications as app}
                    <option value={app.id}>{app.applicantName} — {app.jobTitle}</option>
                {/each}
            </select>
        {/if}
    </div>

    <div>
        <label for="interviewerName" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Interviewer Name</label>
        <input
            id="interviewerName"
            bind:value={interviewerName}
            class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Jane Smith"
        />
    </div>

    <div>
        <label for="interviewStartDate" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
        <input
            id="interviewStartDate"
            type="datetime-local"
            bind:value={interviewStartDate}
            class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
    </div>

    <div>
        <label for="interviewEndDate" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
        <input
            id="interviewEndDate"
            type="datetime-local"
            bind:value={interviewEndDate}
            class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
    </div>

    <div>
        <label for="interviewModality" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Modality</label>
        <select
            id="interviewModality"
            bind:value={interviewModality}
            class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
            {#each modalities as m}
                <option value={m}>{m}</option>
            {/each}
        </select>
    </div>
</div>

{#if formError}
    <div class="mt-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
        {formError}
    </div>
{/if}

<div class="mt-8 flex justify-end space-x-3">
    <button type="button" onclick={onClose} class="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition">
        Cancel
    </button>
    <button
        type="button"
        onclick={handleSubmit}
        disabled={saving || loadingApps || applications.length === 0}
        class="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
    >
        {#if saving} Saving... {:else} Save Interview {/if}
    </button>
</div>