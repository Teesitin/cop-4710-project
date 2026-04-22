<script lang="ts">
    import { onMount } from 'svelte';
    import { initializeApp } from 'firebase/app';
    import { getDataConnect, connectDataConnectEmulator, executeQuery, executeMutation } from 'firebase/data-connect';

    import {
        connectorConfig,
        listJobsRef,
        createCompanyRef,
        createJobRef
    } from '../../dataconnect-generated';

    const app = initializeApp({
        projectId: 'cop-4710-ab900'
    });

    const dc = getDataConnect(connectorConfig);

    type JobRow = {
        id: string;
        title: string;
        company?: {
            id: string;
            name: string;
        } | null;
    };

    let loading = $state(true);
    let saving = $state(false);
    let error = $state('');
    let formError = $state('');
    let jobs = $state<JobRow[]>([]);

    let companyName = $state('');
    let jobTitle = $state('');

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

        if (!companyName.trim() || !jobTitle.trim()) {
            formError = 'Both Company name and Job title are required.';
            return;
        }

        try {
            saving = true;

            const companyNameValue = companyName.trim();
            const jobTitleValue = jobTitle.trim();

            const createCompanyResult = await executeMutation(
                createCompanyRef({
                    name: companyNameValue
                })
            );

            const companyId = createCompanyResult.data.company_insert.id;

            if (!companyId) {
                throw new Error('Company ID was not returned.');
            }

            const createJobResult = await executeMutation(
                createJobRef({
                    title: jobTitleValue,
                    status: 'Open',
                    companyId
                })
            );

            const jobId = createJobResult.data.job_insert.id;

            jobs = [
                {
                    id: jobId,
                    title: jobTitleValue,
                    company: {
                        id: companyId,
                        name: companyNameValue
                    }
                },
                ...jobs
            ];

            companyName = '';
            jobTitle = '';
        } catch (err) {
            console.error('handleSubmit error:', err);
            formError = 'Failed to create job.';
        } finally {
            saving = false;
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
        <p class="mt-1 text-sm">Manage available jobs and companies</p>
    </div>

    <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-6 shadow rounded-2xl">
        <h2 class="mb-4 text-xl font-semibold">Add Job</h2>

        <div class="grid gap-4 md:grid-cols-2">
            <div>
                <label for="companyName" class="mb-1 block text-sm font-medium text-gray-700">
                    Company Name
                </label>
                <input
                    id="companyName"
                    bind:value={companyName}
                    class="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500"
                    placeholder="e.g. Google"
                />
            </div>

            <div>
                <label for="jobTitle" class="mb-1 block text-sm font-medium text-gray-700">
                    Job Title
                </label>
                <input
                    id="jobTitle"
                    bind:value={jobTitle}
                    class="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500"
                    placeholder="e.g. Software Engineer"
                />
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
                class="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {#if saving}
                    Saving...
                {:else}
                    Add Job
                {/if}
            </button>
        </div>
    </div>

    <h2 class="mb-4 text-xl font-semibold text-gray-900">Jobs Database</h2>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p class="text-sm text-gray-600">Loading jobs...</p>
        </div>
    {:else if error}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p class="text-sm font-medium text-red-700">{error}</p>
        </div>
    {:else if jobs.length === 0}
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p class="text-sm text-gray-600">No jobs found. Add one above!</p>
        </div>
    {:else}
        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Job Title</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Company</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    {#each jobs as job (job.id)}
                        <tr class="transition hover:bg-gray-50">
                            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{job.title}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{job.company?.name || 'N/A'}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</section>