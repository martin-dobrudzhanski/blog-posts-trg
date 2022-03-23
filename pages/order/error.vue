<template>
	<section class="error-page">
		<error
			:heading="heading"
			:text="message"
			:btnText="btnText"
			:btnLink="btnLink"
		/>
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
				title: 'Order At Table - Error',
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
				return this.$store.state.orderAtTable.error.heading || 'There was a problem'
			},
			message () {
				return this.$store.state.orderAtTable.error.message || 'An error has occurred'
			},
			btnLink () {
				if (this.$store.state.orderAtTable.error.homeLink) {
					return '/'
				}
				return '/order'
			},
			btnText () {
				if (this.$store.state.orderAtTable.error.homeLink) {
					return 'Home'
				}
				return 'Back'
			}
		},
		mounted () {
			this.$store.dispatch('ui/showFooter')
		}
	}

</script>

<style lang="scss" scoped>

</style>
