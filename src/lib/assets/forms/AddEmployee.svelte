<script lang="ts">
    import { onMount } from 'svelte';
    import '$lib/firebase';

    import {
        createEmployee,
        listApplications,
        listEmployees,
        listJobs
    } from '../../../dataconnect-generated';

    let { close, success } = $props<{
        close: () => void;
        success: (employee: any) => void;
    }>();

    type JobRow = {
        id: string;
        title: string;
        status: string;
        salary?: string | null;
    };

    type ApplicationRow = {
        id: string;
        name: string;
        email: string;
        jobId: string;
        job: JobRow;
        salaryProposed?: number | null;
        status: string;
        appliedDate: string;
    };

    type EmployeeRow = {
        id: string;
        name: string;
        email: string;
        role: string;
        jobId?: string;
        originalApplicationId?: string;
    };

    let jobs = $state<JobRow[]>([]);
    let applications = $state<ApplicationRow[]>([]);
    let employees = $state<EmployeeRow[]>([]);

    let selectedJobId = $state('');
    let selectedApplicationId = $state('');

    let loading = $state(true);
    let saving = $state(false);
    let formError = $state('');

    let openJobs = $derived.by(() => {
        return jobs.filter((job) =>
            String(job.status ?? '').trim().toLowerCase() === 'open'
        );
    });

    let availableApplications = $derived.by(() => {
        const employeeApplicationIds = new Set(
            employees.map((e) => e.originalApplicationId).filter(Boolean)
        );

        const openJobIds = new Set(openJobs.map((j) => j.id));

        return applications.filter((app) => {
            return (
                !employeeApplicationIds.has(app.id) &&
                openJobIds.has(app.jobId)
            );
        });
    });

    let selectedJob = $derived.by(() => {
        return openJobs.find((job) => job.id === selectedJobId);
    });

    let selectedApplication = $derived.by(() => {
        return availableApplications.find((app) => app.id === selectedApplicationId);
    });

    $effect(() => {
        if (!loading && openJobs.length > 0 && !openJobs.some(j => j.id === selectedJobId)) {
            selectedJobId = openJobs[0].id;
        }
        if (!loading && openJobs.length === 0) {
            selectedJobId = '';
        }
    });

    $effect(() => {
        if (!loading && availableApplications.length > 0 && !availableApplications.some(a => a.id === selectedApplicationId)) {
            selectedApplicationId = availableApplications[0].id;
        }
        if (!loading && availableApplications.length === 0) {
            selectedApplicationId = '';
        }
    });

    onMount(loadFormData);

    async function loadFormData() {
        try {
            loading = true;
            formError = '';

            const [jobsRes, appsRes, empRes] = await Promise.all([
                listJobs(),
                listApplications(),
                listEmployees()
            ]);

            jobs = jobsRes.data.jobs ?? [];
            applications = appsRes.data.applications ?? [];
            employees = empRes.data.employees ?? [];
        } catch (err) {
            console.error('loadFormData error:', err);
            formError = 'Failed to load data.';
        } finally {
            loading = false;
        }
    }

    async function handleSubmit() {
        formError = '';

        if (!selectedApplication) {
            formError = 'Please select an application.';
            return;
        }

        if (!selectedJob) {
            formError = 'Please select a job.';
            return;
        }

        try {
            saving = true;

            const nameValue = selectedApplication.name;
            const emailValue = selectedApplication.email;
            const roleValue = selectedJob.title;

            await createEmployee({
                name: nameValue,
                email: emailValue,
                role: roleValue,
                jobId: selectedJob.id,
                originalApplicationId: selectedApplication.id
            });

            success({
                id: crypto.randomUUID(),
                name: nameValue,
                email: emailValue,
                role: roleValue,
                jobId: selectedJob.id,
                originalApplicationId: selectedApplication.id,
                job: selectedJob,
                originalApplication: selectedApplication
            });
        } catch (err) {
            console.error('handleSubmit error:', err);
            formError = 'Failed to create employee.';
        } finally {
            saving = false;
        }
    }
</script>
<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
    Add New Employee
</h2>

{#if loading}
    <div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Loading jobs and applications...
    </div>
{:else}
    <div class="space-y-5">
        <div>
            <label for="application" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Application *
            </label>

            <select
                id="application"
                bind:value={selectedApplicationId}
                class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
                {#each availableApplications as application}
                    <option value={application.id}>
                        {application.name} — {application.email}
                    </option>
                {/each}
            </select>
        </div>

        {#if selectedApplication}
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-900/40">
                <p class="font-semibold text-gray-900 dark:text-white">
                    Applicant Preview
                </p>

                <p class="mt-1 text-gray-600 dark:text-gray-300">
                    Name: {selectedApplication.name}
                </p>

                <p class="text-gray-600 dark:text-gray-300">
                    Email: {selectedApplication.email}
                </p>

                <p class="text-gray-600 dark:text-gray-300">
                    Applied For: {selectedApplication.job.title}
                </p>
            </div>
        {/if}

        <div>
            <label for="job" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employee Job *
            </label>

            <select
                id="job"
                bind:value={selectedJobId}
                class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
                {#each openJobs as job}
                    <option value={job.id}>
                        {job.title} — {job.status}
                    </option>
                {/each}
            </select>
        </div>

        {#if selectedJob}
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-900/40">
                <p class="font-semibold text-gray-900 dark:text-white">
                    Job Preview
                </p>

                <p class="mt-1 text-gray-600 dark:text-gray-300">
                    Role: {selectedJob.title}
                </p>

                <p class="text-gray-600 dark:text-gray-300">
                    Status: {selectedJob.status}
                </p>

                <p class="text-gray-600 dark:text-gray-300">
                    Salary: {selectedJob.salary || '-'}
                </p>
            </div>
        {/if}
    </div>
{/if}

{#if formError}
    <div class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
        {formError}
    </div>
{/if}

<div class="mt-8 flex justify-end space-x-3">
    <button
        type="button"
        onclick={close}
        class="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    >
        Cancel
    </button>

    <button
        type="button"
        onclick={handleSubmit}
        disabled={loading || saving}
        class="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
        {#if saving} Saving... {:else} Save Employee {/if}
    </button>
</div>