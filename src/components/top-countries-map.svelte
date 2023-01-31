<script>
	import { onMount } from 'svelte';
	import { drag, pointer, timer, geoOrthographic, geoPath, geoContains, select, zoom } from 'd3';
	import { feature } from 'topojson';
	import versor from 'versor';
	import world from '$lib/countries-110m.json';
	import { createEventDispatcher } from 'svelte';
	export let topCountries = [];
	const dispatch = createEventDispatcher();
	let el;
	onMount(() => {
		let rotationDelay = 3000;
		let scaleFactor = 0.9;
		let degPerSec = 6;
		let angles = { x: -20, y: 40, z: 0 };
		let rotation;

		let w = 960;
		let h = 500;
		let scl = Math.min(w, h) / 2.5;
		let canvas = select('#chart');
		let context = canvas.node().getContext('2d');
		let water = { type: 'Sphere' };
		let projection = geoOrthographic().precision(0.1);
		let path = geoPath(projection).context(context);
		let v0;
		let r0;
		let q0;
		let lastTime = Date.now();
		let degPerMs = degPerSec / 1000;
		let width, height;
		let land, countries;
		let autorotate, now, diff;

		const setAngles = () => {
			let rotation = projection.rotate();
			rotation[0] = angles.y;
			rotation[1] = angles.x;
			rotation[2] = angles.z;
			projection.rotate(rotation);
		};

		const scale = () => {
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight / 2;
			if (window.innerWidth > 1100) {
				width = 960;
				height = 300;
			}
			canvas.attr('width', width).attr('height', height);
			projection
				.scale((scaleFactor * Math.min(width, height)) / 2)
				.translate([width / 2, height / 2]);
			render();
		};

		//drag canvas
		function dragstarted(e) {
			v0 = versor.cartesian(projection.invert(pointer(e)));
			r0 = projection.rotate();
			q0 = versor(r0);
			stopRotation();
		}

		function dragged(e) {
			var v1 = versor.cartesian(projection.rotate(r0).invert(pointer(e)));
			var q1 = versor.multiply(q0, versor.delta(v0, v1));
			var r1 = versor.rotation(q1);
			projection.rotate(r1);
			render();
		}

		function dragended() {
			startRotation(rotationDelay);
		}

		let dragHandler = drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);

		const startRotation = (delay) => {
			autorotate.restart(rotate, delay || 0);
		};

		const stopRotation = () => {
			autorotate.stop();
		};

		const rotate = (elapsed) => {
			now = Date.now();
			diff = now - lastTime;
			if (diff < elapsed) {
				rotation = projection.rotate();
				rotation[0] += diff * degPerMs;
				projection.rotate(rotation);
				render();
			}
			lastTime = now;
		};

		const render = () => {
			context.clearRect(0, 0, width, height);
			fill(water, '#99ccff');
			stroke(land, '#99ccff');
			fill(land, '#c5ffbb');
			if (country.length > 0) {
				for (let i = 0; i < country.length; i++) {
					fill(country[i], 'red');
				}
			}
		};

		const fill = (obj, color) => {
			context.beginPath();
			path(obj);
			context.fillStyle = color;
			context.fill();
		};

		const stroke = (obj, color) => {
			context.beginPath();
			path(obj);
			context.strokeStyle = color;
			context.stroke();
		};
		//get clicked country
		canvas.on('click', function (e) {
			//get clicked location
			let loc = projection.invert([e.offsetX, e.offsetY]);

			feature(world, world.objects.countries).features.forEach((d) => {
				if (geoContains(d, loc)) {
					dispatch('viewcountry', d.properties.name);
				}
			});
		});
		// enable zoom

		const zoomed = (event) => {
			projection.scale(event.transform.translate(projection).k * scl);
		};
		let zoomHandler = zoom().scaleExtent([0.75, 50]).on('zoom', zoomed);

		setAngles();
		canvas.call(dragHandler);
		canvas.call(zoomHandler);

		let country = [];
		const loadData = () => {
			land = feature(world, world.objects.land);

			countries = feature(world, world.objects.countries);
			for (let i = 0; i < countries.features.length; i++) {
				for (let j = 0; j < topCountries.length; j++) {
					if (countries.features[i].properties.name === topCountries[j].name) {
						country.push(countries.features[i]);
					}
				}
			}

			window.addEventListener('resize', scale);
			scale();
			autorotate = timer(rotate);
		};
		loadData();
	});
</script>

<canvas bind:this={el} id="chart" />

<style>
	#chart {
		cursor: move;
	}
</style>
