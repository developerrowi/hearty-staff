<script>
	import { authUser,isProtectedRoute } from '$lib/store';
	import User from '$svgComponents/icons/user.svelte';
	import router from 'page';
	import BottomMenu from '$components/bottom-menu.svelte';
	import { swipe } from 'svelte-gestures';
	//import SearchBar from '$components/shared/SearchBar.svelte';
	import Delete from '$svgComponents/icons/delete.svelte';
	import AddIcon from '$svgComponents/icons/add.svelte';
	import { onMount } from 'svelte';
	import { clickOutside } from '$lib/clickOutside';
	import supabase from '$lib/supabase';
	import { toast } from '$lib/toast-helper';
	import SvgIthreedot from '$svgComponents/icons/svgIthreedot.svelte';
	import SvgSearchIcon from '$svgComponents/icons/svgsearchIcon.svelte';
	import SvgAttachIcon from '$svgComponents/icons/svgsttachicon.svelte';
	import Itinerary from '$svgComponents/icons/itinerary.svelte';
	import NotificationIcon from '$svgComponents/icons/notification.svelte';
	import DueDate from '$svgComponents/icons/dueDate.svelte';
	import PriorityIcon from '$svgComponents/icons/priority.svelte';
	import ScrollDatepicker from '$components/ScrollDatePicker/scrollDatepicker.svelte';
	import SearchIcon from '$svgComponents/icons/search.svelte';
	import { t } from '$translations/i18n';
 

	import Flatpickr from 'svelte-flatpickr';

	import 'flatpickr/dist/flatpickr.css';
	import 'flatpickr/dist/themes/dark.css';

	var startDate = [];
	var endDate = [];
	let colors = [];
	let checkarr = [];
	let li;
	let rangedate;

	function handleChange(selectedDates, dateStr, instance) {}

	let dates = {
		simple: new Date(),
		range: '2019-04-19 to 2019-04-24'
	};
	$: ischecklist && flatpickrOptionsRange;
	const flatpickrOptionsRange = {
		inline: true,
		onChange: (selectedDates, dateStr, instance) => {
			console.log(selectedDates);
		},
		onDayCreate: function (dObj, dStr, fp, dayElem) {
			// Checking to see if the current day object is in our array
			// The `+` is just a shortcut for parsing the date
			let div;
			dayElem.appendChild((div = document.createElement('div')));
			div.className = 'color-dots';
			for (let i = 0; i < startDate.length; i++) {
				var curDate = new Date(+dayElem.dateObj);
				if (startDate[i].toDateString() === curDate.toDateString()) {
					dayElem.style.border = 'none';

					//   dayElem.setAttribute("onclick", ` checkarr = document.getElementsByClassName('${colors[i]}');
					//   for (let i = 0; i < checkarr.length; i++) {

					//        checkarr[i].classList.add("zoom")
					//        setTimeout(() => {
					//   checkarr[i].classList.remove("zoom")
					//   }, 2000);
					//   }
					//  `);

					div.appendChild((li = document.createElement('span')));
					li.className = 'datecolordot';
					li.id = colors[i];
					li.style.backgroundColor = colors[i];

					dayElem.addEventListener('click', () => {
						let colordots = dayElem.querySelector('.color-dots');
						checkarr = colordots.getElementsByClassName('datecolordot');
						for (let i = 0; i < checkarr.length; i++) {
							{
								let item1 = document.getElementsByClassName(checkarr[i].id);
								for (let i = 0; i < item1.length; i++) {
									item1[i].classList.add('zoom');
									setTimeout(() => {
										item1[i].classList.remove('zoom');
									}, 2000);
								}
							}
						}
					});
				}

				if (endDate[i].toDateString() === curDate.toDateString()) {
					dayElem.style.border = 'none';

					//   dayElem.setAttribute("onclick", ` checkarr = document.getElementsByClassName('${colors[i]}');
					//   for (let i = 0; i < checkarr.length; i++) {

					//        checkarr[i].classList.add("zoom")
					//        setTimeout(() => {
					//   checkarr[i].classList.remove("zoom")
					//   }, 2000);
					//   }
					//  `);

					div.appendChild((li = document.createElement('span')));
					li.className = 'datecolordot';
					li.id = colors[i];
					li.style.backgroundColor = colors[i];

					dayElem.addEventListener('click', () => {
						let colordots = dayElem.querySelector('.color-dots');
						checkarr = colordots.getElementsByClassName('datecolordot');
						for (let i = 0; i < checkarr.length; i++) {
							{
								let item1 = document.getElementsByClassName(checkarr[i].id);
								for (let i = 0; i < item1.length; i++) {
									item1[i].classList.add('zoom');
									setTimeout(() => {
										item1[i].classList.remove('zoom');
									}, 2000);
								}
							}
						}
					});
				}
				if (curDate > startDate[i] && curDate < endDate[i]) {
					dayElem.style.border = 'none';

					//       dayElem.setAttribute("onclick", ` checkarr = document.getElementsByClassName('${colors[i]}');
					//   for (let i = 0; i < checkarr.length; i++) {
					//        checkarr[i].classList.add("zoom")
					//  setTimeout(() => {
					//   checkarr[i].classList.remove("zoom")
					//   }, 2000);
					//   }
					//  `);
					div.appendChild((li = document.createElement('span')));
					li.className = 'datecolordot';
					li.id = colors[i];
					li.style.backgroundColor = colors[i];

					dayElem.addEventListener('click', () => {
						let colordots = dayElem.querySelector('.color-dots');
						checkarr = colordots.getElementsByClassName('datecolordot');
						for (let i = 0; i < checkarr.length; i++) {
							{
								let item1 = document.getElementsByClassName(checkarr[i].id);
								for (let i = 0; i < item1.length; i++) {
									item1[i].classList.add('zoom');
									setTimeout(() => {
										item1[i].classList.remove('zoom');
									}, 2000);
								}
							}
						}
					});
				}
			}
		}
	};

	// width of screen
	let width;
	//  onmount function
	onMount(async () => {
		isProtectedRoute.set(true);
		if (!$authUser) router.redirect('/');
		width = screen.width;
		await ItineraryApi();
		await checklistApi();
	});

	// notification modal var
	let shownotifymodal = false;
	let notificationOn = false;
	let short = false;
	let showTooltip = false;
	// delete modal variables
	let showdelete = false;
	//Due date modal variables
	let showDuedatemodal = false;

	let isShowInput = false;
	function handler(e) {
		console.log(e.target.parentElement);
		if (width <= 500) {
			if (e.detail.direction == 'left') {
				e.target.parentElement.parentElement.querySelectorAll('.hover').forEach((el) => {
					el.classList.remove('hover');
				});
				e.target.parentElement.parentElement.querySelectorAll('.vis').forEach((el) => {
					el.classList.remove('vis');
				});
				e.detail.target.classList.add('hover');
				e.detail.target.nextElementSibling.classList.add('vis');
			}
			if (e.detail.direction == 'right') {
				e.detail.target.classList.remove('hover');
				e.detail.target.nextElementSibling.classList.remove('vis');
			}
		}
	}
	//function to create new checklist
	let name = '';
	const createChecklistOnEnter = (event) => {
		if (event.key === 'Enter') {
			createNewChecklist();
		}
	};

	const createNewChecklist = async (event) => {
		if (!name) {
			toast.warn('enter all the details');
			return;
		}
		const { data, error } = await supabase.from('checklists').insert([{ name: name }]);

		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
		if (data) {
			toast.success('create check list successfully');
			name = '';
			isShowInput = false;
			checklistApi();
		}
	};
	//input field
	function closeShowInput() {
		isShowInput = false;
	}

	//checklist api
	let checklists = [];
	let ischecklist = false;
	async function checklistApi() {
		let { data, error } = await supabase.from('checklists').select('*').is('parent_id', null);
		if (error) {
			console.log(error);
		}
		if (data) {
			//sort data array on basis of priority
			data.sort((a, b) => {
				if (a.is_priority == 1 && b.is_priority == 1) {
					return a.created_at > b.created_at ? 1 : -1;
				} else if (a.is_priority == 1) {
					return 1;
				} else if (b.is_priority == 1) {
					return -1;
				} else {
					return a.created_at > b.created_at ? 1 : -1;
				}
			});
			data.reverse();
			checklists = data;
			ischecklist = false;
			let k = 0;
			for (let i = 0; i < checklists.length; i++) {
				//  startDate[k]=new Date(checklists[i].start_date.split('-')[0],checklists[i].start_date.split('-')[1]-1,checklists[i].start_date.split('-')[2]);
				//   endDate[k]=new Date(checklists[i].end_date.split('-')[0],checklists[i].end_date.split('-')[1]-1,checklists[i].end_date.split('-')[2]);
				//  k++;
				//sort non priority checklist on basis of created at
				if (checklists[i].is_priority == false) {
					if (checklists[i].created_at) {
						checklists[i].created_at = new Date(checklists[i].created_at);
					}
				}
				if (checklists[i].itineraries_id) {
					for (let j = 0; j < countries.length; j++) {
						if (countries[j][1] == checklists[i].itineraries_id) {
							startDate[k] = new Date(
								countries[j][2].split('-')[0],
								countries[j][2].split('-')[1] - 1,
								countries[j][2].split('-')[2]
							);
							endDate[k] = new Date(
								countries[j][3].split('-')[0],
								countries[j][3].split('-')[1] - 1,
								countries[j][3].split('-')[2]
							);
							colors[k] = countries[j][4];
							checklists[i].color = countries[j][4];
							k++;
						}
					}
				}
			}
			ischecklist = true;
			filterChecklist = checklists;
			console.log(checklists);
		}
	}
	// Filter checklist function
	let filterChecklist = [];
	function filterChecklistFunc(id) {
		if (short) {
			filterChecklist = checklists.filter((item) => item.id == id);
			filterChecklist[0]['class'] = 'hover';
			filterChecklist[0]['vis'] = 'vis';
		} else {
			filterChecklist = checklists;
			filterChecklist.forEach((element) => {
				delete element.class;
				delete element.vis;
			});
		}
		console.log(filterChecklist);
	}

	// delete checklist api
	let checklistId = '';
	async function deleteChecklistApi() {
		let { data, error } = await supabase.from('checklists').delete().eq('id', checklistId);
		if (error) {
			console.log(error);
		}
		if (data) {
			console.log(data);
			showdelete = false;
			toast.success('checklist deleted successfully');
			checklistApi();
		}
	}
	//itinerary Select
	let inputText;
	let searchText;
	let countries = [];

	let filteredList = countries;

	const filterCountries = () => {
		filteredList = countries.filter((country) =>
			country[0].toUpperCase().includes(inputText.toUpperCase())
		);
	};
	// random color generator
	function randomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	// itineraries API
	async function ItineraryApi() {
		let { data: trips, error } = await supabase.from('itineraries').select('*');

		for (let i = 0; i < trips.length; i++) {
			if (trips[i].status == true) {
				let touple = [];
				touple[0] = trips[i].trip_name;
				touple[1] = trips[i].id;
				touple[2] = trips[i].start_date;
				touple[3] = trips[i].end_date;
				touple[4] = randomColor();
				countries.push(touple);
			}
		}
		console.log(countries);
	}

	// show itinerary modal
	function showItinerary(id) {
		if (shownotifymodal) {
			shownotify(id);
		}
		if (showDuedatemodal) {
			showDuedate(id);
		}

		short = !short;
		showTooltip = !showTooltip;
		checklistId = id;

		filterChecklistFunc(id);
	}
	//show notify modal
	function shownotify(id, notify) {
		if (showTooltip) {
			showItinerary(id);
		}
		if (showDuedatemodal) {
			showDuedate(id);
		}

		short = !short;
		shownotifymodal = !shownotifymodal;
		checklistId = id;
		notificationOn = notify;

		filterChecklistFunc(id);
	}
	//send notification api
	async function SendnotificationApi() {
		if (notificationOn) {
			let { data, error } = await supabase
				.from('checklists')
				.update({ is_notifications_on: false })
				.eq('id', checklistId);
			if (error) {
				console.log(error);
			}
			if (data) {
				console.log(data);
				shownotifymodal = false;
				toast.success('notification Off successfully');
				short = false;
				checklistApi();
			}
		} else {
			let { data, error } = await supabase
				.from('checklists')
				.update({ is_notifications_on: true })
				.eq('id', checklistId);
			if (error) {
				console.log(error);
			}
			if (data) {
				console.log(data);
				short = false;
				shownotifymodal = false;
				checklistApi();
				toast.success('notification On successfully');
			}
		}
	}
	//show Due date modal
	function showDuedate(id) {
		if (showTooltip) {
			showItinerary(id);
		}
		if (shownotifymodal) {
			shownotify(id);
		}
		if (showDuedatemodal) {
			updateDueDateApi(id);
		}
		short = !short;
		showDuedatemodal = !showDuedatemodal;
		checklistId = id;
		filterChecklistFunc(id);
	}
	//Update checklist Itinerary Id API
	async function updateChecklistItineraryIdApi(item) {
		if (item) {
			let { data, error } = await supabase
				.from('checklists')
				.update({ itineraries_id: item[1], start_date: item[2], end_date: item[3] })
				.eq('id', checklistId);
			if (error) {
				console.log(error);
			}
			if (data) {
				console.log(data);
				showTooltip = false;
				short = false;
				checklistApi();
				toast.success('checklist updated successfully');
			}
		} else {
			toast.warn('select itinerary');
		}
	}
	//udate checklist priority API
	async function updateChecklistPriorityApi(id, priority) {
		short = false;
		showDuedatemodal = false;
		shownotifymodal = false;
		showTooltip = false;
		filterChecklistFunc(id);
		if (priority) {
			let { data, error } = await supabase
				.from('checklists')
				.update({ is_priority: false })
				.eq('id', id);
			if (error) {
				console.log(error);
			}
			if (data) {
				console.log(data);
				await checklistApi();
				toast.success('checklist priority removed successfully');
			}
		} else {
			let { data, error } = await supabase
				.from('checklists')
				.update({ is_priority: true })
				.eq('id', id);
			if (error) {
				console.log(error);
			}
			if (data) {
				console.log(data);
				await checklistApi();
				toast.success('checklist priority  successfully');
			}
		}
	}

	//Search checklist function
	function SearchChecklists() {
		if (searchText) {
			filterChecklist = checklists.filter((item) =>
				item.name.toLowerCase().includes(searchText.toLowerCase())
			);
		} else {
			filterChecklist = checklists;
		}
	}
	//selected itinerary
	let selectedItinerary;
	//select itinerary function
	function selectItinerary(e) {
		let current = e.path[2].querySelector('.btn-green');
		if (current) {
			current.className = current.className.replace('btn-green', '');
			e.target.classList.add('btn-green');
		} else {
			e.target.classList.add('btn-green');
		}
	}
	//get selected date from for due date
	let selectedDate;
	let due_date;
	function getdate(e) {
		selectedDate = e.detail;
		console.log(selectedDate);
	}

	//update due date API
	async function updateDueDateApi(id) {
		if (selectedDate) {
			let { data, error } = await supabase
				.from('checklists')
				.update({ due_date: selectedDate })
				.eq('id', id);
			if (error) {
				console.log(error);
			}
			if (data) {
				console.log(data);
				toast.success('checklist due date updated successfully');
				checklistApi();
			}
		} else {
			toast.warn('select date');
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
<div class="search md:mt-5 mt-2 mb-2">
	<div class="search-bar">
		<label class="relative block">
			<span class="sr-only">Search</span>
			<span class="absolute inset-y-0 left-0 flex items-center pl-2 light-orange-color">
				<SearchIcon />
			</span>
			<input
				class="placeholder:italic placeholder:text-slate-400 block w-full py-2 pl-9 pr-3 search-filed light-orange-color"
				placeholder='{$t("globals.search")}'
				type="text"
				name="search"
				bind:value={searchText}
				on:input={SearchChecklists}
				disabled={short}
			/>
		</label>
	</div>
</div>
{#if ischecklist}
	<Flatpickr
		options={flatpickrOptionsRange}
		class="form-control datepicker bg-white"
		defaultDate={dates.range}
		placeholder={dates.range}
		dateFormat="Y-m-d"
		on:change={(event) => handleChange(event)}
	/>
{/if}

<div
	class={short ? 'check-lists mt-2 short' : 'check-lists mt-2'}
	use:clickOutside
	on:click_outside={closeShowInput}
>
	<div class="create-check-list text-orange text-xl py-5">
		<div class="name" on:click={() => (isShowInput = true)}>
			{#if !isShowInput}
				<span class="mr-5">New List</span>
				<AddIcon />
			{:else}
				<input
					class="create-checklist-inp"
					type="text"
					id="check-list"
					name="checkList-name"
					placeholder="Name"
					bind:value={name}
					on:keydown={createChecklistOnEnter}
					required
				/>
			{/if}
		</div>
	</div>
	{#each filterChecklist as checkList}
		<div
			class={showTooltip
				? `check-list text-orange text-xl py-5 bg-green ${checkList.color} `
				: `check-list text-orange text-xl py-5 ${checkList.color}`}
		>
			<div
				class={checkList.class ? 'name  hover' : 'name'}
				id={checkList.is_priority ? 'bg-green' : ''}
				on:click={() => router.redirect(`/check-list?name=${checkList.name}&id=${checkList.id}`)}
				onselectstart={() => {
					return false;
				}}
				use:swipe={{ timeframe: 300, minSwipeDistance: 20, touchAction: 'pan-y' }}
				on:swipe={handler}
			>
				{#if checkList.itineraries_id}
					<span class="dot" style="background-color: {checkList.color}" />
				{/if}
				{checkList.name}
			</div>
			<div
				class={checkList.vis ? 'del vis' : 'del'}
				on:click={() => {
					showdelete = true;
					checklistId = checkList.id;
				}}
			>
				<Delete />
			</div>
			<div class="buton">
				<button
					class={showTooltip ? 'btn btn-clicked' : 'btn'}
					on:click={showItinerary(checkList.id)}><Itinerary /></button
				>

				<button
					class="btn"
					id={checkList.is_notifications_on ? 'clicked-btn' : ''}
					on:click={shownotify(checkList.id, checkList.is_notifications_on)}
					><NotificationIcon /></button
				>
				<button
					class={showDuedatemodal ? 'btn btn-clicked' : 'btn'}
					id={checkList.due_date ? 'clicked-btn' : ''}
					on:click={showDuedate(checkList.id)}
				>
					{#if checkList.due_date}
						<span class="due-date"
							>{checkList.due_date.split('-')[2] + '/' + checkList.due_date.split('-')[1]}</span
						>
					{:else}
						<DueDate />
					{/if}
				</button>
				<button
					class={checkList.is_priority ? 'btn btn-clicked' : 'btn'}
					on:click={updateChecklistPriorityApi(checkList.id, checkList.is_priority)}
					><PriorityIcon /></button
				>
			</div>
		</div>
	{/each}
</div>
<!-- Itinerary modal screen -->

<div class={showTooltip ? 'itinerary-modal open-i' : 'itinerary-modal'}>
	<div class="items-i">
		<div
			class="add-i px-8 py-2 text-xl "
			on:click={updateChecklistItineraryIdApi(selectedItinerary)}
		>
			Add to itinerary
		</div>

		<div class="search__box mt-2">
			<SvgSearchIcon />
			<input type="text" placeholder='{$t("globals.search")}' bind:value={inputText} on:input={filterCountries} />
		</div>
		<div class="results">
			{#if filteredList.length != 0}
				{#each filteredList as country}
					<div class="items">
						<p
							on:click={(e) => {
								selectItinerary(e);
								selectedItinerary = country;
							}}
						>
							<SvgAttachIcon />
							{country[0]}
						</p>
					</div>
				{:else}
					<p style="font-size: 10px; margin-left: 5px;">No results</p>
				{/each}
			{/if}
		</div>
	</div>
</div>
<div id="arrow" />

<!-- notifications modal -->
<div class={shownotifymodal ? 'notify-modal open-notify' : 'notify-modal'}>
	<div class="add-i px-5 py-2 text-xl mt-0">Send me notifications</div>
	<div class="checkbox mx-2" on:click={SendnotificationApi}>
		<input type="checkbox" class="notify-check" id="click" checked={notificationOn} />
	</div>
</div>

<!-- Delete modal component -->
<div
	class={showdelete
		? 'modal-d fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20 open-d'
		: 'modal-d fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20'}
>
	<div class="max-w-md mx-auto my-48 bg-darkslategray py-4 px-5 rounded-md space-y-5">
		<p>This action will delete the Checklist and its items.</p>
		<div class="space-x-4 flex items-center justify-evenly">
			<button
				class="bg-green text-back-color w-full py-2 rounded-md"
				on:click={() => {
					showdelete = false;
				}}>Cancel</button
			>
			<button class="bg-green text-back-color w-full py-2 rounded-md" on:click={deleteChecklistApi}
				>Continue</button
			>
		</div>
	</div>
</div>

<!-- DueDate Modal component -->
<div class={showDuedatemodal ? 'duedate-modal open-duedate' : 'duedate-modal'}>
	<ScrollDatepicker on:dateChange={getdate} />
</div>

<div class={short ? 'w-full hidden' : 'w-full'}>
	<BottomMenu />
</div>

<style global>
	/* search bar css */
	.search {
		display: block;
		text-align: center;
		height: 50px;
		width: 50vw;
		align-self: center;
	}

	.search-filed {
		border-radius: 30px;
		background-color: #1f2a39;
	}

	.light-orange-color {
		color: #615b59;
	}
	/* user icon css*/

	/*calender css*/
	.calendar {
		align-self: center !important;
	}
	.datepicker {
		display: none;
	}
	.flatpickr-calendar.inline {
		align-self: center;
		background-color: transparent;
	}
	.flatpickr-day {
		font-size: 15px;
		height: 29px;
		line-height: 29px;
		color: #dbbda9 !important;
	}
	.nextMonthDay {
		opacity: 0.35;
	}
	.prevMonthDay {
		opacity: 0.35;
	}
	.flatpickr-month {
		color: #dbbda9 !important;
	}
	.flatpickr-weekday {
		color: #dbbda9 !important;
	}
	.color-dots {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: max-content;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	.datecolordot {
		height: 8px;
		width: 8px;
		border-radius: 100%;
		border: 0.2px solid white;
	}
	/* .flatpickr-innerContainer{
  height: 100%;
  width: 100%;
}
.flatpickr-rContainer{
  height: 100%;
  width: 100%;
}
.flatpickr-days{
  height: 100%;
  width: 100%;
}
.dayContainer{
  height: 100%;
  width: 100%;
} */

	/*create check-list css*/
	.create-check-list {
		margin-top: 20px;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 6vh !important;
		width: 50%;
		z-index: 99;
		background-color: #efd4c2;
		border-radius: 25px;
		margin-top: 10px !important;
		cursor: pointer;
	}
	.create-checklist-inp {
		background-color: #efd4c2;
		color: black;
		border-radius: 25px;
		width: 50%;
		text-align: center;
	}

	/*check-lists css*/

	.check-lists::-webkit-scrollbar {
		display: none;
	}

	.check-lists {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: 100%;
		height: 30vh !important;
		overflow-y: scroll;
	}
	.short {
		height: 15vh !important;
	}
	.check-list {
		margin-top: 20px;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 6vh !important;
		width: 50%;
		z-index: 99;
		background-color: #efd4c2;
		border-radius: 25px;
		margin-top: 10px !important;
		cursor: pointer;
	}
	.bg-green {
		background-color: #c5febb;
	}
	.name {
		position: absolute;
		left: 0;
		border-radius: 25px;
		background-color: #f2e8da;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: flex-start;
		padding-left: 20%;
		align-items: center;
		z-index: 2 !important;
		transition: all 0.5s ease-in-out;
	}
	.del {
		position: absolute;
		display: none;
		left: 65%;
		cursor: pointer;
		color: black;
		transition: display 0.5s ease-in-out;
	}
	.vis {
		display: block;
		z-index: 999;
		transition: display 0.5s ease-in-out;
	}

	.buton {
		position: absolute;
		color: black;
		bottom: 0;
		left: 70%;
		width: 30%;
		background-color: #efd4c2;
		overflow: hidden;
		height: 100%;
		transition: 0.5s ease;
		display: flex;
		flex-direction: row;
		z-index: 1 !important;
		border-radius: 0 25px 25px 0px;
		transition: all 0.5s ease-in-out;
	}
	#bg-green {
		background-color: #c5febb;
		color: black;
	}
	/*button when clicked*/
	.btn-clicked {
		border-radius: 0 !important;
		background-color: #c5febb;
	}
	#clicked-btn {
		border-radius: 0 !important;
		background-color: #c5febb;
	}
	.due-date {
		font-size: 10px;
		width: fit-content;
	}
	/*color dot css*/
	.dot {
		position: absolute;
		left: 5%;
		height: 10px;
		width: 10px;
		border-radius: 50%;
		box-shadow: #1d2531 0px 0px 0px 1px;
	}
	/* swipe left css*/
	.hover {
		width: 70%;
		box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.5);
	}

	/* checklist hover effect*/

	.check-list:hover .name {
		width: 70%;
		box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.5);
	}
	.check-list:hover .del {
		display: block;
		z-index: 999;
		transition: display 0.5s ease-in-out;
	}
	.zoom {
		transform: scale(1.1);
		transition: transform 0.2s; /* Animation */
	}

	/* Delete modal css */
	.modal-d {
		margin: 0;
		padding: 0;
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
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
	.open-d {
		visibility: visible;
		opacity: 1;
		transform: scale(1);
		overflow: hidden;
	}

	/*itinerary modal css*/
	.itinerary-modal {
		position: relative;
		z-index: 1000;
		justify-content: center;
		align-items: center;
		display: none;
		height: 25vh;
		width: 50%;
		align-self: center;
		box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.5);
	}
	.itinerary-modal:before {
		content: '';
		position: absolute;
		height: 0;
		position: absolute;
		width: 0;
		left: 70%;
		top: -10%;
		border: 10px solid transparent;
		border-top-color: #1d2531;
		transform: rotate(180deg);
		z-index: 999;
	}
	.open-i {
		display: flex;
	}
	.add-i {
		background-color: #1d2531;
		box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.5);
		border-radius: 12px;
		cursor: pointer;
	}
	.items-i {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		height: 100%;
		width: 50%;
	}

	.search__box {
		width: 50%;
		height: 6vh;
		background: rgb(88, 88, 88);
		border-radius: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0px 0px 0px;
		margin-bottom: 0px;
	}
	.search__box input {
		background: rgb(88, 88, 88);
		outline: none;
		border: 0;
		width: 100%;
		color: white;
		border-radius: 25px;
		font-size: large;
		text-align: center;
	}

	.results {
		padding: 7px 0;
		width: 50%;
		background: #1d2531;
		color: #dcc;
		border-radius: 5px;
		overflow-y: scroll;
		height: 10vh;
	}
	.results::-webkit-scrollbar {
		display: none;
	}
	.items p {
		width: 100%;
	}
	.items p:hover {
		background-color: #c5ffbb;
		color: #dacdbb;
		border-radius: 10px;
	}
	.btn-green {
		background-color: #c5ffbb;
		color: black;
		border-radius: 10px;
	}
	/* notification modal css*/
	.notify-modal {
		position: relative;

		justify-content: center;
		align-items: center;
		display: none;
		height: 25vh;
		width: 50%;
		align-self: center;
		box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.5);
	}
	.open-notify {
		display: flex;
	}
	.notify-modal:before {
		content: '';
		position: absolute;
		height: 0;
		position: absolute;
		width: 0;
		left: 77%;
		top: -10%;
		border: 10px solid transparent;
		border-top-color: #1d2531;
		transform: rotate(180deg);
		z-index: 999;
	}

	.checkbox input {
		outline: none;
		height: 20px;
		width: 40px;
		border-radius: 25px;
		-webkit-appearance: none;
		position: relative;
		background: #e6e6e6;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}
	.checkbox input:checked {
		background: #664aff;
	}
	.checkbox input:before {
		position: absolute;
		content: '';
		left: 0;
		height: 100%;
		width: 20px;
		background: linear-gradient(#fff, #f2f2f2, #e6e6e6, #d9d9d9);
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		border-radius: 50px;
		transform: scale(0.85);
		transition: left 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}
	input:checked:before {
		left: 20px;
	}

	/*Due date modal css*/
	.duedate-modal {
		position: relative;

		justify-content: center;
		align-items: center;
		display: none;
		height: 25vh;
		width: 50%;
		align-self: center;
		box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.5);
	}
	.open-duedate {
		display: flex;
	}
	.duedate-modal:before {
		content: '';
		position: absolute;
		height: 0;
		position: absolute;
		width: 0;
		left: 82%;
		top: -10%;
		border: 10px solid transparent;
		border-top-color: #1d2531;
		transform: rotate(180deg);
		z-index: 999;
	}

	@media screen and (max-width: 900px) {
		.create-check-list {
			width: 70%;
		}
		.check-list {
			width: 70%;
		}
		.calendar {
			width: 60vw !important;
			height: 35vh !important;
		}
		.contents {
			width: 60vw !important;
			height: 30vh !important;
		}
		.itinerary-modal {
			width: 100%;
		}
		.notify-modal {
			width: 100%;
		}
		.duedate-modal {
			width: 100%;
		}
		.add-i {
			width: 70vw;
		}
		.search__box {
			width: 100%;
		}
	}

	@media screen and (max-width: 500px) {
		/* swipe left css*/
		.hover {
			width: 60%;
			box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.5);
		}
		.hover .del {
			display: inline;
		}
		.create-check-list {
			width: 100%;
		}

		.check-list {
			width: 100%;
		}
		.check-list:hover .name {
			width: 100%;
		}
		.buton {
			left: 55%;
			width: 45%;
		}
		.hover {
			width: 55%;
		}
		.check-list:hover .hover {
			width: 55%;
		}
		.check-list:hover .del {
			display: none;
		}
		.check-list:hover .vis {
			display: block;
		}
		.calendar {
			width: 70vw !important;
			height: 40vh !important;
		}
		.contents {
			width: 70vw !important;
			height: 30vh !important;
		}
		.name {
			padding-left: 10%;
		}
		.vis {
			left: 45%;
		}
		.itinerary-modal:before {
			left: 60%;
		}
		.notify-modal:before {
			left: 68%;
		}
		.duedate-modal {
			width: 95vw;
		}
		.duedate-modal:before {
			right: 5%;
		}
		.zoom {
			transform: scale(1.08);
		}
	}
</style>