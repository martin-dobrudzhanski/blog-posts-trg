<template>
	<div class="allergy-container" data-fullscreen>
		<iframe id="allergy-iframe" :src="content.iframeUrl"></iframe>
	</div>
</template>


<script>

	import { getContent } from '~/libs/templateHelpers.js'

	export default {
		head () {
			let getMeta = () => {
				if (!this.$store.state.ui.metaDescription) {
					return '';
				}
				return this.$store.state.ui.metaDescription;
			}
			return {
				title: 'Allergy advice',
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
			return await getContent(store, `allergy-page/${params.slug}`, error);
		}
	}

</script>

<style lang="scss">
	.allergy-container {
		#allergy-iframe {
				width: 100%;
				height: 100vh;
				margin-top: -3px; // to hide horrible red line at top of page.
		}
	}
 </style>
