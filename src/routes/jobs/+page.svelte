<script lang="ts">
    import { onMount } from 'svelte';
    import { initializeApp } from 'firebase/app';
    import { getDataConnect, executeQuery, executeMutation } from 'firebase/data-connect';
    import AddJob from '$lib/assets/forms/AddJob.svelte';

    import {
        listJobsRef,
        createJobRef,
        deleteJobRef,
        updateJobStatusRef,
        updateJobRef,
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

    // Add Job Form State
    let jobTitle = $state('');
    let jobSalary = $state('');
    let jobStatus = $state('Open');

    // Inline Edit State
    let editingId = $state<string | null>(null);
    let editTitle = $state('');
    let editSalary = $state('');
    let editStatus = $state('Open');

    // --- NEW: Search & Sorting State ---
    let searchQuery = $state('');
<<<<<<< Updated upstream
    let filteredJobs = $derived(
        jobs.filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
=======
    
    // Track which column is being sorted and in what direction
    type SortColumn = 'title' | 'salary' | 'status' | null;
    type SortDirection = 'asc' | 'desc' | 'default';
    let sortColumn = $state<SortColumn>(null);
    let sortDirection = $state<SortDirection>('default');

    // Cycle through: Default -> Ascending -> Descending -> Default
    function toggleSort(col: SortColumn) {
        if (sortColumn === col) {
            if (sortDirection === 'default') sortDirection = 'asc';
            else if (sortDirection === 'asc') sortDirection = 'desc';
            else sortDirection = 'default';
        } else {
            sortColumn = col;
            sortDirection = 'asc';
        }
        
        // Reset column tracker if we are back to default
        if (sortDirection === 'default') {
            sortColumn = null;
        }
    }

    let filteredJobs = $derived.by(() => {
        // 1. FILTERING 
        let result = jobs.filter(job => {
            const query = searchQuery.toLowerCase();
            const matchTitle = job.title.toLowerCase().includes(query);
            const matchSalary = (job.salary || '').toLowerCase().includes(query);
            return matchTitle || matchSalary;
        });

        // 2. SORTING (Runs only if a column is clicked and not on 'default')
        if (sortColumn && sortDirection !== 'default') {
            result.sort((a, b) => {
                const valA = (a[sortColumn] || '').toLowerCase();
                const valB = (b[sortColumn] || '').toLowerCase();

                // NEW: Only use numeric sorting if they clicked the Salary column!
                const isNumericCol = sortColumn === 'salary';

                if (sortDirection === 'asc') {
                    return valA.localeCompare(valB, undefined, { numeric: isNumericCol });
                } else {
                    return valB.localeCompare(valA, undefined, { numeric: isNumericCol });
                }
            });
        }

        return result;
    });
>>>>>>> Stashed changes

    const statuses = ['Open', 'Interviewing', 'Filled', 'Closed'];

    async function loadJobs() {
        try {
            loading = true;
            error = '';
            const result = await executeQuery(listJobsRef());
            // REVERSE the array so newest jobs stay at the top (This is our 'default' sort!)
            jobs = result.data.jobs ? [...result.data.jobs].reverse() : [];
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

    // --- FULL EDITING FUNCTIONS ---
    function startEditing(job: JobRow) {
        editingId = job.id;
        editTitle = job.title;
        editSalary = job.salary || '';
        editStatus = job.status;
    }

    function cancelEditing() {
        editingId = null;
    }

    async function saveEdit(jobId: string) {
        if (!editTitle.trim()) {
            alert("Title cannot be empty.");
            return;
        }

        if (!confirm('Are you sure you want to save these changes?')) return;

        try {
            const titleValue = editTitle.trim();
            const salaryValue = editSalary.trim();

            await executeMutation(updateJobRef({
                id: jobId,
                title: titleValue,
                salary: salaryValue || null,
                status: editStatus
            }));

            // Update the local array without moving the row
            const index = jobs.findIndex(j => j.id === jobId);
            if (index !== -1) {
                jobs[index] = { 
                    ...jobs[index], 
                    title: titleValue, 
                    salary: salaryValue || null, 
                    status: editStatus 
                };
            }
            editingId = null; // Close the edit mode
        } catch (err) {
            console.error("Failed to update job", err);
            alert("Could not update job. Check console.");
        }
    }

    async function handleStatusChange(jobId: string, newStatus: string) {
        try {
            await executeMutation(updateJobStatusRef({ id: jobId, status: newStatus }));
            const jobIndex = jobs.findIndex(j => j.id === jobId);
            if (jobIndex !== -1) jobs[jobIndex].status = newStatus;
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Could not update status.");
        }
    }

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
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Job Tracker</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage available jobs</p>
    </div>

    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow rounded-2xl">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Add Job</h2>

        <div class="grid gap-4 md:grid-cols-3">
            <div>
                <label for="jobTitle" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title *</label>
                <input id="jobTitle" bind:value={jobTitle} class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500" placeholder="e.g. Software Engineer" />
            </div>

            <div>
                <label for="jobSalary" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Salary</label>
                <input id="jobSalary" bind:value={jobSalary} class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500" placeholder="e.g. $90k - $110k" />
            </div>

            <div>
                <label for="jobStatus" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select id="jobStatus" bind:value={jobStatus} class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500">
                    {#each statuses as status}
                        <option value={status}>{status}</option>
                    {/each}
                </select>
            </div>
        </div>

        {#if formError}
            <div class="mt-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">{formError}</div>
        {/if}

        <div class="mt-4">
            <button type="button" onclick={handleSubmit} disabled={saving} class="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {#if saving} Saving... {:else} Add Job {/if}
            </button>
        </div>
    </div>

    <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Jobs Database</h2>
        <div class="w-64">
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search jobs & salaries..."
                class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500"
            />
        </div>    
    </div>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm"><p class="text-sm text-gray-600 dark:text-gray-400">Loading jobs...</p></div>
    {:else if error}
        <div class="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-6 shadow-sm"><p class="text-sm font-medium text-red-700 dark:text-red-400">{error}</p></div>
    {:else if filteredJobs.length === 0}
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {#if jobs.length === 0}
                    No jobs found. Add one above!
                {:else}
                    No jobs match your search.
                {/if}
            </p>
        </div>
    {:else}
        <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th 
                            class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            onclick={() => toggleSort('title')}
                        >
                            Job Title
                            {#if sortColumn === 'title'}
                                <span class="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            {/if}
                        </th>
                        
                        <th 
                            class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            onclick={() => toggleSort('salary')}
                        >
                            Salary
                            {#if sortColumn === 'salary'}
                                <span class="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            {/if}
                        </th>
                        
                        <th 
                            class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            onclick={() => toggleSort('status')}
                        >
                            Status
                            {#if sortColumn === 'status'}
                                <span class="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            {/if}
                        </th>
                        
                        <th class="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {#each filteredJobs as job (job.id)}
                        <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            
                            {#if editingId === job.id}
                                <td class="px-4 py-3">
                                    <input bind:value={editTitle} class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" />
                                </td>
                                <td class="px-4 py-3">
                                    <input bind:value={editSalary} class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" placeholder="$0" />
                                </td>
                                <td class="px-4 py-3">
                                    <select bind:value={editStatus} class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500">
                                        {#each statuses as status}
                                            <option value={status}>{status}</option>
                                        {/each}
                                    </select>
                                </td>
                                <td class="whitespace-nowrap px-6 py-4 text-right space-x-3">
                                    <button onclick={() => saveEdit(job.id)} class="text-sm font-semibold text-green-600 hover:text-green-500 transition">Save</button>
                                    <button onclick={cancelEditing} class="text-sm font-medium text-gray-500 hover:text-gray-400 transition">Cancel</button>
                                </td>
                            {:else}
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{job.title}</td>
                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{job.salary || '-'}</td>
                                <td class="whitespace-nowrap px-6 py-4">
                                    <select 
                                        value={job.status} 
                                        onchange={(e) => handleStatusChange(job.id, (e.currentTarget as HTMLSelectElement).value)}
                                        class="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-white outline-none transition focus:border-blue-500"
                                    >
                                        {#each statuses as status}
                                            <option value={status}>{status}</option>
                                        {/each}
                                    </select>
                                </td>
                                <td class="whitespace-nowrap px-6 py-4 text-right space-x-3">
                                    <button onclick={() => startEditing(job)} class="text-sm font-medium text-blue-500 hover:text-blue-400 transition">Edit</button>
                                    <button onclick={() => handleDelete(job.id)} class="text-sm font-medium text-red-500 hover:text-red-400 transition">Delete</button>
                                </td>
                            {/if}

                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</section>