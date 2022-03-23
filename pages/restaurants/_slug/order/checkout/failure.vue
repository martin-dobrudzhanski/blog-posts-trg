<template>
	<section
		class="checkout-failure-page"
		data-nofooter-fullscreen
	>
		<error
			heading="Payment failed"
			text="Sorry, your payment did not go through"
			btnText="Try again"
			:btnLink="renderBasketPage"
			:hideTerms="true"
		/>
	</section>
</template>

<script>
	import { getContent } from '~/libs/templateHelpers.js'
	import meta from '~/mixins/meta'
	import hidePrivacyBanners from '~/mixins/hidePrivacyBanners';
	import hidefooter from '~/mixins/hidefooter';
	import Error from '~/components/iOrder-core/ErrorV2';

	export default {
		mixins: [meta, hidePrivacyBanners, hidefooter],
		components: {
			Error
		},
		computed: {
			renderBasketPage () {
				const slug = this.$route.params.slug
				if (slug) {
					return `/restaurants/${slug}/order/basket`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';

	.checkout-failure-page {
		background-color:$white-two;
		[data-position="center"] {
			width: 300px;
			margin: 0 auto;
		}
	}

</style>
