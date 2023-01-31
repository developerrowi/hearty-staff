<script>
	import supabase from '$lib/supabase';
	import World from '$svgComponents/world.svelte';
	import { toast } from '$lib/toast-helper';
	import { isProtectedRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import router from 'page';

	onMount(() => {
		isProtectedRoute.set(false);
	});

	let password;
	let confirm_password;

	async function resetPassword() {
		const user = supabase.auth.getUser();
		console.log(user);
		if (!user) {
			return toast.error('Please login first');
		}
		if (password !== confirm_password) {
			toast.warn('Passwords do not match');
			return;
		}
		const { error, data } = await supabase.auth.updateUser({
			password: password
		});
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
		console.log(data);
		router.redirect('/login')
	}
</script>

<div class="flex-1 flex flex-col md:flex-row justify-around md:items-center">
	<World absolute />
	<form
		class="reset-password-root flex-1 flex flex-col justify-center space-y-5 flex-1 flex flex-col justify-center space-y-3 md:max-w-xl md:px-8"
		on:submit|preventDefault={resetPassword}
	>
		<p class="text-center text-orange text-2xl">Type in your New password</p>
		<input
			type="password"
			name="reset-password-email"
			required
			id="reset-password-email"
			placeholder="Password"
			class="inp"
			bind:value={password}
		/>
		<input
			type="password"
			name="reset-password-email"
			required
			id="reset-password-email"
			placeholder="Confirm Password"
			class="inp"
			bind:value={confirm_password}
		/>
		<button class="btn bg-blue capitalize">Reset Password</button>
	</form>
</div>

<style>
	p {
		max-width: 600px;
	}
</style>
