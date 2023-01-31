<script>
	import { createEventDispatcher } from 'svelte';
	import TriangleArrow from '$svgComponents/icons/triangleArrow.svelte';
	const dispatch = createEventDispatcher();

	export let data;
</script>

<TriangleArrow />
<div class="popup">
	<img src={data.image_url} alt="" />
	{data.name}
</div>

<style>
	.popup {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 150px;
		height: 150px;
		background-color: #1e2530;
		color: #fff;
	}
	.popup img {
		width: 100%;
		height: 80%;
	}
</style>
