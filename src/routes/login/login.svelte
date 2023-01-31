<script>
	import World from '$svgComponents/world.svelte';
	import Facebook from '$svgComponents/icons/facebook-round.svelte';
	import Google from '$svgComponents/icons/google-round.svelte';
	import router from 'page';
	import { toast } from '$lib/toast-helper';
	import supabase from '$lib/supabase';
	import { authUser, isProtectedRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import { t } from '$translations/i18n';
	import mainLogo from '$static/logo.jpg'
	onMount(() => {
		isProtectedRoute.set(false);
	});
	// export let baseUrl = undefined;
	const formObj = {
		email: '',
		password: ''
	};

	async function handleSubmit(event) {
		if (!formObj.email || !formObj.password) {
			toast.warn('enter all the details');
			return;
		}
		const { user, error } = await supabase.auth.signInWithPassword({
			email: formObj.email,
			password: formObj.password
		});
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
		if (user) {
			authUser.set(user);
			toast.success('signed in successfully');
		}
	}

	function handleFacebookLogin() {
		supabase.auth.signInWithOAuth({ 
			provider: 'facebook',
			options: {
				redirectTo: window.location.origin + '/'
			}
	 	});
	}

	function handleGoogleLogin() {
		supabase.auth.signInWithOAuth({ 
			provider: 'google',
			options: {
				redirectTo: window.location.origin + '/'
			} 
		});
	}
</script>

<div class="flex lg:flex-1 md:flex-1 flex-col md:flex-row justify-around md:items-center">
	<div class="flex flex-col flex-1 justify-center space-y-3 md:max-w-xl md:px-8">
		<form
			class="login-root flex flex-col justify-center space-y-3 md:max-w-xl lg:max-w-xl md:px-8"
			on:submit|preventDefault={handleSubmit}
		>
			<img src="{mainLogo}" alt='' >

			<input
				class="inp lg:max-w-xl"
				type="email"
				id="login-email"
				name="login-email"
				autofocus
				placeholder="{$t("login.email")}"
				bind:value={formObj.email}
				required
			/>
			<input
				class="inp lg:max-w-xl"
				type="password"
				id="login-password"
				name="login-password"
				placeholder="{$t("login.password")}"
				bind:value={formObj.password}
				required
			/>
			<button
				class="text-right place-self-end text-red uppercase text-3xl"
				value="Submit"
				type="submit"
			>
			{$t("login.go")}
			</button>

		</form>
		
	</div>
</div>

<style>
	form.login-root > p.text-3xl {
		letter-spacing: 0.15em;
		max-width: 600px;
	}
	form.login-root > button.text-3xl {
		letter-spacing: 0.075em;
		max-width: 600px;
	}
	
</style>
