<script lang="ts">
    import { onMount } from 'svelte';
    import '$lib/firebase';
    import Notify from '$lib/assets/components/Notify.svelte';

    let alerts = $state([]);
    
    import {
        listJobs,
        listApplications,
        listEmployees
    } from '../dataconnect-generated';

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
        jobId?: string;
        job?: JobRow;
        salaryProposed?: number | null;
        status: string;
        appliedDate: string;
        interviewer?: string;
        date?: string;
        startTime?: string;
        modality?: string;
    };

    type EmployeeRow = {
        id: string;
        name: string;
        email: string;
        role: string;
        jobId?: string;
        originalApplicationId?: string;
        job?: JobRow;
        originalApplication?: ApplicationRow;
    };

    let loading = $state(true);
    let error = $state('');

    let jobs = $state<JobRow[]>([]);
    let applications = $state<ApplicationRow[]>([]);
    let employees = $state<EmployeeRow[]>([]);

    onMount(() => {
        loadDashboard();
    });

    function normalizeApplication(app: any): ApplicationRow {
        return {
            id: app.id,
            name: app.name ?? app.applicant?.name ?? 'Unknown Applicant',
            email: app.email ?? app.applicant?.email ?? 'No email',
            jobId: app.jobId,
            job: app.job,
            salaryProposed: app.salaryProposed,
            status: app.status,
            appliedDate: app.appliedDate,

            // These are placeholders unless your Interview table is wired into queries.
            interviewer: app.interviewer ?? '',
            date: app.date ?? '',
            startTime: app.startTime ?? '',
            modality: app.modality ?? ''
        };
    }

    async function loadDashboard() {
        try {
            loading = true;
            error = '';

            const [jobsResult, applicationsResult, employeesResult] = await Promise.all([
                listJobs(),
                listApplications(),
                listEmployees()
            ]);

            jobs = jobsResult.data.jobs ?? [];
            applications = (applicationsResult.data.applications ?? []).map(normalizeApplication);
            employees = employeesResult.data.employees ?? [];
        } catch (err) {
            console.error('loadDashboard error:', err);
            error = 'Failed to load dashboard data.';
        } finally {
            loading = false;
        }
    }

    function money(value?: string | number | null) {
        if (value === null || value === undefined || value === '') return '-';

        const numeric = Number(value);

        if (Number.isNaN(numeric)) return String(value);

        return numeric.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
    }

    function formatDate(value?: string) {
        if (!value) return '-';

        const date = new Date(`${value}T00:00:00`);

        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function todayDateValue() {
        return new Date().toISOString().slice(0, 10);
    }

    function statusClass(status: string) {
        const value = status.toLowerCase();

        if (value === 'open' || value === 'accepted') {
            return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300';
        }

        if (value === 'interviewing' || value === 'pending') {
            return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-300';
        }

        if (value === 'filled') {
            return 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/60 dark:bg-purple-900/20 dark:text-purple-300';
        }

        if (value === 'closed' || value === 'denied') {
            return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300';
        }

        return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }

    function interviewerLoad(person: string) {
        return applications.filter((app) => app.interviewer === person).length;
    }

    let totalOpenJobs = $derived(jobs.filter((job) => job.status === 'Open').length);
    let totalInterviewingJobs = $derived(jobs.filter((job) => job.status === 'Interviewing').length);
    let totalFilledJobs = $derived(jobs.filter((job) => job.status === 'Filled').length);
    let totalPendingApplications = $derived(applications.filter((app) => app.status === 'Pending').length);
    let totalAcceptedApplications = $derived(applications.filter((app) => app.status === 'Accepted').length);
    let scheduledInterviews = $derived(applications.filter((app) => app.date && app.startTime).length);

    let averageSalary = $derived.by(() => {
        const salaries = jobs
            .map((job) => Number(job.salary))
            .filter((salary) => !Number.isNaN(salary));

        if (salaries.length === 0) return 0;

        return salaries.reduce((total, salary) => total + salary, 0) / salaries.length;
    });

    let conversionRate = $derived.by(() => {
        if (applications.length === 0) return 0;

        return Math.round((employees.length / applications.length) * 100);
    });

    let pipelineStats = $derived.by(() => {
        return [
            {
                label: 'Open Jobs',
                value: totalOpenJobs,
                detail: 'Active hiring roles',
                icon: 'Briefcase',
                class: 'from-blue-500 to-cyan-500'
            },
            {
                label: 'Applications',
                value: applications.length,
                detail: `${totalPendingApplications} pending review`,
                icon: 'Inbox',
                class: 'from-violet-500 to-fuchsia-500'
            },
            {
                label: 'Scheduled Interviews',
                value: scheduledInterviews,
                detail: 'Upcoming calendar items',
                icon: 'Calendar',
                class: 'from-amber-500 to-orange-500'
            },
            {
                label: 'Employees',
                value: employees.length,
                detail: `${totalAcceptedApplications} accepted applications`,
                icon: 'Team',
                class: 'from-emerald-500 to-teal-500'
            }
        ];
    });

    let jobStatusCards = $derived.by(() => {
        const statuses = ['Open', 'Interviewing', 'Filled', 'Closed'];

        return statuses.map((status) => ({
            status,
            count: jobs.filter((job) => job.status === status).length
        }));
    });

    let rolesByApplicationVolume = $derived.by(() => {
        return [...jobs]
            .map((job) => {
                const appCount = applications.filter((app) => app.jobId === job.id).length;

                return {
                    ...job,
                    appCount
                };
            })
            .sort((a, b) => b.appCount - a.appCount)
            .slice(0, 4);
    });

    let todaysInterviews = $derived.by(() => {
        const today = todayDateValue();

        return applications
            .filter((app) => app.date === today && app.startTime)
            .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));
    });

    let upcomingInterviews = $derived.by(() => {
        const today = todayDateValue();

        return applications
            .filter((app) => app.date && app.startTime && app.date >= today)
            .sort((a, b) => {
                const left = `${a.date} ${a.startTime}`;
                const right = `${b.date} ${b.startTime}`;

                return left.localeCompare(right);
            })
            .slice(0, 8);
    });

    let recentApplications = $derived.by(() => {
        return [...applications]
            .sort((a, b) => String(b.appliedDate).localeCompare(String(a.appliedDate)))
            .slice(0, 5);
    });
</script>

<svelte:head>
    <title>Hiring Dashboard</title>
</svelte:head>

<section class="min-h-screen px-4 py-8 sm:px-8">
    <div class="mx-auto max-w-7xl space-y-8">
        <div class="relative overflow-hidden rounded-4xl border border-white/60 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div class="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div class="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl"></div>

            <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p class="mb-3 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-300">
                        Read-Only Overview
                    </p>

                    <h1 class="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                        Hiring Command Center
                    </h1>

                    <p class="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        A high-level snapshot of jobs, applications, interviews, employees, and hiring pipeline health.
                    </p>
                </div>

                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                        <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Avg Salary</p>
                        <p class="mt-1 text-xl font-black">{money(averageSalary)}</p>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                        <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Conversion</p>
                        <p class="mt-1 text-xl font-black">{conversionRate}%</p>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                        <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Today</p>
                        <p class="mt-1 text-xl font-black">{todaysInterviews.length} interviews</p>
                    </div>
                </div>
            </div>
        </div>

        {#if loading}
            <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p class="text-sm text-slate-500 dark:text-slate-400">Loading dashboard...</p>
            </div>
        {:else if error}
            <div class="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm dark:border-red-900/60 dark:bg-red-950/30">
                <p class="font-semibold text-red-700 dark:text-red-300">{error}</p>
            </div>
        {:else}
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {#each pipelineStats as stat}
                    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div class="h-2 bg-gradient-to-r {stat.class}"></div>

                        <div class="p-6">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
                                    <p class="mt-2 text-4xl font-black">{stat.value}</p>
                                </div>

                                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xs font-black dark:bg-slate-800">
                                    {stat.icon}
                                </div>
                            </div>

                            <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">
                                {stat.detail}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>

            <div class="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div class="mb-6 flex flex-col gap-2">
                        <h2 class="text-2xl font-black">Today’s Interview Schedule</h2>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            Quick glance at interviews scheduled for today.
                        </p>
                    </div>

                    {#if todaysInterviews.length === 0}
                        <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950/60">
                            <p class="text-lg font-black">No interviews scheduled today</p>
                            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Upcoming interview items will appear here when they have a date and start time.
                            </p>
                        </div>
                    {:else}
                        <div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div class="grid grid-cols-12 bg-slate-100 px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                <div class="col-span-2">Time</div>
                                <div class="col-span-3">Candidate</div>
                                <div class="col-span-3">Role</div>
                                <div class="col-span-2">Interviewer</div>
                                <div class="col-span-2">Mode</div>
                            </div>

                            <div class="divide-y divide-slate-200 dark:divide-slate-800">
                                {#each todaysInterviews as interview}
                                    <div class="grid grid-cols-12 items-center gap-3 px-5 py-4">
                                        <div class="col-span-2">
                                            <p class="font-black">{interview.startTime}</p>
                                        </div>

                                        <div class="col-span-3 min-w-0">
                                            <p class="truncate font-bold text-slate-900 dark:text-white">{interview.name}</p>
                                            <p class="truncate text-xs text-slate-500 dark:text-slate-400">{interview.email}</p>
                                        </div>

                                        <div class="col-span-3 min-w-0">
                                            <p class="truncate text-sm font-semibold">{interview.job?.title ?? '-'}</p>
                                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{money(interview.salaryProposed)}</p>
                                        </div>

                                        <div class="col-span-2">
                                            <p class="text-sm font-semibold">{interview.interviewer || '-'}</p>
                                        </div>

                                        <div class="col-span-2">
                                            <p class="text-sm font-semibold">{interview.modality || '-'}</p>
                                            <span class="mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-bold {statusClass(interview.status)}">
                                                {interview.status}
                                            </span>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

                <div class="space-y-6">
                    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 class="text-xl font-black">Pipeline Status</h2>

                        <div class="mt-5 space-y-4">
                            {#each jobStatusCards as item}
                                <div>
                                    <div class="mb-2 flex items-center justify-between text-sm">
                                        <span class="font-semibold">{item.status}</span>
                                        <span class="text-slate-500 dark:text-slate-400">{item.count}</span>
                                    </div>

                                    <div class="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div
                                            class="h-full rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500"
                                            style={`width: ${jobs.length ? Math.max((item.count / jobs.length) * 100, 4) : 0}%`}
                                        ></div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid gap-6 xl:grid-cols-3">
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 class="text-xl font-black">Roles by Application Volume</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Job postings ranked by applicant activity.
                    </p>

                    <div class="mt-5 space-y-3">
                        {#each rolesByApplicationVolume as job, index}
                            <div class="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black dark:bg-slate-800">
                                    #{index + 1}
                                </div>

                                <div class="min-w-0 flex-1">
                                    <p class="truncate font-bold">{job.title}</p>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        {job.appCount} applications · {money(job.salary)}
                                    </p>
                                </div>

                                <span class="rounded-full border px-3 py-1 text-xs font-bold {statusClass(job.status)}">
                                    {job.status}
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 class="text-xl font-black">Hiring Health</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Current staffing flow summary.
                    </p>

                    <div class="mt-6 flex items-center justify-center">
                        <div class="relative flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-fuchsia-500 to-emerald-500 p-2 shadow-xl">
                            <div class="flex h-full w-full flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
                                <p class="text-4xl font-black">{conversionRate}%</p>
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    hired rate
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 grid grid-cols-2 gap-3">
                        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p class="text-xs text-slate-500 dark:text-slate-400">Interviewing</p>
                            <p class="mt-1 text-2xl font-black">{totalInterviewingJobs}</p>
                        </div>

                        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p class="text-xs text-slate-500 dark:text-slate-400">Filled</p>
                            <p class="mt-1 text-2xl font-black">{totalFilledJobs}</p>
                        </div>

                        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p class="text-xs text-slate-500 dark:text-slate-400">Pending Apps</p>
                            <p class="mt-1 text-2xl font-black">{totalPendingApplications}</p>
                        </div>

                        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p class="text-xs text-slate-500 dark:text-slate-400">Employees</p>
                            <p class="mt-1 text-2xl font-black">{employees.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 class="text-xl font-black">Recent Applications</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Latest candidates added to the hiring pipeline.
                </p>

                <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    {#each recentApplications as app}
                        <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0">
                                    <p class="truncate font-bold">{app.name}</p>
                                    <p class="truncate text-xs text-slate-500 dark:text-slate-400">{app.email}</p>
                                </div>
                            </div>

                            <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                {app.job?.title ?? '-'}
                            </p>

                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Applied {formatDate(app.appliedDate)}
                            </p>

                            <span class="mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold {statusClass(app.status)}">
                                {app.status}
                            </span>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</section>

<Notify/>