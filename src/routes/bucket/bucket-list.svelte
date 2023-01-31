<script>
	import router from 'page';
	import { toast } from '$lib/toast-helper';
	import supabase from '$lib/supabase';
	import { authUser, isProtectedRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import AddIcon from '$svgComponents/icons/add.svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import Balloon from '$svgComponents/balloon.svelte';
	import BucketItem from '$components/bucketItem.svelte';
	import Filter from '$components/bucketfilter.svelte';
	import User from '$svgComponents/icons/user.svelte';
	//import SearchBar from '../$components/shared/SearchBar.svelte';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import { Navigation, EffectCoverflow, Mousewheel } from 'swiper';
	import SvgClose from '$svgComponents/icons/close.svelte';
	import { BUCKET_LISTS } from '$lib/constant';
	import { clickOutside } from '$lib/clickOutside';
	import SearchIcon from '$svgComponents/icons/search.svelte';
	import { t } from '$translations/i18n';

	// Import Swiper styles
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import 'swiper/css/scrollbar';
	onMount(() => {
		isProtectedRoute.set(true);
		if (!$authUser) router.redirect('/');
		let url = new URL(window.location.toString());
		activeFilter = url.searchParams.get('bucket');
		bucketAPI();
		getBucketlist();
	});
	function handleClickOutside() {
		isShowInput = false;
	}
	let images = [];
	let bucketlists = [];
	let name = '';
	let isShowInput = false;
	let buckets = [];
	let bucketArr = [];
	let activeFilter = '';	
	let refresh = false;
	let setitem = false;
	function getimages(e) {
		images = e.detail;
		setitem = true;
		console.log(e.detail);
		updateimg();
	}
	function updateimg() {
		for (let i = 0; i < images.length; i++) {
			if (i % 5 == 0) images[i].push('wd-4 hg-3');
			if (i % 5 == 1) images[i].push('wd-2 hg-2');
			if (i % 5 == 2) images[i].push('wd-1 hg-3');
			if (i % 5 == 3) images[i].push('wd-1 hg-1');
			if (i % 5 == 4) images[i].push('wd-3 hg-2');
		}
		console.log(images);
	}
	let isactive = '';
	let filterbucketArr = bucketArr;

	let bucketInputText;
	const filterBuckets = () => {
		filterbucketArr = bucketArr.filter((buck) =>
			buck[0].toUpperCase().includes(bucketInputText.toUpperCase())
		);
	};
	//bucket_lists API
	async function bucketAPI() {
		let { data: bucketData, error } = await supabase.from('bucket_lists').select('*');

		for (let i = 0; i < bucketData.length; i++) {
			let pair = [];
			pair[0] = bucketData[i].name;
			pair[1] = bucketData[i].id;
			buckets.push(pair);
			bucketArr = buckets;
		}
		if (bucketArr[0]&&!activeFilter) {
			isactive = bucketArr[0][1];
			bucketArr[0].push('active');
		}
		else if(activeFilter)
		{
			isactive = activeFilter;
			bucketArr.find((buck) => buck[1] == activeFilter).push('active');
		}
		filterbucketArr = bucketArr;
		if (filterbucketArr[0]&&!activeFilter) {
			isactive = filterbucketArr[0][1];
			filterbucketArr[0].push('active');
		}
		else if(activeFilter)
		{
			isactive = activeFilter;
			filterbucketArr.find((buck) => buck[1] == activeFilter).push('active');
		}
	}
	async function getBucketlist() {
		let { data, error } = await supabase.from(BUCKET_LISTS).select('*');
		if (error) {
			toast.error(error.message);
			return;
		}
		if (data) {
			bucketlists = data;
			if (bucketlists.length == 0) {
				router.redirect('/bucket');
				toast.error('no buckets available. Create one first');
			}
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
	function closeShowInput() {
		isShowInput = false;
	}
	//show delete modal for itineraries menu
	let isShowDeleteModal = false;
	let bucketId = '';
	function showDelete(e) {
		isShowDeleteModal = e.detail;
	}
	//delete bucket list API
	async function deleteBucketList(id) {
		const { data, error } = await supabase.from(BUCKET_LISTS).delete().match({ id: id });
		if (error) {
			toast.error(error.message);
			return;
		}
		if (data) {
			toast.success('delete Bucket successfully');
			buckets = [];
			bucketArr = [];
			filterbucketArr = [];
			isactive = '';
			refresh = true;
			bucketAPI();
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
<div class=" flex-1 flex flex-col justify-around">
	<div class="flex flex-col  justify-around ">
		<div class="items-center flex flex-col  justify-around mt-3 md:mt-0 ">
			<p class=" text-center text-orange uppercase md:text-3xl text-xl lg:max-w-xl">bucket list</p>
		</div>
		<div class="text-center search">
			<div class="search-bar">
				<label class="relative block">
					<span class="sr-only">Search</span>
					<span class="absolute inset-y-0 left-100 flex items-center pl-2 light-orange-color">
						<SearchIcon />
					</span>
					<input
						class="placeholder:italic placeholder:text-slate-400 block w-full py-2 pl-9 pr-3 search-filed light-orange-color"
						placeholder='{$t("globals.search")}'
						type="text"
						name="search"
						bind:value={bucketInputText}
						on:input={filterBuckets}
					/>
				</label>
			</div>
		</div>

		<Swiper
			modules={[Navigation, Mousewheel]}
			navigation={true}
			mousewheel={true}
			observeParents={true}
			observer={true}
			autoplay={false}
			loop={false}
			breakpoints={{
				0: {
					slidesPerView: 3,
					spaceBetween: 20
				},
				350: {
					slidesPerView: 3,
					spaceBetween: 20
				},
				500: {
					slidesPerView: 5,
					spaceBetween: 20
				},
				600: {
					slidesPerView: 6,
					spaceBetween: 20
				},
				765: {
					slidesPerView: 4,
					spaceBetween: 5
				},
				900: {
					slidesPerView: 6.5,
					spaceBetween: 10
				},
				1090: {
					slidesPerView: 8,
					spaceBetween: 0
				}
			}}
			class="bucket-list-slider"
		>
			<SwiperSlide>
				<div
					class={isShowInput
						? 'text-center rounded-lg new-itinerary-box px-3 ml-10 md:ml-0 py-3 md:px-7 md:py-5 flex flex-col items-center justify-center'
						: 'text-center rounded-lg new-itinerary-box px-5 py-3 md:px-7 md:py-5 flex flex-col items-center justify-center'}
					on:click={() => (isShowInput = true)}
					use:clickOutside
					on:click_outside={closeShowInput}
				>
					{#if !isShowInput}
						<div class="flex justify-center ">
							<span class="light-orange-color"><AddIcon /></span>
						</div>
					{:else}
						<div class="flex justify-center w-full  ">
							<input
								class="inp bucket-input light-orange-color "
								type="text"
								id="bucket-name"
								name="bucket-name"
								placeholder="Name"
								bind:value={name}
								on:keydown={createBucketOnEnter}
								required
							/>
						</div>
					{/if}
				</div></SwiperSlide
			>
			{#each filterbucketArr as bucket}
				<SwiperSlide>
					<Filter
						{bucket}
						{refresh}
						{isactive}
						on:images={getimages}
						on:showdelete={showDelete}
						on:bucketId={(e) => (bucketId = e.detail)}
					/>
				</SwiperSlide>
			{/each}
		</Swiper>
	</div>
	{#if setitem}
		{#if images.length != 0}
			<BucketItem
				{images}
				on:refresh={(e) => {
					(refresh = e.detail[0]), (isactive = e.detail[1]);
				}}
			/>
		{:else}
			<div class="no-image">
				<span class="light-orange-color">No Images </span>
				<button
					class="bg-green text-back-color  py-2 rounded-md"
					on:click={(e) => {
						e.preventDefault();
						router.redirect('/picture-view');
					}}>Add Images</button
				>
			</div>
		{/if}
	{/if}

	<div class="w-full">
		<div
			class="text-right absolute bottom-0 left-8 custom-color-cyan uppercase text-xl cursor-pointer md:block hidden"
		>
			<Balloon />
		</div>
		<BottomMenu />
	</div>
</div>
<!-- Delete modal component -->
<div
	class={isShowDeleteModal
		? 'modal-I fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20 open-I'
		: 'modal-I fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20'}
>
	<div class=" close-modal " on:click={() => (isShowDeleteModal = false)}><SvgClose /></div>
	<div class="max-w-md mx-auto my-48 bg-darkslategray py-10 px-5 rounded-md space-y-5">
		<p class="light-orange-color">
			Would you like to delete this bucket list or add it to an itinerary?
		</p>
		<div class="space-x-4 flex items-center justify-evenly">
			<button
				class="bg-green text-back-color w-full py-2 rounded-md"
				on:click={() => {
					isShowDeleteModal = false;
					deleteBucketList(bucketId);
				}}>DELETE</button
			>
			<button
				class="bg-green text-back-color w-full py-2 rounded-md"
				on:click={() => router.redirect(`/add-itinerary?id=${bucketId}&ref=your bucketlist`)}>ADD</button
			>
		</div>
	</div>
</div>

<style global>
	.no-image {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.no-image button {
		margin-top: 20px;
		width: 30%;
	}
	.bucket-input {
		color: #615b59;
		max-width: 8rem;
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
	div.active-bucket {
		background: var(--secondary);
	}

	.search-bar {
		margin-top: 10px !important;
		margin-bottom: 0 !important;
	}
	.search-filed {
		border-radius: 30px;
		background-color: #1f2a39;
	}

	.light-orange-color {
		color: #615b59;
	}
	.modal-bucket {
		margin: 0;
		padding: 0;
		position: fixed;
		top: 10%;
		left: 30%;
		width: 40%;
		height: 40%;
		background-color: #1f2a39;
		z-index: 1000;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: column;
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.5s ease, visibility 0.5s ease, transform 0.5s ease-in-out;
		transform: scale(0);
		overflow: hidden;
		border-radius: 25px;
	}
	.open-bucket {
		visibility: visible;
		opacity: 1;
		transform: scale(1);
		overflow: hidden;
	}
	.close {
		position: fixed;
		top: 0%;
		right: 0%;
		height: 50px;
		width: 50px;
		border-radius: 50%;
		background-color: rgb(82, 77, 77);
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		z-index: 999;
	}
	.modal {
		position: fixed;
		top: 0;
		left: 0;
	}
	.modal-copy {
		position: fixed;
		top: 30%;
		left: 30%;
	}

	/* Delete modal css */
	.modal-I {
		margin: 0;
		padding: 0;
		background-color: rgba(0, 0, 0, 0.9);
		z-index: 999;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: column;
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.5s ease, visibility 0.5s ease, transform 0.5s ease-in-out;
		transform: scale(0);
		overflow: hidden;
	}
	.open-I {
		visibility: visible;
		transition: opacity 0.5s ease, visibility 0.5s ease, transform 0.5s ease-in-out;
		opacity: 1;
		transform: scale(1);
		overflow: hidden;
	}
	/*close modal css*/
	.close-modal {
		position: absolute;
		top: 0%;
		right: 0%;
		height: 50px;
		width: 50px;
		border-radius: 50%;
		background-color: #234;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		z-index: 1000;
	}
	.bg-blur {
		position: fixed;
		top: 0;
		left: 0;
	}

	.new-itinerary-box {
		background-color: #1f2a39;
	}
	.search {
		display: block;
		text-align: center;
		height: 50px;
		width: 50vw;
		align-self: center;
	}
	.bucket-list-slider {
		height: 100px;
		width: 100vw;
		padding-left: 10px;
		padding-right: 30px;
		margin-top: 20px;
	}
	.bucket-list-slider .swiper-slide {
		display: flex !important;
		justify-content: center;
		align-items: center;
	}
	.bucket-list-slider .swiper-slide-active {
		padding: 0 !important;
		margin: 0 !important;
	}
	.bucket-list-slider .swiper-button-prev {
		color: #615b59;
		cursor: pointer;
		position: absolute;
	}
	.bucket-list-slider .swiper-button-next {
		color: #90756b;
		cursor: pointer;
		position: absolute;
		right: 0;
		margin-right: 0;
	}

	.light-orange-color {
		color: #896b61;
	}
	.bucket-list-slider .swiper-button-prev {
		top: 50%;
		width: 50px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.737' height='30.266' viewBox='0 0 32.737 30.266'%3E%3Cg id='Group_2208' data-name='Group 2208' transform='matrix(-1, -0.017, 0.017, -1, 3573.403, 1399.636)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.bucket-list-slider .swiper-button-next {
		top: 50%;
		width: 50px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.224' height='29.708' viewBox='0 0 32.224 29.708'%3E%3Cg id='Group_2207' data-name='Group 2207' transform='translate(-3564.544 -1307.359)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.bucket-list-slider .swiper-button-next::after {
		display: none;
	}
	.bucket-list-slider .swiper-button-prev::after {
		display: none;
	}
	@media (max-width: 768px) {
		.bucket-input {
			color: #615b59;
			max-width: 6rem;
		}
		.bucket-list-slider {
			height: 15vh;
		}
		.modal-bucket {
			height: 50%;
			width: 70%;
			left: 15%;
		}
		.bucket-list-slider .swiper-button-next {
			display: none;
		}
		.bucket-list-slider .swiper-button-prev {
			display: none;
		}
		.search {
			height: 40px;
		}
	}
</style>
