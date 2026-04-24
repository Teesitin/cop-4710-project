<script lang="ts">
    const interviewer = ["Morgan", "Pearl", "Tim"];

    const timeSlots = [ 
        "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM",
        "1:00 PM",  "1:30 PM",
        "2:00 PM",  "2:30 PM",
        "3:00 PM",  "3:30 PM",
        "4:00 PM",  "4:30 PM"
    ];
    const allSlots = [...timeSlots, "5:00 PM"];


    let jobs = [
        { title: "Software Engineer", applicant: "James", interviewer: "", date: "", startTime: ""},
        { title: "Frontend Dev", applicant: "Alfred", interviewer: "", date: "", startTime: ""}
    ];
</script>

<svelte:head>
    <title>Jobs</title>
</svelte:head>

<section class="mx-auto max-w-5xl p-10 space-y-10">
    <table class="min-w-full border border-gray-300">
        <thead class="bg-gray-900 text-white">
            <tr>
                <th class="px-4 py-2 text-left">Job</th>
                <th class="px-4 py-2 text-left">Applicant</th>
                <th class="px-4 py-2 text-left">Interviewer</th>
                <th class="px-4 py-2 text-left">Interview Start Date</th>
                <th class="px-4 py-2 text-left">Interview End Time</th>
                <th class="px-4 py-2 text-left">Mode</th>
            </tr>
        </thead>

        <tbody>
            {#each jobs as job}
                <tr class="border-t">
                    <td class="px-4 py-2">{job.title}</td>
                    <td class="px-4 py-2">{job.applicant}</td>
                    <td class="px-4 py-2">
                        <select bind:value={job.interviewer}>
                            {#each interviewer as interviewer}
                                <option value={interviewer}>{interviewer}</option>
                            {/each}
                        </select>
                    </td>
                    <td>
                        <input type = "date" bind:value={job.date} />
                        <select bind:value={job.startTime}>
                            <option value="">--</option>
                            {#each timeSlots as slot}
                                <option value = {slot}>{slot}</option>                                
                            {/each}
                        </select>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>

<style>
    th, td {
        border-inline: 1px solid black;
        padding: 8px;
    }
    select {
        
        background: transparent;
        border: none;
        outline: none;
        width: 100%;
        cursor: pointer;
        font-size: inherit;
        color: inherit;
    }
</style>