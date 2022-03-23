<template>
	<div data-component="sticky-footer">
		<slot></slot>
	</div>
</template>

<script>

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='sticky-footer'] {
		height:64px; width:100%;
		position:fixed;
		bottom:0; left:0;
		background-color:$white;
		display:flex;
		align-items:center;
		justify-content:center;
		padding:8px 16px;
		@include whenScreenIs(sm) {
			left:auto;
			max-width:560px;
		}
		&[data-modal] {
			@include whenScreenIs(sm) {
				background-color:$white;
				height:64px; width:400px;
				padding:32px 0;
				position:static;
			}
		}
		&.user-details {
			height:64px;
		}
		&.alternative-times {
			height:128px;
			padding:0;
		}
	}

</style>
