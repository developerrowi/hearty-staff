<script>
	import BucketList from '$svgComponents/icons/bucket-list.svelte';
	import CheckList from '$svgComponents/icons/check-list.svelte';
	import Intinerary from '$svgComponents/icons/intinerary.svelte';
	import router from 'page';
</script>

<ul class="back-pack-menu-root flex-1 flex flex-col justify-around items-center mt-5">
	<li
		class="flex flex-col items-center space-y-2 cursor-pointer"
		on:click|preventDefault={() => router.redirect('/check-lists')}
	>
		<CheckList />
		<p>check list</p>
	</li>
	<li
		class="flex flex-col items-center space-y-2 cursor-pointer"
		on:click|preventDefault={() => router.redirect('/itinerary')}
	>
		<Intinerary />
		<p>itinenary</p>
	</li>
	<li
		class="flex flex-col items-center space-y-2 cursor-pointer"
		on:click|preventDefault={() => router.redirect('/bucket-list')}
	>
		<BucketList />
		<p>bucket list</p>
	</li>
</ul>

<style>
	ul.back-pack-menu-root > li > p {
		max-width: 10ch;
		text-align: center;
		font-size: 0.8rem;
		text-transform: capitalize;
		color: var(--primary-orange);
	}
</style>
