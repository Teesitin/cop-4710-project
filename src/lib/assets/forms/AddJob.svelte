<script lang="ts">
    import '$lib/firebase';

    import { createJob } from '../../../dataconnect-generated';
    import { notify } from '$lib/assets/components/notificationState.svelte';

    let { onClose, onSuccess } = $props<{
        onClose: () => void;
        onSuccess: () => void;
    }>();

    let jobTitle = $state('');
    let jobSalary = $state<string | number>('');
    let jobStatus = $state('Open');
    let saving = $state(false);
    let formError = $state('');

    const statuses = ['Open', 'Interviewing', 'Filled', 'Closed'];

    function closeForm() {
        onClose();
        notify.info('Add job cancelled.');
    }

    async function handleSubmit() {
        formError = '';

        const jobTitleValue = String(jobTitle ?? '').trim();
        const salaryText = String(jobSalary ?? '').trim();
        const salaryValue = salaryText ? Number(salaryText) : null;

        if (!jobTitleValue) {
            formError = 'Job title is required.';
            notify.warning('Job title is required.');
            return;
        }

        if (salaryText && Number.isNaN(salaryValue)) {
            formError = 'Salary must be a valid number.';
            notify.warning('Salary must be a valid number.');
            return;
        }

        try {
            saving = true;

            await createJob({
                title: jobTitleValue,
                status: jobStatus,
                salary: salaryValue
            });

            onSuccess();

            notify.success('Job created.');
        } catch (err) {
            console.error('handleSubmit error:', err);
            formError = 'Failed to create job.';
            notify.error('Failed to create job.');
        } finally {
            saving = false;
        }
    }
</script>

<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add New Job</h2>

<div class="space-y-5">
    <div>
        <label for="jobTitle" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title *</label>
        <input id="jobTitle" bind:value={jobTitle} class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g. Software Engineer" />
    </div>

    <div>
        <label for="jobSalary" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Salary</label>
        <input id="jobSalary" type="number" bind:value={jobSalary} class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g. 90000" />
    </div>

    <div>
        <label for="jobStatus" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Status</label>
        <select id="jobStatus" bind:value={jobStatus} class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            {#each statuses as status}
                <option value={status}>{status}</option>
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
    <button type="button" onclick={closeForm} class="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition">
        Cancel
    </button>
    <button type="button" onclick={handleSubmit} disabled={saving} class="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm">
        {#if saving} Saving... {:else} Save Job {/if}
    </button>
</div>