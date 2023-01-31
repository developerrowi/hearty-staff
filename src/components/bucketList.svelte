<script>
	import supabase from '$lib/supabase';
	import SvgDownIcon from '$svgComponents/icons/svgdownicon.svelte';
	import SvgSearchIcon from '$svgComponents/icons/svgsearchIcon.svelte';
	import SvgAttachIcon from '$svgComponents/icons/svgsttachicon.svelte';
	import SvgDownIconMobile from '$svgComponents/icons/svgdowniconmobile.svelte';
	import SvgSearchIconMobile from '$svgComponents/icons/svgsearchIconmobile.svelte';
	import SvgAttachIconMobile from '$svgComponents/icons/svgsttachiconmobile.svelte';
	import Svgadd from '$svgComponents/icons/svgadd.svelte';
	import SvgaddBrowser from '$svgComponents/icons/svgaddbrowser.svelte';
	import BucketListGreen from '$svgComponents/icons/bucketListGreen.svelte';
	import BucketGreenBrowser from '$svgComponents/icons/bucketGreenBrowser.svelte';
	import { t } from '$translations/i18n';

	// choice 1 - mobile view
	// choice 2 - browser view
	export let choice, image, bucketArr;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function showBucketList() {
		dispatch('showBucketList');
	}

	let bucketInputText,
		bucketFilteredList = bucketArr;
	let bucketDisplayOptions = false;

	let selectedBucket = 'GENERAL BUCKET LIST';
	let selectedBucket_id = 0;

	const filterBuckets = () => {
		bucketFilteredList = bucketArr.filter((buck) =>
			buck[0].toUpperCase().includes(bucketInputText.toUpperCase())
		);
	};

	// bucket_list_images API push
	async function bucket_list_images() {
		if (selectedBucket_id != 0) {
			dispatch('setAdded', { value: true });
			dispatch('setBucketList', { value: false });

			setTimeout(() => {
				dispatch('setAdded', { value: false });
			}, 2000);
			const { data, error } = await supabase
				.from('bucket_list_images')
				.insert([{ bucket_lists_id: selectedBucket_id, images_id: image[2] }]);
		}
	}
</script>

<!-- <=700 -->
{#if choice === 1}
	<div class="svggItinerary">
		<div class="svgmenu">
			<div class="dropdown-mobile" on:click={() => (bucketDisplayOptions = !bucketDisplayOptions)}>
				<div class="country__title">
					{selectedBucket}
				</div>
				<SvgDownIconMobile />
			</div>
			<div
				class={bucketDisplayOptions
					? 'open__selectBox-mobile show-mobile'
					: 'open__selectBox-mobile'}
			>
				<div class="search__box-mobile">
					<SvgSearchIconMobile />
					<input
						type="text"
						placeholder='{$t("globals.search")}'
						bind:value={bucketInputText}
						on:input={filterBuckets}
					/>
				</div>
				<div class="results-mobile">
					{#each bucketFilteredList as eachBucket}
						<div class="items-mobile">
							<p
								on:click={() => {
									selectedBucket = eachBucket[0];
									selectedBucket_id = eachBucket[1];
									bucketDisplayOptions = false;
								}}
							>
								<SvgAttachIconMobile />
								{eachBucket[0]}
							</p>
						</div>
					{:else}
						<p style="font-size: 20px;">No results</p>
					{/each}
				</div>
			</div>
		</div>
		<span on:click={() => bucket_list_images()}>
			<Svgadd />
		</span>
		<span on:click={showBucketList} class="bucketGreen">
			<BucketListGreen />
		</span>
	</div>
{:else if choice === 2}
	<!-- >700 -->
	<div class="browser-svg-itnerary">
		<div class="browser-svg-menu">
			<div class="dropdown" on:click={() => (bucketDisplayOptions = !bucketDisplayOptions)}>
				<div class="country__title">
					{selectedBucket}
				</div>
				<SvgDownIcon />
			</div>
			<div class={bucketDisplayOptions ? 'open__selectBox show' : 'open__selectBox'}>
				<div class="search__box">
					<SvgSearchIcon />
					<input
						type="text"
						placeholder='{$t("globals.search")}'
						bind:value={bucketInputText}
						on:input={filterBuckets}
					/>
				</div>
				<div class="results">
					{#each bucketFilteredList as eachBucket}
						<div class="items">
							<p
								on:click={() => {
									selectedBucket = eachBucket[0];
									selectedBucket_id = eachBucket[1];
									bucketDisplayOptions = false;
								}}
							>
								<SvgAttachIcon />
								{eachBucket[0]}
							</p>
						</div>
					{:else}
						<p style="font-size: 10px;">No results</p>
					{/each}
				</div>
			</div>
		</div>
		<span on:click={() => bucket_list_images()}>
			<SvgaddBrowser />
		</span>
		<span on:click={showBucketList} class="bucketGreen">
			<BucketGreenBrowser />
		</span>
	</div>
{/if}

<style>
	@media only screen and (max-width: 700px) {
		.bucketGreen {
			top: 13.5vh !important;
			left: 65vw !important;
		}
	}
	.bucketGreen {
		position: absolute;
		top: 6.5vh;
		left: 56vw;
	}
	.svggItinerary {
		position: absolute;
		width: 100vw;
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
		font-size: 0.4rem;
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
