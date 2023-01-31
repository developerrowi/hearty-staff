<script>
	import router from 'page';
	import { toast } from '$lib/toast-helper';
	import supabase from '$lib/supabase';
	import { authUser, isProtectedRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import AddIcon from '$svgComponents/icons/add.svelte'
	import BottomMenu from '$components/bottom-menu.svelte'
	import Balloon from '$svgComponents/balloon.svelte'
	import { BUCKET_LISTS } from '$lib/constant';

	onMount(() => {
		isProtectedRoute.set(true);
		if (!$authUser) router.redirect('/');
		getBucketlist();
	});
	let bucketlists = [];
	let isShowInput = false;
	let name = '';
	async function getBucketlist() {
		let { data, error } = await supabase.from(BUCKET_LISTS).select('*');
		if (error) {
			toast.error(error.message);
			return;
		}
		if (data) {
			bucketlists = data;
		}
	}

	const createBucketOnEnter = (event) => {
		if (event.key === 'Enter') {
			createNewBucket();
		}
	};

	const createNewBucket = async (event) => {
		if (!name) {
			toast.warn('enter all the details');
			return;
		}
		const { data, error } = await supabase.from(BUCKET_LISTS).insert([{ name: name }]);

		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
		if (data) {
			toast.success('create Bucket successfully');
			name = '';
			isShowInput = false;
			router.redirect('/picture-view');
		}
	};
</script>

<div class="home-root flex-1 flex flex-col mt-8 items-center justify-between">
	<div class="flex flex-col flex-row justify-around md:items-center">
		<div class="mb-20 mt-10" />
		<p class="text-center text-orange uppercase text-3xl lg:max-w-xl">bucket list</p>
		<div class="flex justify-around mt-10">
			<div
				class="text-center rounded-lg new-itinerary-box px-8 py-4"
				on:click={() => (isShowInput = true)}
			>
				{#if !isShowInput}
					<div class="flex justify-center mb-3">
						<span class="light-orange-color"><AddIcon size="36" /></span>
					</div>
					<div class="text-lg light-orange-color uppercase tracking-widest">Create New</div>
				{:else}
					<input
						class="inp bucket-input light-orange-color"
						type="text"
						id="bucket-name"
						name="bucket-name"
						placeholder="Name"
						bind:value={name}
						on:keydown={createBucketOnEnter}
						required
					/>
				{/if}
			</div>
		</div>
	</div>
	<div
		class="text-right creatext absolute top-2/4 right-1/4 custom-color-cyan uppercase text-xl cursor-pointer"
		on:click|preventDefault={createNewBucket}
	>
		Create
	</div>
	<div class="w-full relative">
		<div
			class="text-right absolute bottom-28 right-10 custom-color-cyan uppercase text-xl cursor-pointer"
		>
			<Balloon />
		</div>
		<BottomMenu />
	</div>
</div>

<style>
	.new-itinerary-box {
		background-color: #1f2a39;
	}
	.light-orange-color {
		color: #615b59;
	}

	.bucket-input {
		color: #615b59;
		max-width: 10rem;
	}
	div:focus,
	.bucket-input:focus {
		outline: 0;
	}
	input.bucket-input {
		--inp-font: 1rem;
		font-size: var(--inp-font);
		letter-spacing: 0.1em;
		border: none;
		padding: 0.3em 0.8em;
		color: #e5c2a5;
	}

	input.bucket-input::placeholder {
		color: #555154;
	}
	.bucket-input:focus {
		box-shadow: inset 0 0 0.1em black;
	}

	@media only screen and (max-width: 750px) {
		.creatext {
			left: 70vw;
			top: 60vh;
		}
	}
</style>
