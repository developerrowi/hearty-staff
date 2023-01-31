<script>
	import Flatpickr from 'svelte-flatpickr';
	import dayjs from 'dayjs';
	import customParseFormat from 'dayjs/plugin/customParseFormat.js';
	import { createEventDispatcher } from 'svelte';

	import 'flatpickr/dist/flatpickr.css';
	import 'flatpickr/dist/themes/dark.css';

	const dispatch = createEventDispatcher();
	dayjs.extend(customParseFormat);

	export let calOptions, classname, placeholder, name;
	let formattedValue;

	const defaultCalOptions = {
		mode: 'single',
		enableTime: false,
		element: '#yaa-cal-picker',
		dateFormat: 'd/m/Y',
		disableMobile: 'true'
	};

	const customOptions = {
		...calOptions,
		...defaultCalOptions
	};

	function handleChange(event) {
		const dateObj = dayjs(event?.detail?.[1], 'DD/MM/YYYY');
		const formatedDate = dateObj.format('YYYY-MM-DD');
		dispatch('formatedDate', {
			formatedDate: formatedDate
		});
	}
</script>

<Flatpickr
	options={customOptions}
	class={classname}
	bind:formattedValue
	on:change={handleChange}
	{name}
	{placeholder}
/>
