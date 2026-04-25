<script lang="ts">
    import { onMount } from 'svelte';
    import '../app.css';
    import Sidebar from '$lib/assets/menu/Sidebar.svelte';
    import Notify from '$lib/assets/components/Notify.svelte';

    let { children } = $props();

    onMount(() => {
        const theme = localStorage.getItem('theme');

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
</script>

<svelte:head><link rel="icon" href="/techbro-logo-fav.png" /></svelte:head>

<div class="flex min-h-screen">
	<Sidebar />

	<div class="flex-1">
		{@render children()}
	</div>
</div>

<Notify/>