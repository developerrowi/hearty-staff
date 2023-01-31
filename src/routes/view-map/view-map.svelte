<script>
	import ViewMap from '$components/view-map.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { authUser,isProtectedRoute } from '$lib/store';
	import User from '$svgComponents/icons/user.svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import router from 'page';
	import supabase from '$lib/supabase';
	import { filterStore, isModalOpen, isBarsActive } from '$lib/store';
	import Beads from '$svgComponents/icons/beads.svelte';
	import PicCount from '$components/picCount.svelte';
	import TotalcountryBrowser from '$svgComponents/icons/totalcountryBrowser.svelte';
	import ViewMapIcon from '$svgComponents/icons/viewmap.svelte';
	import Modal from '$components/modal.svelte';

	let appliedFilters = [];
	let loading = true;
	let modalOpen = false;
	const unsub = filterStore.subscribe((data) => (appliedFilters = data));
    onMount(() => isModalOpen.subscribe((state) => (modalOpen = state)));
	onDestroy(() => unsub());

	$: {
		appliedFilters;
		getPlaces();
	}
	onMount(async () => {
		isProtectedRoute.set(true);
		if (!$authUser) router.redirect('/');
		await getPlaces();
		isBarsActive.set(false);
	});
	//get all places
	let places = [];
	let count=0;
	let countryArr = [];
	let countryCount = 0;
	async function getPlaces() {
		loading = true;
		let { data, error } = await supabase.from('places').select('*');

		if (error) {
			console.log(error);
		} else {
			places=[];
			for (let i = 0; i < data.length; i++) {
				if (appliedFilters.length > 0) {
					if (
						appliedFilters.find((p) => p?.name.toUpperCase() === data[i].name.toUpperCase()) ||
						appliedFilters.find((p) => p?.id === data[i].countries_id)
					) {
						places.push(data[i]);
						countryArr.push(data[i].countries_id);
					}
				} else {
					places.push(data[i]);
					countryArr.push(data[i].countries_id);
				}
			}
		}
		countryCount = new Set(countryArr).size;
		count=places.length;
		loading = false;
	}
</script>

<div class="home-root flex-1 flex flex-col mt-20">
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
	<div class="mapbar">
		<ViewMapIcon />
		<!-- {#if !loading}
	<div class="shadow-lg-1 pic__countDiv1">
		<p style="color:#f2d0b8">PICS</p>
		<p class="pic__count1">
			{ places.length < 9 ? `0${places.length}` : places.length}
		</p>
	</div>
	{/if} -->
	<PicCount {count}  />
		<TotalcountryBrowser {countryCount} />

		<div
			on:click|preventDefault={() => {
				isModalOpen.update(() => true);
			}}
			class="cursor-pointer"
		>
			<Beads />
		</div>
	</div>
	{#if !loading}
		<ViewMap {places} />
	{/if}
	<BottomMenu />
</div>

<style>

	.mapbar {
		position: relative;
		top: -8vh;
	}
</style>