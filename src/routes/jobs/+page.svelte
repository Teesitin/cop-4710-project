<script lang="ts">
    import '$lib/firebase';
    import { onMount } from 'svelte';
    import { afterNavigate } from '$app/navigation';

    import AddJob from '$lib/assets/forms/AddJob.svelte';

    import {
        deleteJob,
        listEmployees,
        listJobs,
        updateJob,
        updateJobStatus
    } from '../../dataconnect-generated';

    import { notify } from '$lib/assets/components/notificationState.svelte';

    let loading = $state(true);
    let error = $state('');

    let jobs = $state<Job[]>([]);
    let employees = $state<Employee[]>([]);

    let showAddModal = $state(false);

    let editingId = $state<string | null>(null);
    let editTitle = $state('');
    let editSalary = $state<string | number>('');
    let editStatus = $state<JobStatus>('Open');

    let searchQuery = $state('');

    const statuses: JobStatus[] = ['Open', 'Interviewing', 'Filled', 'Closed'];

    function getSalaryNumber(value: string | number | null | undefined) {
        const text = String(value ?? '').trim();
        if (!text) return null;
        const numberValue = Number(text);
        return Number.isNaN(numberValue) ? null : numberValue;
    }

    function formatSalary(value?: number | null) {
        if (value === null || value === undefined) return '-';
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
    }

    function getEmployeesForJob(jobId: string) {
        return employees.filter((employee) => employee.job.id === jobId);
    }

    function openAddModal() {
        showAddModal = true;
    }

    function closeAddModal() {
        showAddModal = false;
    }

    let filteredJobs = $derived.by(() => {
        const query = searchQuery.trim().toLowerCase();

        return jobs.filter((job) => {
            const employeeText = getEmployeesForJob(job.id)
                .map((employee) => `${employee.name} ${employee.email} ${employee.role}`)
                .join(' ')
                .toLowerCase();

            return (
                job.title.toLowerCase().includes(query) ||
                String(job.salary ?? '').toLowerCase().includes(query) ||
                String(job.status ?? '').toLowerCase().includes(query) ||
                employeeText.includes(query)
            );
        });
    });

    async function loadJobs(options: { notifyOnSuccess?: boolean } = {}) {
        try {
            loading = true;
            error = '';

            const refresh = Date.now();

            const jobsResult = await listJobs({ refresh });
            jobs = [...(jobsResult.data.jobs ?? [])].reverse();

            const employeesResult = await listEmployees({ refresh });
            employees = employeesResult.data.employees ?? [];

            if (options.notifyOnSuccess) {
                notify.success('Jobs loaded.');
            }
        } catch (err) {
            console.error('loadJobs error:', err);
            error = 'Failed to load jobs.';
            notify.error('Failed to load jobs.');
        } finally {
            loading = false;
        }
    }

    async function handleJobAdded() {
        closeAddModal();
        notify.success('Job created.');
        await loadJobs({ notifyOnSuccess: false });
    }

    function startEditing(job: Job) {
        editingId = job.id;
        editTitle = job.title;
        editSalary = job.salary ?? '';
        editStatus = job.status;
        notify.info(`Editing "${job.title}".`);
    }

    function cancelEditing() {
        editingId = null;
        notify.info('Edit cancelled.');
    }

    async function saveEdit(jobId: string) {
        const titleValue = String(editTitle ?? '').trim();
        const salaryText = String(editSalary ?? '').trim();
        const salaryValue = getSalaryNumber(editSalary);

        if (!titleValue) {
            notify.warning('Title is required.');
            return;
        }

        if (salaryText && salaryValue === null) {
            notify.warning('Salary must be a valid number.');
            return;
        }

        try {
            await updateJob({
                id: jobId,
                title: titleValue,
                salary: salaryValue,
                status: editStatus
            });

            jobs = jobs.map((job) => {
                if (job.id !== jobId) return job;
                return { ...job, title: titleValue, salary: salaryValue, status: editStatus };
            });

            editingId = null;
            notify.success('Job updated.');
        } catch (err) {
            console.error('saveEdit error:', err);
            notify.error('Failed to update job.');
        }
    }

    async function handleStatusChange(jobId: string, newStatus: string) {
        try {
            await updateJobStatus({ id: jobId, status: newStatus });

            jobs = jobs.map((job) => {
                if (job.id !== jobId) return job;
                return { ...job, status: newStatus };
            });

            notify.success(`Status updated to ${newStatus}.`);
        } catch (err) {
            console.error('handleStatusChange error:', err);
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
            jobs = jobs.filter((job) => job.id !== jobId);
            notify.success('Job deleted.');
        } catch (err) {
            console.error('handleDelete error:', err);
            notify.error('Failed to delete job.');
        }
    }

    function getStatusClass(status: string) {
        const normalized = String(status ?? '').trim().toLowerCase();

        if (normalized === 'open')
            return 'border-blue-400 bg-blue-50 text-blue-700 focus:border-blue-500 dark:border-blue-600 dark:bg-blue-950/40 dark:text-blue-300';
        if (normalized === 'filled')
            return 'border-green-400 bg-green-50 text-green-700 focus:border-green-500 dark:border-green-600 dark:bg-green-950/40 dark:text-green-300';
        if (normalized === 'closed')
            return 'border-red-400 bg-red-50 text-red-700 focus:border-red-500 dark:border-red-600 dark:bg-red-950/40 dark:text-red-300';
        if (normalized === 'interviewing')
            return 'border-yellow-400 bg-yellow-50 text-yellow-700 focus:border-yellow-500 dark:border-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-300';

        return 'border-gray-400 bg-gray-50 text-gray-900 focus:border-blue-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white';
    }

    onMount(() => {
        loadJobs({ notifyOnSuccess: false });
    });

    afterNavigate(() => {
        loadJobs({ notifyOnSuccess: false });
    });
</script>

<svelte:head>
    <title>Jobs</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-10 p-10">
    <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Job Tracker
            </h1>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage available jobs
            </p>
        </div>

        <div class="flex w-full items-center space-x-4 sm:w-auto">
            <div class="w-full sm:w-64">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search jobs, salaries, employees..."
                    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <button
                onclick={openAddModal}
                class="whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
                + Add Job
            </button>
        </div>
    </div>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p class="text-sm text-gray-600 dark:text-gray-400">Loading jobs...</p>
        </div>
    {:else if error}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900/50 dark:bg-red-900/20">
            <p class="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
        </div>
    {:else if filteredJobs.length === 0}
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {#if jobs.length === 0}
                    No jobs found. Click "+ Add Job" to get started!
                {:else}
                    No jobs match your search.
                {/if}
            </p>
        </div>
    {:else}
        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Job Title
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Salary
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Employee
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {#each filteredJobs as job (job.id)}
                        <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            {#if editingId === job.id}
                                <td class="px-4 py-3">
                                    <input
                                        bind:value={editTitle}
                                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </td>

                                <td class="px-4 py-3">
                                    <input
                                        type="number"
                                        bind:value={editSalary}
                                        placeholder="0"
                                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </td>

                                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    {#if getEmployeesForJob(job.id).length === 0}
                                        -
                                    {:else}
                                        <div class="space-y-1">
                                            {#each getEmployeesForJob(job.id) as employee}
                                                <div>
                                                    <p class="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                                                    <p class="text-xs text-gray-500 dark:text-gray-400">{employee.email}</p>
                                                </div>
                                            {/each}
                                        </div>
                                    {/if}
                                </td>

                                <td class="px-4 py-3">
                                    <div class="inline-block rounded-lg border {getStatusClass(editStatus)}">
                                        <select
                                            bind:value={editStatus}
                                            class="rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium outline-none"
                                        >
                                            {#each statuses as status}
                                                <option value={status} class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                                                    {status}
                                                </option>
                                            {/each}
                                        </select>
                                    </div>
                                </td>

                                <td class="whitespace-nowrap px-6 py-4">
                                    <div class="flex gap-3">
                                        <button
                                            onclick={() => saveEdit(job.id)}
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border-2 border-green-500 hover:bg-green-100 dark:hover:bg-green-900"
                                            aria-label="save-job"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-5 w-5 fill-green-500">
                                                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                            </svg>
                                        </button>

                                        <button
                                            onclick={cancelEditing}
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border-2 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900"
                                            aria-label="cancel-edit-job"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-5 w-5 fill-gray-500">
                                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            {:else}
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {job.title}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {formatSalary(job.salary)}
                                </td>

                                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    {#if getEmployeesForJob(job.id).length === 0}
                                        -
                                    {:else}
                                        <div class="space-y-1">
                                            {#each getEmployeesForJob(job.id) as employee}
                                                <div>
                                                    <p class="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                                                    <p class="text-xs text-gray-500 dark:text-gray-400">{employee.email}</p>
                                                </div>
                                            {/each}
                                        </div>
                                    {/if}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4">
                                    <select
                                        value={job.status}
                                        onchange={(e) => handleStatusChange(job.id, (e.currentTarget as HTMLSelectElement).value)}
                                        class="rounded-lg border px-3 py-1.5 text-sm font-medium outline-none transition {getStatusClass(job.status)}"
                                    >
                                        {#each statuses as status}
                                            <option value={status} class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                                                {status}
                                            </option>
                                        {/each}
                                    </select>
                                </td>

                                <td class="whitespace-nowrap px-6 py-4">
                                    <div class="flex gap-3">
                                        <button
                                            onclick={() => startEditing(job)}
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border-2 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                                            aria-label="edit-job"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-5 w-5 fill-blue-500">
                                                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                            </svg>
                                        </button>

                                        <button
                                            onclick={() => handleDelete(job.id)}
                                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded border-2 border-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                                            aria-label="delete-job"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="h-5 w-5 fill-red-500">
                                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                            </svg>
                                        </button>
                                    </div>
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
        onclick={(e) => {
            if (e.target === e.currentTarget) closeAddModal();
        }}
    >
        <div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-800">
            <AddJob
                onClose={closeAddModal}
                onSuccess={handleJobAdded}
            />
        </div>
    </div>
{/if}