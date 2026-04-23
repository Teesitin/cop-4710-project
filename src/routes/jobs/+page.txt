<script lang="ts">
    import { onMount } from 'svelte';
    import { initializeApp } from 'firebase/app';
    import { getDataConnect, executeQuery, executeMutation } from 'firebase/data-connect';
    import AddJob from '$lib/assets/forms/AddJob.svelte';  

    import {
        listJobsRef,
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
    let error = $state('');
    let jobs = $state<JobRow[]>([]);

    // --- NEW: Modal State ---
    let showAddModal = $state(false);

    // Inline Edit State
    let editingId = $state<string | null>(null);
    let editTitle = $state('');
    let editSalary = $state('');
    let editStatus = $state('Open');

    // Search & Sorting State 
    let searchQuery = $state('');
    
    type SortColumn = 'title' | 'salary' | 'status' | null;
    type SortDirection = 'asc' | 'desc' | 'default';
    let sortColumn = $state<SortColumn>(null);
    let sortDirection = $state<SortDirection>('default');

    function toggleSort(col: SortColumn) {
        if (sortColumn === col) {
            if (sortDirection === 'default') sortDirection = 'asc';
            else if (sortDirection === 'asc') sortDirection = 'desc';
            else sortDirection = 'default';
        } else {
            sortColumn = col;
            sortDirection = 'asc';
        }
        
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

        // 2. SORTING 
        if (sortColumn && sortDirection !== 'default') {
            result.sort((a, b) => {
                const col = sortColumn as Exclude<SortColumn, null>;
                const valA = String(a[col] ?? '').toLowerCase();
                const valB = String(b[col] ?? '').toLowerCase();

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

    const statuses = ['Open', 'Interviewing', 'Filled', 'Closed'];

    async function loadJobs() {
        try {
            loading = true;
            error = '';
            const result = await executeQuery(listJobsRef());
            jobs = result.data.jobs ? [...result.data.jobs].reverse() : [];
        } catch (err) {
            console.error('loadJobs error:', err);
            error = 'Failed to load jobs from Data Connect.';
        } finally {
            loading = false;
        }
    }

    // --- Triggered by the AddJob component when a job saves ---
    function handleJobAdded(newJob: JobRow) {
        jobs = [newJob, ...jobs]; // Put new job at the top of the list
        showAddModal = false;     // Close the modal
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

            const index = jobs.findIndex(j => j.id === jobId);
            if (index !== -1) {
                jobs[index] = { 
                    ...jobs[index], 
                    title: titleValue, 
                    salary: salaryValue || null, 
                    status: editStatus 
                };
            }
            editingId = null; 
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
    <div class="mb-2">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Job Tracker</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage available jobs</p>
    </div>

    <div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Jobs Database</h2>
        
        <div class="flex items-center space-x-4 w-full sm:w-auto">
            <div class="w-full sm:w-64">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search jobs & salaries..."
                    class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500"
                />
            </div>
            
            <button 
                onclick={() => showAddModal = true}
                class="whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
            >
                + Add Job
            </button>
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
                    No jobs found. Click "+ Add Job" to get started!
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

{#if showAddModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm transition-opacity"
        onclick={(e) => { if (e.target === e.currentTarget) showAddModal = false; }}
    >
        <div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
            <AddJob 
                onClose={() => showAddModal = false} 
                onSuccess={handleJobAdded} 
            />
        </div>
    </div>
{/if}