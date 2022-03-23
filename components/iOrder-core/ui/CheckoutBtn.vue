<template>
	<div data-element="checkout-btn-container">
		<nuxt-link data-component="btn"
			:to="href"
			:data-size="size"
			:class="{ inactive: inactive}">
			<icon :icon="inactive ? 'basket-inactive' : 'basket'"
				:class="{ jiggle: animateBasket }"
				size="sm"
				data-element="icon"
				data-position="left"
				/>
			<span data-element="quantity">{{ basketCount }}</span>
			<span data-element="text">Checkout</span>
			<span data-element="price">£{{ basketTotal }}</span>
		</nuxt-link>
	</div>
</template>

<script>

	import Icon from '~/components/iOrder-core/ui/Icon';

	export default {
		data () {
			return {
				animateBasket: false
			}
		},
		props: [
			'href',
			'size',
			'inactive',
			'basketTotal',
			'basketCount'
		],
		components: {
			Icon
		},
		watch: {
			basketCount() {
				this.animateBasket = true;
				setTimeout(() => {
					this.animateBasket = false;
				}, 500);
			}
		}
	}
</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-element='checkout-btn-container'] {
		position:relative;
		display:flex;
		align-items:center;
		justify-content:center;
		width:100%;
		cursor:pointer;
		@include whenScreenIs(sm) {
			display:flex;
			justify-content:center;
		}
			[data-component='btn'] {
				position:relative;
				width:100%;
				display:flex;
				align-items:center;
				justify-content:center;
				height:48px; width:100%;
				color:#ffffff;
				background:$rebrand-green;
				border:none;
				@include whenScreenIs(sm) {
					max-width:328px;
				}
				&[data-size='md'] {
					width:calc(100% - 32px);
					margin:0 16px;
					@include whenScreenIs(sm) {
						width:208px;
					}
				}
				&[data-size='sm'] {
					height:50px; width:72px;
					@include whenScreenIs(sm) {
						height:48px;
					}
				}
				&.inactive {
					background:#ffffff;
					border:1px solid $rebrand-green;
					color:$rebrand-green;
					opacity:0.3;
					pointer-events:none;
				}
				[data-element='text']{
					text-align:center;
					line-height:1.33;
					font-size:18px;
					font-weight:bold;
				}
				[data-element='icon']{
					position:absolute;
					left:16px;
					top:12px;
				}
				[data-element='quantity']{
					position:absolute;
					left:48px;
					top:16px;
					font-size:14px;
				}
				[data-element="price"] {
					font-size:14px;
					font-weight:500;
					position:absolute;
					right:16px;
					top:16px;
				}
				outline:none;
				&:hover {
					background-color:$rebrand-green;
					cursor:pointer;
				}
				&:focus, &:active {
					background-color:$rebrand-green;
				}
		}
	}


</style>
