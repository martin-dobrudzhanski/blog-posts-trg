// const appPlatformHeader = 'x-trgapp-platform';

export const actions = {
	nuxtServerInit ({ commit }, { req }) {
		if (!req.query) {
			return;
		}
		if (!req.query.appPlatform) {
			return;
		}
		// TODO: set app platform as an environment variable
		commit('ui/setAppPlatform', { platform: req.query.appPlatform });
	}
}
