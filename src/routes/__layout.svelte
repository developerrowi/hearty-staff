<script>
	import supabase from '$lib/supabase';
	import { authUser, isProtectedRoute } from '$lib/store';
	import { onMount } from 'svelte';
	import Header from '$components/header.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import router from 'page';
	import { page } from '$app/stores';
	import { t, locale, locales } from "$translations/i18n";

	$: time = new Date().toLocaleDateString($locale, {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	// console.log(navigator.language, $locale)
	locale.set(navigator.language)	
	onMount(() => {
		authUser.set(supabase?.auth?.getUser());
		if (!supabase?.auth?.getUser() && $isProtectedRoute) {
			if($page.url.pathname === '/reset-password-user') return
			router.redirect('/login');
		}
		supabase.auth.onAuthStateChange((event, session) => {
			authUser.set(session?.user);
			if($page.url.pathname === '/reset-password-user') return
			session?.user ? router.redirect('/') : router.redirect('/login');
		});
	});
</script>

<div class="root">
	<Header />
	<slot />
</div>

<SvelteToast />

<style global lang="postcss">
	@import url(https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,regular,italic,500,500italic,700,700italic,900,900italic);
	@font-face {
		font-family: 'Arciform';
		src: url('$static/fonts/Arciform.otf') format('opentype');
		font-style: normal;
	}

	:root {
		--back-color: #1d2531;
		--facebook-color: #3567b8;
		--twitter-color: #00a2f9;
		--primary-blue: #99ccff;
		--primary-orange: #e5c2a5;
		--menu-active-bg: #1d2531ea;
		--secondary: #c5ffbb;
		--white: #ffffff;
		--arciform-font: 'Arciform', 'Lucida Sans', 'Gill Sans', 'Geneva', 'Verdana', 'sans-serif';
		--roboto-font: 'Roboto', 'Lucida Sans', 'Gill Sans', 'Geneva', 'Verdana', 'sans-serif';
		--top-margin: 3rem;
		--side-margin: 3rem;
	}

	div.root {
		background-color: var(--back-color);
		background-image: url(/background.svg);
		background-repeat: no-repeat;
		background-size: 200%;

		height: max(100vh, 675px);
		width: 100%;
	
		overflow: hidden;
		position: relative;

		color: var(--white);
		font-family: var(--arciform-font);
		font-size: 1rem;
		letter-spacing: 0.1em;

		padding-top: var(--top-margin);
		padding-inline: var(--side-margin);

		display: flex;
		flex-direction: column;

		animation: move-bg 60s linear infinite alternate;
	}

	button.btn {
		--btn-font: 1.2rem;
		font-size: var(--btn-font);
		font-family: var(--roboto-font);
		letter-spacing: 0.075em;
		text-align: center;

		border: none;
		outline: none;
		border-radius: 1.25em;
		padding: 0.5em;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	button.btn:hover {
		cursor: pointer;
	}

	input.inp,
	.pickrstyle,
	select.inp {
		--inp-font: 1.25rem;
		font-size: var(--inp-font);
		letter-spacing: 0.1em;

		border: none;
		outline: none;
		border-radius: 0.25em;
		padding: 0.5em;

		background-color: #28303d;
		color: var(--primary-orange);
	}

	input.roundinp,
	.pickrstyle {
		--inp-font: 0.8rem;
		font-size: var(--inp-font);
		letter-spacing: 0.1em;
		border: none;
		outline: none;
		border-radius: 50rem;
		padding: 0.3em 0.8em;
		color: #28303d;
		background-color: #939c9c;
	}

	input.roundinp::placeholder,
	.pickrstyle::placeholder,
	select.roundinp:invalid {
		color: #555154;
	}
	input.roundinp:focus,
	.pickrstyle:focus,
	select.roundinp:focus {
		box-shadow: inset 0 0 0.1em black;
	}

	select.inp {
		padding-block: 0.75em;
	}

	input.inp::placeholder,
	select.inp:invalid {
		color: #555154;
	}
	input.inp:focus,
	select.inp:focus {
		box-shadow: inset 0 0 0.1em black;
	}

	._toastBar {
		border-radius: 8px;
	}

	.pickrstyle {
		width: 50%;
	}

	.world-root {
		margin: 0 auto;
	}
	.bg-color-plan {
		background-color: #1d2531e0;
		width: 100%;
		max-width: 300px;
		margin: 0 auto;
	}
	.custom-color-cyan {
		color: var(--secondary);
	}
	.rounded-right {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		border-right: 1px solid grey;
	}
	.rounded-left {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
	#trip-name::placeholder {
		color: var(--secondary);
		opacity: 1;
	}

	#trip-name:-ms-input-placeholder,
	#trip-name::-ms-input-placeholder {
		color: var(--secondary);
	}

	#trip-name {
		color: var(--white);
		background-color: #242b36;
	}

	/* calender theme  */
	span.flatpickr-weekday,
	.flatpickr-months .flatpickr-month,
	.flatpickr-current-month .flatpickr-monthDropdown-months,
	.flatpickr-calendar,
	.flatpickr-current-month .flatpickr-monthDropdown-months .flatpickr-monthDropdown-month {
		background: var(--back-color) !important;
	}
	.flatpickr-months .flatpickr-prev-month:hover svg,
	.flatpickr-months .flatpickr-next-month:hover svg {
		fill: var(--white) !important;
	}
	@media (min-width: 418px) and (max-width: 649px) {
		.world-root {
			max-width: 300px !important;
		}
		.bg-color-plan {
			max-width: 260px;
		}
	}
	@media (max-width: 594px) {
		div.world-root.bottom {
			left: 0;
		}
		,
		.pickrstyle {
			width: 49%;
		}
		.bg-color-plan {
			max-width: 230px;
			box-shadow: 0px 1px 2px 0px #000;
			margin-top: -50px;
		}
	}

	g.internal {
		width: 100%;
		overflow: hidden;
		float: left;
	}

	@keyframes move-bg {
		from {
			background-position: 0% 0%;
		}
		to {
			background-position: 100% 100%;
		}
	}

	@tailwind base;
	@tailwind utilities;
	@tailwind components;
</style>
