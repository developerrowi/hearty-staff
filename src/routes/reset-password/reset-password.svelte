<script>
	import supabase from '$lib/supabase';
	import World from '$svgComponents/world.svelte';
	import { toast } from '$lib/toast-helper';
	import { isProtectedRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import { t } from '$translations/i18n';
	import router from 'page';	

	onMount(() => {
		isProtectedRoute.set(false);
	});

	let email;
	async function sendEmail() {
		
		if (!email) {
			toast.warn('enter all the details');
			return;
		}
		
		const { error } = await supabase.auth.resetPasswordForEmail(email,{
			redirectTo: `${window.location.origin}/reset-password-user`
		});
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
		toast.success('email has been sent');
		router.redirect('/');
	}
</script>

<div class="flex-1 flex flex-col md:flex-row justify-around md:items-center">
	<World absolute />
	<form
		class="reset-password-root flex-1 flex flex-col justify-center space-y-5 flex-1 flex flex-col justify-center space-y-3 md:max-w-xl md:px-8"
		on:submit|preventDefault={sendEmail}
	>
		<p class="text-center text-orange text-2xl">
			{$t("forgotPassword.type_in_your_email")}
			<!-- Type in your email account and follow these steps to restore your account -->
		</p>
		<input
			type="email"
			name="reset-password-email"
			required
			autofocus
			id="reset-password-email"
			placeholder="{$t("forgotPassword.email")}"
			class="inp"
			bind:value={email}
		/>
		<button class="btn bg-blue capitalize"> {$t("forgotPassword.send_email")} </button>
	</form>
</div>

<style>
	p {
		max-width: 600px;
	}
</style>
