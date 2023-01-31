<script>
	import { createEventDispatcher } from 'svelte';
	import Switcher from './Switcher.svelte';

	export let date = new Date();
	export let years_map = [1900, 2100];

	let years_count = years_map[1] - years_map[0] + 1;

	const MONTHS = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const YEARS = new Array(years_count).fill(years_map[0]).map((v, i) => v + i);
	const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const dispatch = createEventDispatcher();

	let _date, popup;
	$: DAYS = new Array(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate())
		.fill(1)
		.map((v, i) => v + i);
	$: _date = date.toLocaleDateString('en-US');

	let resetDate = () => {
		date = new Date();
	};
	let selectedDate;
	let dateChanged = (event) => {
		let { type, changedData } = event.detail;
		let newDate = new Date();

		if (type === 'day') {
			newDate = new Date(date.getFullYear(), date.getMonth(), changedData + 1);
		} else if (type === 'month') {
			let maxDayInSelectedMonth = new Date(date.getFullYear(), changedData + 1, 0).getDate();
			let day = Math.min(date.getDate(), maxDayInSelectedMonth);
			newDate = new Date(date.getFullYear(), changedData, day);
		} else if (type === 'year') {
			let maxDayInSelectedMonth = new Date(
				years_map[1] + changedData,
				date.getMonth() + 1,
				0
			).getDate();
			let day = Math.min(date.getDate(), maxDayInSelectedMonth);
			newDate = new Date(1900 + changedData, date.getMonth(), day);
		}

		date = newDate;
		selectedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		dispatch('dateChange', selectedDate);
	};
</script>

<div class="touch-date-popup" bind:this={popup}>
	<div>
		<div class="touch-date-wrapper">
			<div class="touch-date-picker">
				<Switcher
					type="month"
					data={MONTHS}
					selected={date.getMonth() + 1}
					on:dateChange={dateChanged}
				/>
				<Switcher type="day" data={DAYS} selected={date.getDate()} on:dateChange={dateChanged} />
				<Switcher
					type="year"
					data={YEARS}
					selected={date.getYear() + 1}
					on:dateChange={dateChanged}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.touch-date-popup {
		touch-action: pan-down;
	}
	.touch-date-popup > div {
		display: flex;
		justify-content: center;
		height: 100%;
	}
	.touch-date-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		font-size: var(--svtd-font-size, 20px);
	}

	.touch-date-picker {
		display: flex;
		padding: 60px 20px;
		justify-content: center;
		align-items: center;
		margin: 10px 0;
		overflow: hidden;
	}

	
</style>
