<template>
  <section class="contact" data-fullscreen>
		<iframe class="contact-iframe" :src="content.iframeUrl"></iframe>
  </section>
</template>

<script>

	// import ContactForm from '~/components/ContactForm';
	import { getContent } from '~/libs/templateHelpers.js'

	export default {
		components: {
			// ContactForm
		},
		head () {
			let getMeta = () => {
				if (!this.$store.state.ui.metaDescription) {
					return '';
				}
				return this.$store.state.ui.metaDescription;
			}
			return {
				title: 'Contact us',
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
			return await getContent(store, 'contact-page', error);
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	section.contact {
		padding-bottom:24px;
		background-color:$very-light-pink;
		.contact-iframe {
			height: 100vh; width: 100%;
      .wholeForm {
        font-family:'alte-haas-grotesk';
        input[type="submit"] {
          background-color:red;
        }
      }
		}
		// .contact-form {
		// 	margin:0; padding:0;
		// 	form {
		// 		margin:0 auto 35px;
		// 		max-width:560px;
		// 		@include whenScreenIs(xs) {
		// 			margin:0 16px;
		// 			max-width:100%;
		// 			padding-bottom:54px;
		// 		}
		// 	}
		// }
	}

</style>
