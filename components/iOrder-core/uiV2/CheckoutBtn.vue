<template>
	<div
		data-element="checkout-btn-container"
		:data-size="containerSize"
	>
		<nuxt-link
			data-component="btn"
			v-if="href"
			:to="href"
			:data-size="size"
			:data-loading="loading"
			:class="{ inactive: inactive}"
		>
			<div data-element="quantity-container">
				<icon
					v-if="!inactive"
					icon="basket"
					:class="{ jiggle: animateBasket }"
					size="sm"
					data-element="icon"
					data-position="left"
				/>
				<span
					v-if="!inactive"
					data-element="quantity"
				>
					{{ basketCount }}
				</span>
			</div>
			<span
				data-element="text"
				v-if="!loading"
			>
				{{ text }}
			</span>
			<div class="loader white inverse" v-else></div>
			<span
				v-if="!inactive"
				data-element="price"
			>
				£{{ basketTotal }}
			</span>
		</nuxt-link>
		<div
			v-else
			data-component="btn"
			@click="handleClick"
			:class="{ inactive: inactive}"
			:data-loading="loading"
		>
			<div data-element="quantity-container">
				<icon
					v-if="!inactive"
					icon="basket"
					:class="{ jiggle: animateBasket }"
					size="sm"
					data-element="icon"
					data-position="left"
				/>
				<span
					v-if="!inactive"
					data-element="quantity"
				>
					{{ basketCount }}
				</span>
			</div>
			<span
				data-element="text"
				v-if="!loading"
			>
				{{ text }}
			</span>
			<div class="loader white inverse" v-else></div>
			<span
				v-if="!inactive"
				data-element="price"
			>
				£{{ basketTotal }}
			</span>
		</div>
	</div>
</template>

<script>

	import Icon from '~/components/iOrder-core/uiV2/Icon';

	export default {
		data () {
			return {
				animateBasket: false
			}
		},
		props: [
			'href',
			'size',
			'text',
			'inactive',
			'basketTotal',
			'basketCount',
			'containerSize',
			'handleClick',
			'loading'
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
		max-width:456px;
		background-color:transparent;
		cursor:pointer;
		&[data-size='md'] {
			padding:8px 16px;
		}
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
				background:$rebrand-blue;
				font-family:$secondary-body-font;
				font-weight:normal;
				border:none;
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
					opacity:0.3;
					pointer-events:none;
				}
				&[data-loading] {
					background-color:$rebrand-green;
				}
				[data-element='quantity-container'] {
					position:absolute;
					left:10px;
					top:14px;
					display:flex;
					align-items:center;
					[data-element='icon']{
						margin-right:4px;
					}
					[data-element='quantity']{
						font-size:16px;
						font-weight:bold;
						font-family: $font;
					}
				}
				[data-element='text']{
					text-align:center;
					line-height:1.2;
					font-size:20px;
					font-weight:normal;
					text-transform:uppercase;
				}
				[data-element="price"] {
					font-size:16px;
					font-weight:bold;
					font-family:$font;
					position:absolute;
					right:16px;
					top:16px;
				}
				outline:none;
				&:hover {
					cursor:pointer;
					@include whenScreenIs(sm) {
						background-color:$rebrand-green;
					}
				}
				&:focus, &:active {
					@include whenScreenIs(sm) {
						background-color:$rebrand-green;
					}
				}
		}
	}

</style>
