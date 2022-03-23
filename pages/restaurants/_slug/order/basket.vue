<template>
	<section class="basket-page" data-nofooter-fullscreen>
		<div data-element="basket-page-container">
			<section-header
				data-element="page-header"
				:text="content.restaurant.fields.name"
				size="sm"
			/>
			<secondary-header
				v-if="content.basketDiscountCopy"
				data-element="payment-discount-desktop"
				:text="content.basketDiscountCopy"
			/>
			<basket
				appLabel="orderAtTable"
				basketHeading="Your basket"
				:content="content"
				:table="$store.getters['orderAtTable/getTableNumber']"
				:hideVouchering="true"
			/>
		</div>
	</section>
</template>

<script>

	import { getContent }         from '~/libs/templateHelpers.js';
	import menuAndBasket          from '~/mixins/iOrder-core/menuAndBasket';
	import basket                 from '~/mixins/iOrder-core/basket';
	import iOrderConfig           from '~/mixins/iOrderConfig';
	import hidePrivacyBanners     from '~/mixins/hidePrivacyBanners';
	import hidefooter             from '~/mixins/hidefooter';
	import Basket                 from '~/components/iOrder-core/basketV2/Basket';
	import orderAtTable           from '~/mixins/orderAtTable';

	export default {
		mixins: [
			menuAndBasket,
			iOrderConfig,
			basket,
			hidePrivacyBanners,
			hidefooter,
			orderAtTable
		],
		scrollToTop: true,
		components: {
			Basket
		},
		async asyncData ({ store, params, error }) {
			return await getContent(store, `order-at-table/${params.slug}`, error);
		},
		methods: {
			async init () {
				this.$store.dispatch('orderAtTable/checkNecessaryDataToProceed', { salesDataCount: 6 });
				this.checkOrderAtTableEnabled();

				this.setIorderConfigs('orderAtTable');
			}
		},
		created () {
			this.init();
			this.initMixin('orderAtTable');
		},
		mounted () {
			window.scrollTo(0,0);
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.basket-page {
		background-color:$very-light-pink;
		padding-bottom:24px;
		width:100%;
		@include whenScreenIs(mdx) {
			background-color:$very-light-pink;
		}
		* { @include noselect }
		[data-element='basket-page-container'] {
			margin:0 auto;
			display:flex;
			flex-direction:column;
			max-width:456px;
			@include whenScreenIs(mdx) {
				max-width:none;
				padding-top:0;
				align-items:flex-start;
			}
			[data-element='page-header'] {
				display:none;
				@include whenScreenIs(mdx) {
					display:flex;
				}
			}
			[data-element='payment-discount-desktop'] {
				display:none;
				@include whenScreenIs(mdx) {
					display:block;
				}
			}
			[data-element='basket-content-container'] {
				width:100%;
				display:flex;
				flex-direction:row;
				[data-element='basket-listing'] {
					width:100%;
					@include whenScreenIs(mdx) {
						width:529px;
						margin-left:67px;
					}
					[data-element='basket-header'] {
						position:relative;
						display:flex;
						align-items:center;
						justify-content:center;
						width:100%;
						@include whenScreenIs(mdx) {
							justify-content:flex-start;
						}
						[data-element='icon'] {
							position:absolute;
							top:16px;
							left:16px;
							@include clickable(true);
							@include whenScreenIs(mdx) {
								top:40px;
							}
						}
						[data-element='basket-heading'] {
							font-size:20px;
							text-align:center;
							padding:16px;
							@include whenScreenIs(mdx) {
								text-align:left;
								margin:24px 0 16px 73px;
								padding-left:0;
							}
						}
					}
					[data-element='payment-discount-mobile'] {
						@include whenScreenIs(mdx) {
							display:none;
						}
					}
					[data-element='timeslot-display'] {
						margin:16px;
						@include whenScreenIs(mdx) {
							margin:0 0 0 73px;
						}
					}
					[data-element='basket'] {
						margin:0 16px 104px;
						@include whenScreenIs(mdx) {
							background-color:$white;
							margin:24px 0 0 73px;
						}
					}
					[data-element="empty-basket"] {
						[data-element="text"] {
							font-size: 21px;
							color: $booger-green;
							text-align: center;
							font-weight: 900;
							margin: 30px 0;
						}
					}
				}
				[data-element='desktop-summary'] {
					display:none;
					@include whenScreenIs(mdx) {
						display:flex;
						flex-direction:column;
						width:314px;
						margin-top:40px;
						margin-left:38px;
					}
				}
			}
			[data-element='sticky-footer'] {
				display:flex;
				flex-direction:column;
				@include whenScreenIs(mdx) {
					display:none;
				}
			}
		}
	}

</style>
