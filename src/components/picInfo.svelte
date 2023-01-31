<script>
	import PicInfoIconM from '$svgComponents/icons/picInfo.svelte';
	import PicInfoBrowser from '$svgComponents/icons/picInfoBrowser.svelte';

	// choice 1 - mobile view
	// choice 2 - browser view
	export let choice, image;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function showPicInfo() {
		dispatch('showPicInfo');
	}
</script>

<!-- <=700 -->
{#if choice === 1}
	<div class="picInfo__container-mobile">
		<h3 class="pic__title">Place info</h3>
		<p>
			{image}
		</p>
		<span on:click={showPicInfo}>
			<PicInfoIconM />
		</span>
	</div>
{:else if choice === 2}
	<!-- >700 -->
	<div class="picInfo__container">
		<h3 class="pic__title">Pic info</h3>
		<p>
			{image}
		</p>
		<span on:click={showPicInfo}>
			<PicInfoBrowser />
		</span>
	</div>
{/if}

<style global>
	@media only screen and (max-width: 700px) {
		.picInfo__container-mobile {
			width: 54vw !important;
			height: 66vw !important;
		}
		.picInfo__container-mobile p {
			font-size: 15px;
		}
		.picInfo__container-mobile h3 {
			font-size: 23px;
		}
	}
	.picInfo__container-mobile {
		padding: 10px 25px;
		position: absolute;
		width: 20vw;
		margin: 0 auto;
		top: 13vh;
		height: 33vh;
		background: rgba(32, 47, 64, 0.85);
	}

	.picInfo__container {
		left: 36vw;
		position: absolute;
		width: 28vw;
		margin: 0 auto;
		top: 30vh;
		height: 43vh;
		background: rgba(32, 47, 64, 0.85);
		z-index: 100;
	}

	.picInfo__container-mobile p {
		font-size: 7px;
		padding: 10px 0;
	}

	.picInfo__container p {
		font-size: 0.9vw;
		margin-left: 0.7vw;
	}
	.pic__title {
		margin: 1vw;
		font-size: 2.3vw;
		text-transform: uppercase;
	}
</style>
