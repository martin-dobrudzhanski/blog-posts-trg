export default function ({ store }) {
	if (process.server) {
		return;
	}
	store.commit('ui/hideModal');
}
