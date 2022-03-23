<template>
	<no-ssr>
		<div data-component="spinner-overlay">
			<div data-element="spinner-container">
				<img data-element="spinner" src="~/assets/img/iorder-core/icons/loader.svg" alt="Loading..." />
			</div>
		</div>
	</no-ssr>
</template>
<script>
	import NoSSR from 'vue-no-ssr';

	export default {
		components: {
			NoSSR	
		}		
	}
</script>

<style lang="scss" scoped>

[data-component="spinner-overlay"] {
	position: relative;
	height: 0;
	padding-bottom: 100%;
	[data-element="spinner-container"] {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		[data-element="spinner"] {
			animation: spinner 1.75s linear infinite;
			display: block;
			height: 26px;
			margin: 2em auto;
			width: 26px;
		}
		@keyframes spinner {
			to {
				transform: rotate(360deg);
			}
		}
	}
}
</style>
