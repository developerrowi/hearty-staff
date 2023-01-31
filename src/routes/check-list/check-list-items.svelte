<script>
	import { authUser } from '$lib/store';
	import router from 'page';
	import User from '$svgComponents/icons/user.svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import { onMount } from 'svelte';
	import { clickOutside } from '$lib/clickOutside';
	import { toast } from '$lib/toast-helper';
	import supabase from '$lib/supabase';
	import { swipe } from 'svelte-gestures';
	import CloseIcon from '$svgComponents/icons/close.svelte';
	import DeleteIcon from '$svgComponents/icons/delete.svelte';
	//get the checklist name from the url
	let parentName = '';
	let checklistName = '';
	let checklistId = '';
	//scree width
	let width;
	onMount(async () => {
		width = screen.width;
		let url = new URL(window.location.toString());
		parentName = url.searchParams.get('Parentname');
		checklistName = url.searchParams.get('name');
		checklistId = url.searchParams.get('id');
		await getChecklistItems();
	});

	//delete modal state
	let showdelete = false;
	//show delete modal
	function showdeleteModal() {
		showdelete = true;
	}
	//delete checklist item api
	const deleteChecklistApi = async () => {
		let { data, error } = await supabase.from('checklists').delete().eq('id', checklistId);
		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Checklist deleted successfully');
			router.redirect('/checklists');
		}
	};
	//add checklist item Api
	let checklistitemname;
	const createChecklistItemOnEnter = (event) => {
		if (event.key === 'Enter') {
			createNewchecklistItem();
		}
	};
	const createNewchecklistItem = async (event) => {
		if (!checklistitemname) {
			toast.warn('enter all the details');
			return;
		}
		const { data, error } = await supabase
			.from('checklists_items')
			.insert([{ name: checklistitemname, checklists_id: checklistId }]);

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
			.eq('checklists_id', checklistId);
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
		<h1>{parentName} Trip</h1>
	</div>

	<div class="sub">
		<hr />
		<h1 class="sub-name mt-2 text-xl uppercase">
			{checklistName}
			<span class="delete-sub" on:click={showdeleteModal}><DeleteIcon /></span>
		</h1>
	</div>
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

<!-- Delete modal component -->
<div
	class={showdelete
		? 'modal-del fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20 open-del'
		: 'modal-del fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20'}
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
<div class="w-full">
	<BottomMenu />
</div>

<style global>
	/*profile icon css*/

	/*trip name css*/
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
	/*checkbox placeholder css*/
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
	.checked::placeholder {
		color: red;
	}
	/*if checkbox is checked*/
	.checked:checked {
		background-color: red;
	}

	.check-inp {
		color: #dca;
		height: 20px;
		width: 20px;
		margin-top: 0 !important;
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
	/*input css for checklist item*/
	.input-trip {
		width: 40vw;
		height: 30px;
		font-size: larger;
		border-radius: 5px;
		align-self: center;
		background-color: #555154;
		position: relative;
		z-index: 1;
		text-align: center;
		margin-top: 0 !important;
	}
	.sub-name {
		color: #dca;
		text-align: center;
		position: relative;
	}
	/* Delete modal css */
	.modal-del {
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
	.open-del {
		visibility: visible;
		opacity: 1;
		transform: scale(1);
		overflow: hidden;
	}
	.delete-sub {
		position: absolute;
		right: 5%;
		top: 25%;
		cursor: pointer;
	}
	/*orange color css*/
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

	/*add button css*/

	.btn-trip {
		background-color: #223;
		color: #80bf95;
		border-radius: 10px;
		height: 40px;
		width: 70px;
		box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.5);
	}

	.sub-trip {
		overflow-y: auto;
		height: 32vh;
	}
	.sub-sub-item {
		display: flex;
		align-items: center;
		flex-direction: row;
		cursor: pointer;
		padding-left: 50px;
	}
	.sub-sub-item:hover {
		padding-left: 15px;
		transition: padding-left 0.2s ease-in-out;
	}
	/* cut the checcklists item text*/
	.cut-line {
		text-decoration: line-through red;
	}
	/*delete button css*/
	.close-button {
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		background-color: #151e28;
		display: none;
	}
	/*show delete button when hover*/
	.sub-sub-item:hover .close-button {
		display: flex;
	}
	@media screen and (max-width: 800px) {
		.new-trip {
			width: 80vw;
		}
		.input-trip {
			width: 60vw;
		}
	}
	@media screen and (max-width: 500px) {
		.new-trip {
			width: 80vw;
		}
		.input-trip {
			width: 60vw;
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
