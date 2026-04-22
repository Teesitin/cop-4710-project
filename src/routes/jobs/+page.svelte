<script lang="ts">
    import { onMount } from 'svelte';
    import { initializeApp } from 'firebase/app';
    import { getDataConnect, executeQuery, executeMutation } from 'firebase/data-connect';

    import {
        listJobsRef,
        createJobRef,
        deleteJobRef,
        updateJobStatusRef,
        connectorConfig,
    } from '../../dataconnect-generated';

    const app = initializeApp({
        projectId: 'cop-4710-ab900'
    });

    const dc = getDataConnect(connectorConfig);

    type JobRow = {
        id: string;
        title: string;
        status: string;
        salary?: string | null;
    };

    let loading = $state(true);
    let saving = $state(false);
    let error = $state('');
    let formError = $state('');
    let jobs = $state<JobRow[]>([]);

    // Form State
    let jobTitle = $state('');
    let jobSalary = $state('');
    let jobStatus = $state('Open');

    const statuses = ['Open', 'Interviewing', 'Filled', 'Closed'];

    async function loadJobs() {
        try {
            loading = true;
            error = '';
            const result = await executeQuery(listJobsRef());
            jobs = result.data.jobs ?? [];
        } catch (err) {
            console.error('loadJobs error:', err);
            error = 'Failed to load jobs from Data Connect.';
        } finally {
            loading = false;
        }
    }

    async function handleSubmit() {
        formError = '';

        if (!jobTitle.trim()) {
            formError = 'Job title is required.';
            return;
        }

        try {
            saving = true;

            const jobTitleValue = jobTitle.trim();
            const jobSalaryValue = jobSalary.trim();

            const createJobResult = await executeMutation(
                createJobRef({
                    title: jobTitleValue,
                    status: jobStatus,
                    salary: jobSalaryValue || null
                })
            );

            const jobId = createJobResult.data.job_insert.id;

            jobs = [
                {
                    id: jobId,
                    title: jobTitleValue,
                    status: jobStatus,
                    salary: jobSalaryValue
                },
                ...jobs
            ];

            // Reset Form
            jobTitle = '';
            jobSalary = '';
            jobStatus = 'Open';
        } catch (err) {
            console.error('handleSubmit error:', err);
            formError = 'Failed to create job.';
        } finally {
            saving = false;
        }
    }

    // --- NEW: Update Status ---
    async function handleStatusChange(jobId: string, newStatus: string) {
        try {
            await executeMutation(updateJobStatusRef({ id: jobId, status: newStatus }));
            const jobIndex = jobs.findIndex(j => j.id === jobId);
            if (jobIndex !== -1) jobs[jobIndex].status = newStatus;
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Could not update status. Check console.");
        }
    }

    // --- NEW: Delete Job ---
    async function handleDelete(jobId: string) {
        if (!confirm('Are you sure you want to delete this job?')) return;
        
        try {
            await executeMutation(deleteJobRef({ id: jobId }));
            jobs = jobs.filter(j => j.id !== jobId);
        } catch (err) {
            console.error("Failed to delete job", err);
            alert("Could not delete job.");
        }
    }

    onMount(() => {
        loadJobs();
    });
</script>

<svelte:head>
    <title>Job Tracker</title>
</svelte:head>

<section class="mx-auto max-w-5xl p-10 space-y-10">
    <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Job Tracker</h1>
        <p class="mt-1 text-sm">Manage available jobs</p>
    </div>

    <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-6 shadow rounded-2xl">
        <h2 class="mb-4 text-xl font-semibold">Add Job</h2>

        <div class="grid gap-4 md:grid-cols-3">
            <div>
                <label for="jobTitle" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Job Title *
                </label>
                <input
                    id="jobTitle"
                    bind:value={jobTitle}
                    class="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                    placeholder="e.g. Software Engineer"
                />
            </div>

            <div>
                <label for="jobSalary" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Salary
                </label>
                <input
                    id="jobSalary"
                    bind:value={jobSalary}
                    class="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                    placeholder="e.g. $90k - $110k"
                />
            </div>

            <div>
                <label for="jobStatus" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Status
                </label>
                <select 
                    id="jobStatus" 
                    bind:value={jobStatus} 
                    class="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500"
                >
                    {#each statuses as status}
                        <option value={status}>{status}</option>
                    {/each}
                </select>
            </div>
        </div>

        {#if formError}
            <div class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
            </div>
        {/if}

        <div class="mt-4">
            <button
                type="button"
                onclick={handleSubmit}
                disabled={saving}
                class="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {#if saving} Saving... {:else} Add Job {/if}
            </button>
        </div>
    </div>

    <h2 class="mb-4 text-xl font-semibold text-gray-900">Jobs Database</h2>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><p class="text-sm text-gray-600">Loading jobs...</p></div>
    {:else if error}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm"><p class="text-sm font-medium text-red-700">{error}</p></div>
    {:else if jobs.length === 0}
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><p class="text-sm text-gray-600">No jobs found. Add one above!</p></div>
    {:else}
        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Job Title</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Salary</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    {#each jobs as job (job.id)}
                        <tr class="transition hover:bg-gray-50">
                            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{job.title}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{job.salary || '-'}</td>
                            <td class="whitespace-nowrap px-6 py-4">
                                <select 
                                    value={job.status} 
                                    onchange={(e) => handleStatusChange(job.id, (e.currentTarget as HTMLSelectElement).value)}
                                    class="rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium outline-none transition focus:border-blue-500"
                                >
                                    {#each statuses as status}
                                        <option value={status}>{status}</option>
                                    {/each}
                                </select>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right">
                                <button onclick={() => handleDelete(job.id)} class="text-sm font-medium text-red-500 hover:text-red-700 transition">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</section>