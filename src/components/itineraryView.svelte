<script>
	import supabase from '$lib/supabase';
	import SvgDownIcon from '$svgComponents/icons/svgdownicon.svelte';
	import SvgSearchIcon from '$svgComponents/icons/svgsearchIcon.svelte';
	import SvgAttachIcon from '$svgComponents/icons/svgsttachicon.svelte';
	import SvgDownIconMobile from '$svgComponents/icons/svgdowniconmobile.svelte';
	import SvgSearchIconMobile from '$svgComponents/icons/svgsearchIconmobile.svelte';
	import SvgAttachIconMobile from '$svgComponents/icons/svgsttachiconmobile.svelte';
	import Svgadd from '$svgComponents/icons/svgadd.svelte';
	import SvgIthreedot from '$svgComponents/icons/svgIthreedot.svelte';
	import SvgaddBrowser from '$svgComponents/icons/svgaddbrowser.svelte';
	import SvgIthreedotBrowser from '$svgComponents/icons/svgIthreedotbrowser.svelte';

	// choice 1 - mobile view
	// choice 2 - browser view
	export let choice, image, countries;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function Iitinerary() {
		dispatch('Iitinerary');
	}

	let inputText;
	let displayOptions = false;

	let filteredList = countries;
	let selectedCountry = 'Select Itinerary';
	let selectedCountry_id = 0;

	const filterCountries = () => {
		filteredList = countries.filter((country) =>
			country[0].toUpperCase().includes(inputText.toUpperCase())
		);
	};

	// itinerary API push
	async function Itinerary_stop() {
		if (selectedCountry_id != 0) {
			dispatch('setAdded', { value: true });
			dispatch('setItin', { value: 0 });

			setTimeout(() => {
				dispatch('setAdded', { value: false });
			}, 2000);

			const { data, error } = await supabase
				.from('itinerary_stops')
				.insert([{ itineraries_id: selectedCountry_id, places_id: image[2] }]);
		}
	}
</script>

<!-- <=700 -->
{#if choice === 1}
	<div class="svggItinerary">
		<div class="svgmenu">
			<div class="dropdown-mobile" on:click={() => (displayOptions = !displayOptions)}>
				<div class="country__title">
					{selectedCountry}
				</div>
				<SvgDownIconMobile />
			</div>
			<div class={displayOptions ? 'open__selectBox-mobile show-mobile' : 'open__selectBox-mobile'}>
				<div class="search__box-mobile">
					<SvgSearchIconMobile />
					<input
						type="text"
						placeholder='{$t("globals.search")}'
						bind:value={inputText}
						on:input={filterCountries}
					/>
				</div>
				<div class="results-mobile">
					{#each filteredList as country}
						<div class="items-mobile">
							<p
								on:click={() => {
									selectedCountry = country[0];
									selectedCountry_id = country[1];
									displayOptions = false;
								}}
							>
								<SvgAttachIconMobile />
								{country[0]}
							</p>
						</div>
					{:else}
						<p style="font-size: 10px;">No results</p>
					{/each}
				</div>
			</div>
		</div>

		<span on:click={() => Itinerary_stop()}>
			<Svgadd />
		</span>
		<span on:click={Iitinerary}>
			<SvgIthreedot />
		</span>
	</div>
{:else if choice === 2}
	<!-- >700 -->
	<div class="browser-svg-itnerary">
		<div class="browser-svg-menu">
			<div class="dropdown" on:click={() => (displayOptions = !displayOptions)}>
				<div class="country__title">
					{selectedCountry}
				</div>
				<SvgDownIcon />
			</div>
			<div class={displayOptions ? 'open__selectBox show' : 'open__selectBox'}>
				<div class="search__box">
					<SvgSearchIcon />
					<input
						type="text"
						placeholder='{$t("globals.search")}'
						bind:value={inputText}
						on:input={filterCountries}
					/>
				</div>
				<div class="results">
					{#each filteredList as country}
						<div class="items">
							<p
								on:click={() => {
									selectedCountry = country[0];
									selectedCountry_id = country[1];
									displayOptions = false;
								}}
							>
								<SvgAttachIcon />
								{country[0]}
							</p>
						</div>
					{:else}
						<p style="font-size: 10px;">No results</p>
					{/each}
				</div>
			</div>
		</div>
		<span on:click={Itinerary_stop}>
			<SvgaddBrowser />
		</span>
		<span on:click={Iitinerary}>
			<SvgIthreedotBrowser />
		</span>
	</div>
{/if}

<style>
	.svggItinerary {
		position: absolute;
		width: 100%;
		top: 28vh;
		height: 22vh;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.3) 20%);
	}
	.svgmenu {
		position: absolute;
		top: 3vh;
		left: 13vw;
	}

	.dropdown-mobile {
		background: #1d2531;
		border-radius: 5px;
		color: #f2e8da;
		text-align: center;
		font-size: 3vw;
		font-family: Arciform;
		letter-spacing: 0.5px;
		display: flex;
		justify-content: space-between;
		padding: 4px;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
		z-index: 100;
		width: 26vw;
		height: 3vh;
		margin-left: 15vw;
	}
	.open__selectBox-mobile {
		display: none;
		margin-top: -4vh;
		width: 40vw !important;
		margin-left: 0.3vw;
		background: #1d2531;
		border-radius: 2vw;
		color: #f2e8da;
	}
	.search__box-mobile {
		width: 35vw !important;
		background: rgb(88, 88, 88);
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 4vh 0.8vw;
		padding: 0px 0px 0px;
		margin-bottom: 0px;
	}
	.search__box-mobile input {
		background: rgb(88, 88, 88);
		outline: none;
		border: 0;
		margin-left: 3.2vw;
		color: white;
		border-radius: 5px;
		font-size: 3vw;
	}
	.results-mobile {
		padding: 7px 0;
		width: 40vw;
		background: #1d2531;
		color: #dcc;
		border-radius: 5px;
		overflow: scroll;
		height: 10vh;
	}
	.items-mobile {
		display: inline;
		width: 50%;
		padding: 0 0px;
		border-radius: 20px;
		font-size: 2.8vw;
	}
	.show-mobile {
		display: block;
	}

	.dropdown {
		width: 10vw;
		background: #1d2531;
		border-radius: 0.5vw;
		color: #f2e8da;
		text-align: center;
		font-size: 0.7vw;
		font-family: Arciform;
		letter-spacing: 0.5px;
		display: flex;
		justify-content: space-between;
		padding: 4px;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
		z-index: 1 !important;
	}

	.country__title {
		width: 100%;
		display: grid;
		place-items: center;
		font-size: 0.5rem;
	}

	.open__selectBox {
		display: none;
		margin-top: -4vh;
		width: 10vw !important;
		background: #1d2531;
		border-radius: 0.5vw;
		color: #f2e8da;
	}
	.search__box {
		width: 8vw !important;
		background: rgb(88, 88, 88);
		border-radius: 0.5vw;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 4vh 0.8vw;
		padding: 0px 0px 0px;
		margin-bottom: 0px;
	}
	.search__box input {
		background: rgb(88, 88, 88);
		outline: none;
		border: 0;
		margin-left: 2vw;
		color: white;
		border-radius: 0.2vw;
		font-size: 0.6vw;
	}

	.results {
		padding: 7px 0;
		width: 100%;
		background: #1d2531;
		color: #dcc;
		border-radius: 5px;
		overflow-y: scroll;
		height: 6vh;
	}
	.browser-svg-itnerary {
		z-index: 100 !important;
		position: absolute;
		width: 100vw;
		top: 31.9vh;
		height: 18vh;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.3) 20%);
	}

	.browser-svg-menu {
		z-index: 1 !important;
		position: absolute;
		top: 0.5vh;
		left: 42vw;
	}
	.items {
		display: inline;
		width: 50%;
		padding: 0 0px;
		border-radius: 20px;
		font-size: 0.6vw;
	}
	.items p {
		padding: 1.4% 0;
	}
	.items p:hover {
		background-color: #c5ffbb;
		color: #dacdbb;
		border-radius: 10px;
	}
	.show {
		display: block;
	}
</style>
