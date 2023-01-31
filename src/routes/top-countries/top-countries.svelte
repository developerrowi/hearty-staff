<script>
	import BottomMenu from '$components/bottom-menu.svelte';
	import WorldMap from '$components/top-countries-map.svelte';
	import { isProtectedRoute, authUser, filterStore,isBarsActive } from '$lib/store';
	import { onMount } from 'svelte';
	import router from 'page';
	import User from '$svgComponents/icons/user.svelte';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import { Navigation, EffectCoverflow, Mousewheel } from 'swiper';
	import supabase from '$lib/supabase';
	import DownIcon from '$svgComponents/icons/svgdownicon.svelte';
	import { swipe } from 'svelte-gestures';
	import { clickOutside } from '$lib/clickOutside';
	// Import Swiper styles
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import 'swiper/css/scrollbar';
	import { color } from 'd3';
	import { toast } from '$lib/toast-helper';
	onMount(async () => {
		// isProtectedRoute.set(true);
		// if (!$authUser) router.redirect('/');
		// console.log(authUser);
		isBarsActive.set(false);
		TopcountriesApi();
		getAllImages();
	});

	console.log($authUser);
	//get top countries var
	let topCountries = [];
	//top countries Api
	async function TopcountriesApi() {
		const { data, error } = await supabase.from('countries').select('*').eq('is_top', true);
		if (error) {
			console.log(error);
		} else {
			topCountries = data;
			console.log(topCountries);
		}
	}
	//select country Function
	let clicked = false;
	function selectCountry(e) {
		let current = e.path[2].querySelector('.clicked');
		let arrow = e.path[2].querySelector('.arr-show');

		if (current) {
			current.className = current.className.replace('clicked', '');
			arrow.className = arrow.className.replace('arr-show', '');
			e.target.classList.add('clicked');
			e.target.querySelector('.arr-down').classList.add('arr-show');
			clicked = true;
		} else {
			e.target.classList.add('clicked');
			e.target.querySelector('.arr-down').classList.add('arr-show');
			clicked = true;
		}
	}
	//check if clicked country is in top countries
	function istopCountry(country) {
		for (let i = 0; i < topCountries.length; i++) {
			if (country === topCountries[i].name) {
				showCountryDetails(topCountries[i]);
				clicked = true;
				let el = document.getElementById(`${topCountries[i].id}`);
				el.classList.add('clicked');
				el.children[0].classList.add('arr-show');
			}
		}
	}
	//show country details
	let lang = '';
	let capital = '';
	let religion = '';
	let Id = '';
	function showCountryDetails(item) {
		numberOfImages = 0;
		Id = item.id;
		capital = item.capital;
		lang = item.language;
		religion = item.religion;
		getNumberOfImages();
	}
	//get All images
	let images = [];
	let numberOfImages = 0;
	async function getAllImages() {
		const { data, error } = await supabase.from('places').select('*');
		if (error) {
			console.log(error);
		} else {
			images = data;
		}
	}
	//get number of images for each country
	function getNumberOfImages() {
		let count = 0;
		images.forEach((item) => {
			if (item.countries_id == Id) {
				count++;
			}
		});
		numberOfImages = count;
	}

	//add country to plan
	//selected countries
	let selectedCountries = [];
	function planCountry() {
		let alreadySelected = document.getElementById(`${Id}`).classList.contains('selected');
		if (!alreadySelected) {
			document.getElementById(`${Id}`).classList.add('selected');
			topCountries.forEach((item) => {
				if (item.id == Id) {
					selectedCountries.push(item);
				}
			});
			console.log(selectedCountries);
		}
	}
	//apply filters
	function applyFilters() {
		if (selectedCountries.length > 0) {
			filterStore.set(selectedCountries);
			router.redirect('/picture-view');
		} else {
			toast.error('Please select at least one country');
		}
	}
	//swipe down to close country details
	function handler(e) {
		if (e.detail.direction == 'bottom') {
			let current = document.querySelector('.clicked');
			let arrow = document.querySelector('.arr-show');
			current.className = current.className.replace('clicked', '');
			arrow.className = arrow.className.replace('arr-show', '');
			clicked = false;
		}
	}
</script>

<div class="home-root flex-1 flex flex-col mt-20">
	{#if $authUser}
		<span
			class="profile  mx-5 cursor-pointer"
			title="Profile"
			on:click|preventDefault={() => router.redirect('/profile')}
		>
			<User />
		</span>
	{/if}

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
				slidesPerView: 2.2,
				spaceBetween: 30
			},
			500: {
				slidesPerView: 4,
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
				slidesPerView: 5,
				spaceBetween: 10
			},
			1090: {
				slidesPerView: 6,
				spaceBetween: 0
			}
		}}
		class="top-countries-swiper"
	>
		{#each topCountries as country}
			<SwiperSlide>
				<div
					class="country text-center rounded-lg shadow-xl mx-2 px-4 md:px-5  flex items-center justify-center "
					id={country.id}
					on:click={(e) => {
						selectCountry(e);
						showCountryDetails(country);
					}}
				>
					{country.name}
					<div class="arr-down" />
				</div>
			</SwiperSlide>
		{/each}
	</Swiper>
	<div
		use:clickOutside
		on:click_outside={() => {
			clicked = false;
			let current = document.querySelector('.clicked');
			let arrow = document.querySelector('.arr-show');
			current.className = current.className.replace('clicked', '');
			arrow.className = arrow.className.replace('arr-show', '');
		}}
	>
		<!-- country details modal -->
		<div
			class={clicked ? 'modal-det show shadow-xl text-center' : 'modal-det shadow-lg'}
			onselectstart={() => {
				return false;
			}}
			use:swipe={{ timeframe: 300, minSwipeDistance: 20, touchAction: 'pan-x' }}
			on:swipe={handler}
		>
			<div>
				<img
					class="modal-img"
					src="https://th.bing.com/th/id/OIP.tOnQyCdKsO8xHBtsy-yYCQHaFj?w=271&h=203&c=7&r=0&o=5&dpr=1.3&pid=1.7"
					alt=""
				/>
			</div>
			<div class="pic"><span class="data">{numberOfImages} Pics</span> For this country</div>
			<div class="lang">Language Spoken: <span class="data">{lang}</span></div>
			<div class="rel">Religion: <span class="data">{religion}</span></div>
			<div class="cap">Country Capital: <span class="data">{capital}</span></div>
		</div>
		<div class={clicked ? 'btn btn-show' : 'btn'} on:click={planCountry}>Select Country</div>

		<div class={clicked ? 'plan-btn show-plan' : 'plan-btn'} on:click={applyFilters}>
			Let's Plan
		</div>
	</div>

	<!-- country map -->
	{#if topCountries.length > 0}
		<WorldMap
			{topCountries}
			on:viewcountry={(e) => {
				istopCountry(e.detail);
			}}
		/>
	{/if}
	<BottomMenu />
</div>

<style>
	/*country name css*/
	.country {
		background-color: #212a38 !important;
		height: 75% !important;
		width: max-content !important;
		color: #2f3d44 !important;
		cursor: pointer !important;
	}
	.clicked {
		color: #bdf5c7;
	}
	.selected {
		background-color: #f4dede;
		color: black;
	}
	.arr-down {
		display: none !important;
		position: absolute !important;
		left: 45% !important;
		top: -2% !important;
		z-index: 1000 !important;
		content: '' !important;
		border: 10px solid transparent !important;
		border-top-color: #bdf5c7 !important;
		z-index: 999 !important;
	}
	.arr-show {
		display: block !important;
	}
	/*country details modal css*/
	.modal-det {
		position: fixed;
		top: 35%;
		left: 30%;
		width: 45%;
		height: 30%;
		background-color: rgb(28, 36, 48, 0.6);
		z-index: 999;
		display: none;
		text-align: center;
	}
	.btn {
		position: fixed;
		top: 70%;
		left: 30%;
		width: 45%;
		height: 5%;
		color: black;
		background-color: #c5ffbb;
		z-index: 999;
		display: none;
		text-align: center;
		cursor: pointer;
		border-radius: 12px;
	}
	.btn-show {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.show {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: #fff;
		font-family: 'Times New Roman', Times, serif;
	}
	.data {
		color: #bdf5c7;
	}
	/*modal img css*/
	.modal-img {
		width: 80px;
		height: 80px;
		border-radius: 100%;
	}
	/* swiper css*/
	.top-countries-swiper {
		height: 75px;
		width: 80vw;
		align-self: center;
		margin-top: 0 !important;
		padding: 0 !important;
		margin-bottom: 0;
		margin-left: 0;
		margin-right: 0;
	}
	.top-countries-swiper .swiper-slide {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.top-countries-swiper .swiper-slide-active {
		padding: 0 !important;
		margin: 0 !important;
	}
	.top-countries-swiper .swiper-button-prev {
		color: #615b59;
		cursor: pointer;
		position: absolute;
	}
	.top-countries-swiper .swiper-button-next {
		color: #90756b;
		cursor: pointer;
		position: absolute;
		right: 0;
		margin-right: 0;
	}

	.top-countries-swiper .swiper-button-prev {
		position: fixed;
		top: 27%;
		left: 8%;
		width: 20px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.737' height='30.266' viewBox='0 0 32.737 30.266'%3E%3Cg id='Group_2208' data-name='Group 2208' transform='matrix(-1, -0.017, 0.017, -1, 3573.403, 1399.636)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.top-countries-swiper .swiper-button-next {
		position: fixed;
		top: 27%;
		right: 8%;
		width: 20px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.224' height='29.708' viewBox='0 0 32.224 29.708'%3E%3Cg id='Group_2207' data-name='Group 2207' transform='translate(-3564.544 -1307.359)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.top-countries-swiper .swiper-button-next::after {
		display: none;
	}
	.top-countries-swiper .swiper-button-prev::after {
		display: none;
	}
	/*plan btn css*/
	.plan-btn {
		position: fixed;
		top: 80%;
		left: 45%;
		width: 15%;
		height: 5%;
		color: black;
		background-color: #c5ffbb;
		z-index: 999;
		display: none;
		text-align: center;
		cursor: pointer;
		border-radius: 12px;
	}
	.show-plan {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	@media screen and (max-width: 500px) {
		.top-countries-swiper .swiper-button-next {
			right: 0%;
			top: 30%;
			width: 20px;
		}
		.top-countries-swiper .swiper-button-prev {
			width: 20px;
			left: 0;
			top: 30%;
		}
		.top-countries-swiper {
			width: 85vw;
		}
		.country {
			height: 75%;
		}
		.modal-det {
			left: 10%;
			width: 80%;
		}
		.btn-show {
			left: 10%;
			width: 80%;
		}
		.plan-btn {
			left: 30%;
			width: 40%;
		}
	}
</style>
