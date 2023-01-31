
<script>
	import L from 'leaflet';
	import MarkerPopup from './MarkerPopup.svelte';
	import * as markerIcons from '$svgComponents/mapmarkers/redmarker.js';
	export let places;
	import { onMount } from 'svelte';
	import {createEventDispatcher} from 'svelte';
	export let currentPlace;
	export let resetMap;
	let dispatch = createEventDispatcher();
	$:{currentPlace&&zoomToPlace(currentPlace)}
	$:{resetMap&&resetMapFn()}
	let map;
	let window;
	//get markers from places
	let markerLocations = [];
	markerLocations = places.map((place) => {
		let point = place.gps_coordinates;
		//get the x,y from '(x,y)' type string
		let x = point.split(',')[0].replace('(', '');
		let y = point.split(',')[1].replace(')', '');
		return [x, y];
	});

	const initialView = [0, 0];
	function createMap(container) {
		let m = L.map(container, { preferCanvas: true }).setView(initialView, 2.5);

		L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
			attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
			subdomains: 'abcd',
			maxZoom: 10,
			minZoom: 2,
			noWrap: true,
			bounds: [
				[-90, -180],
				[90, 180]
			]
		}).addTo(m);

		return m;
	}
//zoom map to currentPlace
	function zoomToPlace(place) {
		let point = place.gps_coordinates;
		//get the x,y from '(x,y)' type string
		let x = point.split(',')[0].replace('(', '');
		let y = point.split(',')[1].replace(')', '');
		map.setView([x, y], 6);
		//add class to the map
		map._container.classList.add('lg-map');
	}
	//reset map
	function resetMapFn() {
		map.setView(initialView, 2.5);
		map._container.classList.remove('lg-map');
	}


	// Create a popup with a Svelte component inside it and handle removal when the popup is torn down.
	// `createFn` will be called whenever the popup is being created, and should create and return the component.
	function bindPopup(marker, createFn) {

		let popupComponent;
		marker.bindPopup(() => {
			let container = L.DomUtil.create('div');
			popupComponent = createFn(container);
			return container;
		});

		marker.on('popupclose', () => {
          
			if (popupComponent) {
				dispatch('close', null);
				let old = popupComponent;
				popupComponent = null;
				// Wait to destroy until after the fadeout completes.
				setTimeout(() => {
					old.$destroy();
				}, 500);
			}
		});
	}

	let markers = new Map();

	function markerIcon(count) {
		let html = `<div class="map-marker"><div>${markerIcons.library}</div></div>`;
		return L.divIcon({
			html,
			className: 'map-marker'
		});
	}

	function createMarker(loc) {
		//get place data from marker location
		let data = places.find((place) => {
			let point = place.gps_coordinates;
			//get the x,y from '(x,y)' type string
			let x = point.split(',')[0].replace('(', '');
			let y = point.split(',')[1].replace(')', '');
			return x == loc[0] && y == loc[1];
		});
		let icon = markerIcon();
		let marker = L.marker(loc, { icon });
		bindPopup(marker, (m) => {
			dispatch('open', data);
			let c = new MarkerPopup({
				target: m,
				props: {
					data
				}
			});

			return c;
		});

		return marker;
	}

	//aconnect markers with red dotted lines
	function connectMarkers() {
		let polyline = L.polyline(markerLocations, 
		{ color: 'red', 
		weight: 1,
		dashArray: '5, 5',
		opacity: 0.5,
		smoothFactor: 1,
		}).addTo(map);
	}


	let markerLayers;
	function mapAction(container) {
		map = createMap(container);

		markerLayers = L.layerGroup();
		for (let location of markerLocations) {
			let m = createMarker(location);
			markerLayers.addLayer(m);
		}

		markerLayers.addTo(map);
		connectMarkers();

		return {
			destroy: () => {
				map.remove();
				map = null;
			}
		};
	}

	// We could do these in the toolbar's click handler but this is an example
	// of modifying the map with reactive syntax.

	function resizeMap() {
		if (map) {
			map.invalidateSize();
		}
	}
</script>

<svelte:window on:resize={resizeMap} />

<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>
<div class="map" use:mapAction />

<style global>
	/*show popup on right side of icon*/
	.leaflet-popup {
		top: -104px !important;
		left: 17px !important;
	}
	.leaflet-popup-content-wrapper {
		background: #1e2530 !important;
	}
	/*show tip on left side*/
	.leaflet-popup-tip-container {
		display: none;
	}
	.leaflet-popup-tip {
		background: #1e2530 !important;
	}
	.map {
		align-self: center;
		height: 60%;
		width: 90%;
        margin-top: 10px;

		z-index: 1;
	}
	.lg-map{
		position: absolute;
		top: 25%;
	
	}
	.leaflet-bottom,
	.leaflet-right {
		display: none;
	}
	.leaflet-control-attribution {
		display: none;
	}
	@media screen and (max-width: 768px) {
		.map {
			width: 95%;
		}
		.lg-map{
			width: 100%;
			top: 20%;
		}
	}
</style>
