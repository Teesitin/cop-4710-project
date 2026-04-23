<script lang="ts">
    type Applicant = {
        id: string;
        name: string;
        email: string;
    };

    type Application = {
        id: string;
        applicant: Applicant;
        jobTitle: string;
        companyName: string;
        salaryProposed: number;
        status: 'Pending' | 'Accepted' | 'Denied';
        appliedDate: string;
    };


    let applications = $state<Application[]>([

    ]);
</script>

<svelte:head>
    <title>Applications</title>
</svelte:head>

<div class="flex items-center justify-center h-screen">
    <div class="text-center border-2 border-yellow-400 bg-yellow-100 text-yellow-800 px-6 py-4 rounded-lg shadow-md">
        <div class="text-2xl font-bold mb-2">
            ⚠️ No Applications Yet
        </div>
        <div class="text-sm opacity-80">
            This section hasn't been set up yet. Check back soon.
        </div>
    </div>
</div>
