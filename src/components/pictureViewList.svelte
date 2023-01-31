<script>
	// choice 1 - mobile view
	// choice 2 - browser view
	export let choice, added;

	import UserIconM from '$svgComponents/icons/svgg1.svelte';
	import PicIconM from '$svgComponents/icons/svgg2.svelte';
	import LocationIconM from '$svgComponents/icons/svgg3.svelte';
	import SvgThreedot from '$svgComponents/icons/svgthreedot.svelte';
	import BucketIconM from '$svgComponents/icons/svgg5.svelte';

	import UserIconBrowser from '$svgComponents/icons/svgg1browser.svelte';
	import PicIconBrowser from '$svgComponents/icons/svgg2browser.svelte';
	import LocationIconBrowser from '$svgComponents/icons/svgg3browser.svelte';
	import SvgThreedotBrowser from '$svgComponents/icons/svgThreedotbrowser.svelte';
	import BucketIconBrowser from '$svgComponents/icons/svgg5browser.svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function showUserInfo() {
		dispatch('showUserInfo');
	}
	function showPicInfo() {
		dispatch('showPicInfo');
	}
	function itinerary() {
		dispatch('itinerary');
	}
	function showBucketList() {
		dispatch('showBucketList');
	}
</script>

<!-- <=700 -->
{#if choice === 1}
	<div class="svgg">
		<span on:click={showUserInfo}>
			<UserIconM />
		</span>
		<span on:click={showPicInfo}>
			<PicIconM />
		</span>
		<LocationIconM />
		<span on:click={itinerary}>
			<SvgThreedot />
		</span>
		<span on:click={showBucketList}>
			<BucketIconM />
		</span>
	</div>
	<div class={added === true ? 'dark' : ''} />
{:else if choice === 2}
	<!-- >700 -->
	<div class={added === true ? 'dark' : ''} />
	<div class="svggbrowser">
		<span on:click={showUserInfo}>
			<UserIconBrowser />
		</span>
		<span on:click={showPicInfo}>
			<PicIconBrowser />
		</span>
		<LocationIconBrowser />
		<span on:click={itinerary}>
			<SvgThreedotBrowser />
		</span>
		<span on:click={showBucketList}>
			<BucketIconBrowser />
		</span>
	</div>
{/if}

<style>
	.svgg {
		padding: 1% 0;
		width: 100%;
		position: absolute;
		top: 43vh;
		left: 15vw;
		display: inline;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
	}
	.dark {
		position: absolute;
		width: 100vw;
		top: 0vh;
		height: 80vh;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 20%, rgba(0, 0, 0, 0.45) 20%);
	}
	.svggbrowser {
		position: absolute;
		height: 25vh;
		top: 37.2vh;
		display: inline;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.3) 20%);
	}
</style>
