<script lang="ts">
    import { afterNavigate } from '$app/navigation';
    import '$lib/firebase';

    import {
        listEmployees,
        updateEmployee,
        deleteEmployee
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

    let editingId = $state<string | null>(null);
    let editName = $state('');
    let editEmail = $state('');
    let editRole = $state('');

    afterNavigate(() => {
        loadEmployees();
    });

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

    function handleEmployeeAdded(newEmployee: EmployeeRow) {
        employees = [newEmployee, ...employees];
        showAddModal = false;
        notify.success('Employee added.');
    }

    function startEditing(employee: EmployeeRow) {
        editingId = employee.id;
        editName = employee.name;
        editEmail = employee.email;
        editRole = employee.role;

        notify.info(`Editing ${employee.name}.`);
    }

    function cancelEditing() {
        editingId = null;
        notify.info('Edit cancelled.');
    }

    async function saveEdit(employeeId: string) {
        const nameValue = String(editName ?? '').trim();
        const emailValue = String(editEmail ?? '').trim();
        const roleValue = String(editRole ?? '').trim();

        if (!nameValue) {
            notify.warning('Name is required.');
            return;
        }

        if (!emailValue) {
            notify.warning('Email is required.');
            return;
        }

        if (!roleValue) {
            notify.warning('Role is required.');
            return;
        }

        try {
            await updateEmployee({
                id: employeeId,
                name: nameValue,
                email: emailValue,
                role: roleValue
            });

            employees = employees.map((employee) => {
                if (employee.id !== employeeId) return employee;

                return {
                    ...employee,
                    name: nameValue,
                    email: emailValue,
                    role: roleValue
                };
            });

            editingId = null;
            notify.success('Employee updated.');
        } catch (err) {
            console.error('saveEdit error:', err);
            notify.error('Failed to update employee.');
        }
    }

    async function handleDelete(employeeId: string) {
        if (!confirm('Are you sure you want to delete this employee?')) {
            notify.info('Delete cancelled.');
            return;
        }

        try {
            await deleteEmployee({ id: employeeId });
            employees = employees.filter((employee) => employee.id !== employeeId);
            notify.success('Employee deleted.');
        } catch (err) {
            console.error('handleDelete error:', err);
            notify.error('Failed to delete employee.');
        }
    }
</script>

<svelte:head>
    <title>Employees</title>
</svelte:head>

<section class="mx-auto max-w-6xl p-10 space-y-10">
    <div class="flex items-center justify-between">
        <div class="">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Employees
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage all employees
            </p>
        </div>

        <button
            onclick={openAddModal}
            class="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
        >
            + Add Employee
        </button>
    </div>

    {#if loading}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">
                Loading employees...
            </p>
        </div>

    {:else if error}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p class="text-sm font-medium text-red-700">{error}</p>
        </div>

    {:else if employees.length === 0}
        <div class="rounded-2xl border border-gray-200 bg-white dark:bg-gray-700 p-6 shadow-sm">
            <p class="text-sm text-gray-600 dark:text-gray-300">
                No employees found.
            </p>
        </div>

    {:else}
        <div class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 shadow-sm">
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
                            Role
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                    {#each employees as emp (emp.id)}
                        <tr class="transition hover:bg-gray-50 dark:hover:bg-gray-600">
                            {#if editingId === emp.id}
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
                                    <input
                                        bind:value={editRole}
                                        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                    />
                                </td>

                                <td class="whitespace-nowrap px-6 py-4">
                                    <div class="flex gap-3">
                                        <button
                                            onclick={() => saveEdit(emp.id)}
                                            class="border-2 border-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer"
                                            aria-label="save-employee"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-green-500">
                                                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                                            </svg>
                                        </button>

                                        <button
                                            onclick={cancelEditing}
                                            class="border-2 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer"
                                            aria-label="cancel-edit-employee"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-gray-500">
                                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            {:else}
                                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {emp.name}
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {emp.email}
                                </td>

                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {emp.role}
                                </td>

                                <td class="whitespace-nowrap px-6 py-4">
                                    <div class="flex gap-3">
                                        <button
                                            onclick={() => startEditing(emp)}
                                            class="border-2 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer"
                                            aria-label="edit-employee"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-blue-500">
                                                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                                            </svg>
                                        </button>

                                        <button
                                            onclick={() => handleDelete(emp.id)}
                                            class="border-2 border-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded w-7 h-7 flex items-center justify-center cursor-pointer"
                                            aria-label="delete-employee"
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
            if (e.target === e.currentTarget) closeAddModal(); 
        }}
    >
        <div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
            <AddEmployee
                close={closeAddModal}
                success={handleEmployeeAdded}
            />
        </div>
    </div>
{/if}