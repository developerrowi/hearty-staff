<script>
	import router from 'page';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="171"
	height="41"
	viewBox="0 0 171 41"
	class="viewMap"
	on:click={() => router.redirect('/view-map')}
>
	<g id="Group_2191" data-name="Group 2191" transform="translate(-3995 -1804)">
		<path
			id="Rectangle_121"
			data-name="Rectangle 121"
			d="M0,0H158.383A12.617,12.617,0,0,1,171,12.617V28.383A12.617,12.617,0,0,1,158.383,41H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z"
			transform="translate(3995 1804)"
			fill="#1d2531"
		/>
		<text
			id="VIEW_MAP"
			data-name="VIEW MAP"
			transform="translate(4095.185 1830.263)"
			fill="#c5ffbb"
			font-size="19.018"
			font-weight="400"
			font-family="Arciform,SegoeUI, Segoe UI"
			letter-spacing="0.1em"><tspan x="-51.387" y="0">VIEW MAP</tspan></text
		>
		<g id="Group_335" data-name="Group 335">
			<path
				id="Path_1149"
				data-name="Path 1149"
				d="M4041.133,1822.474h-1.8a8.97,8.97,0,0,0-8.122-8.122v-1.8a.819.819,0,1,0-1.637,0v1.8a8.97,8.97,0,0,0-8.122,8.122h-1.8a.818.818,0,0,0,0,1.637h1.8a8.971,8.971,0,0,0,8.122,8.122v1.8a.819.819,0,0,0,1.637,0v-1.8a8.971,8.971,0,0,0,8.122-8.122h1.8a.809.809,0,0,0,.818-.818.822.822,0,0,0-.818-.819Zm-6.725,1.637h3.293a7.343,7.343,0,0,1-6.486,6.486V1827.3a.819.819,0,0,0-1.637,0v3.293a7.343,7.343,0,0,1-6.486-6.486h3.294a.818.818,0,0,0,0-1.637h-3.294a7.344,7.344,0,0,1,6.486-6.486v3.294a.819.819,0,0,0,1.637,0v-3.294a7.343,7.343,0,0,1,6.486,6.486h-3.293a.822.822,0,0,0-.818.819.835.835,0,0,0,.818.818Zm0,0"
				fill="#d0fbc0"
			/>
		</g>
	</g>
</svg>

<style>
	.viewMap {
		position: absolute;
		height: 4.5vh;
		width: 40vw;
		top: 1.5vh;
		left: -7vw;
		cursor: pointer;
	}
	@media (max-width: 700px) {
		.viewMap {
			top: 1vh;
			left: -7vw;
			z-index: 2;
		}
		#VIEW_MAP,#Rectangle_121 {
			display: none;
		}
	}
</style>
