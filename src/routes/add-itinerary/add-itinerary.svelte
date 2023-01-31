<script>
	import router from 'page';
	import { toast } from '$lib/toast-helper';
	import supabase from '$lib/supabase';
	import { authUser, isProtectedRoute, isFromItineraryRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import { itineraries } from '$stores/itineraryStore';
	import { getItineraryList } from '$lib/services/itineraryServices';
	import Itinerary from '$components/add-itinerary.svelte';
	import AddIcon from '$svgComponents/icons/add.svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import SearchIcon from '$svgComponents/icons/search.svelte';
	import { t } from '$translations/i18n';

	let bucketId = '';
	let ref='';
	onMount(() => {
		let url = new URL(window.location.toString());
        ref = url.searchParams.get('ref');
		bucketId = url.searchParams.get('id');
		console.log(bucketId);
		isProtectedRoute.set(true);
		if (!$authUser) router.redirect('/');
		getItinerary();
	});
	//filter itineraries variables
	let inputTextt;
	let filtereditineraries;
	//get all itineraries API
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
	//filter itineraries
	const filtermylanguages = () => {
		filtereditineraries = $itineraries.filter((Itinerary) =>
			Itinerary.trip_name.toUpperCase().includes(inputTextt.toUpperCase())
		);
	};
</script>

<div class="head">Select the itinerary you would like to add {ref} to :</div>
<div class="home-root flex-1 flex flex-col mt-5 items-center justify-between">
	<div class="flex flex-col flex-row justify-around md:items-center">
		<div class="mb-10 mt-5">
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
				<Itinerary {itinerary} {bucketId} />
			{/each}
		</div>
	</div>
	<div class="w-full relative">
		<div class="home-root flex-1 flex flex-col mt-20">
			<BottomMenu />
		</div>
	</div>
</div>

<style>
	/*heading css*/
	.head {
		align-self: center;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 25px;
		font-weight: 600;
		margin-top: 15px;
		color: #b5ffb4;
		width: 95vw;
	}

	.search-filed {
		border-radius: 30px;
		background-color: #1f2a39;
	}

	.light-orange-color {
		color: #615b59;
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
	@media screen and (max-width: 500px) {
		.head {
			font-size: 20px;
		}
	}
</style>
