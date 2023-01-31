<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	// export async function load({ url }) {
	// 	return {
	// 		props: {
	// 			host: url.host ? url.host : `http://localhost:3000/reset-password-user`
	// 		}
	// 	};
	// }
	// let host

</script>

<script>
	import { App as CapacitorApp } from '@capacitor/app';
	import { isProtectedRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import Auth from '$components/auth.svelte';
	import Home from '$routes/home/page.svelte';

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

</script>

<Home />
