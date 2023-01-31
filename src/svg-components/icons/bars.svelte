<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function dispatchClick() {
		dispatch('tap', {});
	}

	export let barsActive = false;
	export let size = 24;
</script>

<div class="bars-root" class:bars-root-active={barsActive}>
	<svg
		width={size}
		height={(15 / 18) * size}
		viewBox="0 0 18 15"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		on:click={dispatchClick}
	>
		<path
			d="M0.848705 1.74855H11.5993C11.8267 1.7418 12.0425 1.64673 12.201 1.48351C12.3594 1.32028 12.4481 1.10176 12.4481 0.874277C12.4481 0.646796 12.3594 0.428271 12.201 0.265047C12.0425 0.101823 11.8267 0.00675447 11.5993 0H0.848705C0.621324 0.00675447 0.405519 0.101823 0.247072 0.265047C0.0886244 0.428271 0 0.646796 0 0.874277C0 1.10176 0.0886244 1.32028 0.247072 1.48351C0.405519 1.64673 0.621324 1.7418 0.848705 1.74855Z"
			fill={barsActive ? '#C5FFBB' : '#F1D8C2'}
		/>
		<path
			d="M0.848705 8.20989H17.1513C17.3787 8.20314 17.5945 8.10807 17.7529 7.94484C17.9114 7.78162 18 7.56309 18 7.33561C18 7.10813 17.9114 6.88961 17.7529 6.72638C17.5945 6.56316 17.3787 6.46804 17.1513 6.46129H0.848705C0.621324 6.46804 0.405519 6.56316 0.247072 6.72638C0.0886244 6.88961 0 7.10813 0 7.33561C0 7.56309 0.0886244 7.78162 0.247072 7.94484C0.405519 8.10807 0.621324 8.20314 0.848705 8.20989Z"
			fill={barsActive ? '#C5FFBB' : '#F1D8C2'}
		/>
		<path
			d="M0.848705 14.6712H17.1513C17.3787 14.6645 17.5945 14.5694 17.7529 14.4062C17.9114 14.243 18 14.0244 18 13.7969C18 13.5694 17.9114 13.3509 17.7529 13.1877C17.5945 13.0245 17.3787 12.9294 17.1513 12.9226H0.848705C0.621324 12.9294 0.405519 13.0245 0.247072 13.1877C0.0886244 13.3509 0 13.5694 0 13.7969C0 14.0244 0.0886244 14.243 0.247072 14.4062C0.405519 14.5694 0.621324 14.6645 0.848705 14.6712V14.6712Z"
			fill={barsActive ? '#C5FFBB' : '#F1D8C2'}
		/>
	</svg>
</div>

<style>
	div.bars-root {
		padding: 1rem;
		z-index: 100;
		padding-inline: 1.5rem;
	}

	div.bars-root-active {
		flex: 1;
		background-color: var(--menu-active-bg);
		border-bottom-left-radius: 1.25rem;
		border-bottom-right-radius: 1.25rem;
		padding: 1.25rem;
		position: relative;
		border: 0.5px solid rgba(0, 0, 0, 0.75);
		border-top: none;
		border-right: none;
		position: relative;
	}

	div.bars-root-active::before {
		content: '';
		top: 0px;
		bottom: 1.25rem;
		right: -3rem;
		border-radius: 1.25rem;
		width: 3rem;
		border: 0.5px solid rgba(0, 0, 0, 0.75);
		border-right: none;
		border-bottom: none;
		border-bottom-left-radius: 0;
		border-top-right-radius: 0%;
		position: absolute;
		z-index: 0;
	}

	div.bars-root:hover {
		cursor: pointer;
	}
</style>
