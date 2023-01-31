<script>
	import World from '$svgComponents/world.svelte';
	import { isModalOpen } from '$lib/store';
	import PictureCarousel from '$components/picture-carousel.svelte';
	import Modal from '$components/modal.svelte';
	import { onMount } from 'svelte';
	import { authUser,isProtectedRoute } from '$lib/store';
	import User from '$svgComponents/icons/user.svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import router from 'page';
	let displayImage = 3;

	let modalOpen = false;

	onMount(() =>
	{
		isProtectedRoute.set(true);
		if (!$authUser) router.redirect('/');
	 isModalOpen.subscribe((state) => (modalOpen = state));

	 });
</script>

{#if $authUser}
	<span
		class="profile  mx-5 cursor-pointer"
		title="Profile"
		on:click|preventDefault={() => router.redirect('/profile')}
	>
		<User />
	</span>
{/if}
{#if modalOpen}
	<Modal />
{/if}
<div class="home-root flex-1 flex flex-col mt-0">
	<div class="pics">
		<PictureCarousel />
		{#if displayImage == 3}
			<World class="position" />
		{/if}
	</div>
</div>

<style>
	:root {
		--side-margin: 0rem !important;
	}
	div.home-root :global(.position) {
		margin-top: 0px;
		margin-left: auto;
		margin-right: auto;
		position: fixed;
		left: 3%;
		top: 55%;
		max-width: 96vw !important;
		width: 100% !important;
	}

	@media only screen and (min-width: 600px) {
		div.home-root :global(.position) {
			margin-top: 0px;
			margin-left: auto;
			margin-right: auto;
			position: fixed;
			left: 17%;
			top: 55%;
			max-width: 66vw !important;
			width: 100% !important;
		}
	}

	div.home-root {
		position: relative;
	}
	div.pics {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>