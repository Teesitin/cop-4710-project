<script lang="ts">
    import { onMount } from 'svelte';
    import { app } from '$lib/firebase';
    import { getDataConnect, executeQuery, executeMutation } from 'firebase/data-connect';

    import {
        connectorConfig,
        listJobsRef,
        createCompanyRef,
        createJobRef
    } from '../dataconnect-generated';

    type JobRow = {
        id: string;
        title: string;
        status: string;
        company?: {
            id: string;
            name: string;
        } | null;
        user?: {
            id: string;
            email: string;
            displayName: string;
        } | null;
    };

    let loading = $state(true);
    let saving = $state(false);
    let error = $state('');
    let formError = $state('');
    let jobs = $state<JobRow[]>([]);

    let companyName = $state('');
    let jobTitle = $state('');
    let status = $state('Applied');

    async function loadJobs() {
        try {
            error = '';

            const ref = listJobsRef();
            const result = await executeQuery(ref);

            jobs = result.data.jobs ?? [];
        } catch (err) {
            console.error(err);
            error = 'Failed to load jobs from Data Connect.';
        } finally {
            loading = false;
        }
    }

    async function handleSubmit() {
        formError = '';

        if (!companyName.trim() || !jobTitle.trim() || !status.trim()) {
            formError = 'Company name, job title, and status are required.';
            return;
        }

        try {
            saving = true;

            const createCompanyResult = await executeMutation(
                createCompanyRef({
                    name: companyName.trim()
                })
            );

            const companyId = createCompanyResult.data.company_insert?.id;

            if (!companyId) {
                throw new Error('Company ID was not returned.');
            }

            await executeMutation(
                createJobRef({
                    title: jobTitle.trim(),
                    status: status.trim(),
                    companyId
                })
            );

            companyName = '';
            jobTitle = '';
            status = 'Applied';

            await loadJobs();
        } catch (err) {
            console.error(err);
            formError = 'Failed to create job.';
        } finally {
            saving = false;
        }
    }

    onMount(async () => {
        await loadJobs();
    });
</script>

<svelte:head>
    <title>Job Tracker</title>
</svelte:head>

<div class="mx-auto min-h-screen max-w-5xl px-6 py-10">
    <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Job Tracker</h1>
        <p class="mt-2 text-sm text-gray-500">Simple demo with User, Company, and Job</p>
    </div>

    <div class="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-semibold text-gray-900">Add Job</h2>

        <div class="grid gap-4 md:grid-cols-2">
            <div>
                <label for="companyName" class="mb-1 block text-sm font-medium text-gray-700">
                    Company Name
                </label>
                <input
                    id="companyName"
                    bind:value={companyName}
                    class="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500"
                    placeholder="Google"
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
                    placeholder="Software Engineer"
                />
            </div>

            <div class="md:col-span-2">
                <label for="status" class="mb-1 block text-sm font-medium text-gray-700">
                    Status
                </label>
                <input
                    id="status"
                    bind:value={status}
                    class="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500"
                    placeholder="Applied"
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
                class="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {#if saving}
                    Saving...
                {:else}
                    Add Job
                {/if}
            </button>
        </div>
    </div>

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
            <p class="text-sm text-gray-600">No jobs found.</p>
        </div>
    {:else}
        <div class="grid gap-4">
            {#each jobs as job}
                <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <h2 class="mb-4 text-xl font-semibold text-gray-900">
                        {job.title}
                    </h2>

                    <div class="space-y-2 text-sm text-gray-700">
                        <p>
                            <span class="font-semibold text-gray-900">Status:</span>
                            {job.status}
                        </p>

                        {#if job.company}
                            <p>
                                <span class="font-semibold text-gray-900">Company:</span>
                                {job.company.name}
                            </p>
                        {/if}

                        {#if job.user}
                            <p>
                                <span class="font-semibold text-gray-900">User:</span>
                                {job.user.displayName} ({job.user.email})
                            </p>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>