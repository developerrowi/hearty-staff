<script>
	import Modaltabs from './shared/Modaltabs.svelte';
	import Popup from './popup.svelte';
	import { isPopupShown, isModalOpen, filterStore,isTripModalOpen } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';
	import supabase from '$lib/supabase';
	import SvgClose from '$svgComponents/icons/close.svelte';
	import { fade } from 'svelte/transition';
	import { toast } from '$lib/toast-helper';
    import {createEventDispatcher} from 'svelte';
	const dispatch = createEventDispatcher();
	let added = false;
	let popupState;
    let refresh = false;
	let items = ['Countries', 'Places'];
	let activeItem = 'Countries';

	let input = '';

	let results = [];
	let timer;
	let addbtn = false;
	const tabChange = (e) => {
		activeItem = e.detail;
		results = [];
		input = '';
	};

	// let places = [],
		 let countries = [];
      
	let showPopup = false;
    let currentstate = '';
	
    export let modalCountries = [];
    export let places = [];
	export let tripId = '';
	
	const removeCountry = (/** @type {{ id: any; }} */ country) => {
	    showPopup = true;
		currentstate = 'country';
		popupState = country;
	};

	
	const removePlace = (/** @type {{ countries_id: any; }} */ place) => {
		showPopup = true;
		currentstate = 'place';
		popupState = place;
	};
//delete API
	async function DeleteApi()
	{
		if(currentstate == 'country')
		{
			//get all places of country
			for(let i=0;i<places.length;i++)
			{
				if(places[i].countries_id == popupState.id)
				{
					//delete items from itinerary_stops table which have places_id = places[i].id and itineraries_id = tripId
					let { data, error } = await supabase
					.from('itinerary_stops')
					.delete()
					.match({ itineraries_id: tripId, places_id: places[i].id });
				}
			}
			showPopup = false;
			dispatch('deleted',refresh=true);
			toast.success('Country removed successfully');
		}
		else if(currentstate == 'place')
		{
			//delete items from itinerary_stops table which have places_id = popupState.id and itineraries_id = tripId
			let { data, error } = await supabase
			.from('itinerary_stops')
			.delete()
			.match({ itineraries_id: tripId, places_id: popupState.id });
			showPopup = false;
			dispatch('deleted',refresh=true);
			toast.success('Deleted place successfully');
		}
	}


</script>

<!-- svelte-ignore a11y-autofocus -->

<!-- tabindex is required, because it tells the browser that this div element is focusable and hence triggers the keydown event-->
<div tabindex={0} autofocus class="fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-10">
	<div
		class="{added === true
			? 'bg-darkslategray'
			: 'bg-darkslategray'} max-w-xs sm:max-w-5xl md:max-w-2xl lg:max-w-4xl mx-auto my-20 text-tan font-roboto  p-6 rounded-md relative"
	>
		<div
			on:click={() => isTripModalOpen.update(() => false)}
			class="cursor-pointer shadow-md absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 bg-darkslategraySecondary p-2 rounded-md"
		>
			<SvgClose />
		</div>
		<Modaltabs {items} {activeItem} on:tabChange={tabChange} />
		<div class="mt-5 relative">
			{#if activeItem === 'Countries'}
				
			

				<div class="mt-5 space-y-2 overflow-y-auto h-40">
					{#each modalCountries as filter}
						{#if !filter.hasOwnProperty('countries_id')}
							<div class="flex items-center space-x-2">
								<div class="cursor-pointer" on:click={() => removeCountry(filter)}>
									<SvgClose />
								</div>
								<p>{filter?.name}</p>
							</div>
						{/if}
					{/each}
				</div>
			{:else if activeItem === 'Places'}
				<div class="mt-5 space-y-2 overflow-y-auto h-40">
					{#each places as filter}
						{#if filter.hasOwnProperty('countries_id')}
							<div class="flex items-center space-x-2">
								<div class="cursor-pointer" on:click={() => removePlace(filter)}>
									<SvgClose />
								</div>
								<p>{filter?.name}</p>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- delete modal -->
{#if showPopup}

<div class="fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20">
	<div class="max-w-md mx-auto my-48 bg-darkslategray py-4 px-5 rounded-md space-y-5">
		<div class="text-center bg-darkslategraySecondary py-2 rounded-md text-lg font-medium">
			<h2>{popupState.name}</h2>
		</div>
		<p>
			This action will delete the {#if currentstate === 'country'} country {:else} place {/if} and
			all the pics that are in the {#if currentstate === 'country'} country {:else} place {/if}.
		</p>
		<div class="space-x-4 flex items-center justify-evenly">
			<button
				class="bg-green text-back-color w-full py-2 rounded-md"
				on:click={() =>showPopup=false}>Cancel</button
			>
			<button
				class="bg-green text-back-color w-full py-2 rounded-md"
				on:click={()=>{DeleteApi();}}
				>Continue</button
			>
		</div>
	</div>
</div>
{/if}

<style>
	
</style>
