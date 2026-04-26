<script lang="ts">
    import { afterNavigate } from '$app/navigation';
    import '$lib/firebase';

    import {
        listApplications,
        listJobs,
        updateApplication,
        updateApplicationStatus,
        deleteApplication
    } from '../../dataconnect-generated';

    import AddApplication from '$lib/assets/forms/AddApplication.svelte';
    import { notify } from '$lib/assets/components/notificationState.svelte';
    import { formatTimestamp } from '$lib';

    let loading = $state(true);
    let error = $state('');
    let applications = $state<Application[]>([]);
    let jobs = $state<Job[]>([]);
    let showAddModal = $state(false);

    let editingId = $state<string | null>(null);
    let editName = $state('');
    let editEmail = $state('');
    let editJobId = $state('');
    let editSalaryProposed = $state<string | number>('');
    let editStatus = $state('Pending');
    let editAppliedDate = $state('');

    const statuses = ['Pending', 'Accepted', 'Denied'];

    afterNavigate(() => {
        loadPageData();
    });

    async function loadPageData() {
        try {
            loading = true;
            error = '';

            const refresh = Date.now();

            const [applicationsResult, jobsResult] = await Promise.all([
                listApplications({ refresh }),
                listJobs({ refresh })
            ]);

            applications = applicationsResult.data.applications ?? [];
            jobs = jobsResult.data.jobs ?? [];

            notify.success('Applications loaded.');
        } catch (err) {
            console.error('loadPageData error:', err);
            error = 'Failed to load applications.';
            notify.error('Failed to load applications.');
        } finally {
            loading = false;
        }
    }

    async function handleApplicationAdded() {
        showAddModal = false;
        notify.success('Application added.');
        await loadPageData();
    }

    function startEditing(app: Application) {
        editingId = app.id;
        editName = app.name;
        editEmail = app.email;
        editJobId = app.job.id;
        editSalaryProposed = app.salaryProposed ?? '';
        editStatus = app.status;
        editAppliedDate = app.appliedDate;

        notify.info(`Editing ${app.name}.`);
    }

    function cancelEditing() {
        editingId = null;
        notify.info('Edit cancelled.');
    }

    async function saveEdit(applicationId: string) {
        const nameValue = String(editName ?? '').trim();
        const emailValue = String(editEmail ?? '').trim();
        const salaryText = String(editSalaryProposed ?? '').trim();
        const salaryValue = salaryText ? Number(salaryText) : null;

        if (!nameValue) {
            notify.warning('Name is required.');
            return;
        }

        if (!emailValue) {
            notify.warning('Email is required.');
            return;
        }

        if (!editJobId) {
            notify.warning('Job is required.');
            return;
        }

        if (!editAppliedDate) {
            notify.warning('Applied date is required.');
            return;
        }

        if (salaryText && Number.isNaN(salaryValue)) {
            notify.warning('Salary proposed must be a valid number.');
            return;
        }

        try {
            await updateApplication({
                id: applicationId,
                name: nameValue,
                email: emailValue,
                jobId: editJobId,
                salaryProposed: salaryValue,
                status: editStatus,
                appliedDate: editAppliedDate
            });

            editingId = null;
            await loadPageData();

            notify.success('Application updated.');
        } catch (err) {
            console.error('saveEdit error:', err);
            notify.error('Failed to update application.');
        }
    }

    async function handleStatusChange(applicationId: string, newStatus: string) {
        try {
            await updateApplicationStatus({
                id: applicationId,
                status: newStatus
            });

            await loadPageData();

            notify.success(`Application status updated to ${newStatus}.`);
        } catch (err) {
            console.error('handleStatusChange error:', err);
            notify.error('Failed to update application status.');
        }
    }

    async function handleDelete(applicationId: string) {
        if (!confirm('Are you sure you want to delete this application?')) {
            notify.info('Delete cancelled.');
            return;
        }

        try {
            await deleteApplication({ id: applicationId });

            await loadPageData();

            notify.success('Application deleted.');
        } catch (err) {
            console.error('handleDelete error:', err);
            notify.error('Failed to delete application.');
        }
    }

    function getStatusClass(status: string) {
        const normalized = String(status ?? '').trim().toLowerCase();

        if (normalized === 'pending') {
            return 'border-yellow-400 bg-yellow-50 text-yellow-700 focus:border-yellow-500 dark:border-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-300';
        }

        if (normalized === 'accepted') {
            return 'border-green-400 bg-green-50 text-green-700 focus:border-green-500 dark:border-green-600 dark:bg-green-950/40 dark:text-green-300';
        }

        if (normalized === 'denied') {
            return 'border-red-400 bg-red-50 text-red-700 focus:border-red-500 dark:border-red-600 dark:bg-red-950/40 dark:text-red-300';
        }

        return 'border-gray-400 bg-gray-50 text-gray-900 focus:border-blue-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white';
    }

</script>

<svelte:head>
    <title>Applications</title>
</svelte:head>

<section class="mx-auto max-w-6xl p-10 space-y-10">
    <div class="flex items-center justify-between">
        <div class="">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Applications
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage all applications
            </p>
        </div>

        <button
            onclick={() => showAddModal = true}
            class="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
        >
            + Add Application
        </button>
    </div>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">
                Loading applications...
            </p>
        </div>
    {:else if error}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p class="text-sm font-medium text-red-700">{error}</p>
        </div>

    {:else if applications.length === 0}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">
                No applications found.
            </p>
        </div>
    {:else}
        <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Job
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Salary Proposed
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Applied Date
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                    {#each applications as app (app.id)}
                        <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-600">
                            {#if editingId === app.id}
                                <td class="px-4 py-3">
                                    <input
                                        bind:value={editName}
                                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                    />
                                </td>

                                <td class="px-4 py-3">
                                    <input
                                        bind:value={editEmail}
                                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                    />
                                </td>

                                <td class="px-4 py-3">
                                    <select
                                        bind:value={editJobId}
                                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                    >
                                        {#each jobs as job}
                                            <option value={job.id}>
                                                {job.title}
                                            </option>
                                        {/each}
                                    </select>
                                </td>

                                <td class="px-4 py-3">
                                    <input
                                        type="number"
                                        bind:value={editSalaryProposed}
                                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                    />
                                </td>

                                <td class="px-4 py-3">
                                    <div class="inline-block rounded-lg border {getStatusClass(editStatus)}">
                                        <select
                                            bind:value={editStatus}
                                            class="rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium outline-none"
                                        >
                                            {#each statuses as status}
                                                <option
                                                    value={status}
                                                    class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                                                >
                                                    {status}
                                                </option>
                                            {/each}
                                        </select>
                                    </div>
                                </td>

                                <td class="px-4 py-3">
                                    <input
                                        type="date"
                                        bind:value={editAppliedDate}
                                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                    />
                                </td>

                                <td class="whitespace-nowrap px-6 py-4">
                                    <div class="flex gap-3">
                                        <button
                                            onclick={() => saveEdit(app.id)}
                                            class="border-2 border-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer"
                                            aria-label="save-application"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-green-500">
                                                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                                            </svg>
                                        </button>

                                        <button
                                            onclick={cancelEditing}
                                            class="border-2 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer"
                                            aria-label="cancel-edit-application"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-gray-500">
                                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            {:else}
                                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {app.name}
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {app.email}
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {app.job?.title || '-'}
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {app.salaryProposed ?? '-'}
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    <div class="inline-block rounded-lg border {getStatusClass(app.status)}">
                                        <select
                                            value={app.status}
                                            onchange={(e) => handleStatusChange(app.id, (e.currentTarget as HTMLSelectElement).value)}
                                            class="rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium outline-none"
                                        >
                                            {#each statuses as status}
                                                <option
                                                    value={status}
                                                    class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                                                >
                                                    {status}
                                                </option>
                                            {/each}
                                        </select>
                                    </div>
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {formatTimestamp(app.appliedDate)}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4">
                                    <div class="flex gap-3">
                                        <button
                                            onclick={() => startEditing(app)}
                                            class="border-2 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer"
                                            aria-label="edit-application"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-blue-500">
                                                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                                            </svg>
                                        </button>

                                        <button
                                            onclick={() => handleDelete(app.id)}
                                            class="border-2 border-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer"
                                            aria-label="delete-application"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-red-500">
                                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm"
        onclick={(e) => {
            if (e.target === e.currentTarget) showAddModal = false;
        }}
    >
        <div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
            <AddApplication
                close={() => {
                    showAddModal = false;
                }}
                success={handleApplicationAdded}
            />
        </div>
    </div>
{/if}