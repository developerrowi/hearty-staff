<script>
	import { onDestroy, onMount } from 'svelte';
	import { filterStore } from '$lib/store';
	import supabase from '$lib/supabase';
	import { createEventDispatcher } from 'svelte';
	import Intinerary from '$svgComponents/icons/itinerary.svelte';

	let selected = false;
	let showdelete = false;
	export let isactive;
	export let refresh;

	const dispatch = createEventDispatcher();
	export let bucket;
	onMount(() => {
		bucket_id = isactive;
		Bucket_imagesAPI();

		console.log(bucket);
	});
	$: {
		console.log(refresh);
		console.log(isactive);
		if (refresh) {
			bucket_id = isactive;
			Bucket_imagesAPI();
		}
	}

	function btnblue(e) {
		let current = e.path[3].querySelector('.btn-blue');
		let menu = e.path[3].querySelector('.show-btn');
		if (current) {
			current.className = current.className.replace('btn-blue', '');
			e.target.classList.add('btn-blue');
			bucket_id = e.target.id;
			Bucket_imagesAPI();
		} else {
			e.target.classList.add('btn-blue');
			bucket_id = e.target.id;
			Bucket_imagesAPI();
		}

		if (menu) {
			menu.className = menu.className.replace('show-btn', '');
			e.target.parentElement.querySelector('.menu-btn').classList.add('show-btn');
		} else {
			e.target.parentElement.querySelector('.menu-btn').classList.add('show-btn');
		}
	}

	let images;

	let bucket_id;
	let appliedFilters = [];
	let bucketsdata = [];
	const unsub = filterStore.subscribe((data) => (appliedFilters = data));

	onDestroy(() => unsub());
	//bucket_lists API
	async function Bucket_imagesAPI() {
		let { data, error } = await supabase
			.from('bucket_list_images')
			.select('*')
			.eq('bucket_lists_id', bucket_id);
		if (data) {
			bucketsdata = data;
			console.log(bucketsdata);
			PicturesAPI();
		}
	}
	//Places API
	async function PicturesAPI() {
		images = [];
		// for(let i=0;i<bucketsdata.length;i++){
		// 	let { data, error } = await supabase.from('places').select('*').eq('id',bucketsdata[i].places_id)
		// 	if (data) {
		// 		images.push(data);

		// images[i].push(bucketsdata[i].id)
		// 	}
		// }
		let { data: pics, error } = await supabase.from('places').select('*');

		for (let j = 0; j < bucketsdata.length; j++) {
			for (let i = 0; i < pics.length; i++) {
				if (bucketsdata[j].places_id == pics[i].id) {
					let pair = [];
					pair[0] = pics[i].image_url;
					pair[1] = pics[i].name;
					pair[2] = pics[i].id;
					pair[3] = pics[i].description;
					pair[4] = pics[i].countries_id;
					pair[5] = bucketsdata[j].id;
					pair[6] = bucketsdata[j].bucket_lists_id;
					images = [...images, pair];
				}
			}
		}

		dispatch('images', images);
	}
</script>

<div
	class="text-center rounded-lg btn  flex items-center justify-center new-itinerary-box light-orange-color "
>
	<div
		class={bucket[2]
			? 'flex justify-center rounded-lg filter-n btn-blue uppercase px-3 py-3 md:px-5 md:py-5'
			: 'flex justify-center filter-n uppercase px-3 py-3 md:px-5 md:py-5 rounded-lg'}
		id={bucket[1]}
		on:click={btnblue}
	>
		{bucket[0]}
	</div>
	<div
		class={bucket[2] ? 'menu-btn show-btn' : 'menu-btn'}
		on:click={() => {
			showdelete = true;
			dispatch('showdelete', showdelete);
			dispatch('bucketId', bucket[1]);
		}}
	>
		<Intinerary />
	</div>
</div>

<style>
	.new-itinerary-box {
		position: relative;
		background-color: #1f2a39;
		cursor: pointer;
	}

	.light-orange-color {
		color: #615b59;
	}
	.btn-blue {
		background-color: #c5e1f7;
		color: black;
	}
	.menu-btn {
		position: absolute;
		right: -10%;
		top: -20%;
		height: 30px;
		width: 30px;
		background-color: #dca;
		border-radius: 100%;
		display: none;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.filter-n {
		height: 100%;
		width: 100%;
	}
	.show-btn {
		display: flex;
	}
	@media screen and (max-width: 500px) {
		.menu-btn {
			right: -15%;
			top: -22%;
		}
	}
</style>
