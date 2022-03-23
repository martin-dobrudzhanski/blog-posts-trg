<template>
	<div data-element="outer-container">
		<div data-element="inner-container">
			<div data-component="info-block">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
	}
</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-element='outer-container'] {
		width:314px;
		height:50vh;
		position:relative;
		overflow:hidden;
		margin-top:6px;
		[data-element='inner-container'] {
			height:50vh;
			position:absolute;
			left:0;
			overflow-x:hidden;
			overflow-y:scroll;
			[data-component='info-block'] {
				width:314px;
				border-bottom:1px solid $very-light-pink;
				min-height:188px;
				background-color:$white;
			}
		}
	}


</style>
