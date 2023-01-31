<script>
	import Logo from '$svgComponents/logo.svelte';
	import LogoName from '$svgComponents/logo-name.svelte';
	import User from '$svgComponents/icons/user.svelte';
	import { toast } from '$lib/toast-helper';
	import { authUser, isProtectedRoute } from '$lib/store';
	import supabase from '$lib/supabase';
	import router from 'page';
	
</script>


<style>
</style>
