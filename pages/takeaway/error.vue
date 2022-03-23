<template>
	<section class="error-page" data-fullscreen>
		<error :heading="heading" :text="message" btnText="Back" btnLink="/takeaway" />
	</section>
</template>

<script>

	import Error from '~/components/iOrder-core/ErrorV2';

	export default {
		components: {
			Error
		},
		head () {
			let getMeta = () => {
				if (!this.$store.state.ui.metaDescription) { return ''; }
				return this.$store.state.ui.metaDescription;
			}
			return {
				title: 'Click and Collect - Error',
				bodyAttrs: {'data-pagecolor': 'white'},
				meta: [{
										hid: 'description',
										name: 'description',
										content: getMeta()
								}]
			}
		},
		data () {
			return {
				content: null
			}
		},
		computed: {
			heading () {
				return this.$store.state.clickAndCollect.error.heading || 'There was a problem'
			},
			message () {
				return this.$store.state.clickAndCollect.error.message || 'An error has occurred'
			}
		}
	}

</script>

<style lang="scss" scoped>

</style>
