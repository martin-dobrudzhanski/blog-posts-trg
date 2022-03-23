export const state = () => {
  return {
    config: null,
    btUuid: null,
    modalIsVisible: false,
    activeModal: null,
    user: {
      email: null,
      name: null,
      phone: null,
      token: null
    }
  };
};

export const getters = {
  getCurrentUser(state) {
    return {
      email: state.user.email,
      name: state.user.name,
      phone: state.user.phone,
      token: state.user.token
    };
  },
  hasGuestDetails(state) {
    return state.user.email && state.user.name && state.user.phone;
  }
};

export const mutations = {
  showModal(state, { modal, modalOptions }) {
    document.body.setAttribute('data-modal', true);
    state.modalIsVisible = true;
    state.activeModal = modal;
  },
  hideModal(state) {
    document.body.removeAttribute('data-modal');
    state.modalIsVisible = false;
    state.activeModal = null;
  },
  setToken(state, { token }) {
    state.user.token = token;
  },
  setBtUuid(state, { uuid }) {
    state.btUuid = uuid;
  },
  setUserEmail(state, { email }) {
    state.user.email = email;
  },
  setIorderConfig(state, { config }) {
    state.config = config;
  },
  setGuestDetails(state, { email, phone, name }) {
    state.user.email = email;
    state.user.phone = phone;
    state.user.name = name;
  }
};

export const actions = {
  showGuestLoginModal({ commit }) {
    commit('showModal', {
      modal: 'GuestLoginModal'
    });
  },
  showLoginModal({ commit }) {
    commit('showModal', {
      modal: 'LoginModal'
    });
  },
  showResetPasswordModal({ commit }) {
    commit('showModal', {
      modal: 'ResetModal'
    });
  },
  showRegisterModal({ commit }) {
    commit('showModal', {
      modal: 'RegisterModal'
    });
  },
  hideModal({ commit }) {
    commit('hideModal');
  },
  showToast({ commit }, { detail }) {
    this.$toast.show(detail, {
      theme: 'primary',
      className: 'iorderauth-toast',
      closeOnSwipe: true,
      containerClass: 'iorderauth',
      duration: 4000,
      fullWidth: true,
      fitToScreen: true,
      position: 'bottom-center',
      singleton: true
    });
  },
  async submitGuestDetails({ commit }, { email, name, phone }) {
    return new Promise(resolve => {
      commit('setGuestDetails', { email, name, phone });
      setTimeout(resolve, 1000);
    });
  },

  async login({ state, getters, commit, dispatch }, { email, password }) {
    return new Promise((resolve, reject) => {
      this.app.iOrder.login(
        { email, password, config: { ...state.config } },
        (err, res) => {
          if (err) {
            return resolve(false);
          } else if (res.response === 'Error') {
            dispatch('showToast', { detail: res.detail });
            return resolve(false);
          }
          commit('setUserEmail', { email });
          commit('setToken', { token: res['X-Auth-UserToken'] });
          commit('setBtUuid', { uuid: res.user.braintree_uuid });
          dispatch('hideModal');
          resolve(true);
        }
      );
    });
  },
  async register(
    { state, getters, commit, dispatch },
    { email, password, firstName }
  ) {
    return new Promise((resolve, reject) => {
      this.app.iOrder.register(
        { email, password, firstName, config: { ...state.config } },
        (err, res) => {
          if (err) {
            console.log(err);
            return resolve(false);
          } else if (res.response === 'Error') {
            dispatch('showToast', { detail: res.detail });
            return resolve(false);
          }
          commit('setUserEmail', { email });
          commit('setToken', { token: res['X-Auth-UserToken'] });
          commit('setBtUuid', { uuid: res.user.braintree_uuid });
          dispatch('hideModal');
          dispatch('showToast', { detail: 'Your account has been created!' });
          resolve(true);
        }
      );
    });
  },
  async resetPassword({ state, getters, commit, dispatch }, { email }) {
    return new Promise((resolve, reject) => {
      this.app.iOrder.resetPassword(
        { email, config: { ...state.config } },
        (err, res) => {
          if (err) {
            console.log(err);
            return resolve(false);
          } else if (res.response === 'Error') {
            console.log(err);
            dispatch('showToast', { detail: res.detail });
            return resolve(false);
          }
          dispatch('showToast', {
            detail:
              'Thanks! If you have an account with us, you will receive an email with instructions to reset your password.'
          });
          dispatch('showLoginModal');
          resolve(true);
        }
      );
    });
  }
};
