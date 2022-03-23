import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

function checkConfig(config) {
  return new Promise((resolve, reject) => {
    if (!config || !config.iOrderUrl || !config.headers) {
      console.log('checkConfig failed - config: ', config);
      resolve({ success: false, message: 'checkConfig failed' });
    } else {
      resolve({ success: true });
    }
  });
}

export default ({ app }) => {
  const vueInstance = Vue;
  app.iOrder = {
    async checkBasket(
      {
        siteId,
        salesAreaId,
        basketLines,
        voucherLines,
        serviceId,
        user,
        timeslot,
        config,
        identifier
      },
      callback
    ) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'checkBasket',
        siteId,
        venueId: siteId,
        salesAreaId,
        serviceId,
        timeslot,
        lines: basketLines,
        voucherLines,
        userDeviceIdentifier: identifier
      };
      const requestHeaders = Object.assign({}, config.headers);
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: requestHeaders }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },
    async checkVoucher(
      { siteId, salesAreaId, voucherCode, identifier, config },
      callback
    ) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'checkVoucher',
        siteId,
        salesAreaId,
        userDeviceIdentifier: identifier,
        voucherCode
      };
      const requestHeaders = Object.assign({}, config.headers);
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: requestHeaders }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },
    async voidVoucher(
      { siteId, salesAreaId, voucherCode, identifier, config },
      callback
    ) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'voidVoucher',
        siteId,
        salesAreaId,
        userDeviceIdentifier: identifier,
        voucherCode
      };
      const requestHeaders = Object.assign({}, config.headers);
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: requestHeaders }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },
    async makeBraintreePayment(
      {
        nonce,
        paymentMethod,
        description,
        deviceData,
        table,
        basketId,
        siteId,
        salesAreaId,
        timeslot,
        user,
        config
      },
      callback
    ) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'makeBraintreePayment',
        platform: 'web',
        userEmailAddress: user.email,
        customerName: user.name,
        phoneNumber: user.phone,
        siteId,
        salesAreaId,
        timeslot,
        basketId,
        table,
        nonce,
        deviceData,
        paymentMethod
      };
      const requestHeaders = Object.assign({}, config.headers);
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: requestHeaders }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },
    async getTables({ siteId, salesAreaId, config }, callback) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'getTables',
        siteId,
        salesAreaId
      };
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: config.headers }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data.tables);
        })
        .catch(callback);
    },
    async getVenue({ siteId, config }, callback) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'venues',
        siteId
      };
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: config.headers }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },
    async getMenus({ siteId, salesAreaId, config }, callback) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'getMenus',
        siteId,
        salesAreaId
      };
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: config.headers }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },
    async getMenuPages({ siteId, salesAreaId, menuId, config }, callback) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'getmenupages',
        siteId,
        salesAreaId,
        menuId
      };
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: config.headers }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },
    async login({ email, password, config }, callback) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'postLoginEmail',
        user: {
          email,
          password
        }
      };
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: config.headers }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },
    async register({ email, password, firstName, config }, callback) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'postRegisterUser',
        user: {
          email,
          password,
          firstName
        }
      };
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: config.headers }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },
    async resetPassword({ email, config }, callback) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'resetPassword',
        email
      };
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: config.headers }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    },

    async getTimeslots({ siteId, config }, callback) {
      const configCheck = await checkConfig(config);
      if (!configCheck.success) return callback(true);
      const data = {
        method: 'timeslots',
        siteId
      };
      vueInstance.http
        .post(
          config.iOrderUrl,
          'request=' + JSON.stringify({ request: data }),
          { headers: config.headers }
        )
        .then(res => {
          if (res.data.response === 'error') {
            return callback(res.data);
          }
          callback(null, res.data);
        })
        .catch(callback);
    }
  };
};

// X-Auth-UserToken
