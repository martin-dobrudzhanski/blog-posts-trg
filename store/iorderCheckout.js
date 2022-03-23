import Vue from 'vue';
import VueResource from 'vue-resource';
import dayjs from 'dayjs';
import rakutonEcomTag from '@/plugins/rakuten-ecom-tag';
Vue.use(VueResource);

export const state = () => {
  return {
    config: null,
    alertsUrl: process.env.ALERTS_URL,
    paymentIds: {
      CreditCard: 'Credit Card',
      PayPalAccount: 'PayPal',
      PayPalCheckout: 'PayPal',
      ApplePay: 'Apple Pay'
    },
    modalIsVisible: false,
    activeModal: null,
    requiredCheckoutData: {
      basketId: null,
      btToken: null,
      basketTotal: null,
      promotionDiscount: null,
      voucherDiscount: null
    },
    voucherDetail: null,
    paymentData: {
      deviceData: null,
      nonce: null,
      description: null,
      paymentType: null
    },
    successData: {
      paidBy: null,
      uniqueRef: null,
      receiptEmail: null
    },
    failureData: {
      message: null
    }
  };
};

export const getters = {
  getPaymentOptions(state) {
    return {
      ...state.requiredCheckoutData
    };
  },
  getEcomTrackingData(state) {
    return {
      ...state.requiredCheckoutData,
      ...state.successData
    };
  },
  getBasketTotal(state) {
    return state.requiredCheckoutData.basketTotal || 0;
  },
  getPromotionDiscountAmount(state) {
    return state.requiredCheckoutData.promotionDiscount || 0;
  },
  getVoucherDiscountAmount(state) {
    return state.requiredCheckoutData.voucherDiscount || 0;
  },
  getVoucherDetail(state) {
    return state.voucherDetail;
  }
};

export const mutations = {
  clearState(state) {
    state.requiredCheckoutData = {
      basketId: null,
      btToken: null,
      basketTotal: null,
      promotionDiscount: null,
      voucherDiscount: null
    };
    state.paymentData = {
      deviceData: null,
      nonce: null,
      description: null,
      paymentType: null
    };
  },
  clearStatusData(state) {
    state.successData = {
      paidBy: null,
      uniqueRef: null
    };
    state.failureData = {
      message: null
    };
  },
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
  setCheckoutData(
    state,
    { btToken, basketTotal, basketId, promotionDiscount, voucherDiscount }
  ) {
    state.requiredCheckoutData.btToken = btToken;
    state.requiredCheckoutData.basketTotal = basketTotal;
    state.requiredCheckoutData.basketId = basketId;
    state.requiredCheckoutData.promotionDiscount = promotionDiscount;
    state.requiredCheckoutData.voucherDiscount = voucherDiscount;
  },
  setIorderConfig(state, { config }) {
    state.config = config;
  },
  setPaymentError(state, { message }) {
    state.failureData.message = message;
  },
  setTransactionDetails(state, { paidBy, uniqueRef, receiptEmail }) {
    state.successData = { paidBy, uniqueRef, receiptEmail };
  },
  setVoucherDetail(state, { voucherDetail }) {
    state.voucherDetail = voucherDetail;
  }
};

export const actions = {
  showCheckoutModal({ commit }) {
    commit('showModal', {
      modal: 'checkoutModal'
    });
  },
  clearState({ commit }) {
    commit('clearState');
  },
  hideModal({ commit }) {
    commit('hideModal');
  },
  showToast({ commit }, { detail, size }) {
    const className = size ? `iorderauth-toast-${size}` : 'iorderauth-toast';

    this.$toast.show(detail, {
      theme: 'primary',
      className,
      closeOnSwipe: true,
      containerClass: 'iorderauth',
      duration: 4000,
      fullWidth: true,
      fitToScreen: true,
      position: 'bottom-center',
      singleton: true
    });
  },
  async checkBasket(
    { state, getters, commit, dispatch },
    {
      siteId,
      salesAreaId,
      basketLines,
      voucherLines,
      serviceId,
      user,
      timeslot,
      identifier
    }
  ) {
    commit('clearStatusData');
    return new Promise((resolve, reject) => {
      if (dayjs().isAfter(dayjs(timeslot))) {
        return resolve({
          success: false,
          status: 'timeslotUnavailable'
        });
      }

      this.app.iOrder.checkBasket(
        {
          siteId,
          salesAreaId,
          basketLines,
          voucherLines,
          serviceId,
          user,
          timeslot,
          config: state.config,
          identifier: identifier || 'Web - iOrderCore'
        },
        (err, res) => {
          if (err) {
            dispatch('showToast', {
              detail: 'Oops, something went wrong, please try again.'
            });
            console.log(err);
            return resolve({
              success: false,
              status: 'Oops, something went wrong, please try again.'
            });
          } else if (res.response === 'Error') {
            if (/log in/i.test(res.detail)) {
              dispatch('showToast', {
                detail: 'Oops, you need to be logged in to place and order.'
              });
              return resolve({
                success: false,
                status: 'authRequired'
              });
            }

            if (/please make another selection/i.test(res.detail)) {
              dispatch('showToast', { detail: res.detail });
              return resolve({
                success: false,
                status: 'unavailableLines',
                ingredientId: res.ingredientId
              });
            }

            if (/time is no longer available/i.test(res.detail)) {
              return resolve({
                success: false,
                status: 'timeslotUnavailable'
              });
            }

            if (
              /more than one of these discounts cannot be applied/i.test(
                res.detail
              ) ||
              /vouchers have timed out/i.test(res.detail)
            ) {
              return resolve({
                success: false,
                status: 'voucherError'
              });
            }

            return resolve({
              success: false,
              status: res.detail
            });
          }

          let discountLines = res.lines.filter(
            item => item.amount && item.amount < 0
          );
          discountLines = discountLines.length ? discountLines : [];
          discountLines = discountLines.map(item => item.amount);
          const promotionDiscount = discountLines.reduce(
            (sum, amount) => sum + amount,
            0
          );

          const voucherLines = res.voucherLines
            ? res.voucherLines.map(voucherLine => voucherLine.Amount)
            : [];
          const voucherDiscount = voucherLines.reduce(
            (sum, amount) => sum + amount,
            0
          );

          commit('setCheckoutData', {
            btToken: res.braintreeToken,
            basketTotal: res.basketTotal,
            basketId: res.basketId,
            promotionDiscount,
            voucherDiscount
          });

          commit('setVoucherDetail', {
            voucherDetail: res.voucherLines[0]
          });

          return resolve({
            success: true
          });
        }
      );
    });
  },
  async checkVoucher(
    { state, getters, commit, dispatch },
    { siteId, salesAreaId, voucherCode, identifier }
  ) {
    return new Promise((resolve, reject) => {
      this.app.iOrder.checkVoucher(
        { siteId, salesAreaId, voucherCode, identifier, config: state.config },
        (err, res) => {
          if (err) {
            dispatch('showToast', {
              detail: 'Oops, something went wrong, please try again.'
            });
            console.log(err);
            return resolve({
              success: false,
              status: 'Oops, something went wrong, please try again.'
            });
          } else if (res.response === 'Error') {
            if (/an error has occurred/i.test(res.detail)) {
              return resolve({
                success: false,
                status: 'invalidVoucherCode'
              });
            }

            return resolve({
              success: false,
              status: res.detail
            });
          }

          return resolve({
            success: true,
            voucherCode: res.voucher.voucherCode
          });
        }
      );
    });
  },
  async voidVoucher(
    { state, dispatch },
    { siteId, salesAreaId, voucherCode, identifier }
  ) {
    return new Promise(resolve => {
      this.app.iOrder.voidVoucher(
        { siteId, salesAreaId, voucherCode, identifier, config: state.config },
        (err, res) => {
          if (err) {
            dispatch('showToast', {
              detail: 'Oops, something went wrong, please try again.'
            });
            console.log(err);
            return resolve({
              success: false,
              status: 'Oops, something went wrong, please try again.'
            });
          } else if (res.STATUS !== 'OK') {
            if (/an error has occurred/i.test(res.detail)) {
              return resolve({
                success: false,
                status: 'invalidVoucherCode'
              });
            }

            return resolve({
              success: false,
              status: res.detail
            });
          }

          return resolve({
            success: true
          });
        }
      );
    });
  },
  async makeBraintreePayment(
    { state, getters, commit, dispatch },
    { nonce, type, description, deviceData, salesData, user }
  ) {
    commit('clearStatusData');
    const basketId = state.requiredCheckoutData.basketId;
    return new Promise((resolve, reject) => {
      const timeslot = salesData.timeslot;
      this.app.iOrder.makeBraintreePayment(
        {
          config: state.config,
          siteId: salesData.siteId,
          salesAreaId: salesData.salesAreaId,
          table: salesData.tableNumber,
          paymentMethod: state.paymentIds[type] || 54,
          timeslot,
          user,
          basketId,
          nonce,
          description,
          deviceData
        },
        (err, res) => {
          if (err) {
            commit('setPaymentError', { message: err.detail });
            return resolve({
              success: false,
              status: 'authRequired'
            });
          } else if (res.response === 'Error') {
            if (/log in/i.test(res.detail)) {
              commit('setPaymentError', {
                message: 'You must be logged in to place an order'
              });
              return resolve({
                success: false,
                status: 'authRequired'
              });
            }
            commit('setPaymentError', {
              message: 'Oops, something went wrong, please try again'
            });
            return resolve({
              success: false,
              status: 'unknown'
            });
          }

          commit('setTransactionDetails', {
            paidBy: res.paidBy,
            uniqueRef: res.uniqueRef,
            receiptEmail: res.userEmailAddress
          });
          return resolve({
            success: true
          });
        }
      );
    });
  },
  async dispatchAlert({ rootState, state }, { alertsCode }) {
    const alertsUrl =
      state.alertsUrl || 'https://alerts-api-stage.omnifitrgsites.co.uk';
    const url = `${alertsUrl}/events`;
    const vueInstance = Vue;

    const transactionDetails = {
      brand: 'fb',
      type: alertsCode,
      order_number: state.successData.uniqueRef,
      total: state.requiredCheckoutData.basketTotal,
      time_of_transaction: new Date(),
      customer_email: rootState.iorderAuth.user.email
    };

    if (alertsCode === 'd') {
      transactionDetails.table_number =
        rootState.drinks.requiredSalesData.tableNumber;
      transactionDetails.restaurant_id = rootState.drinks.location.siteId;
    }

    if (alertsCode === 'cc') {
      transactionDetails.cc_timeslot =
        rootState.clickAndCollect.requiredSalesData.timeslot;
      transactionDetails.restaurant_id =
        rootState.clickAndCollect.location.siteId;
      transactionDetails.first_name = rootState.iorderAuth.user.name;
    }

    if (alertsCode === 'oat') {
      transactionDetails.table_number =
        rootState.orderAtTable.requiredSalesData.tableNumber;
      transactionDetails.restaurant_id = rootState.orderAtTable.location.siteId;
    }

    return new Promise((resolve, reject) => {
      vueInstance.http.post(url, transactionDetails).then(
        res => {
          resolve();
          return res;
        },
        err => {
          reject();
          return err;
        }
      );
    });
  },
  getProductPrice({ rootGetters }, { applicationName, item }) {
    const productDetails = rootGetters[`${applicationName}/getProduct`](
      item.ingredientId
    );
    const itemPrice =
      productDetails &&
      productDetails.portions &&
      productDetails.portions.find(portion => portion.id === item.portionTypeId)
        .price;
    const choiceSum =
      item.choiceLines &&
      item.choiceLines.reduce((choiceSum, choice) => {
        const aztecChoice = rootGetters[`${applicationName}/getProduct`](
          choice.ingredientId
        );
        return (
          choiceSum +
          ((aztecChoice &&
            aztecChoice.portions &&
            aztecChoice.portions[0] &&
            aztecChoice.portions[0].price) ||
            0)
        );
      }, 0);
    return itemPrice + choiceSum;
  },
  async submitEcomTracking(
    { state, getters, rootState, rootGetters, dispatch },
    { applicationName, env }
  ) {
    if (env !== 'production') {
      return;
    }
    const ga = window.ga || (() => {});
    const basket =
      rootState[applicationName] &&
      rootState[applicationName].basket &&
      rootState[applicationName].basket.lines;

    ga('require', 'ec');

    if (basket && basket.length) {
      for (const item of basket) {
        const productSummary = rootGetters[
          `${applicationName}/getProductSummary`
        ](item);
        const id =
          (productSummary &&
            productSummary.SKU &&
            productSummary.SKU.toString()) ||
          '';
        const name = (productSummary && productSummary.productName) || '';
        const brand = `fb-${applicationName}`;
        const category =
          rootGetters[`${applicationName}/getDisplayGroupName`](
            item.ingredientId
          ) || '';
        const price = await dispatch('getProductPrice', {
          applicationName,
          item
        });
        const quantity = productSummary && productSummary.quantity;
        let variant = [];

        if (item.choiceLines && item.choiceLines.length) {
          item.choiceLines.forEach(choiceLine => {
            const choiceItemSummary = rootGetters[
              `${applicationName}/getProduct`
            ](choiceLine.ingredientId);
            if (choiceItemSummary && choiceItemSummary.eposName) {
              variant.push(choiceItemSummary.eposName);
            }
          });
        }
        variant = variant.join(', ');

        if (id || name) {
          ga('ec:addProduct', {
            id,
            name,
            brand,
            variant,
            category,
            price,
            quantity
          });
        }
      }
    }
    ga('ec:setAction', 'purchase', {
      id: getters.getEcomTrackingData.uniqueRef,
      affiliation: applicationName,
      revenue: getters.getEcomTrackingData.basketTotal,
      shipping: 0.0,
      coupon:
        getters.getVoucherDetail &&
        getters.getVoucherDetail.voucher &&
        getters.getVoucherDetail.voucher.metaData &&
        getters.getVoucherDetail.voucher.metaData.description
    });
    ga('send', 'pageview');
  },
  submitWebExtendConversionTracking(
    { rootGetters, rootState, dispatch },
    { basketLines, applicationName, customerEmail, orderId, env }
  ) {
    if (!window.ScarabQueue) {
      return;
    }

    if (env !== 'production') {
      ScarabQueue.push(['testMode']);
    }
    if (customerEmail) ScarabQueue.push(['setEmail', customerEmail]);

    if (
      applicationName === 'clickAndCollect' &&
      basketLines &&
      basketLines.length
    ) {
      const items = [];
      basketLines.forEach(lineItem => {
        const productSummary = rootGetters[
          `${applicationName}/getProductSummary`
        ](lineItem);
        const itemPrice = productSummary && productSummary.unitPrice;
        const itemName = (productSummary && productSummary.productName) || '';
        const itemQuantity = productSummary && productSummary.quantity;
        for (let i = 0; i < itemQuantity; i++) {
          items.push({
            item: itemName,
            price: itemPrice,
            quantity: 1
          });
          if (lineItem.choiceLines && lineItem.choiceLines.length) {
            lineItem.choiceLines.forEach(choiceLine => {
              const choiceItemSummary = rootGetters[
                `${applicationName}/getProduct`
              ](choiceLine.ingredientId);
              console.log('choiceItemSummary', choiceItemSummary);
              const choiceItemName =
                choiceItemSummary &&
                choiceItemSummary.displayRecords.length &&
                choiceItemSummary.displayRecords[0].name;
              const choiceItemPrice =
                (choiceItemSummary &&
                  choiceItemSummary.portions.length &&
                  choiceItemSummary.portions[0].price) ||
                0;
              if (choiceItemName !== 'None') {
                items.push({
                  item: choiceItemName,
                  price: choiceItemPrice,
                  quantity: 1
                });
              }
            });
          }
        }
      });

      ScarabQueue.push(['cart', items]);

      if (orderId && items && items.length)
        ScarabQueue.push([
          'purchase',
          {
            orderId,
            items
          }
        ]);
    } else {
      ScarabQueue.push(['cart', []]);
    }

    ScarabQueue.push(['go']);
  },
  submitRakutenTracking(
    { getters, state },
    { customerEmail, orderId, lineitems }
  ) {
    rakutonEcomTag({
      affiliateConfig: {
        ranMID: '43600',
        discountType: 'item',
        taxRate: 20,
        removeTaxFromDiscount: true
      },
      orderid: orderId,
      currency: 'GBP',
      customerStatus: 'New',
      conversionType: 'Sale',
      customerID: customerEmail,
      discountCode: getters.voucherDescription || '',
      discountAmount:
        state.requiredCheckoutData.promotionDiscount +
        state.requiredCheckoutData.voucherDiscount,
      taxAmount: getTax(state.requiredCheckoutData.basketTotal),
      lineitems
    });

    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'purchase',
      transactionId: getters.getEcomTrackingData.uniqueRef,
      transactionAffiliation: 'clickandcollect',
      transactionTotal: getters.getEcomTrackingData.basketTotal,
      transactionTax: getTotalLessTax(getters.getEcomTrackingData.basketTotal),
      transactionProducts: lineitems.map(item => {
        return {
          sku: item.SKU,
          name: item.productName,
          price: item.unitPrice,
          quantity: item.quantity
        };
      })
    });
  }
};

function getTax(total) {
  return Number((total - total / 1.2).toFixed(2));
}
function getTotalLessTax(total) {
  return Number((total / 1.2).toFixed(2));
}
