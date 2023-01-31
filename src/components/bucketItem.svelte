<script>
	import Delete from '$svgComponents/icons/delete.svelte';
	import { onMount } from 'svelte/internal';
	import SvgClose from '$svgComponents/icons/close.svelte';
	import supabase from '$lib/supabase';
	import SvgDownIcon from '$svgComponents/icons/svgdownicon.svelte';
	import SvgSearchIcon from '$svgComponents/icons/svgsearchIcon.svelte';
	import SvgAttachIcon from '$svgComponents/icons/svgsttachicon.svelte';
	import { swipe } from 'svelte-gestures';
	import { clickOutside } from '$lib/clickOutside';
	import { longpress } from '$lib/longPress';
	import { toast } from '$lib/toast-helper';
	export let images = [];
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let width;
	onMount(async () => {
		width = screen.width;
		await bucketAPI();
	});
	let showImg = false;
	let imgid;
	let Picinfo;
	let showcopy = false;
	let refresh = false;
	let showdelete = false;
	let BigImg = '';
	function handleClickOutside() {
		closeCopy();
	}
	function HandleClick(e) {
		if (width > 500) {
			BigImg = e.target.src;
			Picinfo = e.target.name;
			showImg = true;
		}
	}
	function HandleHold(e) {
		if (width <= 500) {
			BigImg = e.target.src;
			Picinfo = e.target.name;
			showImg = true;
		}
	}
	function closeImg() {
		showImg = false;
	}
	function closedelete() {
		showdelete = false;
	}
	let deleteid;
	function showdeletetab(id, id2) {
		showdelete = true;
		current_bucket = id2;
		deleteid = id;
		console.log(deleteid);
	}
	function closeCopy() {
		showcopy = false;
		bucketDisplayOptions = false;
		selectedBucket = 'SELECT';
		selectedBucket_id = 0;
	}
	let current_bucket;
	function showcopytab(id, id2, id3) {
		showcopy = true;
		deleteid = id;
		imgid = id2;
		current_bucket = id3;
		console.log(imgid);
	}
	async function deleteApi() {
		let { data, error } = await supabase.from('bucket_list_images').delete().eq('id', deleteid);
		if (data) {
			toast.success('Image Deleted');
			showdelete = false;
			refresh = true;
			dispatch('refresh', [refresh, current_bucket]);
			refresh = false;
			setTimeout(() => {
				dispatch('refresh', refresh);
			}, 2000);
		}
	}
	async function moveimg(id) {
		let { data, error } = await supabase
			.from('bucket_list_images')
			.update({ bucket_lists_id: id })
			.eq('id', deleteid);
		if (data) {
			toast.success('Image Moved');
			showcopy = false;
			refresh = true;
			dispatch('refresh', [refresh, current_bucket]);
			refresh = false;
			setTimeout(() => {
				dispatch('refresh', refresh);
			}, 2000);
		}
	}
	async function copyimg(id) {
		let { data, error } = await supabase
			.from('bucket_list_images')
			.insert([{ bucket_lists_id: selectedBucket_id, places_id: imgid }]);
		if (data) {
			toast.success('Image Copied');
			showcopy = false;
		}
	}
	let buckets = [],
		bucketArr = [],
		bucketFilteredList = [];
	//bucket_lists API
	async function bucketAPI() {
		let { data: bucketData, error } = await supabase.from('bucket_lists').select('*');

		for (let i = 0; i < bucketData.length; i++) {
			let pair = [];
			pair[0] = bucketData[i].name;
			pair[1] = bucketData[i].id;
			buckets.push(pair);
			bucketArr = buckets;
			bucketFilteredList = bucketArr;
		}
	}
	let bucketInputText;
	let bucketDisplayOptions = false;

	let selectedBucket = 'SELECT';
	let selectedBucket_id = 0;

	const filterBuckets = () => {
		bucketFilteredList = bucketArr.filter((buck) =>
			buck[0].toUpperCase().includes(bucketInputText.toUpperCase())
		);
	};
	let hovermobile = false;
	function handler(e) {
		if (width <= 500) {
			if (e.detail.direction == 'left') {
				hovermobile = true;
				e.target.children[0].children[0].classList.remove('image');
				e.target.children[0].children[0].classList.add('hoverimg');
				e.target.children[0].children[1].classList.add('hover');
				e.target.children[0].children[1].classList.remove('buttons');
			}
			if (e.detail.direction == 'right') {
				e.target.children[0].children[0].classList.remove('hoverimg');
				e.target.children[0].children[0].classList.add('image');
				e.target.children[0].children[1].classList.remove('hover');
				e.target.children[0].children[1].classList.add('buttons');
				hovermobile = false;
			}
		}
	}
</script>

<div class={showImg ? 'modal item-center open' : 'modal'}>
	<img src={BigImg} alt="" />
	{#if showImg}
		<div class=" close " on:click={closeImg}><SvgClose /></div>
	{/if}
	<div class="pic-info rounded-lg md:p-8 p-2 bg-orange ">
		{Picinfo}
	</div>
	<div class="user-info rounded-lg bg-orange md:p-8 p-3">
		<h4>Admin</h4>
		<div class="date__time">
			<p>2020-11-16</p>
			<p>19:32:45</p>
		</div>
		<p>Greece</p>
	</div>
</div>
<div class={showcopy ? 'bg-blur open' : 'bg-blur'}>
	<div
		class={showcopy
			? 'modal-copy open bg-darkslategraySecondary p-3'
			: 'modal-copy bg-darkslategraySecondary p-3'}
		use:clickOutside
		on:click_outside={handleClickOutside}
	>
		<h1 class="text-orange lg:text-2xl md:text-l text-center px-5">
			Select the bucketlist you would like move or copy this pic to
		</h1>
		<div class={bucketDisplayOptions ? 'browser-svg-itnerary large' : 'browser-svg-itnerary '}>
			<div class="browser-svg-menu">
				<div
					class="dropdown flex flex-row items-center justify-center "
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
				</div>
			</div>
		</div>

		<div class="btns">
			<button on:click={moveimg(selectedBucket_id)}>Move</button>
			<button on:click={copyimg(selectedBucket_id)}>Copy</button>
		</div>

		{#if showcopy}
			<div class=" close-copy " on:click={closeCopy}><SvgClose /></div>
		{/if}
	</div>
</div>
<div
	class={showdelete
		? 'modal fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20 open'
		: 'modal fixed min-h-screen top-0 right-0 left-0 blur-md bg-overlay z-20'}
>
	<div class="max-w-md mx-auto my-48 bg-darkslategray py-4 px-5 rounded-md space-y-5">
		<p>This action will delete the Image from bucket list.</p>
		<div class="space-x-4 flex items-center justify-evenly">
			<button class="bg-green text-back-color w-full py-2 rounded-md" on:click={closedelete}
				>Cancel</button
			>
			<button class="bg-green text-back-color w-full py-2 rounded-md" on:click={deleteApi}
				>Continue</button
			>
		</div>
	</div>
</div>
<div class="gallery">
	{#each images as img}
		<div
			class="gallery-container {img[7]}"
			onselectstart={() => {
				return false;
			}}
			use:swipe={{ timeframe: 300, minSwipeDistance: 20, touchAction: 'pan-y' }}
			on:swipe={handler}
		>
			<div class="gallery-item">
				<div class="image">
					<img
						src={img[0]}
						alt="nature "
						name={img[3]}
						on:click={HandleClick}
						draggable="false"
						use:longpress
						on:long={HandleHold}
					/>
				</div>
				<div class="buttons">
					<div class="delete">
						<button class="text-center" on:click={showdeletetab(img[5], img[6])}><Delete /></button>
					</div>
					<div class="copy" on:click={showcopytab(img[5], img[2], img[6])}>
						<button>Copy</button>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.modal {
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
	.bg-blur {
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
	.modal-copy {
		margin: 0;
		padding: 0;
		border-radius: 25px;
		width: 40%;
		height: 60%;
		z-index: 999;
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-direction: column;
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.5s ease, visibility 0.5s ease, transform 0.5s ease-in-out;
		transform: scale(0);
		overflow: hidden;
	}
	.open {
		visibility: visible;
		opacity: 1;
		transform: scale(1);
		overflow: hidden;
	}

	.modal img {
		width: 50%;
		height: 50%;
		border-radius: 25px;
		-khtml-user-select: none;
		-moz-user-select: none;
		-o-user-select: none;
		user-select: none !important;
	}
	.close {
		position: fixed;
		top: 1.5%;
		right: 1%;
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
	.close-copy {
		position: fixed;
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
	.btns {
		margin-top: 80px;
		display: flex;
		width: 100%;
		flex-direction: row;
		justify-content: space-evenly;
	}
	.btns button {
		background-color: #c5ffbb;
		border-radius: 25px;
		height: 50px;
		width: 100px;
		color: black;
	}
	.pic-info,
	.user-info {
		color: black;
		width: 70%;
	}
	.gallery {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-auto-rows: 70px 70px;
		grid-gap: 10px;
		grid-auto-flow: dense;
		overflow: auto;
		height: 58vh;
		width: 85%;
		align-self: center;
	}
	.gallery::-webkit-scrollbar {
		display: none;
	}

	.gallery-item {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: row;
	}
	.buttons {
		position: absolute;
		bottom: 0;
		left: 100%;
		right: 0;
		background-color: #292a2a;
		overflow: hidden;
		width: 0;
		height: 100%;
		transition: 0.5s ease;
		display: flex;
		flex-direction: column;
	}
	.delete {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 50%;
		background-color: #131820;

		margin: 2px;
		margin-top: 0;
	}
	.copy {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 50%;
		margin: 2px;
		margin-top: 0;
		background-color: #171e27;
	}
	.gallery-item .image {
		width: 100%;
		height: 100%;
		overflow: hidden;
		transition: 0.5s ease-in-out;
	}

	.gallery-item .image img {
		width: 100%;
		height: 100%;
		user-select: none;

		cursor: pointer;
		transition: 0.5s ease-in-out;
	}

	.gallery-container:hover .buttons {
		width: 30%;
		left: 70%;
	}
	.gallery-container {
		position: relative;
	}
	.gallery-container:hover .image {
		width: 70%;
		transition: 0.5s ease-in-out;
	}
	.wd-1 {
		grid-column: span 1;
	}
	.wd-2 {
		grid-column: span 1;
	}
	.wd-3 {
		grid-column: span 1;
	}
	.wd-4 {
		grid-column: span 1;
	}

	.hg-1 {
		grid-row: span 2;
	}
	.hg-2 {
		grid-row: span 2;
	}
	.hg-3 {
		grid-row: span 3;
	}
	.hg-4 {
		grid-row: span 4;
	}
	.open__selectBox {
		display: none;
		width: 100% !important;
		background: #1d2531;
		border-radius: 0.5vw;
		color: #896b61;
	}
	.search__box {
		width: 100% !important;
		background: rgb(88, 88, 88);
		border-radius: 0.5vw;
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
		margin-left: 2vw;
		color: white;
		border-radius: 0.2vw;
		font-size: 20px;
		width: 1000%;
	}

	.results {
		padding: 7px 0;
		width: 100%;
		background: #1d2531;
		color: #dcc;
		border-radius: 5px;
		overflow-y: scroll;
		height: 10vh;
	}
	.invisible-scrollbar::-webkit-scrollbar {
		height: fit-content;
		border-radius: 25px;
	}
	.items {
		display: inline;
		width: 100%;
		padding: 0 0px;
		border-radius: 20px;
		font-size: 20px;
	}
	.items p {
		padding: 1.4% 0;
	}
	.items p:hover {
		background-color: #c5ffbb;
		color: #dacdbb;
		border-radius: 10px;
	}
	.show {
		display: block;
	}
	.dropdown {
		padding: 0;
	}
	.browser-svg-menu {
		z-index: 1 !important;
		position: absolute;
		top: 20%;
		width: 100%;
	}

	.browser-svg-itnerary {
		color: #896b61;
		padding: 0;
		padding-top: 0;
		background-color: #171e27;
		position: absolute;
		top: 35%;
		width: 50%;
		height: 10%;
		display: flex !important;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: row;
		transition: all 0.5s ease-in-out;
		cursor: pointer;
	}

	@media screen and (max-width: 868px) {
		.gallery {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media screen and (max-width: 700px) {
		.modal-copy {
			width: 60%;
			left: 20%;
		}
		.gallery {
			grid-template-columns: repeat(2, 1fr);
			grid-auto-rows: 70px 70px;
		}
		.hg-1 {
			grid-row: span 1;
		}
		.wd-4 {
			grid-column: span 3/2;
		}
		.wd-3 {
			grid-column: span 2;
		}
		.wd-1 {
			grid-column: span 1;
		}
	}

	@media screen and (max-width: 500px) {
		.gallery {
			width: 96vw;
		}
		.gallery-container:hover .buttons {
			position: absolute;
			bottom: 0;
			left: 100%;
			right: 0;
			background-color: #292a2a;
			overflow: hidden;
			width: 0;
			height: 100%;
			transition: 0.5s ease;
			display: flex;
			flex-direction: column;
		}
		.gallery-container:hover .image {
			width: 100%;
			left: 100%;
		}
		.gallery-container:hover .image img {
			width: 100%;
			left: 100%;
		}
		.hover {
			bottom: 0;
			top: 0;
			width: 30%;
			height: 100%;
			left: 70%;
			transition: 0.5s ease-in-out;
		}
		.hoverimg {
			top: 0;
			bottom: 0;
			height: 100% !important;
			width: 70%;
			transition: 0.5s ease-in-out;
		}
		.gallery-item .hoverimg img {
			width: 100%;
			height: 100%;

			cursor: pointer;
			transition: 0.5s ease-in-out;
		}
		.modal-copy {
			width: 80%;
			left: 10%;
		}
		.gallery {
			grid-template-columns: repeat(2, 1fr);
		}

		.modal img {
			width: 80%;
		}
		.modal .close {
			top: 1%;
			right: 4%;
		}
	}
</style>
