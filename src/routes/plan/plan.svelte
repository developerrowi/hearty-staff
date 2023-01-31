<script>
	import World from '$svgComponents/world.svelte';
	import router from 'page';
	import { toast } from '$lib/toast-helper';
	import supabase from '$lib/supabase';
	import { authUser, isProtectedRoute, isFromItineraryRoute, isBarsActive } from '$lib/store';
	import { onMount } from 'svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import Calender from '$components/calender.svelte';
	import User from '$svgComponents/icons/user.svelte';

	onMount(() => {
		isProtectedRoute.set(true);
		if (!$authUser) router.redirect('/');
	});
	const formObj = {
		trip_name: '',
		start_date: '',
		trip_duration: null,
		start_city: null,
		end_city: null
	};
	async function goToPictureView() {
		router.redirect('/picture-view');
	}

	async function openPlanjourney() {
		router.redirect('/');
		isBarsActive.update(() => true);
	}

	async function handleSubmit() {
		if (!formObj.trip_name || !formObj.start_date || !formObj.trip_duration) {
			toast.warn('enter all the details');
			return;
		}
		const { data, error } = await supabase.from('itineraries').insert([{ ...formObj }]);
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
		if (data) {
			toast.success('create Itinerary successfully');
			$isFromItineraryRoute ? openPlanjourney() : goToPictureView();
		}
	}
	const planCalOptions = {
		enableTime: false,
		dateFormat: 'd/m/Y',
		locale: {
			firstDayOfWeek: 1
		},
		element: '#cal-start-plan'
	};

	const endPlanCalOptions = {
		...planCalOptions,
		element: '#cal-end-plan'
	};

	function handleChange(event, type) {
		const formatedDate = event?.detail?.formatedDate;
		if (type === 'startDate') {
			formObj.start_date = formatedDate;
		}
		if (type === 'endDate') {
			formObj.end_date = formatedDate;
		}
	}
</script>

{#if $authUser}
	<span
		class="profile  mx-5 cursor-pointer"
		title="Profile"
		on:click|preventDefault={() => router.redirect('/profile')}
	>
		<User />
	</span>
{/if}
<div class="home-root flex-1 flex flex-col mt-8 items-center justify-between">
	<div class="text-cener text-orange uppercase text-3xl">Let's Plan</div>
	<div class="mb-20 w-full relative">
		<div
			class="absolute lg:shadow-sm sm:w-full mx-auto inset-x-0 bg-color-plan rounded-2xl py-8 px-4 md:mt-20 lg:mt-0 lg:pt-20"
		>
			<div
				class="plan-root flex-1 flex flex-col justify-center space-y-3 sm:max-w-xl md:px-4 justify-between md:m-auto lg:m-auto"
			>
				<input
					class="roundinp tripinput mb-4"
					type="text"
					id="trip-name"
					name="trip-name"
					bind:value={formObj.trip_name}
					placeholder="trip name"
					required
				/>
				<div class="flex flex-row">
					<Calender
						calOptions={planCalOptions}
						classname="pickrstyle rounded-right"
						name="start_date"
						placeholder="Departure"
						on:formatedDate={(event) => handleChange(event, 'startDate')}
					/>
				<input type="number"
				class="pickrstyle rounded-left"
				id="trip-duration"
				name="trip-duration"
				bind:value={formObj.trip_duration}
				placeholder="trip duration"
				required
				>
				</div>
				<input
					class="roundinp"
					type="text"
					id="arrive-city"
					name="arrive-city"
					bind:value={formObj.start_city}
					placeholder="Arrive to specific city"
				/>
				<input
					class="roundinp"
					type="text"
					id="departure-city"
					name="departure-city"
					bind:value={formObj.end_city}
					placeholder="Departure to specific city"
				/>
			</div>
		</div>
		<World class="plan" />
	</div>
	<div class="w-full relative">
		<div
			class="text-right absolute bottom-32 right-0 custom-color-cyan uppercase text-xl cursor-pointer"
			on:click|preventDefault={handleSubmit}
		>
			{$isFromItineraryRoute ? "Let's Plan" : 'add'}
		</div>
		<BottomMenu />
	</div>
</div>

<style>

	/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
