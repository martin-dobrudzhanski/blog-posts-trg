export default {
	methods: {
		setIorderConfigs (storeLabel) {
			this.$store.dispatch(`${storeLabel}/setIorderConfigs`);
		}
	}
}
