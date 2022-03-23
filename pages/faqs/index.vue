<template>
  <section class="faqs" data-fullscreen>
		<div class="header-container">
			<h1 class="heading" data-size="xl" data-weight="normal">{{content.headerText}}</h1>
		</div>
		<div class="faqs-container">
			<FaqListings :faqs="content.sections" />
		</div>
  </section>
</template>

<script>


	import { getContent } from '~/libs/templateHelpers.js'
	import FaqListings from '~/components/faqs/FaqListings.vue'

	export default {
		components: {
			FaqListings
		},
		head () {
			let getMeta = () => {
				if (!this.$store.state.ui.metaDescription) {
					return '';
				}
				return this.$store.state.ui.metaDescription;
			}
			return {
				title: 'FAQs',
				bodyAttrs: {
					'data-pagecolor': 'light-grey'
				},
				meta: [
					{
						hid: 'description',
						name: 'description',
						content: getMeta()
					}
				]
			}
		},
		data () {
			return {
				content: null
			}
		},
		async asyncData ({ store, params, error }) {
			return await getContent(store, 'faq-page', error);
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';
	.faqs {
		background-color: $rebrand-very-light-pink;
	  padding-bottom: 30px;
		.header-container {
      background-color:$rebrand-blue;
			position:relative;
			height: 56px;
			@include whenScreenIs(mdx) { height: 80px; }
			h1.heading {
				color: white;
				line-height: 56px;
				@include whenScreenIs(mdx) { line-height: 80px; }
			}
		}
	}

</style>
