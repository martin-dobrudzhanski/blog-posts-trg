import Vue from 'vue';
import get from 'lodash.get';

export const state = () => {
  return {
    nav: {
      open: false,
      headerDrawerOpen: false,
      bottomNavigationDrawerOpen: false,
      navItems: {
        header: [],
        headerCta: null,
        footer: [],
        mobile: [],
        footerSocialLinks: [],
        stickyFooter: []
      }
    },
    metaDescription: null,
    cookiesMessageIsVisible: true,
    GDPRMessageIsVisible: true,
    modalIsVisible: false,
    activeModal: null,
    modalOptions: null,
    flashMessage: {
      isVisible: false,
      messageStr: null
    },
    isApp: false,
    appPlatform: null,
    analyticsIds: {
      app: 'UA-16319728-1',
      web: 'UA-16319728-1'
    },
    showMenuSearch: null
  };
};

export const getters = {
  headerNavigationLinks(state) {
    return state.nav.navItems.header.map(link => link && link.fields);
  },
  headerDrawerOpen(state) {
    return state.nav.headerDrawerOpen;
  },
  bottomNavigationDrawerOpen(state) {
    return state.nav.bottomNavigationDrawerOpen;
  },
  headerNavigationCta(state) {
    return get(state, 'nav.navItems.headerCta.fields');
  },
  mobileNavigationLinks(state) {
    return state.nav.navItems.mobile.map(link => link && link.fields);
  },
  footerSocialLinks(state) {
    return state.nav.navItems.footerSocialLinks.map(
      link => link && link.fields
    );
  },
  footerNavigationLinks(state) {
    return state.nav.navItems.footer.map(link => link && link.fields);
  },
  bottomNavigationActions(state) {
    return state.nav.navItems.stickyFooter.map(link => {
      const iconSrc = get(link, 'fields.icon.fields.file.url');
      const iconActiveSrc = get(link, 'fields.activeIcon.fields.file.url');
      const title = get(link, 'fields.title');
      const url = get(link, 'fields.url');
      const newTab = get(link, 'fields.newTab');
      const external = get(link, 'fields.isExternalLink');

      return {
        iconSrc,
        iconActiveSrc,
        title,
        url,
        newTab,
        external
      };
    });
  },
  // TODO: replace with .env
  getAnalyticsId(state) {
    if (!state.isApp) {
      return state.analyticsIds.web;
    }
    return state.analyticsIds.app;
  },
  showMenuSearch(state) {
    return state.showMenuSearch;
  },
  // TODO: individual getters not whole ui
  navOpen(state) {
    return state.nav.open;
  },
  getFlashMessage(state) {
    return state.flashMessage.message;
  }
};

export const mutations = {
  showHeaderDrawer(state) {
    document.body.setAttribute('data-nav', true);
    state.nav.headerDrawerOpen = true;
  },
  hideHeaderDrawer(state) {
    document.body.removeAttribute('data-nav');
    state.nav.headerDrawerOpen = false;
  },
  showBottomNavigationDrawer(state) {
    document.body.setAttribute('data-nav', true);
    state.nav.bottomNavigationDrawerOpen = true;
  },
  hideBottomNavigationDrawer(state) {
    document.body.removeAttribute('data-nav');
    state.nav.bottomNavigationDrawerOpen = false;
  },
  // TODO: delete and call directly from .env
  setAppPlatform(state, { platform }) {
    state.appPlatform = platform;
    state.isApp = true;
  },
  showFlashMessage(state, { message }) {
    Vue.set(state.flashMessage, 'message', message);
    state.flashMessage.isVisible = true;
  },
  hideFlashMessage(state) {
    state.flashMessage.message = null;
    state.flashMessage.isVisible = false;
  },
  // TODO: delete show/hide, replace with setNavState(payload)
  showNav(state) {
    // TODO: replace with class on body linked to top level state freeze
    document.body.setAttribute('data-nav', true);
    state.nav.open = true;
  },
  hideNav(state) {
    document.body.removeAttribute('data-nav');
    state.nav.open = false;
  },
  setMetaDescription(state, metaDescription) {
    state.metaDescription = metaDescription;
  },
  setNav(state, navItems) {
    // TODO: Add individual mutations for these and call from action if you need to group state manipulation
    state.nav.navItems.header = navItems.header;
    state.nav.navItems.footer = navItems.footer;
    state.nav.navItems.headerCta = navItems.headerCta;
    state.nav.navItems.app = navItems.app;
    state.nav.navItems.mobile = navItems.mobile;
    state.nav.navItems.footerSocialLinks = navItems.footerSocialLinks || [];
    Vue.set(state.nav.navItems, 'stickyFooter', navItems.stickyFooter || []);
  },
  closeCookiesMessage(state) {
    state.cookiesMessageIsVisible = false;
  },
  closeGDPRMessage(state) {
    state.GDPRMessageIsVisible = false;
  },
  showModal(state, { modal, modalOptions }) {
    // TODO: stop adding stuff to the DOM!
    document.body.setAttribute('data-modal', true);
    // TODO: Split these out into own mutations, call from action to group
    state.modalIsVisible = true;
    state.activeModal = modal;
    state.modalOptions = modalOptions;
  },
  hideModal(state) {
    // TODO: stop adding stuff to the DOM!
    document.body.removeAttribute('data-modal');
    state.modalIsVisible = false;
    state.activeModal = null;
    state.modalOptions = null;
  },
  resetMenuSearch(state) {
    state.showMenuSearch = false;
  },
  toggleMenuSearch(state) {
    state.showMenuSearch = !state.showMenuSearch;
  }
};

export const actions = {
  toggleNav({ state, getters, commit }) {
    if (state.nav.open === false) {
      commit('showNav');
      return;
    }
    commit('hideNav');
  },
  flash({ commit }, options) {
    commit('showFlashMessage', options);
  },
  // TODO: put states on these. don't randomly add stuff directly to the DOM!
  hideFooter({}) {
    document.body.classList.add('hide-footer');
  },
  showFooter({}) {
    document.body.classList.remove('hide-footer');
  },
  hidePrivacyBanners({}) {
    document.body.classList.add('hide-privacy-banners');
  },
  showPrivacyBanners({}) {
    document.body.classList.remove('hide-privacy-banners');
  },
  // TODO: Separate out search into own component
  resetMenuSearch({ commit }) {
    commit('resetMenuSearch');
  },
  toggleMenuSearch({ commit }) {
    commit('toggleMenuSearch');
  },
  showModal({ commit }, data) {
    commit('showModal', data);
  }
};
