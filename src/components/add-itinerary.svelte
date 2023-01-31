<script>
	import { toast } from '$lib/toast-helper';
	import supabase from '$lib/supabase';
	import DeleteIcon from '$svgComponents/icons/delete.svelte';
	import { getItineraryList } from '$lib/services/itineraryServices';
	import { itineraries } from '$stores/itineraryStore';
	import router from 'page';

	export let itinerary;
	export let bucketId;
	const updateItineraries = async () => {
		let { data, error } = await getItineraryList();
		if (error) {
			toast.error(error.message);
			return;
		}
		if (data) {
			itineraries.set(data);
		}
	};

	const deleteItinerary = async (id) => {
		const { data, error } = await supabase
			.from('itineraries')
			.update({ status: false })
			.eq('id', id);
		if (error) {
			toast.error(error.message);
			return;
		}
		if (data) {
			toast.success('Deteted itinerary successfully');
			updateItineraries();
		}
	};
	//update bucketlist itinerary API
	const updateBucketItineraryApi = async (id) => {
		const { data, error } = await supabase
			.from('bucket_lists')
			.update({ trip_plans_id: id })
			.eq('id', bucketId);
		if (error) {
			toast.error(error.message);
			return;
		}
		if (data) {
			toast.success('Added itinerary to bucketlist successfully');
			router.redirect('/bucket-list');
		}
	};
</script>

<div
	class="text-center rounded-lg bg-color iti shadow-xl"
	on:click={updateBucketItineraryApi(itinerary.id)}
>
	<p class="text-center text-orange uppercase text-lg lg:max-w-xl tracking-widest ">
		{itinerary.trip_name}
	</p>
	<div class="flex justify-end">
		<span class="cursor-pointer text-orange" on:click={deleteItinerary(itinerary.id)}
			><DeleteIcon /></span
		>
	</div>
</div>

<style>
	.bg-color {
		background-color: #1f2a39;
	}
	.iti {
		height: max-content;
		padding: 20px 30px 20px 30px;
		cursor: pointer;
	}
</style>
