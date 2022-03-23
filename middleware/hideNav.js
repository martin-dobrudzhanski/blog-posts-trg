export default function({ store }) {
  if (process.server) {
    return;
  }
  store.commit('ui/hideHeaderDrawer');
  store.commit('ui/hideBottomNavigationDrawer');
}
