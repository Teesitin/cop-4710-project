<script lang="ts">
  import AddInterview from "$lib/assets/forms/AddInterview.svelte";




    type interviewRow = {
        id: string;
        applicationId: string;
        applicantName: string;
        jobTitle: string;
        interviewerName: string | null;
        interviewStartDate: string | null;
        interviewEndDate: string | null;
        interviewModality: string | null;
    };

    let interviews = $state<interviewRow[]>([]);
    let searchQuery = $state('');
    let showAddModal = $state(false);

    function handleInterviewAdded(newInterview: interviewRow) {
        interviews = [newInterview, ...interviews];
        showAddModal = false;
    };
</script>

<svelte:head>
    <title>Interviews</title>
</svelte:head>

<section class="mx-auto max-w-5xl p-10 space-y-10">
    <div class="mb-2">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Interview Tracker</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage interviews</p>
    </div>

        <div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Interview Database</h2>
        
        <div class="flex items-center space-x-4 w-full sm:w-auto">
            <div class="w-full sm:w-64">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search interviews"
                    class="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white outline-none transition focus:border-blue-500"
                />
            </div>
            
            <button 
                onclick={() => showAddModal = true}
                class="whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
            >
                + Add Interview
            </button>
        </div>    
    </div>
</section>

{#if showAddModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm transition-opacity"
        onclick={(e) => { if (e.target === e.currentTarget) showAddModal = false; }}
    >
        <div class="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <AddInterview 
                onClose={() => showAddModal = false} 
                onSuccess={handleInterviewAdded} 
            />
        </div>
    </div>
{/if}