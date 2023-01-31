

<script>
	

	import { App as CapacitorApp } from '@capacitor/app';
	import { isProtectedRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import Auth from '$components/auth.svelte';

	onMount(() => {
		isProtectedRoute.set(false);
		CapacitorApp?.addListener('backButton', ({ canGoBack }) => {
			if (!canGoBack) {
				CapacitorApp?.exitApp();
			} else {
				window?.history?.back();
			}
		});
	});
	export let host;
	console.log(host);
</script>

<Auth/>
