<script lang="ts">
    import { onMount } from 'svelte';
    import '$lib/firebase';

    import {
        listEmployees
    } from '../../dataconnect-generated';

    import AddEmployee from '$lib/assets/forms/AddEmployee.svelte';
    import { notify } from '$lib/assets/components/notificationState.svelte';

    type EmployeeRow = {
        id: string;
        name: string;
        email: string;
        role: string;
    };

    let loading = $state(true);
    let error = $state('');
    let employees = $state<EmployeeRow[]>([]);
    let showAddModal = $state(false);

    onMount(() => {
        loadEmployees();
    });

    function handleEmployeeAdded(newEmployee: EmployeeRow) {
        employees = [newEmployee, ...employees];
        showAddModal = false;
        notify.success('Employee added.');
    }

    async function loadEmployees() {
        try {
            loading = true;
            error = '';

            const result = await listEmployees();
            employees = result.data.employees ?? [];

            notify.success('Employees loaded.');
        } catch (err) {
            console.error('loadEmployees error:', err);
            error = 'Failed to load employees.';
            notify.error('Failed to load employees.');
        } finally {
            loading = false;
        }
    }

    function openAddModal() {
        showAddModal = true;
        notify.info('Add employee form opened.');
    }

    function closeAddModal() {
        showAddModal = false;
        notify.info('Add employee cancelled.');
    }
</script>

<svelte:head>
    <title>Employees</title>
</svelte:head>

<section class="mx-auto max-w-5xl p-10 space-y-10">
    <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Employees</h1>
        <p class="mt-1 text-sm">View all employees</p>
    </div>


    <div class="flex items-center justify-between">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Employees Database
        </h2>

        <button
            onclick={() => showAddModal = true}
            class="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
        >
            + Add Employee
        </button>
    </div>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">Loading employees...</p>
        </div>

    {:else if error}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p class="text-sm font-medium text-red-700">{error}</p>
        </div>

    {:else if employees.length === 0}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">No employees found.</p>
        </div>

    {:else}
        <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Email
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Role
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-700">
                    {#each employees as emp (emp.id)}
                        <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                {emp.name}
                            </td>

                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {emp.email}
                            </td>

                            <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {emp.role}
                            </td>
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
            <AddEmployee
                close={() => {
                    showAddModal = false;
                }}
                success={handleEmployeeAdded}
            />
        </div>
    </div>
{/if}