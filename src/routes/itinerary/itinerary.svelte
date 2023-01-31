<script>
	import router from 'page';
	import { toast } from '$lib/toast-helper';
	import supabase from '$lib/supabase';
	import { authUser, isProtectedRoute, isFromItineraryRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import { itineraries } from '$stores/itineraryStore';
	import { getItineraryList } from '$lib/services/itineraryServices';
	import Itinerary from '$components/itinerary.svelte';
	import AddIcon from '$svgComponents/icons/add.svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import SearchIcon from '$svgComponents/icons/search.svelte';
	import { t } from '$translations/i18n';

	onMount(() => {
		isProtectedRoute.set(true);
		if (!$authUser) router.redirect('/');
		getItinerary();
	});

	let inputTextt;
	let filtereditineraries;

	async function getItinerary() {
		let { data, error } = await getItineraryList();
		if (error) {
			toast.error(error.message);
			return;
		}
		if (data) {
			itineraries.set(data);
			console.log('ghjk', $itineraries);
			filtereditineraries = $itineraries;
		}
	}

	filtereditineraries = $itineraries;
	const filtermylanguages = () => {
		filtereditineraries = $itineraries.filter((Itinerary) =>
			Itinerary.trip_name.toUpperCase().includes(inputTextt.toUpperCase())
		);
	};

	async function goToPlan() {
		isFromItineraryRoute.set(true);
		router.redirect('/plan');
	}
</script>

<div class="home-root flex-1 flex flex-col mt-8 items-center justify-between">
	<div class="flex flex-col flex-row justify-around md:items-center">
		<div class="mb-20 mt-10">
			<label class="relative block">
				<span class="sr-only">Search</span>
				<span class="absolute inset-y-0 left-0 flex items-center pl-2 light-orange-color">
					<SearchIcon />
				</span>
				<input
					class="placeholder:italic placeholder:text-slate-400 block w-full py-2 pl-9 pr-3 search-filed light-orange-color"
					placeholder='{$t("globals.search")}'
					type="text"
					bind:value={inputTextt}
					on:input={filtermylanguages}
				/>
			</label>
		</div>
		<div
			class="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-20 md:gap-y-10 overflow-y-auto itinerary-parent"
		>
			{#each filtereditineraries as itinerary}
				<Itinerary {itinerary} />
			{/each}
			<div
				class="text-center rounded-lg new-itinerary-box px-8 md:px-20 py-4"
				on:click={() => goToPlan()}
			>
				<div class="flex justify-center mb-3">
					<span class="light-orange-color"><AddIcon /></span>
				</div>
				<div class="text-sm light-orange-color uppercase tracking-widest">New</div>
			</div>
		</div>
	</div>
	<div class="w-full relative">
		<div class="home-root flex-1 flex flex-col mt-20">
			<BottomMenu />
		</div>
	</div>
</div>

<style>
	.search-filed {
		border-radius: 30px;
		background-color: #1f2a39;
	}

	.light-orange-color {
		color: #615b59;
	}

	.new-itinerary-box {
		background-color: #1f2a39;
		height: max-content;
		padding: 20px 30px 20px 30px;
		cursor: pointer;
	}
	.itinerary-parent {
		height: 50vh;
	}
	.itinerary-parent::-webkit-scrollbar {
		display: none;
	}
	.itinerary-parent {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>