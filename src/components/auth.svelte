<script>
	import Login from '$routes/login.svelte';
	import { authUser } from '$lib/store';
	import Home from '$routes/home/page.svelte';
	import { getCountries, getCurrentUser } from '$lib/supabase-api.js';
	import { onMount } from 'svelte';



	onMount(async () => {

	});
</script>

{#if $authUser}
	<Home />
{:else}
	<Login />
{/if}

