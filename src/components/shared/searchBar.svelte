<script>
	import SearchIcon from '../$svgComponents/icons/search.svelte';
	import { t } from '$translations/i18n';

</script>

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
		/>
	</label>
</div>

<style>
	.search-filed {
		border-radius: 30px;
		background-color: #1f2a39;
	}

	.light-orange-color {
		color: #615b59;
	}
</style>
