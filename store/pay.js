import axios from 'axios';
import get from 'lodash.get';

import { getBrowserLocation } from '~/libs/location.js';
import sortByDistance from '~/libs/sortByDistance.js';
import { getGlobalContent } from '~/plugins/contentful.js';

export const state = () => ({
  brandId: 'chiquito',
  content: null,
  contentIsLoading: false,
  geolocationIsLoading: false,
  locationFormIsLoading: false,
  basketIsLoading: false,
  voucherIsLoading: false,
  voucherApplied: null,
  nearestLocations: [],
  showLocationModal: false,
  showGratuityModal: false,
  location: {},
  siteId: null,
  trgSiteId: null,
  salesId: null,
  basketId: null,
  accountId: null,
  tableNumber: null,
  billQuantity: null,
  billItems: [],
  taxAmount: null,
  total: null,
  totalIncludingDiscount: null,
  totalIncludingDiscountAndGratuity: null,
  discount: null,
  gratuityAmount: null,
  emailAddress: null,
  paymentMethods: null,
  processingPayment: false,
  paymentResult: null,
  braintreeToken: null,
  tableServiceGateway:
    process.env.PMB_GATEWAY_URL || 'https://ts-gw-dev.omnifitrgsites.co.uk'
});
export const getters = {
  getContent: state => {
    return state && state.content;
  },
  getContentIsLoading: state => {
    return state && state.contentIsLoading;
  },
  geolocationIsLoading: state => {
    return state && state.geolocationIsLoading;
  },
  getBasketIsLoading: state => {
    return state && state.basketIsLoading;
  },
  getNearestLocations: state => {
    return state && state.nearestLocations;
  },
  getSiteId: state => {
    return state && state.siteId;
  },
  getTrgSiteId: state => {
    return state && state.trgSiteId;
  },
  getSalesId: state => {
    return state && state.salesId;
  },
  getBasketId: state => {
    return state && state.basketId;
  },
  getAccountId: state => {
    return state && state.accountId;
  },
  getTableNumber: state => {
    return state && state.tableNumber;
  },
  getBrandId: state => {
    return state && state.brandId;
  },
  locationModalIsVisible: state => {
    return state && state.showLocationModal;
  },
  getLocation: state => {
    return state && state.location;
  },
  getBillQuantity: state => {
    return state && state.billQuantity;
  },
  getBillItems: state => {
    return state && state.billItems;
  },
  getTaxAmount: state => {
    return state && state.taxAmount;
  },
  getTotal: state => {
    return state && state.total;
  },
  getTotalIncludingDiscount: state => {
    return state && state.totalIncludingDiscount;
  },
  getTotalIncludingDiscountAndGratuity: state => {
    return state && state.totalIncludingDiscountAndGratuity;
  },
  getDiscount: state => {
    return state && state.discount;
  },
  getGratuityAmount: state => {
    return state && state.gratuityAmount;
  },
  getEmailAddress: state => {
    return state && state.emailAddress;
  },
  getPaymentMethods: state => {
    return state && state.paymentMethods;
  },
  getPaymentResult: state => {
    return state && state.paymentResult;
  },
  getProcessingPayment: state => {
    return state && state.processingPayment;
  },
  getVoucherLoading: state => {
    return state && state.voucherIsLoading;
  },
  getVoucherApplied: state => {
    return state && state.voucherApplied;
  },
  getBraintreeToken: state => {
    return state && state.braintreeToken;
  }
};

export const actions = {
  async contentRequest({ commit, dispatch, getters }) {
    commit('setContentIsLoading', { contentIsLoading: true });
    try {
      const content = await getGlobalContent();

      if (!content) {
        return dispatch('ui/showError', { error: 'no-content' });
      }

      commit('setContent', { content });
      commit('setContentIsLoading', { contentIsLoading: false });

      // TODO: Handle killswitch
      // if (!getters['pay/getAppIsEnabled']) {
      //   return dispatch('ui/showError', { error: 'killswitch' })
      // }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      dispatch('ui/showError', { error: null });
      commit('setContentIsLoading', { contentIsLoading: false });
    }
  },

  async handleGloballyDisabled({ dispatch }) {
    dispatch('showToast', {
      toastMessage:
        'Pay my bill is not currently available, please contact your server to pay your bill.'
    });
    this.app.router.push('/');
  },

  async handleDisabledForRestaurant({ dispatch, getters }, { location }) {
    const brandId = getters.getBrandId;
    const latitude = location && location.latitude;
    const longitude = location && location.longitude;
    const url = `https://paymybill.restaurant/${brandId}/search/${latitude}/${longitude}/`;
    window.location.href = url;
  },

  closeLocationModal({ commit }) {
    commit('toggleLocationModal', { modalIsVisible: false });
    commit('clearNearestLocations');
  },

  async getLocationFromQuery({ commit, dispatch }, { query, restaurantList }) {
    const apiKey =
      process.env.geocodingKey || 'AIzaSyBpmb8tTzE16cFd_YIVVx5-2IfDGSDb9fs';
    const formattedQuery = `${query
      .trim()
      .split(' ')
      .join('+')},+uk`;
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';

    commit('toggleLocationFormLoader', { locationFormIsLoading: true });
    commit('clearNearestLocations');

    try {
      const res = await axios.get(
        `${url}?address=${formattedQuery}&key=${apiKey}`
      );

      if (res.data.error_message === 'The provided API key is invalid.') {
        dispatch('showToast', {
          toastMessage: 'There was a problem fetching the locations.',
          limit: true
        });
        return;
      }

      const coords = get(res, 'data.results[0].geometry.location');

      if (!coords || !coords.lat || !coords.lng) {
        dispatch('showToast', {
          toastMessage:
            'Could not find any locations matching your search term.',
          limit: true
        });
        commit('toggleLocationFormLoader', { locationFormIsLoading: false });
        return;
      }

      await dispatch('showNearestEnabledLocations', { coords, restaurantList });
      commit('toggleLocationFormLoader', { locationFormIsLoading: false });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      commit('toggleLocationFormLoader', { locationFormIsLoading: false });
    }
  },

  async handleGeolocate({ commit, dispatch }, { restaurantList }) {
    try {
      commit('toggleGeolocationLoader', { geolocationIsLoading: true });
      commit('clearNearestLocations');
      const coords = await getBrowserLocation();
      if (!coords || !coords.lat || !coords.lng) {
        dispatch('showToast', {
          toastMessage: 'Could not get device coordinates.',
          limit: true
        });
        commit('toggleGeolocationLoader', { geolocationIsLoading: false });
        return;
      }

      await dispatch('showNearestEnabledLocations', { coords, restaurantList });
      commit('toggleGeolocationLoader', { geolocationIsLoading: false });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      dispatch('showToast', {
        toastMessage:
          'Location services are not currently enabled for on device.',
        limit: true
      });
      commit('toggleGeolocationLoader', { geolocationIsLoading: false });
    }
  },

  selectTableNumber({ commit }, { tableNumber }) {
    commit('selectTableNumber', { tableNumber });
  },

  setNearestLocations({ commit }, { nearestLocations }) {
    const prettyLocations = nearestLocations.map(location => {
      return { ...location.fields };
    });
    commit('setNearestLocations', { locations: prettyLocations });
  },

  async showNearestEnabledLocations(
    { commit, dispatch },
    { coords, restaurantList }
  ) {
    try {
      const opts = {
        xName: 'latitude',
        yName: 'longitude',
        seperator: 'fields'
      };
      const origin = { latitude: coords.lat, longitude: coords.lng };

      const nearestLocations = await sortByDistance(
        origin,
        restaurantList,
        opts
      ).slice(0, 3);
      await dispatch('setNearestLocations', { nearestLocations });
      commit('toggleLocationModal', { modalIsVisible: true });
    } catch (err) {
      dispatch('showToast', {
        toastMessage: 'Could not find any nearby locations.',
        limit: true
      });
      // eslint-disable-next-line no-console
      console.log(err);
    }
  },

  async getBasket(
    { commit, dispatch, getters, state },
    { siteId, salesId, tableNumber: tableNum }
  ) {
    const url = `${state.tableServiceGateway}/site/${siteId}/area/${salesId}/table/${tableNum}`;

    commit('setBasketIsLoading', { basketIsLoading: true });

    try {
      if (!siteId) {
        throw new Error('siteId not defined');
      }
      if (!salesId) {
        throw new Error('salesId not defined');
      }
      if (!tableNum) {
        throw new Error('tableNum not defined');
      }

      const res = await axios.get(url);

      if (
        !res.data ||
        (!res.data.accountBreakdown && !res.data.braintreeToken)
      ) {
        throw new Error('Response is in an unexpected format');
      }

      const { accountBreakdown, braintreeToken } = res && res.data;

      const outstandingBalanceToPay =
        accountBreakdown.account.outstandingBalanceToPay;
      const totalIncludingDiscount =
        accountBreakdown.account.outstandingBalanceToPay;
      const basketId = accountBreakdown.account.basketId;
      const accountId = accountBreakdown.account.accountId;
      const account = accountBreakdown.account.account;
      const taxes = accountBreakdown.account.TaxesAndServiceCharges;

      if (outstandingBalanceToPay === 0) {
        throw new Error(res);
      }

      // Map bill items
      const billItems = [...account]
        .map((item, index) => ({
          id: index,
          name: item.display && item.display.name,
          price: item.tariffPrice || 0,
          choices:
            (item.choiceLines &&
              [...item.choiceLines].map((choice, index) => ({
                id: index,
                name: choice.display.name,
                price: choice.tariffPrice
              }))) ||
            []
        }))
        // Remove discount items
        .filter(item => item.name)
        // Remove 'None' items from choices
        .map(item => {
          const choices = item.choices.filter(choice => choice.name !== 'None');
          const updatedItem = {
            ...item,
            choices
          };
          return updatedItem;
        });

      // Get discount amount
      const discountItems = [...account].filter(
        item => item.discountId || item.promotionId
      );
      const discount =
        (discountItems.length &&
          (Math.abs(discountItems[0].Amount) ||
            Math.abs(discountItems[0].amount))) ||
        0;

      // Calculate original amount without discount applied
      const total = (
        parseFloat(totalIncludingDiscount || 0) + parseFloat(discount || 0)
      ).toFixed(2);
      if (taxes) {
        const taxAmount = taxes.reduce(
          (amount, tax) => (amount += tax.Amount),
          0
        );
        commit('setTaxAmount', { taxAmount });
      }
      commit('setAccountId', { accountId });
      commit('setBasketId', { basketId });
      commit('setBillItems', { billItems });
      commit('setTotal', { total });
      commit('setTotalIncludingDiscount', { totalIncludingDiscount });
      commit('setTotalIncludingDiscountAndGratuity', {
        totalIncludingDiscountAndGratuity: parseFloat(
          totalIncludingDiscount || 0
        ).toFixed(2)
      });
      commit('setVoucherApplied', { voucherApplied: discount !== 0 });
      commit('setDiscount', { discount });
      commit('setBillQuantity', { billQuantity: billItems.length });
      commit('setBraintreeToken', {
        braintreeToken: braintreeToken.clientToken
      });
      commit('setBasketIsLoading', { basketIsLoading: false });

      return { success: true };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      commit('setBasketIsLoading', { basketIsLoading: false });
      const path = this.app.router.history.current.path.split('/');
      if (path[3] === 'pay') {
        path.pop();
        const newPath = path.join('/');
        this.app.router.replace(newPath);
      } else {
        this.app.router.go(-1);
      }
      dispatch('showToast', {
        toastMessage: `No account data was found for the table number ${tableNum}. Please try again.`
      });
    }
  },

  async applyVoucher({ commit, dispatch, getters, state }, { voucherCode }) {
    const siteId = getters.getSiteId;
    const salesId = getters.getSalesId;
    const accountId = getters.getAccountId;
    const basketId = getters.getBasketId;
    const url = `${state.tableServiceGateway}/site/${siteId}/area/${salesId}/account/${accountId}/basket/${basketId}/apply`;

    commit('toggleVoucherLoader', { voucherIsLoading: true });

    try {
      if (!siteId) {
        throw new Error('siteId not defined');
      }
      if (!salesId) {
        throw new Error('salesId not defined');
      }
      if (!accountId) {
        throw new Error('accountId not defined');
      }
      if (!basketId) {
        throw new Error('basketId not defined');
      }
      // is an employee discounts voucher
      const isED = voucherCode.startsWith('ED-');
      if (isED) {
        // test that voucher is still valid
        const mwUrl = `${process.env.MWS_VOUCHER_URL ||
          'https://employee-discounts.test-trg-api.co.uk'}/voucher/${voucherCode}/redeem`;
        const mwToken =
          process.env.MWS_VOUCHER_TOKEN || 'mIleBnAq527S9n0jH5feGnBJ60MRH0aF';
        const mwConfig = {
          method: 'put',
          url: mwUrl,
          headers: {
            'x-api-key': mwToken,
            'Content-Type': 'application/json'
          }
        };
        // eslint-disable-next-line
            const mwRes = await axios(mwConfig);
        if (mwRes.status === 200) {
          voucherCode = await voucherCode.substring(3);
        } else {
          throw new Error(
            'invalid voucher, return to employee discounts and try again'
          );
        }
      }
      const res = await axios.post(url, { voucherCode });

      // Set discount
      const account = get(res, 'data.basketDetails.data');
      const items = get(account, 'account');
      const discountItems = [...items].filter(
        item => item.discountId || item.promotionId
      );
      const discount =
        (discountItems.length &&
          (Math.abs(discountItems[0].Amount) ||
            Math.abs(discountItems[0].amount))) ||
        0;
      commit('setDiscount', { discount });

      // Calculate original amount without discount applied
      const totalIncludingDiscount = account.outstandingBalanceToPay;
      const total = (
        parseFloat(totalIncludingDiscount || 0) + parseFloat(discount || 0)
      ).toFixed(2);
      commit('setTotal', { total });
      commit('setTotalIncludingDiscount', { totalIncludingDiscount });
      commit('setTotalIncludingDiscountAndGratuity', {
        totalIncludingDiscountAndGratuity: parseFloat(
          totalIncludingDiscount || 0
        ).toFixed(2)
      });

      commit('toggleVoucherLoader', { voucherIsLoading: false });
      commit('setVoucherApplied', {
        voucherApplied: `You have applied the voucher code ${voucherCode}`
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      dispatch('showToast', {
        toastMessage: 'Could not apply the voucher to your basket.',
        limit: true
      });
      commit('toggleVoucherLoader', { voucherIsLoading: false });
    }
  },

  async processPayment({ commit, dispatch, getters, state }, { nonce }) {
    const siteId = getters.getSiteId;
    const trgSiteId = getters.getTrgSiteId;
    const salesId = getters.getSalesId;
    const accountId = getters.getAccountId;
    const basketId = getters.getBasketId;
    const url = `${state.tableServiceGateway}/site/${siteId}/area/${salesId}/account/${accountId}/basket/${basketId}/pay`;

    commit('setProcessingPayment', { processingPayment: true });

    try {
      if (!siteId) {
        throw new Error('siteId not defined');
      }
      if (!salesId) {
        throw new Error('salesId not defined');
      }
      if (!accountId) {
        throw new Error('accountId not defined');
      }
      if (!basketId) {
        throw new Error('basketId not defined');
      }

      const amount = getters.getTotalIncludingDiscount;
      const customerEmail = getters.getEmailAddress;
      const tableNumber = getters.getTableNumber;
      const brandId = getters.getBrandId;
      const itemTotal = getters.getTotal;
      const location = getters.getLocation;
      const siteName = location && location.name;
      const discount = getters.getDiscount;
      const tip = getters.getGratuityAmount;

      const res = await axios.post(url, {
        amount,
        brandId,
        customerEmail,
        discount,
        itemTotal,
        location,
        nonce,
        siteName,
        tableNumber,
        tip,
        trgSiteId
      });

      if (!res.data) {
        dispatch('showToast', {
          toastMessage: 'There was a problem processing your payment'
        });
        this.app.router.push('/paymybill/failure');
        return;
      }

      const paymentMethod = get(
        res,
        'data.braintreePayment.data.transaction.paymentInstrumentType'
      );

      this.$logExponeaOrder({
        id: accountId,
        total: amount,
        items: getters.getBillItems,
        useremail: customerEmail,
        siteId: trgSiteId,
        siteName,
        paymentMethod,
        actionType: 'dine_in',
        discount
      });
      commit('setPaymentResult', { paymentResult: 'success' });
      commit('setProcessingPayment', { processingPayment: false });
      this.app.router.push('/paymybill/success');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      dispatch('showToast', {
        toastMessage: 'There was a problem processing your payment'
      });
      commit('setPaymentResult', { paymentResult: 'failure' });
      commit('setProcessingPayment', { processingPayment: false });
      this.app.router.push('/paymybill/failure');
    }
  },

  setLocation({ commit }, { location }) {
    commit('setLocation', { location });
  },

  setSiteId({ commit }, { siteId }) {
    commit('setSiteId', { siteId });
  },

  setTrgSiteId({ commit }, { trgSiteId }) {
    commit('setTrgSiteId', { trgSiteId });
  },

  setSalesId({ commit }, { salesId }) {
    commit('setSalesId', { salesId });
  },

  setBasketId({ commit }, { basketId }) {
    commit('setBasketId', { basketId });
  },

  setAccountId({ commit }, { accountId }) {
    commit('setAccountId', { accountId });
  },

  setTableNumber({ commit }, { tableNumber }) {
    commit('setTableNumber', { tableNumber });
  },

  setBillItems({ commit }, { billItems }) {
    commit('setBillItems', { billItems });
  },

  setBillQuantity({ commit }, { billQuantity }) {
    commit('setBillQuantity', { billQuantity });
  },

  setTotal({ commit }, { total }) {
    commit('setTotal', { total });
  },

  setTotalIncludingDiscount({ commit }, { totalIncludingDiscount }) {
    commit('setTotalIncludingDiscount', { totalIncludingDiscount });
  },

  setTotalIncludingDiscountAndGratuity(
    { commit },
    { totalIncludingDiscountAndGratuity }
  ) {
    commit('setTotalIncludingDiscountAndGratuity', {
      totalIncludingDiscountAndGratuity
    });
  },

  setDiscount({ commit }, { discount }) {
    commit('setDiscount', { discount });
  },

  setEmailAddress({ commit }, { emailAddress }) {
    commit('setEmailAddress', { emailAddress });
  },

  setGratuityAmount({ commit, getters }, { gratuityAmount }) {
    commit('setGratuityAmount', { gratuityAmount });
    const totalIncludingDiscountAndGratuity = (
      parseFloat(gratuityAmount || 0) +
      parseFloat(getters.getTotalIncludingDiscount || 0)
    ).toFixed(2);
    commit('setTotalIncludingDiscountAndGratuity', {
      totalIncludingDiscountAndGratuity
    });
  },

  setPaymentMethods({ commit }, { paymentMethods }) {
    commit('setPaymentMethods', { paymentMethods });
  },

  setPaymentResult({ commit }, { paymentResult }) {
    commit('setPaymentResult', { paymentResult });
  },

  setProcessingPayment({ commit }, { processingPayment }) {
    commit('setProcessingPayment', { processingPayment });
  },

  showToast({ commit }, { toastMessage, limit }) {
    if (!limit || this.$toast.toasts.length < 1) {
      this.$toast.show(toastMessage, {
        theme: 'primary',
        className: 'iorderauth-toast',
        closeOnSwipe: true,
        containerClass: 'iorderauth',
        duration: 5000,
        fullWidth: true,
        fitToScreen: true,
        position: 'bottom-center',
        singleton: true
      });
    }
  }
};

export const mutations = {
  setContent(state, { content }) {
    state.content = content;
  },
  setContentIsLoading(state, { contentIsLoading }) {
    state.contentIsLoading = contentIsLoading;
  },
  clearCheckoutState(newState) {
    newState = { ...state };
  },
  clearNearestLocations(state) {
    state.nearestLocations = [];
  },
  selectTableNumber(state, { tableNumber }) {
    state.tableNumber = tableNumber;
  },
  setNearestLocations(state, { locations }) {
    state.nearestLocations = locations;
  },
  toggleGeolocationLoader(state, { geolocationIsLoading }) {
    state.geolocationIsLoading = geolocationIsLoading;
  },
  setBasketIsLoading(state, { basketIsLoading }) {
    state.basketIsLoading = basketIsLoading;
  },
  toggleLocationFormLoader(state, { locationFormIsLoading }) {
    state.locationFormIsLoading = locationFormIsLoading;
  },
  toggleVoucherLoader(state, { voucherIsLoading }) {
    state.voucherIsLoading = voucherIsLoading;
  },
  toggleLocationModal(state, { modalIsVisible }) {
    state.showLocationModal = modalIsVisible;
  },
  toggleGratuityModal(state, { modalIsVisible }) {
    state.showGratuityModal = modalIsVisible;
  },
  setLocation(state, { location }) {
    state.location = location;
  },
  setSiteId(state, { siteId }) {
    state.siteId = siteId;
  },
  setTrgSiteId(state, { trgSiteId }) {
    state.trgSiteId = trgSiteId;
  },
  setSalesId(state, { salesId }) {
    state.salesId = salesId;
  },
  setBasketId(state, { basketId }) {
    state.basketId = basketId;
  },
  setAccountId(state, { accountId }) {
    state.accountId = accountId;
  },
  setTableNumber(state, { tableNumber }) {
    state.tableNumber = tableNumber;
  },
  setDiscount(state, { discount }) {
    state.discount = discount;
  },
  setBillIsLoading(state, { billIsLoading }) {
    state.billIsLoading = billIsLoading;
  },
  setBillItems(state, { billItems }) {
    state.billItems = billItems;
  },
  setTaxAmount(state, { taxAmount }) {
    state.taxAmount = taxAmount;
  },
  setTotal(state, { total }) {
    state.total = total;
  },
  setTotalIncludingDiscount(state, { totalIncludingDiscount }) {
    state.totalIncludingDiscount = totalIncludingDiscount;
  },
  setTotalIncludingDiscountAndGratuity(
    state,
    { totalIncludingDiscountAndGratuity }
  ) {
    state.totalIncludingDiscountAndGratuity = totalIncludingDiscountAndGratuity;
  },
  setBillQuantity(state, { billQuantity }) {
    state.billQuantity = billQuantity;
  },
  setGratuityAmount(state, { gratuityAmount }) {
    state.gratuityAmount = gratuityAmount;
  },
  setEmailAddress(state, { emailAddress }) {
    state.emailAddress = emailAddress;
  },
  setPaymentMethods(state, { paymentMethods }) {
    state.paymentMethods = paymentMethods;
  },
  setPaymentResult(state, { paymentResult }) {
    state.paymentResult = paymentResult;
  },
  setProcessingPayment(state, { processingPayment }) {
    state.processingPayment = processingPayment;
  },
  setVoucherApplied(state, { voucherApplied }) {
    state.voucherApplied = voucherApplied;
  },
  setBraintreeToken(state, { braintreeToken }) {
    state.braintreeToken = braintreeToken;
  }
};
