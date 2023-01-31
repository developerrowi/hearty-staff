<script>
	import router from 'page';
	import Facebook from '$svgComponents/icons/facebook.svelte';
	import World from '$svgComponents/world.svelte';
	import supabase from '$lib/supabase';

	export let baseUrl;

	function handleFacebookLogin() {
		supabase.auth.signInWithOAuth({ 
			provider: 'facebook', 		
			options: {
				redirectTo: window.location.origin + '/'
			} 
		});
	}
</script>

<div class="sign-in-root flex-1 flex flex-col lg:flex-row justify-around lg:items-center">
	<World />
	<div class="sign-in-options flex flex-col space-y-2 sm:place-self-center">
		<button class="btn bg-facebook" on:click={handleFacebookLogin}>
			<Facebook /> <span class="ml-2"> Login with Facebook </span>
		</button>
		<p class="text-center text-orange text-xl font-roboto">or</p>
		<button class="btn bg-blue" on:click|preventDefault={() => router.redirect('/signup')}>
			<a href="/signup"> Create an account </a>
		</button>
		<p class="text-center text-orange text-xl font-roboto">
			Already have an account? <a class="text-twitter" href="/login">Log in </a>
		</p>
	</div>
</div>

<style>
	p {
		max-width: 600px;
	}
</style>
