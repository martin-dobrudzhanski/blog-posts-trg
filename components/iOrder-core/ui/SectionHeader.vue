<template>
	<div
	data-component="drinks-header"
	:data-inverse="inverse"
	:data-modal-header="modalHeader">
		<h2
		data-element="text"
		:data-size="size"
		:data-inverse="inverse">{{ text }}</h2>
	</div>
</template>

<script>
	export default {
		props: [ 'text', 'size', 'inverse', 'modalHeader' ]
	}
</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='drinks-header'] {
		background:$booger-green;
		display:flex;
		align-items:center;
		justify-content:center;
		padding:16px;
		width:100%;
		&[data-inverse] {
			background:#fff;
		}
		&:not([data-modal-header]) {
			@include whenScreenIs(sm) {
				padding:24px;
			}
		}
		[data-element='text'] {
			width:70%;
			color:#fff;
			font-size:20px;
			font-weight:900;
			line-height:1.2;
			text-align:center;
			&[data-inverse] {
				color:$booger-green;
			}
			&[data-size='sm'] {
				font-size:20px;
				@include whenScreenIs(sm) {
					width:432px;
				}
			}
			&[data-size='md'] {
				font-size:18px;
				width:280px;
				@include whenScreenIs(sm) {
					font-size:20px;
					width:432px;
				}
			}
			@include whenScreenIs(sm) {
				font-size:28px;
				width:328px;
			}
		}
	}
</style>
