export default {	
	beforeMount () {
		this.$store.dispatch('ui/hideFooter')
	}
}
