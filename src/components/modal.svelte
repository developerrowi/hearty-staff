<script>
	import Modaltabs from './shared/Modaltabs.svelte';
	import Popup from './popup.svelte';
	import { isPopupShown, isModalOpen, filterStore } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';
	import supabase from '$lib/supabase';
	import SvgClose from '$svgComponents/icons/close.svelte';
	import { fade } from 'svelte/transition';

	let added = false;
	let popupState;

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

	let places = [],
		countries = [];

	let showPopup = false;

	let appliedFilters = [];

	const unsub = filterStore.subscribe((data) => (appliedFilters = data));

	onDestroy(() => unsub());

	onMount(() => isPopupShown.subscribe((state) => (showPopup = state)));

	async function fetchData() {
		const res = await Promise.all([
			supabase.from('places').select('*'),
			supabase.from('countries').select('*')
		]);

		places = res[0].data;
		countries = res[1].data;
	}

	onMount(async () => {
		await fetchData();
	});

	const addCountry = (/** @type {{ id: any; }} */ country) => {
		if (!appliedFilters.find((filter) => filter?.id === country.id)) {
			appliedFilters = [...appliedFilters, country];
			results = [];
			input = '';
			addbtn = true;
		} else return;
	};

	const removeCountry = (/** @type {{ id: any; }} */ country) => {
		isPopupShown.update(() => true);
		addbtn = true;
		popupState = country;
	};

	const addPlace = (/** @type {{ id: any; }} */ place) => {
		if (!appliedFilters.find((filter) => filter?.id === place.id)) {
			appliedFilters = [...appliedFilters, place];
			results = [];
			input = '';
			addbtn = true;
		} else return;
	};

	const removePlace = (/** @type {{ countries_id: any; }} */ place) => {
		isPopupShown.update(() => true);
		addbtn = true;
		popupState = place;
	};

	const updateFilters = (/** @type {{ detail: { state: string; status: string; }; }} */ e) => {
		if (e.detail.state === 'place' && e.detail.status === 'continue') {
			const index = appliedFilters.findIndex(
				(filter) => filter?.countries_id === popupState.countries_id
			);

			if (index >= 0) {
				appliedFilters.splice(index, 1);
			}

			appliedFilters = appliedFilters;

			isPopupShown.update(() => false);

			filterStore.set(appliedFilters);
		} else {
			if (e.detail.state === 'country' && e.detail.status === 'continue') {
				const index = appliedFilters.findIndex((filter) => filter.id === popupState.id);

				if (index >= 0) {
					appliedFilters.splice(index, 1);
				}

				appliedFilters = appliedFilters;

				isPopupShown.update(() => false);

				filterStore.set(appliedFilters);
			}
		}
	};

	const handleDebounce = (e) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (input) {
				if (e.target.dataset.result === 'countries') {
					results = countries.filter(
						(country) => country.name.toUpperCase().indexOf(input.toUpperCase()) > -1
					);
				} else {
					places = places.filter(
						(place, index, self) =>
							index === self.findIndex((t) => t.name.toUpperCase() === place.name.toUpperCase())
					);

					results = places.filter(
						(place) => place.name.toUpperCase().indexOf(input.toUpperCase()) > -1
					);
				}
			} else results = [];
		}, 500);
	};
</script>

<!-- svelte-ignore a11y-autofocus -->

<!-- tabindex is required, because it tells the browser that this div element is focusable and hence triggers the keydown event-->
<div tabindex={0} autofocus class="fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-10">
	{#if added == true}
		<div class="centered__add-browser " transition:fade={{ duration: 1000 }}>ADDED</div>
	{/if}
	<div class={added === true ? 'dark' : ''} />
	<div
		class="{added === true
			? 'bg-darkslategray'
			: 'bg-darkslategray'} max-w-xs sm:max-w-5xl md:max-w-2xl lg:max-w-4xl mx-auto my-20 text-tan font-roboto  p-6 rounded-md relative"
	>
		{#if showPopup}
			<Popup {popupState} on:updateStatus={updateFilters} />
		{/if}
		<div
			on:click={() => isModalOpen.update(() => false)}
			class="cursor-pointer shadow-md absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 bg-darkslategraySecondary p-2 rounded-md"
		>
			<SvgClose />
		</div>
		<Modaltabs {items} {activeItem} on:tabChange={tabChange} />
		<div class="mt-5 relative">
			{#if activeItem === 'Countries'}
				<h2 class="text-xl">Choose countries:</h2>
				<input
					on:keyup={handleDebounce}
					bind:value={input}
					type="text"
					class="w-full outline-none px-3 py-2 bg-darkslategraySecondary rounded-md mt-2"
					data-result="countries"
				/>
				{#if results.length > 0}
					<div
						class="absolute top-16 rounded-md bg-darkslategraySecondary shadow-xl w-full h-36 overflow-y-scroll px-4 py-2 mt-5 space-y-2"
					>
						{#each results as result}
							<p class="cursor-pointer" on:click={() => addCountry(result)}>
								{result.name}
							</p>
						{/each}
					</div>
				{/if}

				<div class="mt-5 space-y-2 overflow-y-auto h-40">
					{#each appliedFilters as filter}
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
				<h2 class="text-xl">Choose places:</h2>
				<input
					on:keyup={handleDebounce}
					bind:value={input}
					type="text"
					class="w-full outline-none px-3 py-2 bg-darkslategraySecondary rounded-md mt-2"
					data-result="places"
				/>
				{#if results.length > 0}
					<div
						class="absolute top-16 rounded-md bg-darkslategraySecondary shadow-xl w-full h-36 overflow-y-scroll px-4 py-2 mt-5 space-y-2"
					>
						{#each results as result}
							<p class="cursor-pointer" on:click={() => addPlace(result)}>
								{result.name}
							</p>
						{/each}
					</div>
				{/if}

				<div class="mt-5 space-y-2 overflow-y-auto h-40">
					{#each appliedFilters as filter}
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
			<div
				class="absolute bottom-0 right-0 transform cursor-pointer"
				style="pointer-events: {addbtn ? 'auto' : 'none'}"
				on:click={() => {
					added = true;
					setTimeout(() => {
						added = false;
						addbtn = false;
					}, 500);
					filterStore.set(appliedFilters);
					// isModalOpen.update(() => false);
				}}
			>
				<p>Add</p>
			</div>
		</div>
	</div>
</div>

<style>
	.centered__add-browser {
		margin-left: 45vw;
		text-align: center;
		color: #f2d0b8;
		position: absolute;
		top: 38.3vh;
		z-index: 100 !important;
		letter-spacing: 2px;
	}
	.dark {
		position: absolute;
		z-index: 30 !important;
		width: 100vw;
		top: 0vh;
		height: 80vh;
		background: linear-gradient(to bottom, rgba(8, 6, 6, 0.45) 20%, rgba(9, 7, 7, 0.45) 20%);
	}
</style>
