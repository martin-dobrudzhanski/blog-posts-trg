import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
	createPersistedState({
		key: 'chiqv2',
		paths: [
			'location.coords',
			'location.accepted',
			'ui.cookiesMessageIsVisible',
			'ui.GDPRMessageIsVisible',
			'auth.token',
			'auth.user',
			'auth.facebookPermissionsGranted',
			'ui.isApp',
			'ui.appPlatform',
			'iorderAuth.user.email',
			'iorderAuth.btUuid',
			'iorderCheckout.requiredCheckoutData.basketId',
			'iorderCheckout.requiredCheckoutData.basketTotal',
			'iorderCheckout.requiredCheckoutData.btToken',
			'iorderCheckout.requiredCheckoutData.discount',
			'clickAndCollect',
			'orderAtTable',
			'segments.contactId'
		]
	})(store)
}
