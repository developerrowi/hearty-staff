<script>
	//Import Components
	import { fade } from 'svelte/transition';
	import { Navigation, EffectCoverflow } from 'swiper';
	import supabase from '$lib/supabase';
	import { onDestroy, onMount } from 'svelte';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import { swipe } from 'svelte-gestures';
	import { isBarsActive, isModalOpen, filterStore } from '$lib/store';
	import router from 'page';
	import { toast } from '$lib/toast-helper';
	// Import Swiper styles
	import 'swiper/css/effect-coverflow';
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import 'swiper/css/scrollbar';

	// Import svg
	import Beads from '$svgComponents/icons/beads.svelte';
	import ViewMap from '$svgComponents/icons/viewmap.svelte';
	import ViewMapMobile from '$svgComponents/icons/viewmapMobile.svelte';
	import BeadsMobile from '$svgComponents/icons/beads-mobile.svelte';
	import TotalcountryBrowser from '$svgComponents/icons/totalcountryBrowser.svelte';
	import BottombarBrowser from '$svgComponents/icons/bottombarBrowser.svelte';

	import Svgg1Browser from '$svgComponents/icons/svgg1browser.svelte';
	import Svgg2Browser from '$svgComponents/icons/svgg2browser.svelte';
	import Svgg3Browser from '$svgComponents/icons/svgg3browser.svelte';
	import SvgThreedotBrowser from '$svgComponents/icons/svgThreedotbrowser.svelte';
	import Svgg5Browser from '$svgComponents/icons/svgg5browser.svelte';

	import SvgaddBrowser from '$svgComponents/icons/svgaddbrowser.svelte';
	import SvgIthreedotBrowser from '$svgComponents/icons/svgIthreedotbrowser.svelte';

	import SvgGo from '$svgComponents/icons/svggo.svelte';
	import SvgDownIcon from '$svgComponents/icons/svgdownicon.svelte';
	import SvgSearchIcon from '$svgComponents/icons/svgsearchIcon.svelte';
	import SvgAttachIcon from '$svgComponents/icons/svgsttachicon.svelte';

	import PicInfoBrowser from '$svgComponents/icons/picInfoBrowser.svelte';
	import UserInfoGreen from '$svgComponents/icons/userInfoGreen.svelte';
	import BucketGreenBrowser from '$svgComponents/icons/bucketGreenBrowser.svelte';
	import AddIcon from '$svgComponents/icons/add.svelte';
	import ViewmapMobile from '$svgComponents/icons/viewmapMobile.svelte';
	import Viewmap from '$svgComponents/icons/viewmap.svelte';
	import { t } from '$translations/i18n';


	let showInput = false;
	let appliedFilters = [];

	const unsub = filterStore.subscribe((data) => (appliedFilters = data));

	onDestroy(() => unsub());

	$: {
		appliedFilters;
		PicturesAPI();
	}
	let images,
		buckets = [],
		bucketArr = [],
		bucketFilteredList = [],
		Waiting = 0,
		pictureView = 0,
		picInfo = false;

	let index = 0;
	let countryArr = [];
	let countryCount = 0;

	onMount(() => isBarsActive.set(false));

	// first screen api
	onMount(async () => {
		await PicturesAPI();
		await bucketAPI();
		window.onpopstate = function (event) {
			let url = new URL(window.location.toString());
			let params = url.searchParams.get('mode');
			if (params == 'true') {
				activeimg.classList.add('picture-mode');
				clicked = true;
			} else {
				clicked = false;
				activeimg.classList.remove('picture-mode');
			}
		};
	});

	onMount(() => {
		clicked = false;
		replaceStateWithQuery({ mode: 'false' });
	});
	//Places API
	async function PicturesAPI() {
		Waiting = 0;

		let { data: pics, error } = await supabase.from('places').select('*');

		images = [];

		for (let i = 0; i < pics.length; i++) {
			if (appliedFilters.length > 0) {
				if (
					appliedFilters.find((p) => p?.name.toUpperCase() === pics[i].name.toUpperCase()) ||
					appliedFilters.find((p) => p?.id === pics[i].countries_id)
				) {
					let pair = [];
					pair[0] = pics[i].image_url;
					pair[1] = pics[i].name;
					pair[2] = pics[i].id;
					pair[3] = pics[i].description;
					pair[4] = pics[i].countries_id;
					countryArr.push(pics[i].countries_id);
					images = [...images, pair];
				}
			} else {
				let pair = [];
				pair[0] = pics[i].image_url;
				pair[1] = pics[i].name;
				pair[2] = pics[i].id;
				pair[3] = pics[i].description;
				pair[4] = pics[i].countries_id;
				countryArr.push(pics[i].countries_id);
				images = [...images, pair];
			}
		}
		console.log(countryArr);
		countryCount = new Set(countryArr).size;
		console.log(countryCount);
		// console.log(images)

		Waiting = 1;
		width = screen.width;
		if (width < 700) displayImage = 1;
		else displayImage = 3;
	}
	let isactive = false;
	const onProgress = (e) => {
		const progress = e.detail;
		setTimeout(() => {
			index = progress[0].activeIndex - 3;
			if (index < 0) index = images.length - 1;
			if (index >= images.length) index = 0;
		}, 0);
	};

	//bucket_lists API
	async function bucketAPI() {
		let { data: bucketData, error } = await supabase.from('bucket_lists').select('*');
		if (bucketData.length == 0) {
			const { data, error } = await supabase
				.from('bucket_lists')
				.insert([{ name: 'General Bucket List' }]);

			if (error) {
				console.log(error);
				toast.error(error.message);
				return;
			}
			if (data) {
				toast.success('create Bucket successfully');
				bucketAPI();
			}
		} else {
			for (let i = 0; i < bucketData.length; i++) {
				let pair = [];
				pair[0] = bucketData[i].name;
				pair[1] = bucketData[i].id;
				buckets.push(pair);
				bucketArr = buckets;
				bucketFilteredList = bucketArr;
			}
			selectedBucket = bucketArr[0][0];
		}
	}
	let newbucket = '';
	//add bucket on enter
	function addBucketOnEnter(e) {
		if (e.key == 'Enter') {
			addBucketApi();
		}
	}
	//add bucket api
	async function addBucketApi() {
		if (newbucket == '') {
			toast.error('Please enter bucket name');
			return;
		}
		const { data, error } = await supabase.from('bucket_lists').insert([{ name: newbucket }]);
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
		if (data) {
			toast.success('create Bucket successfully');
			newbucket = '';
			bucketAPI();
		}
	}

	// screen width
	let width = 0;
	let screen = { width: null };
	onMount(() => {
		screen = { width: window.innerWidth };
		width = screen.width;
	});

	// No. of images to display on screen
	export let displayImage;
	let zoom = 0;
	//icons of Frist view Screen
	function pictureViewClick() {
		isBarsActive.set(false);

		width = screen.width;
		itin = 0;
		pictureView = 0;
		userInfo = false;
		picInfo = false;
		bucketList = false;
		clicked = !clicked;
		setUrl(clicked);
		if (clicked) {
			activeimg.classList.add('picture-mode');
		} else {
			activeimg.classList.remove('picture-mode');
		}
	}

	//onClick Frist Screen View
	function firstScreenClick() {
		width = screen.width;
		pictureView = 1;
	}

	// show user info
	let userInfo = false;
	const showUserInfo = () => {
		userInfo = !userInfo;
	};

	// Show Pic info
	const showPicInfo = () => {
		picInfo = !picInfo;
	};

	//itinerary Select
	let inputText;
	let displayOptions = false;
	let countries = [];

	let filteredList = countries;
	let selectedCountry = 'Select Itinerary';
	let selectedCountry_id = 0;

	const filterCountries = () => {
		filteredList = countries.filter((country) =>
			country[0].toUpperCase().includes(inputText.toUpperCase())
		);
	};
	let activeimg;
	// itineraries menu api data
	onMount(() => {
		ItineraryApi();
		activeimg = document.getElementsByClassName('swiper-slide-active');
	});

	// itineraries API
	async function ItineraryApi() {
		let { data: trips, error } = await supabase.from('itineraries').select('*');

		// console.log("kkk",trips.length);
		for (let i = 0; i < trips.length; i++) {
			if (trips[i].status == true) {
				let touple = [];
				touple[0] = trips[i].trip_name;
				touple[1] = trips[i].id;
				countries.push(touple);
			}
		}
		// console.log("komal",countries);
	}

	let bucketInputText;
	let bucketDisplayOptions = false;

	let selectedBucket;
	let selectedBucket_id = 0;

	const filterBuckets = () => {
		bucketFilteredList = bucketArr.filter((buck) =>
			buck[0].toUpperCase().includes(bucketInputText.toUpperCase())
		);
	};

	// show bucket list
	let bucketList = false;
	const showBucketList = () => {
		bucketList = !bucketList;
	};

	// bucket_list_images API push
	async function bucket_list_images(img) {
		if (selectedBucket_id != 0) {
			bucketList = false;
			added = true;
			setTimeout(() => {
				added = false;
			}, 2000);
			const { data, error } = await supabase
				.from('bucket_list_images')
				.insert([{ bucket_lists_id: selectedBucket_id, places_id: img[2] }]);
		}
	}

	// Itinerary-Screen
	let itin = 0;
	function Iitinerary() {
		itin = 0;
	}
	function itinerary() {
		itin = 1;
	}

	let added = false;
	let clicked = false;
	export const replaceStateWithQuery = (values) => {
		const url = new URL(window.location.toString());
		for (let [k, v] of Object.entries(values)) {
			if (v == 'true') {
				url.searchParams.set(k, v);
				history.pushState(null, null, url);
			} else if (v == 'false') url.searchParams.delete(k);
		}

		history.replaceState({}, '', url);
	};
	const setUrl = (clicked) => {
		if (clicked) {
			replaceStateWithQuery({ mode: 'true' });
		}
		if (clicked === false) {
			replaceStateWithQuery({
				mode: 'false'
			});
		}
	};

	// itinerary API push
	async function Itinerary_stop(img) {
		if (selectedCountry_id != 0) {
			itin = 0;
			added = true;
			setTimeout(() => {
				added = false;
			}, 2000);
			const { data, error } = await supabase
				.from('itinerary_stops')
				.insert([{ itineraries_id: selectedCountry_id, places_id: img[2] }]);
		}
	}

	//Swipe down event to back to picture browsing first screnn
	let direction;

	function handler(event) {
		direction = event.detail.direction;
		if (direction == 'bottom') {
			pictureView = 0;
			width = screen.width;

			itin = 0;
			userInfo = false;
			picInfo = false;
			bucketList = false;
		}
	}
</script>

{#if Waiting === 1}
	<div
		onselectstart={() => {
			return false;
		}}
		use:swipe={{ timeframe: 300, minSwipeDistance: 100, touchAction: 'pan-x' }}
		on:swipe={handler}
	>
		{#if displayImage === 3}
			<div
				on:click={() => {
					isModalOpen.update(() => true);
				}}
				class="cursor-pointer"
			>
				<Beads />
			</div>
		{:else}
			<div
				on:click={() => {
					isModalOpen.update(() => true);
				}}
				class={clicked ? 'filter-mobile' : 'cursor-pointer'}
			>
				<BeadsMobile />
			</div>
		{/if}

		{#if width > 700}
			<div class="shadow-lg pic__countDiv">
				<p style="color:#f2d0b8">PICS</p>
				<p class="pic__count">
					{images.length < 9 ? `0${images.length}` : images.length}
				</p>
			</div>
		{/if}
		<Viewmap />

		{#if width > 700}
			<TotalcountryBrowser {countryCount} />
		{/if}

		{#if width > 700}
			{#if added == true}
				<div class="centered__add-browser" transition:fade={{ duration: 1000 }}>ADDED</div>
			{/if}
		{/if}
		<Swiper
			on:swiper={(e) => {
				console.log(e.detail[0]);
			}}
			effect="coverflow"
			coverflowEffect={{
				rotate: 0,
				stretch: 0,
				depth: 0,
				modifier: 1,
				slideShadows: true
			}}
			spaceBetween={30}
			speed={500}
			shortSwipes={width > 700 ? false : true}
			grabCursor={true}
			slidesPerView={displayImage}
			centeredSlides={true}
			loop={true}
			modules={[Navigation, EffectCoverflow]}
			navigation={true}
			allowSlideNext={width < 500 ? !clicked : true}
			allowSlidePrev={width < 500 ? !clicked : true}
			allowTouchMove={width < 500 ? !clicked : true}
			breakpoints={{
				0: {
					slidesPerView: 1,
					centeredSlides: true
				},
				768: {
					centeredSlides: true
				},
				1024: {
					centeredSlides: true,
					allowSlideNext: true,
					allowSlidePrev: true
				},
				1280: {
					centeredSlides: true,
					allowSlideNext: true,
					allowSlidePrev: true
				}
			}}
			class="pic_swiper"
			on:slideChange={(e) => {
				// console.log(images);
				isBarsActive.set(false);
			}}
			on:slideChangeTransitionEnd={(e) => {
				activeimg = e.detail[0].slides[e.detail[0].activeIndex];
				if (clicked) {
					activeimg.classList.add('picture-mode');
				} else {
					activeimg.classList.remove('picture-mode');
				}
			}}
			on:progress={onProgress}
			on:touchEnd={(e) => {
				activeimg = e.detail[0].slides[e.detail[0].activeIndex];
				if (clicked) {
					activeimg.classList.add('picture-mode');
				} else {
					activeimg.classList.remove('picture-mode');
				}
			}}
		>
			{#each images as image, i}
				<SwiperSlide>
					<img src={image[0]} on:click={pictureViewClick} alt="Yaabin" />
					{#if clicked}
						{#if itin == 0 && !picInfo && !userInfo && !bucketList}
							<div class={added === true ? 'dark' : ''} />
							<div class="svggbrowser">
								<span on:click={showUserInfo}>
									<Svgg1Browser />
								</span>
								<span on:click={showPicInfo}>
									<Svgg2Browser />
								</span>
								<span on:click={() => router.redirect('/plan')}>
									<Svgg3Browser />
								</span>
								<span on:click={itinerary}>
									<SvgThreedotBrowser />
								</span>
								<span on:click={showBucketList}>
									<Svgg5Browser />
								</span>
							</div>
						{:else if itin == 1}
							<div class="browser-svg-itnerary">
								<div class="browser-svg-menu">
									<div class="dropdown" on:click={() => (displayOptions = !displayOptions)}>
										<div class="country__title">
											{selectedCountry}
										</div>
										<SvgDownIcon />
									</div>
									<div class={displayOptions ? 'open__selectBox show' : 'open__selectBox'}>
										<div class="search__box">
											<SvgSearchIcon />
											<input
												type="text"
												placeholder='{$t("globals.search")}'
												bind:value={inputText}
												on:input={filterCountries}
											/>
										</div>
										<div class="results">
											{#each filteredList as country}
												<div class="items">
													<p
														on:click={() => {
															selectedCountry = country[0];
															selectedCountry_id = country[1];
															displayOptions = false;
														}}
													>
														<SvgAttachIcon />
														{country[0]}
													</p>
												</div>
											{:else}
												<p style="font-size: 10px; margin-left: 5px;">No results</p>
											{/each}
										</div>
									</div>
								</div>
								<span on:click={() => Itinerary_stop(image)}>
									<SvgaddBrowser />
								</span>
								<span on:click={Iitinerary}>
									<SvgIthreedotBrowser />
								</span>
							</div>
						{:else if picInfo}
							<div class="picInfo__container">
								<h3 class="pic__title">Pic info</h3>
								<p>
									{image[3]}
								</p>
								<span on:click={showPicInfo}>
									<PicInfoBrowser />
								</span>
							</div>
						{:else if userInfo}
							<div class="userInfo__container">
								<div class="who__userTitle">
									<p>Who uploaded this photo?</p>
								</div>
								<div class="userData__container">
									<div class="user__btn">
										<span on:click={showUserInfo}>
											<UserInfoGreen />
										</span>
									</div>
									<div class="user__right">
										<h4>Admin</h4>
										<div class="date__time">
											<p>2020-11-16</p>
											<p>19:32:45</p>
										</div>
										<p>Greece</p>
									</div>
								</div>
							</div>
						{:else if bucketList}
							<div class="browser-svg-itnerary">
								<div class="browser-svg-menu">
									<div
										class="dropdown"
										on:click={() => (bucketDisplayOptions = !bucketDisplayOptions)}
									>
										<div class="country__title">
											{selectedBucket}
										</div>
										<SvgDownIcon />
									</div>
									<div class={bucketDisplayOptions ? 'open__selectBox show' : 'open__selectBox'}>
										<div class="search__box">
											<SvgSearchIcon />
											<input
												type="text"
												placeholder='{$t("globals.search")}'
												bind:value={bucketInputText}
												on:input={filterBuckets}
											/>
										</div>
										<div class="results">
											{#each bucketFilteredList as eachBucket}
												<div class="items">
													<p
														on:click={() => {
															selectedBucket = eachBucket[0];
															selectedBucket_id = eachBucket[1];
															bucketDisplayOptions = false;
														}}
													>
														<SvgAttachIcon />
														{eachBucket[0]}
													</p>
												</div>
											{:else}
												<p style="font-size: 10px; margin-left: 5px;">No results</p>
											{/each}
										</div>
										<div class="add-inp">
											<input type="text" placeholder="Add new bucket" bind:value={newbucket} />
										</div>
										<div class="add-i" on:click={addBucketApi}><AddIcon /></div>
									</div>
								</div>
								<span on:click={() => bucket_list_images(image)}>
									<SvgaddBrowser />
								</span>
								<span on:click={showBucketList} class="bucketGreen">
									<BucketGreenBrowser />
								</span>
							</div>
						{/if}
						<BottombarBrowser />
						<p class="country-name-browser">{image[1]}</p>
					{/if}
				</SwiperSlide>
			{/each}
		</Swiper>
		{#if width < 700}
			{#if !clicked}
				<BottomMenu />
			{/if}
		{:else}
			<BottomMenu />
		{/if}
	</div>
{/if}

<style>
	.bucketGreen {
		position: absolute;
		top: 6.5vh;
		left: 56vw;
	}
	.user__btn {
		margin-right: 10px;
	}

	.who__userTitle {
		width: 48%;
		background: rgba(32, 47, 64, 0.65);
		margin-top: 1vh;
	}
	.who__userTitle p {
		z-index: 100;
		font-size: 7px;
		background: rgba(32, 47, 64, 1);
		text-transform: uppercase;
		padding: 2px 10px;
	}
	.userData__container {
		width: 20vw;
		margin: 0 auto;
		background: rgba(32, 47, 64, 1);
		font-size: 7px;
		padding: 2px 15px;
		display: flex;
	}
	.user__right h4 {
		font-size: 10px;
	}
	.date__time {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.date__time > p:first-child {
		position: absolute;
		right: 2vw;
	}
	.pic__title {
		margin: 1vw;
		font-size: 1.3vw;
		text-transform: uppercase;
	}
	.pic__countDiv-sm {
		/* margin-top: 12.3%;
		margin-left: 21%; */
		top: 5.5vh;
		left: 16vw;
		display: flex;
		position: absolute;
		width: 8%;
		border-radius: 5px;
	}
	.pic__count-sm {
		padding: 0 20%;
		color: #80bf95;
		background: #3c4650;
		margin-left: 15%;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
	.pic__countDiv {
		margin-top: 1.3%;
		margin-left: 23%;
		display: flex;
		width: 8%;
		border-radius: 5px;
	}
	.pic__count {
		padding: 0 15%;
		color: #80bf95;
		background: #3c4650;
		margin-left: 11%;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	html {
		scroll-behavior: smooth;
		overflow-x: hidden;
	}
	html::-webkit-scrollbar,
	body::-webkit-scrollbar {
		width: 0px;
		background-color: #1d2531;
	}
	html::-webkit-scrollbar-thumb,
	body::-webkit-scrollbar-thumb {
		background-color: #1d2531;
		width: 0px;
	}
	::-webkit-scrollbar {
		width: 4px;
		background-color: #1d2531;
	}
	::-webkit-scrollbar-thumb {
		background-color: rgb(88, 88, 88);
		width: 4px;
	}

	.centered__add {
		text-align: center;
		color: #f2d0b8;
		font-size: 9vw;
		position: absolute;
		top: 35vw;
		font-family: Arciform;
	}
	.centered__add-browser {
		margin-left: 45vw;
		text-align: center;
		color: #f2d0b8;
		font-size: 3.5vw;
		position: absolute;
		top: 28.3vh;
		font-family: Arciform;
		z-index: 100 !important;
	}

	.dropdown {
		width: 10vw;
		background: #1d2531;
		border-radius: 0.5vw;
		color: #f2e8da;
		text-align: center;
		font-size: 0.7vw;
		font-family: Arciform;
		letter-spacing: 0.5px;
		display: flex;
		justify-content: space-between;
		padding: 4px;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
		z-index: 1 !important;
	}

	.country__title {
		width: 100%;
		display: grid;
		place-items: center;
	}

	.open__selectBox {
		display: none;
		margin-top: -4vh;
		width: 10vw !important;
		background: #1d2531;
		border-radius: 0.5vw;
		color: #f2e8da;
	}
	.search__box {
		width: 8vw !important;
		background: rgb(88, 88, 88);
		border-radius: 0.5vw;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 4vh 0.8vw;
		padding: 0px 0px 0px;
		margin-bottom: 0px;
	}
	.search__box input {
		background: rgb(88, 88, 88);
		outline: none;
		border: 0;
		margin-left: 2vw;
		color: white;
		border-radius: 0.2vw;
		font-size: 0.6vw;
	}

	.results {
		padding: 7px 0;
		width: 100%;

		background: #1d2531;
		color: #dcc;
		border-radius: 5px;
		overflow-y: scroll;
		height: 9vh;
	}
	.invisible-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.items {
		display: inline;
		width: 100%;
		padding: 0 0px;
		border-radius: 20px;
		font-size: 10px;
	}
	.items p {
		padding: 0;
	}
	.items p:hover {
		background-color: #c5ffbb;
		color: #dacdbb;
		border-radius: 10px;
	}
	.add-i {
		position: absolute;
		bottom: 0;
		right: 0;
	}
	.add-inp {
		display: flex;

		padding: 0 0px;
		border-radius: 20px;
		font-size: 10px;
	}

	.add-inp input {
		background: rgb(88, 88, 88);
		outline: none;
		border: 0;
		border-radius: 20px;
		text-align: center;
	}
	.show {
		display: block;
	}

	.browser-svg-menu,
	.pic__menu {
		z-index: 1 !important;
		position: absolute;
		top: 0.5vh;
		left: 42vw;
	}

	.svgmenu {
		position: absolute;
		top: 3vh;
		left: 13vw;
	}

	.items-mobile {
		display: inline;
		width: 50%;
		padding: 0 0px;
		border-radius: 20px;
		font-size: 2.8vw;
	}
	.show-mobile {
		display: block;
	}

	.picInfo__container {
		position: absolute;
		width: 90%;
		margin: 0 auto;
		top: 5vh;
		height: 80%;
		background: rgba(32, 47, 64, 0.65);
	}

	.picInfo__container p {
		font-size: 0.5vw;
		margin-left: 0.7vw;
	}

	main {
		font-family: sans-serif;
		text-align: center;
	}

	div.pics {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.dark {
		position: absolute;
		width: 100vw;
		top: 0vh;
		height: 80vh;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 20%, rgba(0, 0, 0, 0.45) 20%);
	}
	/* SVG CSS */
	.svgg {
		z-index: 100;
		width: 100vw;
		height: 10vh;
		position: absolute;
		bottom: 17.5vh;
		left: 0vw;
		display: inline;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.3) 20%);
	}
	.browser-svg-itnerary {
		z-index: 100 !important;
		position: absolute;
		width: 100vw;
		bottom: 5vh;
		height: 18vh;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.3) 20%);
	}

	.svggItinerary {
		position: absolute;
		width: 100vw;
		top: 38.5vh;
		height: 22vh;
		/* left: 15vw; */
		/* display: inline; */
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.3) 20%);
	}
	.filter-mobile {
		display: none;
	}
	.svggbrowser {
		position: absolute;
		bottom: 5vh;
		display: inline;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 20%);
	}

	.userInfo__container {
		padding-top: 10px;
		position: absolute;
		width: 100%;
		margin: 0 auto;
		bottom: 5vh;
		height: 30%;
		background: rgba(32, 47, 64, 0.65);
	}

	.country-name {
		position: absolute;
		bottom: 10vh;
		left: auto;
		color: #f2e8da;
		font-size: 6vw;
	}

	.country-name-browser {
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 0;
		height: 5vh;
		left: auto;
		color: #f2e8da;
	}

	/* Swiper CSS */
	.pic_swiper {
		transform: scale(1.1) !important;
	}

	.pic_swiper .swiper-slide {
		background-color: rgba(255, 0, 0, 0.25);
		margin-top: 13.5vh;
		margin-bottom: 13.5vh;
		height: 40.5vh !important;
		display: flex !important;
		background: transparent !important;
		align-items: center !important;
		justify-content: center !important;
		transition: all 200ms linear;
		transform: scale(1) !important;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
		filter: blur(2.5px);
	}

	.img1 {
		margin-bottom: 18vh !important;
		background-color: transparent;
		object-fit: cover;
		min-width: 100vw;
		max-height: 60.5vh !important;
		min-height: 60.5vh !important;
	}

	.img-moblie {
		margin-top: 7vh;
		height: 45vh;
		width: 100vh !important;
	}

	.pic_swiper .swiper-slide img {
		background-color: transparent;
		object-fit: cover;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.3) 20%);
		max-width: 100vw;
		max-height: 80.5vh;
		transform: scale(1) !important;
	}

	.pic_swiper .swiper-slide-active {
		margin-top: 13.5vh;
		z-index: 99 !important;
		transform: scale(1.2) !important;
		filter: blur(0px);
		transition: 200ms ease-in-out;
		/* margin-top: 18.5vh; */
	}
	.pic_swiper .picture-mode {
		transform: scale(1.5) !important;
		transition: 200ms ease-in-out !important;
	}

	.pic_swiper .swiper-slide-active1 {
		margin-top: 12.5vh;
		width: 81.5vw;
		height: 78vh;
		z-index: 99;
		transform: scale(1.7);
	}

	.pic_swiper .swiper-slide-browser-active {
		margin-top: 15.5vh;
		height: 55vh;
	}
	.pic_swiper .swiper-slide-next {
		margin-top: 13.5vh;
		transform: scale(1) !important;
		z-index: 95 !important;
	}

	.pic_swiper .swiper-slide-prev {
		margin-top: 13.5vh;
		transform: scale(1) !important;
		z-index: 95 !important;
	}

	.pic_swiper .swiper-button-prev {
		top: 56%;
		width: 50px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.737' height='30.266' viewBox='0 0 32.737 30.266'%3E%3Cg id='Group_2208' data-name='Group 2208' transform='matrix(-1, -0.017, 0.017, -1, 3573.403, 1399.636)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.pic_swiper .swiper-button-next {
		top: 56%;
		width: 50px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.224' height='29.708' viewBox='0 0 32.224 29.708'%3E%3Cg id='Group_2207' data-name='Group 2207' transform='translate(-3564.544 -1307.359)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}

	.pic_swiper .swiper-slide .picInfo__container {
		display: none;
	}
	.pic_swiper .swiper-slide-active .picInfo__container {
		display: block;
	}

	.pic_swiper .swiper-slide .browser-svg-itnerary {
		display: none;
	}
	.pic_swiper .swiper-slide-active .browser-svg-itnerary {
		display: block;
	}

	.pic_swiper .swiper-slide .userInfo__container {
		display: none;
	}
	.pic_swiper .swiper-slide-active .userInfo__container {
		display: block;
	}

	.pic_swiper .swiper-slide .svggbrowser {
		display: none;
	}
	.pic_swiper .swiper-slide-active .svggbrowser {
		display: block;
	}

	.pic_swiper .swiper-slide .country-name-browser {
		display: none;
	}
	.pic_swiper .swiper-slide-active .country-name-browser {
		display: flex !important;
	}

	.pic_swiper .swiper-button-next:after,
	.pic_swiper .swiper-button-prev:after {
		font-size: 0;
	}

	@media only screen and (max-width: 700px) {
		.pic_swiper {
			margin-top: 5vh;
		}
		.pic_swiper .swiper-slide {
			width: 80vw;
		}
		.pic_swiper .swiper-slide img {
			width: 78vw;
		}
		.pic_swiper .swiper-slide-active {
			transform: scale(1.2) !important;
			outline: none;
		}
		.pic_swiper .picture-mode {
			margin-top: 0vh;

			height: 78vh !important;
			z-index: 999 !important;
			transform: scale(1.16) !important;
			transition: all 100ms ease-in-out !important;
		}

		.pic_swiper .picture-mode .svggbrowser {
			bottom: 10vh;
			width: 100% !important;
		}
		.pic_swiper .picture-mode img {
			height: 78%;
			/* width:100%; */
		}

		.pic_swiper .picture-mode .country-name-browser {
			font-size: large;
			bottom: 4.9vh;
		}
		.pic_swiper .swiper-button-prev {
			display: none;
		}
		.pic_swiper .swiper-button-next {
			display: none;
		}
		.svggbrowser {
			text-align: center;
			width: 70vw !important;
		}

		.picInfo__container {
			width: 67vw;
			height: 48vh;
			top: 21vh;
		}
		.picInfo__container p {
			font-size: 10px;
			margin-left: 2vw;
		}

		.picInfo__container h3 {
			margin-left: 3vw;
			font-size: 25px;
		}
		.userInfo__container {
			width: 80vw;
			height: 23vh;
			bottom: 9vh;
		}
		.who__userTitle {
			width: 48%;
			background: rgba(32, 47, 64, 1);
			margin-top: 1vh;
			padding: 10px 20px;
		}
		.user__right {
			padding: 10px;
		}
		.userData__container {
			width: 100%;
		}
		.date__time {
			width: 300%;
		}
		.user__btn {
			/* margin-right: 10px; */
			margin-left: 20px;
			display: grid;
			place-items: center;
		}
		.bucketGreen {
			position: absolute;
			top: 12.5vh;
			left: 70vw;
		}
		.browser-svg-itnerary {
			position: absolute;
			width: 100vw;
			top: 39vh;
			height: 22vh;
			/* left: 15vw; */
			/* display: inline; */
			background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.3) 20%);
		}
		.browser-svg-menu,
		.pic__menu {
			position: absolute;
			top: 5vh;
			left: 13vw;
		}
		.dropdown {
			width: 40vw;
			background: #1d2531;
			border-radius: 5px;
			color: #f2e8da;
			text-align: center;
			font-size: 3vw;
			font-family: Arciform;
			letter-spacing: 0.5px;
			display: flex;
			justify-content: space-between;
			padding: 4px;
			box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
			z-index: 100;
		}
		.country-name-browser {
			bottom: 3vh !important;
			align-items: center !important;
		}
		.open__selectBox {
			/* display: none; */
			margin-top: -4vh;
			width: 40vw !important;
			margin-left: 0.3vw;
			background: #1d2531;
			border-radius: 2vw;
			color: #f2e8da;
		}
		.search__box {
			width: 35vw !important;
			background: rgb(88, 88, 88);
			border-radius: 5px;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 4vh 0.8vw;
			padding: 0px 0px 0px;
			margin-bottom: 0px;
		}
		.search__box input {
			background: rgb(88, 88, 88);
			outline: none;
			border: 0;
			margin-left: 3.2vw;
			color: white;
			border-radius: 5px;
			font-size: 3vw;
		}

		.results {
			padding: 7px 0;
			width: 40vw;
			background: #1d2531;
			color: #dcc;
			border-radius: 5px;
			overflow: scroll;
			height: 10vh;
		}
		.centered__add-browser {
			position: absolute;
			margin-left: 0 !important;
			top: 28.3vh;
			left: 35% !important;
			font-size: 40px;
			text-align: center !important;
		}
	}

	@media only screen and (min-width: 700px) {
		.pic_swiper {
			width: 60vw;
		}
	}
</style>
