<script>
	import Gallery from '$svgComponents/icons/gallery.svelte';
	import Star from '$svgComponents/icons/star.svelte';
	import router from 'page';
</script>

<div class="bars-menu-root flex-1 flex flex-col mt-10 justify-start space-y-10 items-center">
	<h3 class="text-xl text-blue uppercase">plan journey</h3>
	<ul class="flex flex-col items-start space-y-3">
		<li
			class="flex space-x-2 items-baseline cursor-pointer"
			on:click|preventDefault={() => router.redirect('/picture-view')}
		>
			<Gallery />
			<p class="text-orange text-2xl uppercase">picture browsing</p>
		</li>
		<li
			class="flex space-x-2 items-baseline cursor-pointer"
			on:click|preventDefault={() => router.redirect('/top-countries')}
		>
			<Star />
			<p class="text-orange text-2xl uppercase">top countries</p>
		</li>
	</ul>
</div>
