<template>
	<div
		data-component="basket-totals"
		:data-discount="discount"
	>
		<div
			data-element="row"
			v-if="discount"
		>
			<p data-element="label">
				Subtotal
			</p>
			<p data-element="amount">
				£{{ subtotal }}
			</p>
		</div>
		<div
			data-element="row"
			v-if="discount"
		>
			<p data-element="label">
				Discount
			</p>
			<p data-element="amount">
				- £{{ discount }}
			</p>
		</div>
		<div
			data-element="row"
			data-total
		>
			<p data-element="label">
				Total
			</p>
			<p data-element="amount">
				£{{ discountedTotal }}
			</p>
		</div>
	</div>
</template>

<script>

	export default {
		props: [
			'subtotal',
			'discount',
			'discountedTotal'
		]
	}
</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='basket-totals'] {
		width:100%;
		max-width:456px;
		padding:0 16px;
		background:#f8f8f8;
		&[data-discount] {
			padding-top:12px;
		}
		@include whenScreenIs(mdx) {
			padding-top:15px;
		}
		[data-element='row'] {
			display:flex;
			justify-content:space-between;
			padding-bottom:8px;
			@include whenScreenIs(mdx) {
				padding-bottom:16px;
			}
			&[data-total] {
				display:none;
				@include whenScreenIs(mdx) {
					display:flex;
				}
			}
			[data-element='label'],
			[data-element='amount'] {
				color:#000;
				font-size:16px;
				font-weight:500;
			}
		}
	}
</style>
