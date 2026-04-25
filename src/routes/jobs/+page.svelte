<script lang="ts">
    import { onMount } from 'svelte';
    import '$lib/firebase';

    import AddJob from '$lib/assets/forms/AddJob.svelte';

    import {
        listJobs,
        deleteJob,
        updateJob,
        updateJobStatus
    } from '../../dataconnect-generated';

    import { notify } from '$lib/assets/components/notificationState.svelte';

    type JobRow = {
        id: string;
        title: string;
        status: string;
        salary?: string | null;
    };

    let loading = $state(true);
    let error = $state('');
    let jobs = $state<JobRow[]>([]);

    let showAddModal = $state(false);

    let editingId = $state<string | null>(null);
    let editTitle = $state('');
    let editSalary = $state('');
    let editStatus = $state('Open');

    let searchQuery = $state('');

    type SortColumn = 'title' | 'salary' | 'status' | null;
    type SortDirection = 'asc' | 'desc' | 'default';

    let sortColumn = $state<SortColumn>(null);
    let sortDirection = $state<SortDirection>('default');

    const statuses = ['Open', 'Interviewing', 'Filled', 'Closed'];

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

        notify.info(`Sorting by ${col ?? 'default'} (${sortDirection})`);
    }

    let filteredJobs = $derived.by(() => {
        let result = jobs.filter(job => {
            const query = searchQuery.toLowerCase();
            return (
                job.title.toLowerCase().includes(query) ||
                String(job.salary ?? '').toLowerCase().includes(query)
            );
        });

        if (sortColumn && sortDirection !== 'default') {
            result.sort((a, b) => {
                const valA = String(a[sortColumn!] ?? '').toLowerCase();
                const valB = String(b[sortColumn!] ?? '').toLowerCase();

                const isNumeric = sortColumn === 'salary';

                return sortDirection === 'asc'
                    ? valA.localeCompare(valB, undefined, { numeric: isNumeric })
                    : valB.localeCompare(valA, undefined, { numeric: isNumeric });
            });
        }

        return result;
    });

    async function loadJobs() {
        try {
            loading = true;
            error = '';

            const result = await listJobs();
            jobs = result.data.jobs ? [...result.data.jobs].reverse() : [];

            notify.success('Jobs loaded.');
        } catch (err) {
            console.error('loadJobs error:', err);
            error = 'Failed to load jobs.';
            notify.error('Failed to load jobs.');
        } finally {
            loading = false;
        }
    }

    function handleJobAdded(newJob: JobRow) {
        jobs = [newJob, ...jobs];
        showAddModal = false;
        notify.success('Job created.');
    }

    function startEditing(job: JobRow) {
        editingId = job.id;
        editTitle = job.title;
        editSalary = job.salary || '';
        editStatus = job.status;

        notify.info(`Editing "${job.title}"`);
    }

    function cancelEditing() {
        editingId = null;
        notify.info('Edit cancelled.');
    }

    async function saveEdit(jobId: string) {
        const titleValue = String(editTitle ?? '').trim();
        const salaryValue = String(editSalary ?? '').trim();

        if (!titleValue) {
            notify.warning('Title is required.');
            return;
        }

        try {
            await updateJob({
                id: jobId,
                title: titleValue,
                salary: salaryValue || null,
                status: editStatus
            });

            const i = jobs.findIndex(j => j.id === jobId);
            if (i !== -1) {
                jobs[i] = {
                    ...jobs[i],
                    title: titleValue,
                    salary: salaryValue || null,
                    status: editStatus
                };
            }

            editingId = null;
            notify.success('Job updated.');
        } catch (err) {
            console.error(err);
            notify.error('Failed to update job.');
        }
    }

    async function handleStatusChange(jobId: string, newStatus: string) {
        try {
            await updateJobStatus({ id: jobId, status: newStatus });

            jobs = jobs.map(j =>
                j.id === jobId ? { ...j, status: newStatus } : j
            );

            notify.success(`Status updated to ${newStatus}.`);
        } catch (err) {
            console.error(err);
            notify.error('Failed to update status.');
        }
    }

    async function handleDelete(jobId: string) {
        if (!confirm('Delete this job?')) {
            notify.info('Delete cancelled.');
            return;
        }

        try {
            await deleteJob({ id: jobId });
            jobs = jobs.filter(j => j.id !== jobId);

            notify.success('Job deleted.');
        } catch (err) {
            console.error(err);
            notify.error('Failed to delete job.');
        }
    }

    onMount(loadJobs);
</script>

<svelte:head>
    <title>Jobs</title>
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
                        
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
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
                                <td class="whitespace-nowrap px-6 py-4 flex gap-3">
                                    <button onclick={() => saveEdit(job.id)}  class="border-2 border-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="edit-job">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-green-500">
                                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                                        </svg>
                                    </button>

                                    <button onclick={cancelEditing} class="border-2 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="edit-job">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-gray-500">
                                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                        </svg>
                                    </button>
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
                                <td class="whitespace-nowrap px-6 py-4 flex gap-3">
                                    <button onclick={() => startEditing(job)} class="border-2 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="edit-job">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-blue-500">
                                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                                        </svg>
                                    </button>

                                    <button onclick={() => handleDelete(job.id)} class="border-2 border-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer" aria-label="edit-job">
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
            <AddJob 
                onClose={() => showAddModal = false} 
                onSuccess={handleJobAdded} 
            />
        </div>
    </div>
{/if}