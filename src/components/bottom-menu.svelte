<script>
	import { onMount, onDestroy } from 'svelte';
	import BackPack from '$svgComponents/icons/back-pack.svelte';
	import Bars from '$svgComponents/icons/bars.svelte';
	import BackPackMenu from './back-pack-menu.svelte';
	import BarsMenu from './bars-menu.svelte';
	import { isBarsActive } from '$lib/store';
	import { clickOutside } from '$lib/clickOutside';

	let barsActive = false;
	onMount(() => isBarsActive.subscribe((state) => (barsActive = state)));
	let backPackActive = false;

	function handleClickOutside() {
		isBarsActive.set(false);
	}
</script>

<div
	class="bottom-menu-root flex flex-col justify-end "
	class:bottom-menu-open={barsActive || backPackActive}
	use:clickOutside
	on:click_outside={handleClickOutside}
>
	{#if barsActive || backPackActive}
		<div class="menu-body" class:rounded-br={barsActive} class:rounded-bl={backPackActive}>
			{#if barsActive}
				<BarsMenu />
			{:else}
				<BackPackMenu />
			{/if}
		</div>
	{/if}
	<div class="bottom-menu-bar flex justify-between items-center">
		<Bars
			{barsActive}
			on:tap={() => {
				isBarsActive.update((isBarActive) => !isBarActive);
				backPackActive = false;
			}}
		/>
		<BackPack
			{backPackActive}
			on:tap={() => {
				backPackActive = !backPackActive;
				isBarsActive.update(() => false);
			}}
		/>
	</div>
</div>

<style>
	div.bottom-menu-root {
		position: absolute;
		bottom: 4rem;
		left: 0;
		right: 0;
		z-index: 999 !important;
	}
	div.bottom-menu-root.bottom-menu-open {
		min-height: 50vh;
		z-index: 100 !important;
	}
	div.bottom-menu-root > div.menu-body {
		background-color: var(--menu-active-bg);
		flex: 1;
		border: 0.5px solid rgba(0, 0, 0, 0.75);
		border-bottom: none;
		border-radius: 1.25rem;
		position: relative;
		display: flex;
		z-index: 100 !important;
	}
	div.bottom-menu-root > div.menu-body::before {
		content: '';
		width: 4rem;
		height: 0.1rem;
		top: 0.5rem;
		left: calc(50% - 2rem);
		background-color: var(--back-color);
		position: absolute;
		border-radius: 0.25rem;
		z-index: 100 !important;
	}
	div.bottom-menu-root > div.menu-body.rounded-br {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 1.25rem;
		z-index: 100 !important;
	}
	div.bottom-menu-root > div.menu-body.rounded-bl {
		border-bottom-left-radius: 1.25rem;
		border-bottom-right-radius: 0;
		z-index: 100 !important;
	}
	div.bottom-menu-root > div.bottom-menu-bar {
		border-radius: 1.25rem;
		z-index: 100 !important;
	}

	@media screen and (max-width: 500px) {
		div.bottom-menu-root {
			background-color: rgb(15 23 42);
			border-radius: 25px;
			bottom: 1rem;
		}
	}
</style>
