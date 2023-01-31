<script>

	import PinkBaloon from '$svgComponents/pink-baloon.svelte';
	import SecondBaloon from '$svgComponents/second-baloon.svelte';
	import ArrowDownUpload from '$svgComponents/arrow-down-upload.svelte';
	import { onDestroy, onMount } from 'svelte';

	import SvgAttachIconMobile from '$svgComponents/icons/svgsttachiconmobile.svelte';
	import SvgDownIconMobile from '$svgComponents/icons/svgdowniconmobile.svelte';
	import BottomMenu from '$components/bottom-menu.svelte';
	import Logout from '$svgComponents/icons/logout.svelte';

	import { createEventDispatcher } from 'svelte';
	import supabase from '$lib/supabase';
	import SvgsearchIconprofile from '$svgComponents/svgsearchIconprofile.svelte';
	import { toast } from '$lib/toast-helper';
	import { t } from '$translations/i18n';
	let path;
	export let size = '10em';

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log(error);
			toast.error(error.message);
			return;
		}
	};

	let uploading = false;
	let labeltext = $t("profile.upload");
	let src;
	let files;
	$: path && downloadImage();
	$: path && changelabeltext();

	const dispatch = createEventDispatcher();

	function changelabeltext() {
		labeltext = 'Edit Photo';
	}

	async function downloadImage() {
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path);
			if (error) throw error;

			src = URL.createObjectURL(data);
		} catch (error) {
			console.error('Error downloading image: ', error.message);
		}
	}

	async function uploadAvatar() {
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = files[0];
			const fileExt = file.name.split('.').pop();
			const fileName = `${Math.random()}.${fileExt}`;
			const filePath = `${fileName}`;

			let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

			if (uploadError) throw uploadError;

			path = filePath;
			dispatch('upload');
		} catch (error) {
			alert(error.message);
		} finally {
			uploading = false;
		}
	}

	async function saveprofile() {
		console.log(src, selectedAppLanguage_code, selectedCountry_id, selectedMyLanguage_code);
		let { data, error } = await supabase.rpc('profiles_save', {
			_full_name: 'Noah Hunter',
			_avatar_url: 'https://google.com',
			_language: 'en',
			_profiles_passports: [234, 231], // TODO: use Alpha-3 ('usa')
			_profiles_languages: ['ab', 'es'],
			_gender: 'male'
		});
		if (error) console.error(error);
		else console.log(data);
	}

	onMount(async () => {
		await countriesAPI();
		await languagesAPI();
	});

	async function countriesAPI() {
		let { data: count, error } = await supabase.from('countries').select('*');

		for (let i = 0; i < count.length; i++) {
			let pair = [];
			pair[0] = count[i].name;
			pair[1] = count[i].code;
			countries.push(pair);
		}
	}

	async function languagesAPI() {
		let { data: lang, error } = await supabase.from('languages').select('*');

		for (let i = 0; i < lang.length; i++) {
			let pair = [];
			pair[0] = lang[i].name;
			pair[1] = lang[i].code;
			languages.push(pair);
		}
	}

	let inputText;
	let countries = [];
	let languages = [];

	let selectedCountry = $t("profile.passport");
	let selectedCountry_id = 0;
	let selectedAppLanguage = $t("profile.app_language");
	let selectedAppLanguage_code = 'NA';
	let selectedMyLanguage = $t("profile.my_language");
	let selectedMyLanguage_code = 'NA';
	let displayOptions = false;
	let displayPassport = false;
	let displayLanguage = false;


	let filteredList = countries;
	const filterCountries = () => {
		filteredList = countries.filter((country) =>
			country[0].toUpperCase().includes(inputText.toUpperCase())
		);
	};

	let filteredlang = languages;
	const filterlanguages = () => {
		filteredlang = languages.filter((language) =>
			language[0].toUpperCase().includes(inputText.toUpperCase())
		);
	};
	let filteredmylang = languages;
	const filtermylanguages = () => {
		filteredmylang = languages.filter((mylanguage) =>
			mylanguage[0].toUpperCase().includes(inputText.toUpperCase())
		);
	};

	let ch = (val) => {
		if (val == 'displayOptions') {
			displayOptions = !displayOptions;
			displayLanguage = false;
			displayPassport = false;
		}
		if (val == 'displayPassport') {
			displayPassport = !displayPassport;
			displayOptions = false;
			displayLanguage = false;
		}
		if (val == 'displayLanguage') {
			displayLanguage = !displayLanguage;
			displayOptions = false;
			displayPassport = false;
		}
	};
</script>

<!-- {#if Waiting == 2} -->
<div>
	<span class="cursor-pointer" on:click={handleLogout}>
		<Logout />
	</span>
	<form>
		<div class="profilePhoto">
			<div class="photo_upload">
				<div class="high" />
				<div class="lower">
					<span class="lower-svg-container">
						<div class="double_arrow">
							<ArrowDownUpload />
							<ArrowDownUpload />
						</div>
					</span>
					<label class="uploadbutton" for="single">
						{uploading ? 'UPLOADING ...' : labeltext}
					</label>
					<input
						style="visibility: hidden; position:absolute;"
						type="file"
						id="single"
						accept="image/*"
						bind:files
						on:change={uploadAvatar}
						disabled={uploading}
					/>
				</div>
				{#if path}
					<div class="img">
						<img use:downloadImage {src} alt="Avatar" class="avatar image upload_photo_image" />
					</div>
				{:else}
					<div class="avatar no-image" style="height: {size}; width: {size};" />
				{/if}
			</div>
		</div>
		<div class="svggItinerary svggItinerary-first">
			<div class="svgmenu">
				<input type="text" class="name" placeholder='{$t("profile.full_name")}' />
				<div class="dropdown-mobile" on:click={() => ch('displayOptions')}>
					<div class="country__title">
						{selectedAppLanguage}
						<SvgDownIconMobile />
					</div>
				</div>
				<div
					class={displayOptions ? 'open__selectBox-mobile show-mobile' : 'open__selectBox-mobile'}
				>
					<div class="search__box-mobile">
						<SvgsearchIconprofile />
						<input
							type="text"
							placeholder='{$t("globals.search")}'
							bind:value={inputText}
							on:input={filterlanguages}
						/>
					</div>
					<div class="results-mobile">
						{#each filteredlang as language}
							<div class="items-mobile">
								<p
									on:click={() => {
										selectedAppLanguage = language[0];
										selectedAppLanguage_code = language[1];
										displayOptions = false;
									}}
								>
									<SvgAttachIconMobile />
									{language[0]}
								</p>
							</div>
						{:else}
							<p style="font-size: 15px;">No results</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<div class="svggItinerary">
			<div class="svgmenu">
				<div class="dropdown-mobile" on:click={() => ch('displayPassport')}>
					<div class="country__title">
						{selectedCountry}
						<SvgDownIconMobile />
					</div>
				</div>
				<div
					class={displayPassport ? 'open__selectBox-mobile show-mobile' : 'open__selectBox-mobile'}
				>
					<div class="search__box-mobile">
						<SvgsearchIconprofile />
						<input
							type="text"
							placeholder='{$t("globals.search")}'
							bind:value={inputText}
							on:input={filterCountries}
						/>
					</div>
					<div class="results-mobile">
						{#each filteredList as country}
							<div class="items-mobile">
								<p
									on:click={() => {
										selectedCountry = country[0];
										selectedCountry_id = country[1];
										displayPassport = false;
									}}
								>
									<SvgAttachIconMobile />
									{country[0]}
								</p>
							</div>
						{:else}
							<p style="font-size: 15px;">No results</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<div class="svggItinerary">
			<div class="svgmenu">
				<div class="dropdown-mobile" on:click={() => ch('displayLanguage')}>
					<div class="country__title">
						{selectedMyLanguage}
						<SvgDownIconMobile />
					</div>
				</div>
				<div
					class={displayLanguage ? 'open__selectBox-mobile show-mobile' : 'open__selectBox-mobile'}
				>
					<div class="search__box-mobile">
						<SvgsearchIconprofile />
						<input
							type="text"
							placeholder='{$t("globals.search")}'
							bind:value={inputText}
							on:input={filtermylanguages}
						/>
					</div>
					<div class="results-mobile">
						{#each filteredmylang as mylanguage}
							<div class="items-mobile">
								<p
									on:click={() => {
										selectedMyLanguage = mylanguage[0];
										selectedMyLanguage_code = mylanguage[1];
										displayLanguage = false;
									}}
								>
									<SvgAttachIconMobile />
									{mylanguage[0]}
								</p>
							</div>
						{:else}
							<p style="font-size: 15px;">No results</p>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<button class="profile_btn" on:click|preventDefault={() => saveprofile()}>{$t("profile.save")}</button>
	</form>

	<div class="ballon">
		<PinkBaloon />
	</div>
	<div class="sec-baloon">
		<SecondBaloon />
	</div>
	<BottomMenu />
</div>

<!-- {/if} -->
<style global>
	.name {
		background-color: #1d2531;
		color: #f2e8da !important;
		font-size: 25px;

		border: none;
		outline: none;

		align-items: center;
		font-family: Arciform;
		letter-spacing: 2px;

		margin-bottom: 1vh;
		margin-top: 1vh;
		margin-left: 2vw;
	}
	::placeholder {
		color: #f2e8da;
		opacity: 1;
	}
	@media only screen and (max-width: 600px) {
		form {
			margin-top: 30px;
		}
		.ballon {
			position: absolute;
			right: 8vw;
			bottom: 30px;
		}
		.sec-baloon {
			position: absolute;
			right: 18vw;
			bottom: 30px;
		}
	}
	.profilePhoto {
		border-radius: 50%;
		height: 170px;
		width: 170px;
		background-color: #c5ffbb;
		overflow: hidden;
	}
	.high {
		height: 85px;
	}
	.lower-svg-container {
		margin: 5px;
		margin-bottom: 10px;
		width: 100%;
	}
	.double_arrow {
		margin: 5px;
	}

	.lower {
		height: 85px;
		width: 100%;
		background-color: black;
		opacity: 0.7;
		text-align: center;
		font-size: 12px;
		padding-top: 10px;
		z-index: 999;
		right: 0%;
		position: absolute;
	}
	.img {
		position: absolute;
		top: 0%;
		width: 100%;
	}
	.uploadbutton {
		color: white !important;
		font-weight: 900;
		font-size: larger;
	}
	form {
		height: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.ballon {
		position: absolute;
		right: 8vw;
		bottom: 0vw;
	}
	.sec-baloon {
		position: absolute;
		right: 18vw;
		bottom: 0vh;
	}
	.profile_btn {
		padding: 6px 30px;
		margin: 60px 6px;
		background-color: #c5ffbb;
		border: none;
		border-radius: 5px;
		color: black;
		font-size: 14px;
		font-weight: lighter;
		letter-spacing: 2px;
		cursor: pointer;
	}
	.svggItinerary {
		justify-content: flex-end !important;
		margin: 5px;
		width: 180px;
	}
	.svggItinerary-first {
		margin-top: 20px;
	}
	
	.dropdown-mobile {
		border-radius: 5px;
		color: #f2e8da;
		text-align: center;
		font-family: Arciform;
		letter-spacing: 0.5px;
		justify-content: space-between;
		padding: 4px;
		z-index: 100;
		align-items: center;
	}

	.country__title {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: left;
		font-family: Arciform;
		letter-spacing: 2px;
	}
	.photo_upload {
		position: relative;
	}

	.upload_photo_image {
		position: absolute;
		top: 0;
		border-radius: 50%;
	}

	.open__selectBox-mobile {
		display: none;
		margin-top: -4vh;
		/* width: 40vw !important; */
		margin-left: 0.3vw;
		background: #1d2531;
		border-radius: 2vw;
		color: #f2e8da;
	}

	.show-mobile {
		display: block;
	}

	.search__box-mobile {
		background: rgb(88, 88, 88);
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;

		margin: 4vh 0.8vw;
		padding: 0px 0px 0px;
		margin-bottom: 0px;
	}
	.search__box-mobile input {
		text-align: center;
		background: rgb(88, 88, 88);
		outline: none;
		border: 0;
		color: white;
		border-radius: 5px;
		font-size: 17px;
	}

	.results-mobile {
		padding: 7px 0;
		color: #dcc;
		border-radius: 5px;
		overflow: scroll;
		height: 10vh;
	}

	.items-mobile {
		display: inline;
		width: 50%;
		padding: 0 0px;
		border-radius: 20px;
		font-size: 10px;
	}
</style>
