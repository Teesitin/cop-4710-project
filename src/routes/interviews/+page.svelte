<script lang="ts">
    let jobs = [
        { title: "Software Engineer", company: "Google" },
        { title: "Frontend Dev", company: "Apple" }
    ];
</script>

<svelte:head>
    <title>Jobs</title>
</svelte:head>

<table class="min-w-full border border-gray-300">
    <thead class="bg-gray-900 text-white">
        <tr>
            <th class="px-4 py-2 text-left">Job Title</th>
            <th class="px-4 py-2 text-left">Company</th>
        </tr>
    </thead>

    <tbody>
        {#each jobs as job}
            <tr class="border-t">
                <td class="px-4 py-2">{job.title}</td>
                <td class="px-4 py-2">{job.company}</td>
            </tr>
        {/each}
    </tbody>
</table>