<script>
	import { createEventDispatcher } from 'svelte';
	import { isPopupShown } from '$lib/store';

	export let popupState;

	let currentState = () => {
		if (popupState.hasOwnProperty('countries_id')) {
			return 'place';
		} else return 'country';
	};

	const dispatch = createEventDispatcher();
</script>

<div class="fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20">
	<div class="max-w-md mx-auto my-48 bg-darkslategray py-4 px-5 rounded-md space-y-5">
		<div class="text-center bg-darkslategraySecondary py-2 rounded-md text-lg font-medium">
			<h2>{popupState.name}</h2>
		</div>
		<p>
			This action will delete the {#if currentState() === 'country'} country {:else} place {/if} and
			all the pics that are in the {#if currentState() === 'country'} country {:else} place {/if}.
		</p>
		<div class="space-x-4 flex items-center justify-evenly">
			<button
				class="bg-green text-back-color w-full py-2 rounded-md"
				on:click={() => isPopupShown.update(() => false)}>Cancel</button
			>
			<button
				class="bg-green text-back-color w-full py-2 rounded-md"
				on:click={() => dispatch('updateStatus', { state: currentState(), status: 'continue' })}
				>Continue</button
			>
		</div>
	</div>
</div>

<style>
</style>
