export default {
	beforeMount () {
		this.$store.dispatch('ui/hidePrivacyBanners')
	}
}
