<template>
	<div data-component="upsell-modal">
		<div data-element="modal-container">
			<div data-element="modal-header">
				<section-header data-element="upsell-heading" :text="heading" size="md" :inverse="true" :modalHeader="true"/>
			</div>
			<div data-element="content-container">
				<p data-element="subheading" v-if="text">
					{{ text }}
				</p>
				<div data-element="image-container">
					<div data-element="upsell-image" :style="upsellImage">
						<span :aria-label="product.displayName"></span>
					</div>
					<div data-element="star" v-if="offerText">
						<div data-element="star-text" :class="textSize">
							{{ offerText }}
						</div>
					</div>
					<div data-element="product-details">
						<p data-element="product-name">
							{{ product.displayName }}
						</p>
						<p data-element="product-price">
							£{{ displayPrice }}
						</p>
					</div>
				</div>
			</div>

			<sticky-footer data-modal>
				<div data-element="buttons-container">
					<btn
						text="Skip"
						@click.native="handleSkip"
						data-element="skip-button"
						:colour="'transparent'"
						id="upsell-skip"
					/>
					<btn
						text="Add"
						@click.native="handleAdd"
						data-element="add-button"
						id="upsell-add"
					/>
				</div>
			</sticky-footer>
		</div>
	</div>
</template>

<script>

	import SectionHeader from '~/components/iOrder-core/uiV2/SectionHeader';
	import Btn           from '~/components/iOrder-core/uiV2/Btn';
	import StickyFooter  from '~/components/iOrder-core/uiV2/StickyFooter';


	export default {
		data () {
			return {
				selectedPortionId: this.defaultPortionId,
				selectedChoices: []
			}
		},
		props: [
			'addItemToBasket',
			'product',
			'image',
			'getProduct',
			'heading',
			'text',
			'offerText'
		],
		components: {
			SectionHeader,
			Btn,
			StickyFooter
		},
		computed: {
			productDetails () {
				return this.getProduct(this.product.productId);
			},
			displayPrice () {
				const productDetails = this.productDetails;
				if(!productDetails.portions) {
					return false;
				}
				if(productDetails.portions.length === 1) {
					return productDetails.portions.find(portion => portion.id === this.product.defaultPortionId).price;
				} else {
					return Math.min( ...productDetails.portions.map(portion => portion.price));
				}
			},
			textSize () {
				return this.offerText.length > 6 ? 'small-text' : '';
			},
			upsellImage () {
				return {
					backgroundImage: `url('${this.image}')`
				};
			}
		},
		methods: {
			handleAdd () {
				this.addItemToBasket(this.product);
				this.$router.push(`/restaurants/${this.$store.state.clickAndCollect.location.slug}/takeaway/basket`);
				this.$emit('close-upsell-modal')
			},
			handleSkip () {
				this.$router.push(`/restaurants/${this.$store.state.clickAndCollect.location.slug}/takeaway/basket`);
				this.$emit('close-upsell-modal')
			}
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='upsell-modal'] {
		position:fixed;
		z-index:99999;
		top:0; right:0;
		bottom:0; left:0;
		display:flex;
		align-items:center;
		justify-content:center;
		overflow-y:auto;
		background-color:$white-two;
		@include whenScreenIs(sm) {
			background-color:rgba(0,0,0,.3);
			flex-direction:column;
		}
		[data-element='modal-container'] {
	 		position:relative;
			width:100%;
			height:100%;
			max-height:800px;
			overflow-y:auto;
			display:flex;
			flex-direction:column;
			align-items:center;
			@include whenScreenIs(sm) {
				background-color:#fff;
				height:500px; width:400px;
				padding-bottom:0;
				max-height:none;
			}
			[data-element='modal-header'] {
				position:absolute;
				left:0;
				top:0;
				width:100%;
				background-color: transparent;
				z-index: 1;
				[data-element='upsell-heading'] {
					margin:4px 0 8px;
					background-color: transparent;
					color:$rebrand-orange;

					h2 {
						font-size:28px !important;
					}
				}
			}
			[data-element='content-container'] {
				padding:76px 16px 0;
				overflow-y:auto;
				width:100%;
				display:flex;
				flex-direction:column;
				align-items:center;
				@include whenScreenIs(sm) {
					padding-top:82px;
				}
				@media only screen and (max-height: 535px) {
					padding:52px 16px 0;
				}
				[data-element='subheading'] {
					width:100%;
					text-align:center;
					font-size:15px;
					@include whenScreenIs(sm) {
						padding:0 18px;
					}
				}
				[data-element='image-container'] {
					position:relative;
					width:100%;
					padding:0 16px;
					margin-top:35px;
					max-width: 329px;
					@include whenScreenIs(sm) {
						padding:0 34px;
						[data-element='star'] {
							right:10px;
						}
					}
					@media only screen and (max-height: 535px) {
						margin-top:30px;
						width:85%;
					}
					[data-element='upsell-image'] {
						width:100%;
						background-size:cover;
						background-position:center;
						&:before{ // To make the height of the element dynamically equal the width
							content:"";
							display:block;
							padding-top:100%;
						}
					}
					[data-element='star'] {
						position:absolute;
						top:-30px;
						right:-6px;
						min-width:100px;
						min-height:100px;
						background-image:url('~/assets/img/iorder-coreV2/icons/offer-star.svg');
						background-size:contain;
						background-repeat:no-repeat;
						display:flex;
						align-items:center;
						justify-content:center;
						padding:7%;
						&:before{ // To make the height of the element dynamically equal the width
							content:"";
							display:block;
							padding-top:100%;
						}
						[data-element='star-text'] {
							font-weight:bold;
							font-style:italic;
							font-size:26px;
							color:$white;
							&.small-text {
								font-size:20px;
							}
						}
					}
				}
				[data-element='product-details'] {
					margin-top:12px;
					width:100%;
					padding:0;
					display:flex;
					justify-content:space-between;
					@include whenScreenIs(sm) {
						padding:0;
					}
					@media only screen and (max-height: 535px) {
						margin-top:8px;
					}
					[data-element='product-name'] {
						text-align:left;
						width:80%;
						font-size:15px;
					}
					[data-element='product-price'] {
						font-weight:normal;
						font-size:15px;
					}
				}
			}
			[data-element='buttons-container'], [data-element='buttons-container-desktop'] {
				width:100%;
				padding:0 12px 20px;
				display:flex;
				flex-direction:row;
				[data-element='add-button'], [data-element='skip-button'] {
					margin:4px;
				}
			}
			[data-element='buttons-container'] {
				position:absolute;
				bottom:0;
				background:$white-two;
				width:100%;
				padding:0 28px 20px;
				display:flex;
				@include whenScreenIs(sm) {
					padding:16px 34px 16px;
					position:static;
					background-color:$white;
				}
				@media only screen and (max-height: 535px) {
					padding-bottom:8px;
				}
			}
		}
	}
</style>
