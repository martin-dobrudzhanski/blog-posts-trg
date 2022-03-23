export default {
	computed: {
		orderAtTableEnabled () {
			const enabled = this.content &&
							this.content.restaurant &&
							this.content.restaurant.fields &&
							this.content.restaurant.fields.orderAtTable;

			const globallyEnabled = this.content && this.content.globallyEnabled;


			return enabled && globallyEnabled === 'enabled';
		}
	},
	methods: {
		checkOrderAtTableEnabled () {
			console.log('orderAtTableEnabled: ', this.orderAtTableEnabled)
			if (!this.orderAtTableEnabled) {
				this.$store.dispatch('orderAtTable/showError', { heading: 'Oops, sorry about that', message: 'Order at Table is not available right now. Please speak to your server to place an order. (code: cmskill)'});
				return;
			}
			return true;
		}
	}
}
