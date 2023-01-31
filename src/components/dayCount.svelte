<script>
	import Svgdownicon from "$svgComponents/icons/svgdownicon.svelte";

	export let dayCount;
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

</script>

<div class={`shadow-lg day__countDiv`}>
	<p style="color:#f2d0b8">DURATION</p>
	<select name="" class="day__count" value={dayCount}
	on:change={(e) => dispatch("selectday", e.target.value)}
	>
		{#each [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] as day}
			<option value={day}
			>{day}</option>
		{/each}
	</select>
	
</div>

<style global>
    .day__countDiv
    {
        position: absolute;
        left: 20%;
        top: 8%;
    }
	.day__count::-webkit-scrollbar{
		width: 0;
		display: none;
	}
	.day__countDiv {
		margin-top: 1.3%;
		margin-left: 23%;
		display: flex;
		width: 8%;
		border-radius: 5px;
	}
	.day__count {
		padding: 0 15%;
		color: #80bf95;
		background: #3c4650;
		margin-left: 11%;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
	@media only screen and (max-width: 700px) {
		.day__countDiv {
			margin: 0 !important;
			position: absolute;
			width: 8%;
			border-radius: 5px;
			top: 30%;
			left: 35%;
			flex: 1;
			padding-right: 20px;
		}
		.left {
			left: 16vw;
		}
		.right {
			right: 23%;
		}
		.day__count {
			padding: 0 20%;
			color: #80bf95;
			background: #3c4650;
			margin-left: 15%;
			border-top-right-radius: 5px;
			border-bottom-right-radius: 5px;
		}
	}
	@media only screen and (max-width: 560px) {
		.day__countDiv {
			font-size: smaller;
		}
		.right {
			right: 38% !important;
		}
	}
	@media only screen and (max-width: 330px) {
		.right {
			right: 42% !important;
		}
	}
	
</style>
