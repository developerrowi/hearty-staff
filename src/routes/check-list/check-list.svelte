<script>
	import { authUser } from '$lib/store';
	import router from 'page';
	import User from '$svgComponents/icons/user.svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import { onMount } from 'svelte';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import { Navigation, EffectCoverflow, Mousewheel } from 'swiper';
	import AddIcon from '$svgComponents/icons/add.svelte';
	import { clickOutside } from '$lib/clickOutside';
	import { toast } from '$lib/toast-helper';
	import supabase from '$lib/supabase';
	import { swipe } from 'svelte-gestures';
	import CloseIcon from '$svgComponents/icons/close.svelte';
	import Balloon from '$svgComponents/balloon.svelte';

	// Import Swiper styles
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import 'swiper/css/scrollbar';
	//variables for getting the data from url
	let params;
	let parent_id = '';
	let showsubtrip = false;
	let subname = '';
	let subtripId = '';
	let closeItem = false;
	//scree width
	let width;
	// function to show checklist items after clicking on the trip
	async function showsub(item) {
		showsubtrip = true;

		subtripId = item.id;
		subname = item.name;
		await getChecklistItems();
	}
	let sub_subname = [];
	onMount(async () => {
		width = screen.width;
		let url = new URL(window.location.toString());
		params = url.searchParams.get('name');
		parent_id = url.searchParams.get('id');
		console.log(params);
		await getSubChecklist();
		await getChecklistItems();
	});
	//close the new checklist input
	let isShowInput = false;
	function closeShowInput() {
		isShowInput = false;
	}

	// get sub checklist Api
	let subchecklist = [];
	let subCheckListAndItems = [];
	async function getSubChecklist() {
		let { data, error } = await supabase.from('checklists').select('*').eq('parent_id', parent_id);
		if (error) {
			toast.error(error.message);
		}
		if (data) {
			subchecklist = data;
			await getAllChecklistItems();
		}
	}

	// add sub checklist Api
	let name = '';
	//if enter key is pressed
	const createChecklistOnEnter = (event) => {
		if (event.key === 'Enter') {
			createNewchecklist();
		}
	};
	//create new checklist
	const createNewchecklist = async (event) => {
		if (!name) {
			toast.warn('enter all the details');
			return;
		}
		const { data, error } = await supabase
			.from('checklists')
			.insert([{ name: name, parent_id: parent_id }]);

		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
		if (data) {
			toast.success('create Sub-checklist successfully');
			name = '';
			isShowInput = false;
			await getSubChecklist();
		}
	};

	//get all checklist items
	async function getAllChecklistItems() {
		for (let i = 0; i < subchecklist.length; i++) {
			let { data, error } = await supabase
				.from('checklists_items')
				.select('*')
				.eq('checklists_id', subchecklist[i].id);
			if (error) {
				toast.error(error.message);
			}
			if (data) {
				subchecklist[i]['items'] = data;
				if (i % 3 == 0) {
					subchecklist[i]['class'] = 'bg-blue';
				} else if (i % 3 == 1) {
					subchecklist[i]['class'] = 'bg-pink';
				} else {
					subchecklist[i]['class'] = 'bg-green';
				}
			}
		}
		subCheckListAndItems = subchecklist;
		console.log(subCheckListAndItems);
	}
	//add checklist item Api
	let checklistitemname;
	//if enter key is pressed
	const createChecklistItemOnEnter = (event) => {
		if (event.key === 'Enter') {
			createNewchecklistItem();
		}
	};
	//create new checklist item
	const createNewchecklistItem = async (event) => {
		if (!checklistitemname) {
			toast.warn('enter all the details');
			return;
		}
		const { data, error } = await supabase
			.from('checklists_items')
			.insert([{ name: checklistitemname, checklists_id: parent_id }]);

		if (error) {
			console.log(error);
			toast.error(error.message);
		}
		if (data) {
			toast.success('create checklist item successfully');
			checklistitemname = '';
			await getChecklistItems();
		}
	};
	//get checklist items Api
	let checklistitems = [];
	async function getChecklistItems() {
		let { data, error } = await supabase
			.from('checklists_items')
			.select('*')
			.eq('checklists_id', parent_id);
		if (error) {
			toast.error(error.message);
		}
		if (data) {
			checklistitems = data;
			checkedbox();
			console.log(checklistitems);
		}
	}

	//show delete checklist item button
	function handler(e) {
		if (width <= 500) {
			if (e.detail.direction == 'left') {
				e.path[1].querySelectorAll('.delete-btn').forEach((item) => {
					item.classList.remove('delete-btn');
				});
				e.path[1].querySelectorAll('.left-shift').forEach((item) => {
					item.classList.remove('left-shift');
				});
				e.target.querySelector('.close-button').classList.add('delete-btn');
				e.target.classList.add('left-shift');
			}
			if (e.detail.direction == 'right') {
				e.target.querySelector('.close-button').classList.remove('delete-btn');
				e.target.classList.remove('left-shift');
			}
		}
	}
	//Delete checklist item Api
	async function deleteChecklistItem(id) {
		const { data, error } = await supabase.from('checklists_items').delete().eq('id', id);
		if (error) {
			toast.error(error.message);
		}
		if (data) {
			toast.success('delete checklist item successfully');
			await getChecklistItems();
		}
	}
	let checked = false;
	// function to checked box
	async function checkedbox(e) {
		checked = e.target.classList.contains('checked');
		updateChecklistItem(e.target.id, checked);
	}
	//update checklist item checked at
	async function updateChecklistItem(id, checked) {
		let date = new Date();
		let checked_at;
		if (checked) checked_at = null;
		else {
			checked_at = date.toISOString();
		}

		const { data, error } = await supabase
			.from('checklists_items')
			.update({ checked_at: checked_at })
			.eq('id', id);
		if (error) {
			toast.error(error.message);
		}
		if (data) {
			toast.success('update checklist item successfully');
			await getChecklistItems();
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
<div class="trip">
	<div class="trip-name mt-10 text-3xl uppercase">
		<h1>{params} Trip</h1>
	</div>
	<!-- {#if showsubtrip}
<div class="sub">
<hr>
<h1 class="sub-name mt-5 text-xl uppercase">
	{subname}
</h1>
</div>
{/if} -->
	<div class="new-trip mt-2">
		<input class="check-inp" type="checkbox" />
		<input
			type="text"
			class="input-trip"
			bind:value={checklistitemname}
			on:keydown={createChecklistItemOnEnter}
		/>
		<button class="btn-trip shadow-lg" on:click={createNewchecklistItem}>ADD</button>
	</div>
	<div class="sub-trip mt-5">
		{#each checklistitems as item}
			<div
				class="light-orange-color sub-sub-item text-xl mt-2"
				onselectstart={() => {
					return false;
				}}
				use:swipe={{ timeframe: 300, minSwipeDistance: 20, touchAction: 'pan-y' }}
				on:swipe={handler}
			>
				<span
					><input
						class={item.checked_at ? 'checked' : 'check'}
						type="checkbox"
						on:click={checkedbox}
						id={item.id}
					/></span
				>
				<h3 style="pointer-events: none;" class={item.checked_at ? 'mx-2 cut-line' : 'mx-2'}>
					{item.name}
				</h3>
				<span class="close-button" on:click={deleteChecklistItem(item.id)}><CloseIcon /></span>
			</div>
		{/each}
	</div>
</div>

<div class="sub-checklists">
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
				slidesPerView: 2,
				spaceBetween: 20
			},
			350: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			500: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			600: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			765: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			900: {
				slidesPerView: 3,
				spaceBetween: 30
			},
			1090: {
				slidesPerView: 4,
				spaceBetween: 60
			}
		}}
		class="sub-checklists-slider"
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
					<div class="flex justify-center flex-col ">
						<p class="light-orange-color my-2"><AddIcon /></p>
						<h1>NEW</h1>
					</div>
				{:else}
					<div class="flex justify-center   ">
						<input
							class="trip-input light-orange-color "
							type="text"
							name="check-list"
							placeholder="Name"
							bind:value={name}
							on:keydown={createChecklistOnEnter}
							required
						/>
					</div>
				{/if}
			</div></SwiperSlide
		>
		{#each subCheckListAndItems as item}
			<SwiperSlide>
				<div
					class="trip-item px-2 py-5 {item.class}"
					on:click={() =>
						router.redirect(`/check-list-items?Parentname=${params}&name=${item.name}&id=${item.id}`)}
				>
					<h1 class="heading md:text-2xl text-xl" style="pointer-events: none;">{item.name}</h1>
					{#if item.items.length == 1}
						<div class="item text-xl mt-2">
							<span><input class="check" type="checkbox" /></span>
							<h3 style="pointer-events: none;">{item.items[0].name.substring(0, 8)}</h3>
						</div>
					{:else if item.items.length >= 2}
						<div class="item text-xl mt-2">
							<span><input class="check" type="checkbox" /></span>
							<h3 style="pointer-events: none;">{item.items[0].name.substring(0, 8)}</h3>
						</div>
						<div class="item text-xl mt-2">
							<span><input class="check" type="checkbox" /></span>
							<h3 style="pointer-events: none;">{item.items[1].name.substring(0, 8)}</h3>
						</div>
					{/if}
				</div>
			</SwiperSlide>
		{/each}
	</Swiper>
</div>
<div class="w-full">
	<BottomMenu />
</div>

<style global>
	/*profile icon css*/

	/*checklist and sub checklist css*/
	.item {
		display: flex;
		justify-content: space-evenly;
		width: 70%;
		align-items: center;
		flex-direction: row;
		pointer-events: none;
	}
	.trip {
		height: 50vh;
		align-self: center;
	}
	.trip-name {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #dca;
	}

	.trip-item {
		height: 100%;
		width: 100%;
		display: flex;

		align-items: center;
		border-radius: 25px;
		flex-direction: column;
	}
	/*checkbox css*/
	.check {
		color: #dca;
		height: 20px;
		width: 20px;
		border: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		border: #dca solid 2px;
		cursor: pointer;
		background-color: transparent;
	}
	.check::placeholder {
		color: transparent;
	}
	.checked {
		color: #dca;
		height: 20px;
		width: 20px;
		border: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		border: #dca solid 2px;
		cursor: pointer;
		background-color: red;
	}
	.checked:checked {
		background-color: red;
	}
	.checked::placeholder {
		color: red;
	}
	/*input for new checklist item css*/
	.check-inp {
		color: #dca;
		height: 20px;
		width: 20px;
		border: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		border: #dca solid 2px;
		cursor: pointer;
		position: absolute;
		z-index: 2;
		left: 2%;
		top: 25%;
	}
	.check-inp::placeholder {
		color: transparent;
	}
	.input-trip {
		width: 40vw;
		height: 30px;
		font-size: larger;
		border-radius: 5px;
		align-self: center;
		margin-top: 0 !important;
		background-color: #555154;
		position: relative;
		z-index: 1;
		text-align: center;
	}
	.sub-name {
		color: #dca;
		text-align: center;
	}

	.trip-input {
		width: 90%;
		color: #615b59;
	}
	.light-orange-color {
		color: #615b59;
	}
	.new-trip {
		display: flex !important;
		align-self: center;
		width: 50vw;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
		position: relative;
	}
	.input-trip::placeholder {
		color: #dca;
	}
	/*create new sub checklist css*/
	.trip-input {
		--inp-font: 1rem;
		font-size: var(--inp-font);
		letter-spacing: 0.1em;
		border: none;
		padding: 0.3em 0.8em;
		color: #e5c2a5;
	}

	.trip-input input::placeholder {
		color: #555154 !important;
	}
	.trip-input:focus {
		box-shadow: inset 0 0 0.1em black;
	}
	/*add btn css*/
	.btn-trip {
		background-color: #223;
		color: #80bf95;
		border-radius: 10px;
		height: 40px;
		width: 70px;
		box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.5);
	}
	.sub-checklists {
		align-self: center;
		margin-top: 40px;
	}
	/* swiper css*/
	.sub-checklists-slider {
		height: 170px;
		width: 70vw;
	}
	.sub-checklists-slider .swiper-slide {
		display: flex !important;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		background-color: #212a38;
		border-radius: 25px;
		color: #615b59;
		cursor: pointer;
	}
	/*background css for each slide*/
	.bg-blue {
		background-color: #96bcf9;
		color: white;
	}
	.sub-checklists-slider .bg-green {
		background-color: #c5febb;
		color: black;
	}
	.sub-checklists-slider .bg-pink {
		background-color: #f2bdbd;
		color: white;
	}
	.sub-checklists-slider .btn-blue {
		background-color: #96bcf9;
		color: white;
	}
	.sub-checklists-slider .btn-blue .check {
		border: white solid 2px;
	}
	.sub-checklists-slider .swiper-slide-active {
		padding: 0 !important;
	}
	.sub-checklists-slider .swiper-button-prev {
		color: #615b59;
		cursor: pointer;
	}
	.sub-checklists-slider .swiper-button-next {
		color: #90756b;
		cursor: pointer;
	}

	.light-orange-color {
		color: #896b61;
	}
	.sub-checklists-slider .swiper-button-prev {
		position: fixed;
		top: 80vh;
		left: 8%;
		width: 20px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.737' height='30.266' viewBox='0 0 32.737 30.266'%3E%3Cg id='Group_2208' data-name='Group 2208' transform='matrix(-1, -0.017, 0.017, -1, 3573.403, 1399.636)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.sub-checklists-slider .swiper-button-next {
		position: fixed;
		top: 80vh;
		right: 8%;
		width: 20px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.224' height='29.708' viewBox='0 0 32.224 29.708'%3E%3Cg id='Group_2207' data-name='Group 2207' transform='translate(-3564.544 -1307.359)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.sub-checklists-slider .swiper-button-next::after {
		display: none;
	}
	.sub-checklists-slider .swiper-button-prev::after {
		display: none;
	}
	/* checklist items css*/
	.sub-trip {
		overflow-y: auto;
		height: 32vh;
	}
	.sub-trip::-webkit-scrollbar {
		display: none;
	}
	.sub-sub-item:hover {
		padding-left: 15px;
		transition: padding-left 0.2s ease-in-out;
	}
	.sub-sub-item {
		display: flex;

		align-items: center;
		flex-direction: row;
		cursor: pointer;
		padding-left: 50px;
	}
	.cut-line {
		text-decoration: line-through red;
	}
	.close-button {
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		background-color: #151e28;
		display: none;
	}
	.sub-sub-item:hover .close-button {
		display: flex;
	}
	@media screen and (max-width: 800px) {
		.item {
			width: 100%;
		}
		.new-trip {
			width: 80vw;
		}
		.input-trip {
			width: 60vw;
		}
		.sub-checklists-slider {
			width: 75vw;
		}
		.sub-checklists-slider .swiper-button-next {
			right: 5%;
		}
		.sub-checklists-slider .swiper-button-prev {
			left: 5%;
		}
	}
	@media screen and (max-width: 500px) {
		.item {
			width: 100%;
		}
		.sub-trip {
			height: 28vh;
		}
		.sub-checklists-slider .swiper-button-next {
			right: 0%;
			width: 20px;
		}
		.sub-checklists-slider .swiper-button-prev {
			width: 20px;
			left: 0;
		}
		.sub-checklists {
			height: 170px;
			margin-top: 20px;
		}
		.sub-checklists-slider {
			width: 85vw;
		}
		.sub-sub-item:hover .close-button {
			display: none;
		}
		.sub-sub-item:hover {
			padding-left: 50px;
		}
		.delete-btn {
			display: flex;
		}
		.left-shift {
			padding-left: 15px;
		}
	}
</style>
