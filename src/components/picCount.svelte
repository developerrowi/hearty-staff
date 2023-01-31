<script>
	export let count;
</script>

<div class={`shadow-lg pic__countDiv`}>
	<p style="color:#f2d0b8">PICS</p>
	<p class="pic__count">
		{count < 9 ? `0${count}` : count}
	</p>
</div>

<style global>
	@media only screen and (max-width: 700px) {
		.pic__countDiv {
			margin: 0 !important;
			position: absolute;
			width: 8%;
			border-radius: 5px;
			top: 30%;
			left: 15%;
			flex: 1;
			padding-right: 20px;
		}
		.left {
			left: 16vw;
		}
		.right {
			right: 23%;
		}
		.pic__count {
			padding: 0 20%;
			color: #80bf95;
			background: #3c4650;
			margin-left: 15%;
			border-top-right-radius: 5px;
			border-bottom-right-radius: 5px;
		}
	}
	@media only screen and (max-width: 560px) {
		.right {
			right: 38% !important;
		}
	}
	@media only screen and (max-width: 330px) {
		.right {
			right: 42% !important;
		}
	}
	.pic__countDiv {
		margin-top: 1.3%;
		margin-left: 23%;
		display: flex;
		width: 8%;
		border-radius: 5px;
	}
	.pic__count {
		padding: 0 15%;
		color: #80bf95;
		background: #3c4650;
		margin-left: 11%;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
</style>
