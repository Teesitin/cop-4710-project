<script lang="ts">
    import { onMount } from 'svelte';
    import '$lib/firebase';

    import {
        createApplication,
        listJobs
    } from '../../../dataconnect-generated';

    let { close, success } = $props<{
        close: () => void;
        success: () => void;
    }>();

    let jobs = $state<Job[]>([]);

    let name = $state('');
    let email = $state('');
    let selectedJobId = $state('');
    let salaryProposed = $state('');
    let status = $state('Pending');

    // Timestamp input value for <input type="datetime-local">
    let appliedDate = $state(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
            .toISOString()
            .slice(0, 16)
    );
    
    let loading = $state(true);
    let saving = $state(false);
    let formError = $state('');

    let openJobs = $derived.by(() => {
        return jobs.filter((job) => {
            return String(job.status ?? '').trim().toLowerCase() === 'open';
        });
    });

    let selectedJob = $derived.by(() => {
        return openJobs.find((job) => job.id === selectedJobId);
    });

    $effect(() => {
        if (loading) return;

        if (openJobs.length === 0) {
            selectedJobId = '';
            return;
        }

        const selectedStillExists = openJobs.some((job) => job.id === selectedJobId);

        if (!selectedStillExists) {
            selectedJobId = openJobs[0].id;
        }
    });

    onMount(() => {
        loadJobs();
    });

    function toIsoTimestamp(value: string) {
        return value ? new Date(value).toISOString() : '';
    }

    async function loadJobs() {
        try {
            loading = true;
            formError = '';

            const result = await listJobs({
                refresh: Date.now()
            });

            jobs = result.data.jobs ?? [];
        } catch (err) {
            console.error('loadJobs error:', err);
            formError = 'Failed to load jobs.';
        } finally {
            loading = false;
        }
    }

    async function handleSubmit() {
        formError = '';

        const nameValue = String(name ?? '').trim();
        const emailValue = String(email ?? '').trim();
        const appliedDateValue = String(appliedDate ?? '').trim();
        const salaryText = String(salaryProposed ?? '').trim();

        if (!nameValue) {
            formError = 'Name is required.';
            return;
        }

        if (!emailValue) {
            formError = 'Email is required.';
            return;
        }

        if (!selectedJob) {
            formError = 'Please select an open job.';
            return;
        }

        if (!appliedDateValue) {
            formError = 'Applied date is required.';
            return;
        }

        const appliedDateTimestamp = toIsoTimestamp(appliedDateValue);

        if (!appliedDateTimestamp) {
            formError = 'Applied date must be valid.';
            return;
        }

        const salaryValue = salaryText ? Number(salaryText) : null;

        if (salaryText && Number.isNaN(salaryValue)) {
            formError = 'Salary must be a valid number.';
            return;
        }

        try {
            saving = true;

            await createApplication({
                name: nameValue,
                email: emailValue,
                jobId: selectedJob.id,
                salaryProposed: salaryValue,
                status,
                appliedDate: appliedDateTimestamp
            });

            success();
        } catch (err) {
            console.error('handleSubmit error:', err);
            formError = 'Failed to create application.';
        } finally {
            saving = false;
        }
    }
</script>

<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
    Add New Application
</h2>

{#if loading}
    <div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Loading jobs...
    </div>
{:else}
    <div class="space-y-5">
        <div>
            <label for="name" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
            </label>
            <input
                id="name"
                bind:value={name}
                class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. John Smith"
            />
        </div>

        <div>
            <label for="email" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
            </label>
            <input
                id="email"
                bind:value={email}
                class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. john@email.com"
            />
        </div>

        <div>
            <label for="job" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job *
            </label>

            {#if openJobs.length === 0}
                <div class="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-300">
                    No open jobs available.
                </div>
            {:else}
                <select
                    id="job"
                    bind:value={selectedJobId}
                    class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    {#each openJobs as job}
                        <option value={job.id}>
                            {job.title} — {job.salary || '-'}
                        </option>
                    {/each}
                </select>
            {/if}
        </div>

        <div>
            <label for="salaryProposed" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Salary Proposed
            </label>
            <input
                id="salaryProposed"
                type="number"
                bind:value={salaryProposed}
                class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 85000"
            />
        </div>

        <div>
            <label for="status" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
            </label>
            <select
                id="status"
                bind:value={status}
                class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Denied">Denied</option>
            </select>
        </div>

        <div>
            <label for="appliedDate" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Applied Date *
            </label>
            <input
                id="appliedDate"
                type="datetime-local"
                bind:value={appliedDate}
                class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
        </div>
    </div>
{/if}

{#if formError}
    <div class="mt-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
        {formError}
    </div>
{/if}

<div class="mt-8 flex justify-end space-x-3">
    <button
        type="button"
        onclick={close}
        class="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition"
    >
        Cancel
    </button>

    <button
        type="button"
        onclick={handleSubmit}
        disabled={loading || saving || openJobs.length === 0}
        class="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
    >
        {#if saving} Saving... {:else} Save Application {/if}
    </button>
</div>