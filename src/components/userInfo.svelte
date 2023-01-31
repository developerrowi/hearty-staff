<script>
	import UserInfoGreen from '$svgComponents/icons/userInfoGreen.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function showUserInfo() {
		dispatch('showUserInfo');
	}
</script>

<div class="userInfo__container">
	<div class="who__userTitle">
		<p>Who uploaded this photo?</p>
	</div>
	<div class="userData__container">
		<div class="user__btn">
			<span on:click={showUserInfo}>
				<UserInfoGreen />
			</span>
		</div>
		<div class="user__right">
			<h4>Admin</h4>
			<div class="date__time">
				<div>2020-11-16</div>
				<div>19:32:45</div>
			</div>
			<p>Greece</p>
		</div>
	</div>
</div>

<style global>
	@media only screen and (max-width: 700px) {
		.userInfo__container {
			width: 100%;
			height: 21vh !important;
			top: 38vh;
		}
		.who__userTitle {
			width: 48% !important;
			margin-left: 17%;
			background: rgba(32, 47, 64, 1);
			margin-top: 1vh;
			padding: 10px 20px;
		}
		.user__right {
			padding: 10px;
		}
		.userData__container {
			width: 67% !important;
		}
		.date__time {
			width: 300%;
		}
		.user__btn {
			margin-left: 20px;
			display: grid;
			place-items: center;
		}
	}
	.user__btn {
		margin-right: 10px;
	}

	.userInfo__container {
		padding-top: 10px;
		position: absolute;
		width: 100%;
		margin: 0 auto;
		top: 29vh;
		height: 30%;
		background: rgba(32, 47, 64, 0.65);
	}
	.who__userTitle {
		width: 48%;
		background: rgba(32, 47, 64, 0.65);
		margin-top: 1vh;
	}
	.who__userTitle p {
		font-size: 9px;
		background: rgba(32, 47, 64, 1);
		text-transform: uppercase;
		padding: 2px 10px;
	}
	.userData__container {
		width: 20vw;
		margin: 0 auto;
		background: rgba(32, 47, 64, 1);
		font-size: 7px;
		padding: 2px 15px;
		display: flex;
	}
	.user__right h4 {
		font-size: 10px;
	}
	.date__time {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
</style>
