<template lang="html">
	<section
		class="restaurant-slug-order-ahead-checkout-success"
		data-nofooter-fullscreen
	>
		<spinner
			data-element="spinner"
			v-if="!pageReady"
		/>
		<section-header
			v-if="pageReady"
			text="Payment successful!"
			textWidth="lg"
			size="sm"
			:background="`transparent`"
			:inverse="true"
		/>
		<success
			v-if="pageReady"
			:orderAtTable="true"
			:textTop="content.successTextTop"
			:textBottom="content.successTextBottom"
			:phoneNumber="successData.phoneNumber"
			:centerHeading="`Order details`"
			:location="successData.location"
			:orderRef="successData.orderRef"
			:lineItems="successData.basket.lines"
			:getProduct="getProduct"
			:total="successData.total"
			:discount="successData.discount"
			:buttonLink="buttonLink"
			:buttonText="buttonText"
			:basketCount="successData.basketCount"
			:tableNumber="successData.table"
		/>
	</section>
</template>

<script>

	import { getContent }     from '~/libs/templateHelpers.js'
	import meta               from '~/mixins/meta';
	import hidefooter         from '~/mixins/hidefooter';
	import hidePrivacyBanners from '~/mixins/hidePrivacyBanners';
	import SectionHeader      from '~/components/iOrder-core/uiV2/SectionHeader';
	import Spinner            from '~/components/iOrder-core/uiV2/GenericLoader';
	import Success            from '~/components/iOrder-core/checkoutV2/Success';


	export default {
		components: {
			SectionHeader,
			Spinner,
			Success
		},
		mixins: [ meta, hidePrivacyBanners, hidefooter ],
		data () {
			return {
				content: null,
				pageReady: null,
				showDetails: false,
				successData: {},
				productsDictionary: null
			}
		},
		async asyncData ({ store, params, error }) {
			return await getContent(store, `order-at-table/${params.slug}`, error);
		},
		computed: {
			buttonText () {
				return this.content && this.content.successPageButtonText;
			},
			buttonLink () {
				return this.content && this.content.successPageButtonLink;
			}
		},
		methods: {
			init () {
				if (!this.$store.state.iorderCheckout.successData.uniqueRef) {
					return this.$router.push('/order');
				}

				this.productsDictionary = this.$store.getters['orderAtTable/getProductsDictionary'];

				this.successData = Object.assign({}, {
					basketCount: this.$store.getters['orderAtTable/getBasketCount'],
					phoneNumber: this.$store.state.orderAtTable.location.telephone,
					orderRef:    this.$store.state.iorderCheckout.successData.uniqueRef,
					email:       this.$store.state.iorderCheckout.successData.receiptEmail,
					basket:      this.$store.getters['orderAtTable/getBasket'],
					discount:    Math.abs(this.$store.state.iorderCheckout.requiredCheckoutData.discount),
					total:       this.$store.state.iorderCheckout.requiredCheckoutData.basketTotal,
					location:    this.$store.state.orderAtTable.location.name,
					table:       this.$store.getters['orderAtTable/getTableNumber']
				})
				this.pageReady = true;
				this.$store.dispatch('orderAtTable/initState');
			},
			getProduct (productId) {
				return this.productsDictionary[productId];
			},
		},
		mounted () {
			this.init();
		}
	}
</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.restaurant-slug-order-ahead-checkout-success {
		background-color:$white-two;
		padding-bottom:150px;
		overflow-x: hidden;
	}

</style>
