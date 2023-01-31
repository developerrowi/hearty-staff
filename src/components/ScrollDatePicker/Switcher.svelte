<script>
	import { afterUpdate, onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let selected;
	export let data = 0;
	export let type;

	let position = selected ? -(selected - 1) * 30 : 0;

	let offset = 0;
	let dragging = false;

	let itemWrapper, previousY;

	onMount(() => {
		setPosition();
	});

	afterUpdate(() => {
		let selectedPosition = -(selected - 1) * 30;
		if (!dragging && position !== selectedPosition) {
			position = selectedPosition;
			setPosition();
		}
	});

	function onDateChange(type, changedData) {
		dispatch('dateChange', {
			type,
			changedData
		});
	}

	function setPosition() {
		let itemPosition = `
        will-change: 'transform';
        transition: transform ${Math.abs(offset) / 100 + 0.1}s;
        transform: translateY(${position}px)
      `;
		itemWrapper.style.cssText = itemPosition;
	}

	let onMouseDown = (event) => {
		previousY = event.touches ? event.touches[0].clientY : event.clientY;
		dragging = true;

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		window.addEventListener('touchmove', onMouseMove);
		window.addEventListener('touchend', onMouseUp);
	};

	let onMouseMove = (event) => {
		let clientY = event.touches ? event.touches[0].clientY : event.clientY;
		offset = clientY - previousY;

		let maxPosition = -data.length * 30;
		let _position = position + offset;
		position = Math.max(maxPosition, Math.min(30, _position));
		previousY = event.touches ? event.touches[0].clientY : event.clientY;
		setPosition();
	};

	let onMouseUp = () => {
		let maxPosition = -(data.length - 1) * 30;
		let rounderPosition = Math.round((position + offset * 5) / 30) * 30;
		let finalPosition = Math.max(maxPosition, Math.min(0, rounderPosition));

		dragging = false;
		position = finalPosition;

		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', onMouseUp);
		window.removeEventListener('touchmove', onMouseMove);
		window.removeEventListener('touchend', onMouseUp);

		setPosition();
		onDateChange(type, -finalPosition / 30);
	};

	let onWheel = (e) => {
		if (e.deltaY < 0) {
			//go to first position if position is last
			if (position === -(data.length - 1) * 30) {
				position = 0;
			} else {
				position -= 30;
			}
		}
		if (e.deltaY > 0) {
			position = position + 30;
			//go to last position if position is 0
			if (position == 0) {
				position = -(data.length - 1) * 30;
			} else {
				position = position + 30;
			}
		}
		onMouseUp();
	};

	//get index of each data item
	let getIndex = (item) => {
		return data.indexOf(item);
	};
	//get position by index
	let getPosition = (index) => {
		return -index * 30;
	};
</script>

<div
	class="touch-date-wrapper"
	on:mousedown={onMouseDown}
	on:touchstart={onMouseDown}
	on:wheel={onWheel}
>
	<ul bind:this={itemWrapper} class="touch-date-container">
		{#each data as item}
			<li
				class={getPosition(getIndex(item)) === position ? 'active' : 'others'}
				id={Math.abs(getPosition(getIndex(item)) - position) === 60 ? 'dark' : ''}
			>
				{item}
			</li>
		{/each}
	</ul>
</div>

<style>
	.touch-date-wrapper {
		position: relative;
		height: 30px;

		border-radius: 0;
	}
	.touch-date-container {
		margin: 0;
		padding: 0;
	}

	.touch-date-container li {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80px;
		height: 30px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.active {
		transform: scale(1.1);
		transition: transform 0.2s ease-in-out;
		color: #709175;
		z-index: 99;
	}
	.others {
		transform: scale(0.9);
		opacity: 0.5 !important;
		z-index: 1;
		color: #e5c2a5;
	}
	#dark {
		color: #66625f;
		transform: scale(0.8);
		opacity: 0.5;
	}
</style>
