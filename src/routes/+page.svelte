<script lang="ts">
    import { afterNavigate } from '$app/navigation';
    import '$lib/firebase';

    import {
        listJobs,
        listApplications,
        listEmployees,
        listInterviews
    } from '../dataconnect-generated';

    let loading = $state(true);
    let error = $state('');

    let jobs = $state<JobRow[]>([]);
    let applications = $state<ApplicationRow[]>([]);
    let employees = $state<EmployeeRow[]>([]);
    let interviews = $state<InterviewRow[]>([]);

    afterNavigate(loadDashboard);

    async function loadDashboard() {
        try {
            loading = true;
            error = '';

            const [jobsResult, applicationsResult, employeesResult, interviewsResult] = await Promise.all([
                listJobs(),
                listApplications(),
                listEmployees(),
                listInterviews()
            ]);

            jobs = jobsResult.data.jobs ?? [];
            applications = applicationsResult.data.applications ?? [];
            employees = employeesResult.data.employees ?? [];
            interviews = interviewsResult.data.interviews ?? [];
        } catch (err) {
            console.error('loadDashboard error:', err);
            error = 'Failed to load dashboard data.';
        } finally {
            loading = false;
        }
    }

    function money(value?: number | null) {
        if (value === null || value === undefined) return '-';

        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
    }

    function formatDate(value?: string | null) {
        if (!value) return '-';

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            const dateOnly = new Date(`${value}T00:00:00`);

            if (Number.isNaN(dateOnly.getTime())) return value;

            return dateOnly.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function formatTime(value?: string | null) {
        if (!value) return '-';

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return '-';

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    function statusClass(status?: string) {
        const value = String(status ?? '').toLowerCase();

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

        return 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }

    let openJobs = $derived(jobs.filter((job) => job.status === 'Open'));
    let filledJobs = $derived(jobs.filter((job) => job.status === 'Filled'));
    let pendingApplications = $derived(applications.filter((app) => app.status === 'Pending'));
    let acceptedApplications = $derived(applications.filter((app) => app.status === 'Accepted'));

    let averageSalary = $derived.by(() => {
        const salaries = jobs
            .map((job) => job.salary)
            .filter((salary): salary is number => typeof salary === 'number');

        if (salaries.length === 0) return null;

        return salaries.reduce((total, salary) => total + salary, 0) / salaries.length;
    });

    let hireRate = $derived.by(() => {
        if (applications.length === 0) return 0;

        return Math.round((employees.length / applications.length) * 100);
    });

    let dashboardCards = $derived.by(() => [
        {
            label: 'Open Jobs',
            value: openJobs.length,
            detail: `${filledJobs.length} filled`,
            bar: 'from-blue-500 to-cyan-500'
        },
        {
            label: 'Applications',
            value: applications.length,
            detail: `${pendingApplications.length} pending`,
            bar: 'from-violet-500 to-fuchsia-500'
        },
        {
            label: 'Employees',
            value: employees.length,
            detail: `${hireRate}% hire rate`,
            bar: 'from-emerald-500 to-teal-500'
        },
        {
            label: 'Interviews',
            value: interviews.length,
            detail: 'scheduled records',
            bar: 'from-amber-500 to-orange-500'
        }
    ]);

    let jobStatusRows = $derived.by(() => {
        return ['Open', 'Interviewing', 'Filled', 'Closed'].map((status) => ({
            status,
            count: jobs.filter((job) => job.status === status).length
        }));
    });

    let rolesByApplicationVolume = $derived.by(() => {
        return jobs
            .map((job) => ({
                ...job,
                appCount: applications.filter((app) => app.jobId === job.id).length
            }))
            .sort((a, b) => b.appCount - a.appCount)
            .slice(0, 5);
    });

    let recentApplications = $derived.by(() => {
        return [...applications]
            .sort((a, b) => String(b.appliedDate).localeCompare(String(a.appliedDate)))
            .slice(0, 6);
    });

    let upcomingInterviews = $derived.by(() => {
        const now = new Date();

        return interviews
            .filter((interview) => {
                if (!interview.interviewStartDate) return false;

                const date = new Date(interview.interviewStartDate);

                return !Number.isNaN(date.getTime()) && date >= now;
            })
            .sort((a, b) => {
                return String(a.interviewStartDate).localeCompare(String(b.interviewStartDate));
            })
            .slice(0, 6);
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

                    <h1 class="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                        Hiring Dashboard
                    </h1>

                    <p class="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                        A simple snapshot of jobs, candidates, employees, and scheduled interviews.
                    </p>
                </div>

                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                        <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Avg Salary</p>
                        <p class="mt-1 text-xl font-black text-slate-950 dark:text-white">{money(averageSalary)}</p>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                        <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Hire Rate</p>
                        <p class="mt-1 text-xl font-black text-slate-950 dark:text-white">{hireRate}%</p>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                        <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Accepted</p>
                        <p class="mt-1 text-xl font-black text-slate-950 dark:text-white">{acceptedApplications.length}</p>
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
                {#each dashboardCards as card}
                    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div class="h-2 bg-gradient-to-r {card.bar}"></div>

                        <div class="p-6">
                            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
                            <p class="mt-2 text-4xl font-black text-slate-950 dark:text-white">{card.value}</p>
                            <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">{card.detail}</p>
                        </div>
                    </div>
                {/each}
            </div>

            <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 class="text-2xl font-black text-slate-950 dark:text-white">Upcoming Interviews</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Next scheduled interviews from the interview records.
                    </p>

                    <div class="mt-5 space-y-3">
                        {#if upcomingInterviews.length === 0}
                            <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950/60">
                                <p class="font-bold text-slate-950 dark:text-white">No upcoming interviews</p>
                                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Interviews will appear here after they are scheduled.
                                </p>
                            </div>
                        {:else}
                            {#each upcomingInterviews as interview}
                                <div class="grid gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800 md:grid-cols-[1fr_auto]">
                                    <div class="min-w-0">
                                        <p class="truncate font-bold text-slate-950 dark:text-white">
                                            {interview.application?.name ?? 'Unknown Candidate'}
                                        </p>

                                        <p class="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                                            {interview.application?.job?.title ?? 'No role listed'}
                                        </p>

                                        <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                            {interview.interviewerName ?? 'No interviewer'} · {interview.interviewModality ?? 'No modality'}
                                        </p>
                                    </div>

                                    <div class="rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950/70">
                                        <p class="font-black text-slate-950 dark:text-white">{formatTime(interview.interviewStartDate)}</p>
                                        <p class="text-slate-500 dark:text-slate-400">{formatDate(interview.interviewStartDate)}</p>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>

                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 class="text-xl font-black text-slate-950 dark:text-white">Job Pipeline</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Current job status breakdown.
                    </p>

                    <div class="mt-5 space-y-4">
                        {#each jobStatusRows as item}
                            <div>
                                <div class="mb-2 flex items-center justify-between text-sm">
                                    <span class="font-semibold text-slate-700 dark:text-slate-300">{item.status}</span>
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

            <div class="grid gap-6 xl:grid-cols-2">
                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 class="text-xl font-black text-slate-950 dark:text-white">Roles by Application Volume</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Job postings ranked by applicant activity.
                    </p>

                    <div class="mt-5 space-y-3">
                        {#if rolesByApplicationVolume.length === 0}
                            <p class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                No job records found.
                            </p>
                        {:else}
                            {#each rolesByApplicationVolume as job, index}
                                <div class="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                        #{index + 1}
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <p class="truncate font-bold text-slate-950 dark:text-white">{job.title}</p>
                                        <p class="text-xs text-slate-500 dark:text-slate-400">
                                            {job.appCount} applications · {money(job.salary)}
                                        </p>
                                    </div>

                                    <span class="rounded-full border px-3 py-1 text-xs font-bold {statusClass(job.status)}">
                                        {job.status}
                                    </span>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>

                <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 class="text-xl font-black text-slate-950 dark:text-white">Recent Applications</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Latest candidates added to the hiring pipeline.
                    </p>

                    <div class="mt-5 space-y-3">
                        {#if recentApplications.length === 0}
                            <p class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                No applications found.
                            </p>
                        {:else}
                            {#each recentApplications as app}
                                <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <div class="flex items-start justify-between gap-3">
                                        <div class="min-w-0">
                                            <p class="truncate font-bold text-slate-950 dark:text-white">{app.name}</p>
                                            <p class="truncate text-xs text-slate-500 dark:text-slate-400">{app.email}</p>
                                        </div>

                                        <span class="rounded-full border px-3 py-1 text-xs font-bold {statusClass(app.status)}">
                                            {app.status}
                                        </span>
                                    </div>

                                    <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                        {app.job?.title ?? '-'}
                                    </p>

                                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Applied {formatDate(app.appliedDate)}
                                    </p>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</section>