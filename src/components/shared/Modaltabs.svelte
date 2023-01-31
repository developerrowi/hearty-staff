<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let items;
	export let activeItem;
</script>

<div class="tabs">
	<ul class="flex items-center space-x-4 justify-evenly">
		{#each items as item}
			<li on:click={() => dispatch('tabChange', item)}>
				<div class="cursor-pointer w-1/2" class:active={item === activeItem}>{item}</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.active {
		color: #c5ffbb;
	}
</style>
