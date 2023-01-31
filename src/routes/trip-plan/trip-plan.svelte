<script>
    import { onMount } from "svelte";
    import {authUser} from "$lib/store";
    import User from '$svgComponents/icons/user.svelte';
	import router from 'page';
    import BottomMenu from '$components/bottom-menu.svelte';
    import supabase from '$lib/supabase';
    import {filterStore, isModalOpen, isBarsActive , isTripModalOpen} from '$lib/store';
    import Beads from '$svgComponents/icons/beads.svelte';
    import PicCount from '$components/picCount.svelte';
    import TotalcountryBrowser from '$svgComponents/icons/totalcountryBrowser.svelte';
    import ViewMapIcon from '$svgComponents/icons/viewmap.svelte';
    import {onDestroy} from 'svelte';
	import ViewMap from "$components/trip-plan-map.svelte";
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import { Navigation, EffectCoverflow, Mousewheel, FreeMode } from 'swiper';
	import AddIcon from '$svgComponents/icons/add.svelte';
// Import Swiper styles
    import 'swiper/css/effect-coverflow';
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import 'swiper/css/scrollbar';
	import { toast} from "$lib/toast-helper";
	import ViewmapIcon from "$svgComponents/icons/viewmap.svelte";
	import Intinerary from "$svgComponents/icons/itinerary.svelte";
	import CheckListIcon from "$svgComponents/icons/check-list.svelte";
	import BucketListIcon from "$svgComponents/icons/bucket-list.svelte";
	import CloseIcon from "$svgComponents/icons/close.svelte";
	import DayCount from "$components/dayCount.svelte";
	import Modal from "$components/trip-plan-filters.svelte";
    //trip name from url
    let tripName = '';
	let tripId = ''; 
	let menuModalData = [];
	let buckets=false;
	let countryinfo = false;
	let covid = false;
	let modalCountries = [];
	let checklists=false;
	let showdatamodal=false;
	let width;
	let modalOpen = false;
	let refresh = false;
	 $:{
		if(refresh)
		{
		getItineraryPlaces().then(()=>{
			getPlaces().then(()=>{
					refresh = false;
				})
		});
		}
	}
    onMount(async () => {
    width = screen.width;
    let url = new URL(window.location.toString());
    tripName = url.searchParams.get('trip-name');
	tripId= url.searchParams.get('id');
	await getItinerary()
	await getBucketList();
	await getCheckList();
    });
    onMount(() => isTripModalOpen.subscribe((state) => (modalOpen = state)));
	let appliedFilters = [];
	let loading = true;
	const unsub = filterStore.subscribe((data) => (appliedFilters = data));
	onDestroy(() => unsub());

	$: {
		appliedFilters;
		getPlaces();
	}
	$:{itineraryPlaces&&createDays()}
	$:{dayCount&&createDays()}
	onMount(async () => {
		await getItineraryPlaces();
		await getCountries();
		await getPlaces();
		
		isBarsActive.set(false);
	});
	//get Itinerary
	let dayCount = 0;
	async function getItinerary(){
		let {data, error} = await supabase.from('itineraries').select('*').eq('id', tripId);
		if(data){
			dayCount = data[0].trip_duration;
		}

	}
	//get itinerary places
	let itineraryPlaces = [];
	async function getItineraryPlaces() {
		let { data, error } = await supabase.from('itinerary_stops').select('*').eq('itineraries_id', tripId);
		if (error) {
			console.log(error);
		} else {
			itineraryPlaces = data;
			console.log(itineraryPlaces);
		}
	}
	//get all places
	let places = [];
	let count=0;
	let countryArr = [];
	let countryCount = 0;
	async function getPlaces() {
		loading = true;
		let { data, error } = await supabase.from('places').select('*');
		if (error) {
			console.log(error);
		} else {

			places=[];
			countryArr = [];
			for(let j=0;j<itineraryPlaces.length;j++){
			for (let i = 0; i < data.length; i++) {
				if (data[i].id == itineraryPlaces[j].places_id) {
				if (appliedFilters.length > 0) {
					if (
						appliedFilters.find((p) => p?.name.toUpperCase() === data[i].name.toUpperCase()) ||
						appliedFilters.find((p) => p?.id === data[i].countries_id)
					) {
						places.push(data[i]);
						countryArr.push(data[i].countries_id);
					}
				} else {
					places.push(data[i]);
					countryArr.push(data[i].countries_id);
				}
			}
		}
	}
}
		//remove duplicate countries from array
		countryArr = countryArr.filter((item, index) => countryArr.indexOf(item) === index);
		//filter countries 
		modalCountries = countries.filter((item) => countryArr.includes(item.id));
	    console.log(modalCountries);
		countryCount = countryArr.length;
		count=places.length;
		createDays();
		loading = false;
	}
//get all countries
	let countries = [];
	async function getCountries() {
		loading = true;
		let { data, error } = await supabase.from('countries').select('*');

		if (error) {
			console.log(error);
		} else {
			countries = data;
			console.log(countries);
		}
		loading = false;
	}
//get all bucketlist
let bucketList = [];
async function getBucketList() {
	let {data, error} =await supabase.from('bucket_lists').select('*').eq('trip_plans_id', tripId);
	if (error) {
		console.log(error);
	} else {
		bucketList = data;
		console.log(bucketList);
	}
}
//get all checklist
let checkList = [];
async function getCheckList() {
	let {data, error} =await supabase.from('checklists').select('*').eq('itineraries_id', tripId);
	if (error) {
		console.log(error);
	} else {
		checkList = data;
		console.log(checkList);
	}
}
	//days array
	let days = [];
	let showdays= false;
   function createDays(){
	   days=[];
	   showdays= false;
	   for(let i=0;i<dayCount;i++){
		   days.push(
			   {
				   id:i+1,
				   name:`Day ${i+1}`,
				   places: setPlaces(i+1)
			   }
		   );
	   }
	   console.log(days);
	   showdays=true;
   }	
	//set places for each day
	function setPlaces(id){
		 let dayplaces = itineraryPlaces.filter((p) => p.relative_day_index == id);
		 let dayplacesArr = [];
		 for(let i=0;i<dayplaces.length;i++){
			 dayplacesArr.push(places.find((p) => p.id == dayplaces[i].places_id));
		 }
		 console.log(dayplacesArr);
		 return dayplacesArr;
		 

	}
	//select day function
	let selectedDay;
	//selected day places
	let selectedDayPlaces = [];
	function btnSelected(e)
	{
		let current = e.path[2].querySelector('.btn-pink');
		if (current) {
			current.className = current.className.replace('btn-pink', '');
			if(current.id==e.target.id)
			{
				selectedDay=null;
				count=places.length;
				currentPlace=null;
				resetMap=true;
				selectedDayPlaces=[];
				modalCountries = countries.filter((item) => countryArr.includes(item.id));
				return;
			}
			else{
			e.target.classList.add('btn-pink');
			selectedDay = e.target.id;
			resetMap=false;
			selectedDayPlaces = days[selectedDay-1].places;
			modalCountries = countries.filter((item) => selectedDayPlaces.map((p) => p.countries_id).includes(item.id));
			count=selectedDayPlaces.length;
			if(selectedDayPlaces.length==0&&!selectedPlace)
			{
				toast.error('No places added to this day. Please add places to this day');
				resetMap=true;
			}
			}
		} else {
			e.target.classList.add('btn-pink');
			selectedDay = e.target.id;
			resetMap=false;
			selectedDayPlaces = days[selectedDay-1].places;
			count=selectedDayPlaces.length;
			modalCountries = countries.filter((item) => selectedDayPlaces.map((p) => p.countries_id).includes(item.id));
			if(selectedDayPlaces.length==0&&!selectedPlace)
			{
				toast.error('No places added to this day. Please add places to this day');
				resetMap=true;
			}
		}

	}
//Select place
let selectedPlace;
//swiper currentplace
let currentPlace;
let resetMap=false;
//add place to day
function addPlace()
{
	if(selectedPlace)
	{
let day = days.find((p)=>p.id==selectedDay);
let alreadyAdded = day.places.find((p)=>p.id==selectedPlace.id);
if(alreadyAdded)
{
	toast.error('Place already added');
	return;
}
else{
	addPlaceToDay(selectedPlace.id,day.id);
}
	}
	else{
		toast.error('Please select a place');
	}
}
//add a place to the day API
async function addPlaceToDay(placeId,dayId)
{
	let id = itineraryPlaces.find((p)=>p.places_id==placeId).id;
	console.log(dayId);
	let {data, error} = await supabase.from('itinerary_stops').update({relative_day_index:dayId}).eq('id',id);
	if(error)
	{
		console.log(error);
	}
	else{
      await  getItineraryPlaces();
	  selectedDayPlaces = days[selectedDay-1].places;
	  count=selectedDayPlaces.length;
		toast.success('Place added to day');
	}
}

//show menu
let showMenu = false;
//show update duration modal
let showUpdateDuration = false;
let updatedDuration;
//update duration API
async function updateDuration()
{
	let {data, error} = await supabase.from('itineraries').update({trip_duration:updatedDuration}).eq('id',tripId);
	if(error)
	{
		console.log(error);
	}
	else{
		toast.success('Duration updated');
		updatedDuration=null;
		getItinerary();
		getItineraryPlaces();
		showUpdateDuration=false;
	}
}
//show place description
let showPlaceDescription = false;
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
{#if modalOpen}
<Modal {modalCountries} {places} {tripId} on:deleted={(e)=>refresh=e.detail}/>
{/if}
<div class="trip-name1">
    {tripName.toUpperCase()}
</div>
<!-- topbar -->
<div class="trip-plan-top-bar">
	<ViewmapIcon />
	<PicCount {count}/>
	{#if !selectedDay && !showUpdateDuration}
	<DayCount {dayCount} on:selectday={(e)=>{updatedDuration=e.detail;console.log(e.detail); showUpdateDuration=true}}/>
	{/if}
	<div class="trip-plan-menu"
	on:click={()=>{showMenu=true}}
	>
  <Intinerary />
	</div>
	<div class="cursor-pointer" on:click={()=>isTripModalOpen.set(true)}>
	<Beads/>
	</div>
</div>
{#if showdays}
<!-- days swipper -->
<Swiper
		modules={[Navigation, Mousewheel,FreeMode]}
		navigation={true}
		mousewheel={true}
		observeParents={true}
		observer={true}
		autoplay={false}
		loop={false}
		freeMode={true}
		slidesPerView='auto'
		shortSwipes={true}
		class="days-swipper"
	>
	{#each days as day}
<SwiperSlide>
<div class="day" id={day.id} on:click={btnSelected}>
	{day.name.toUpperCase()}
</div>	
</SwiperSlide>
{/each}	
</Swiper>

{/if}
{#if !loading}
<ViewMap {places} {currentPlace} {resetMap}  on:close={(e)=>{selectedPlace=e.detail}} on:open={(e)=>{
	if(!selectedDay)
	selectedPlace=e.detail
	
	}}/>
{/if}

<!-- places swiper for selected day -->
{#if selectedDayPlaces.length>0&&!selectedPlace}
<Swiper
		modules={[Navigation]}
		
		navigation={true}
		mousewheel={true}
		observeParents={true}
		observer={true}
		autoplay={false}
		loop={true}
		freeMode={true}
		slidesPerView={(selectedDayPlaces.length>3&&width>700)?3:1}
		shortSwipes={true}
		centeredSlides={true}
		spaceBetween={0}
		class={selectedDayPlaces.length>3&&width>700?"selected-day-swipper":"selected-day-swipper single"}
		on:slideChangeTransitionEnd={(e) => {
			let current = e.detail[0].slides[e.detail[0].activeIndex];
			let currentId = current.querySelector('img').id;
			currentPlace = selectedDayPlaces.find((p) => p.id == currentId);
			}}
	>
	{#each selectedDayPlaces as place}
<SwiperSlide>
<img src={place.image_url} alt="" id={place.id}
on:click={()=>{showPlaceDescription=!showPlaceDescription;}}
>
<div class={showPlaceDescription?"place-info place-info-show":"place-info"}>
	<h3 class="pic__title">Pic info</h3>
<p>{place.description}</p>	
</div>
</SwiperSlide>
{/each}	
</Swiper>
{/if}





<!-- save button -->
{#if selectedDay&&selectedPlace}
<div class="save-btn" on:click={addPlace}>
	<button class="btn btn-pink">Save</button>
</div>
{/if}

<!-- trip plan menu modal  -->
{#if showMenu}
<div class="outer">
<div class={showMenu?"trip-plan-menu-modal menu-modal-show shadow-lg":"trip-plan-menu-modal shadow-lg"}>
	<div class="close-menu-modal">
		<div class="close-icon" 
		on:click={()=>{showMenu=false}}
		>
		<Intinerary />
	</div>
	</div>
	<div class="trip-name1">
		{tripName.toUpperCase()}
	</div>
	<div class="menu-content">
		<div class="div1">
		<div class="check-list-menu-icon"
		on:click={()=>{menuModalData=checkList; checklists=true;showdatamodal=true;}}
		>
         <CheckListIcon />
		 <p>check list</p>
		</div>
		<div class="bucket-list-menu-icon"
		on:click={()=>{menuModalData=bucketList; checklists=false;buckets=true;showdatamodal=true;}}
		>
         <BucketListIcon />
		 <p>bucket list</p>
		</div>
	</div>
	<div class="div2">
		<div class="covid-info-menu-icon"
		on:click={()=>{menuModalData=modalCountries; covid=true;showdatamodal=true;}}
		>
          <h1>C</h1>
		 <p>covid info</p>
		</div>
		<div class="country-info-menu-icon"
		on:click={()=>{menuModalData=modalCountries; countryinfo=true;showdatamodal=true;}}
		>
        <h1>I</h1>
		 <p>country info</p>
		</div>
	</div>
	</div>
		
	</div>
</div>
{#if showdatamodal}
<div class="outer">
<div class={showdatamodal?"menu-data-modal menu-data-modal-show shadow-lg":"menu-data-modal shadow-lg"}>
	<div class="close-icon"
	on:click={()=>{menuModalData=[];covid=false;countryinfo=false;buckets=false;checklists=false; showdatamodal=false;}}>
		<CloseIcon />
	</div>
{#if buckets}
{#each menuModalData as bucket}
<div class="data"
on:click={()=>{router.redirect(`/bucket-list?bucket=${bucket.id}`)}}
>
{bucket.name}
</div>
{/each}
{/if}
{#if checklists}
{#each menuModalData as checklist}
<div class="data"
on:click={()=>{router.redirect('/check-list?name='+checklist.name+'&id='+checklist.id)}}
>
{checklist.name}
</div>
{/each}
{/if}
{#if covid}
{#each menuModalData as country}
<div class="data"
on:click={()=>{router.redirect(`/?covid-info=true&country-name=${country.name}&country-id=${country.id}`)}}
>
{country.name}
</div>
{/each}
{/if}
{#if countryinfo}
{#each menuModalData as country}
<div class="data"
on:click={()=>{router.redirect(`/country-info?country-name=${country.name}&countryId=${country.id}`)}}
>
{country.name}
</div>
{/each}
{/if}
</div>
</div>

{/if}
{/if}
<!-- update duration modal -->
{#if showUpdateDuration}
<div class="outer">
<div class={showUpdateDuration?"update-duration-modal update-duration-modal-show shadow-lg":"update-duration-modal shadow-lg"}>
	<div class="close-icon"
	on:click={()=>{showUpdateDuration=false}}
	>
		<CloseIcon />
	</div>
	THIS ACTION WILL UPDATE THE DURATION OF THE TRIP FROM {dayCount} DAYS TO {updatedDuration} DAYS
	<div class="update-duration-btns">
		<button class="btn"
		on:click={()=>{updateDuration(); showUpdateDuration=false}}
		>Update</button>
		<button class="btn"
		on:click={()=>{showUpdateDuration=false;}}
		>Cancel</button>
		</div>
</div>
</div>
{/if}
<BottomMenu />

<style global>
    /*profile icon css*/


    /*trip name css*/
    .trip-name1{
     display: flex;
     justify-content: center;
        align-items: center;
        background-color: #28303b;
        color:#c7f0b9;
        width:50%;
        height:7%;
        border-radius: 25px;
        margin-top: 10px;
        align-self: center;
        font-size:x-large;
    }
	/*days swipper css*/
	.days-swipper{
		width: 90vw;
		height: 8%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}
	.days-swipper .swiper-slide{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 10vw!important;
		height: 80%;
		
		font-size: large;
		border-radius: 12px;
		margin: 0 20px;
        cursor: pointer;
	}
	.days-swipper .swiper-slide-active{
		width: 10vw;
	}
	.days-swipper .swiper-wrapper{
	 width: 90vw!important;
	 margin: 0 auto;
	}
	.days-swipper .swiper-button-prev {
		position: fixed;
		left: 2%;
		top: 33%!important;
		width: 20px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.737' height='30.266' viewBox='0 0 32.737 30.266'%3E%3Cg id='Group_2208' data-name='Group 2208' transform='matrix(-1, -0.017, 0.017, -1, 3573.403, 1399.636)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.days-swipper .swiper-button-next {
		position: fixed;
		top: 33%;
		right: 2%;
		width: 20px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.224' height='29.708' viewBox='0 0 32.224 29.708'%3E%3Cg id='Group_2207' data-name='Group 2207' transform='translate(-3564.544 -1307.359)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.days-swipper .swiper-slide .day{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: #28303b;
		color: #c7f0b9;
		border-radius: 12px;
	}
	.days-swipper .swiper-slide .day .light-orange-color{
		color: #dbbda9;
		
	}
	.days-swipper  .swiper-button-next::after {
		display: none;
	}
	
	.days-swipper .swiper-button-prev::after {
		display: none;
	}
	.days-swipper .swiper-slide .btn-pink{
		background-color: #e9bebd;
		color: #28303b;
	}
	.save-btn{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100px;
		height: 50px;
	   position: fixed;
	   bottom: 15%;
	   right: 10%;
	   background-color:#dbbda9;
	   border-radius: 60%;

	   font-size: x-large;
	   color: #28303b;
	   cursor: pointer;
	   z-index: 999;
	}
	/*selected day swipper css*/
	.selected-day-swipper{
		width: 70vw;
		height: 45%;
		display: flex;
		align-self: center;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 40%;
		left: 15%;
	}
	.selected-day-swipper .swiper-slide{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%!important;
		font-size: large;
		cursor: pointer;
		overflow: hidden;
		
	
	}
	.selected-day-swipper .swiper-slide-active{
		z-index: 2;
		transform: scale(1.3) !important;
	}

	.selected-day-swipper .swiper-slide img{
		object-fit: cover !important;
		width: 90%;
        position: relative;
	}
	.selected-day-swipper .swiper-slide .place-info{
		position: absolute;
		left: 25%;
		width: 50%;
		height: 60%;
		background: rgba(32, 47, 64, 0.65);
		display: none;
		justify-content: center;
		align-items: center;
		text-align: start;
		font-size: small;
		flex-direction: column;
		padding: 10px;
	}
	.selected-day-swipper .swiper-slide .place-info h3{
		font-size: large;
		font-weight: bold;
	}
	.selected-day-swipper .swiper-slide .place-info p{
		font-size: smaller;
	}
	.selected-day-swipper .swiper-slide-active .place-info-show{
	display: flex;
	justify-content: center;
	align-items: center;
	}
	.days-swipper .swiper-slide-active img{
		object-fit: cover !important;
		width: 100%;
	}
	.selected-day-swipper .swiper-button-next{
	    margin-right: 10px;
		width: 20px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.224' height='29.708' viewBox='0 0 32.224 29.708'%3E%3Cg id='Group_2207' data-name='Group 2207' transform='translate(-3564.544 -1307.359)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.selected-day-swipper .swiper-button-prev
	{
		margin-left: 10px;
		width: 20px;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32.737' height='30.266' viewBox='0 0 32.737 30.266'%3E%3Cg id='Group_2208' data-name='Group 2208' transform='matrix(-1, -0.017, 0.017, -1, 3573.403, 1399.636)' opacity='0.996'%3E%3Cpath id='Path_1276' data-name='Path 1276' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(19.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_1277' data-name='Path 1277' d='M3565,1307.564l6.57,14.649-6.57,14.649' transform='translate(0 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3Cpath id='Path_7898' data-name='Path 7898' d='M3570.43,1307.564l6.57,14.649-6.57,14.649' transform='translate(7.22 0)' fill='none' stroke='%23c5ffbb' stroke-miterlimit='10' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
	}
	.selected-day-swipper .swiper-button-next::after {
		display: none;
	}
	.selected-day-swipper .swiper-button-prev::after {
		display: none;
	}
	/*single image swipper css*/
	.single{
		width:60vw;
		left: 20%;
	}

	.single .swiper-slide-active{
		transform: scale(1) !important;
	}
     .single img{
		width: 100%;
		height: 100%;
	}
	.single .swiper-button-next{
		margin-right:35px;
	}
	.single .swiper-button-prev{
		margin-left:35px;
	}
	/*topbar css*/
	.trip-plan-top-bar{
		position: relative;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.trip-plan-menu{

		background-color:#dca;
		width: 35px;
		height:35px;
		position: absolute;
		top: 20%;
		right:20%;
		border-radius: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	/*trip plan menu modal css*/
	.trip-plan-menu-modal{
		width: 70%;
		height: 60%;
		background-color:#1d2531;
		display: none;
		transition: display 0.5s ease-in-out;
		z-index: 1000;
	}
	.outer{
		position: fixed;
		top: 0;
		left: 0;
		
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0,0,0,0.8);
		z-index: 1000;
	}
	.menu-modal-show{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		transition: display 0.5s ease-in-out;
		position: relative;
		
	}
	.menu-content{
		height: 70%;
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		align-items:space-around;
		flex-direction: column;
		
	}
	.div1,.div2{
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: row;
	}
  .country-info-menu-icon,.covid-info-menu-icon,.bucket-list-menu-icon,.check-list-menu-icon{
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
  }
	.covid-info-menu-icon h1,.country-info-menu-icon h1{
		width: 50px;
		height: 50px;
		border-radius: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		color: #000;
		font-size: x-large;
		font-weight: bold;
		background-color: #f2e8da
	}
	/* close menu modal css*/
	.close-menu-modal{
		position: absolute;
		top: -40px;
		right: 30px;
		cursor: pointer;
		background-color:#1d2531;
		border-radius: 12px;
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;

	}
	.close-menu-modal .close-icon{
		width: 30px;
		height: 30px;
		background-color: #c7f0b9;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100%;

	}
	/*menu data modal css*/
	.menu-data-modal{
	   position: relative;
		width: 25%;
		height: 30%;
		background-color:#28303b;
		display: none;
		transition: display 0.5s ease-in-out;
		border-radius: 12px;
		z-index: 10000;

	}
	.menu-data-modal-show{
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: column;
		transition: display 0.5s ease-in-out;
		overflow-y: auto;
		
	}
	.menu-data-modal .close-icon{
		width: 30px;
		height: 30px;
		background-color: #c7f0b9;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
		cursor: pointer;
		position: absolute;
		top: 0px;
		right: 0;
	
		
	}
	.menu-data-modal .data{
		width: 70%;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #c7f0b9;
		border-radius: 25px;
		color: #000;
		cursor: pointer;
	}
	/*update duration modal css*/
	.update-duration-modal{
		position: relative;
		width: 35%;
		height: 40%;
		background-color:#28303b;
		color: #c7f0b9;
		display: none;
		transition: display 0.5s ease-in-out;
		border-radius: 12px;
		z-index: 10000;
	}
	.update-duration-modal-show{
		display: flex;
		justify-content: space-evenly;
		text-align: center;
		align-items: center;
		flex-direction: column;
		transition: display 0.5s ease-in-out;
	}
	.update-duration-modal .close-icon{
		width: 30px;
		height: 30px;
		background-color: #c7f0b9;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
		cursor: pointer;
		position: absolute;
		top: 0px;
		right: 0;
	}
	.update-duration-modal .update-duration-btns{
		width: 70%;
		height: 40px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		color: #000;
		cursor: pointer;
	}
	.update-duration-modal .update-duration-btns .btn{
		width: 30%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #c7f0b9;
		border-radius: 25px;
	}
	@media screen and (max-width: 768px) {
		.trip-name1{
			width: 80%;
		}
		.days-swipper .swiper-slide{
			width: 20vw!important;
		}
		.days-swipper .swiper-slide-active{
			width: 20vw;
		}
		.days-swipper .swiper-button-prev {
			left: 0%;
			top: 33%!important;
		}
		.days-swipper .swiper-button-next {
			right: 0%;
			top: 33%;
		}
		.selected-day-swipper{
			width: 100vw!important;
			height: 40vh!important;
			display: flex;
			align-self: center;
			justify-content: center;
			align-items: center;
			position: fixed;
			top: 40%;
		    left: 0%;
		}
		.selected-day-swipper .swiper-slide{
			height: 40vh!important;
		}
		.selected-day-swipper .swiper-slide img{
			object-fit: cover !important;
			width: 100%!important;
			height: 80%!important;
		}
		.selected-day-swipper .swiper-slide .place-info{
			width:70%;
			left: 15%;
		}
		.selected-day-swipper .swiper-slide-active{
			transform: scale(1.3) !important;

		}
	   .selected-day-swipper .swiper-button-next{
		display: none;
	   }
	   .selected-day-swipper .swiper-button-prev{
		display: none;
	   }
	   .trip-plan-top-bar{
		height: 25px;
	   }
	   .trip-plan-menu{
		right: 15%;
		height: 28px;
		width: 28px;
	   }
	   .menu-data-modal{
		width:70%;
		height: 40%;
	   }
	   .update-duration-modal{
		width: 80%;
		height: 40%;
	   }
	   .update-duration-modal .update-duration-btns{
		width: 100%;
	   }


	}
</style>
