<template>
	<div data-component="secondary-header">
		<h2 data-element="text">
			{{ text }}
		</h2>
	</div>
</template>

<script>
export default {
	props: [
		'text'
	]
}
</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='secondary-header'] {
		padding:14px 16px;
		background-color:$rebrand-orange;
		width:100%;
		[data-element='text'] {
			text-align:center;
			color:$white;
			font-weight:bold;
			font-size:14px;
			@include whenScreenIs(mdx) {
				font-size:18px;
				line-height:1.11;
			}
		}
	}
</style>
