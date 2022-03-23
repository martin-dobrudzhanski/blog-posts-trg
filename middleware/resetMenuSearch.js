export default function ({ store }) {
	if (!store.getters['ui/showMenuSearch']) {
		return;
	}
	store.dispatch('ui/resetMenuSearch');
}
