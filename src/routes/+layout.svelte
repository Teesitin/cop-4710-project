<script lang="ts">
    import '../app.css';
    import Sidebar from '$lib/assets/menu/Sidebar.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href="/techbro-logo-fav.png" /></svelte:head>

<div class="flex h-screen">
    <!-- Sidebar -->
	<Sidebar/>

    <!-- Content -->
    <div class="flex-1 p-6 bg-gray-100">
        {@render children()}
    </div>
</div>