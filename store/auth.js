import axios from 'axios'

var Api = axios.create({
  timeout: 200000
})

function sendGAEvent({ hitType, eventCategory, eventAction, eventLabel }) {
  const gaConfig = {
    hitType,
    eventCategory,
    eventAction,
    eventLabel
  }
  window.ga =
    window.ga ||
    ((...data) => {
      console.log(data)
    })
  window.ga('send', gaConfig)
}

export const state = () => {
  const baseUrl =
    process.env.VOUCHER_ENDPOINT ||
    'https://vouchers-stage.omnifitrgsites.co.uk/v1-0/chiq'
  const facebookAppId = process.env.FACEBOOK_APP_ID || '649816015518153'

  return {
    token: '',
    urlbase: baseUrl,
    facebookPermissionsGranted: false,
    facebookAppId
  }
}

export const getters = {
  facebookPermissionsGranted(state) {
    return state.facebookPermissionsGranted
  },
  userAuthenticated(state) {
    return !!state.token
  }
}

export const mutations = {
  setSessionToken(state, value) {
    state.token = value || ''
  },
  setFacebookPermissions(state, { permissionGranted }) {
    state.facebookPermissionsGranted = permissionGranted
  }
}

export const actions = {
  login({ commit, state, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      generatePostReq(`${state.urlbase}/login`, null, credentials)
        .then(res => {
          commit('setSessionToken', res.headers['auth-token'])
          resolve(res)
        })
        .catch(err => {
          commit('setSessionToken', null)
          reject(err)
        })
    })
  },

  register({ commit, state, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      generatePostReq(`${state.urlbase}/register`, null, credentials)
        .then(res => {
          resolve(res)
          commit('setSessionToken', res.headers['auth-token'])
        })
        .catch(err => {
          commit('setSessionToken', null)
          reject(err)
        })
    })
  },

  logout({ commit, state, dispatch }) {
    commit('setSessionToken', null)
    commit('segments/setContactId', null, { root: true })
    dispatch('deregisterEmarsysUser')
  },

  getVouchers({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      generateGetReq(`${state.urlbase}/wallet`, state.token)
        .then(res => res.data.data)
        .then(data => {
          data.campaigns.sort()
          data.campaigns.forEach((campaign, i) => {
            const voucher = data.vouchers.find(
              voucher => voucher.campaignId === campaign.campaignId
            )
            if (voucher) {
              delete voucher.expired
              delete voucher.expiry
              data.campaigns[i] = Object.assign({}, campaign, voucher)
            }
          })
          resolve(data.campaigns)
        })
        .catch(reject)
    })
  },

  issueVoucher({ state, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      generatePostReq(`${state.urlbase}/voucher`, state.token, data)
        .then(res => {
          const isGameCampaign = data.gameCampaign
          const eventCategory = isGameCampaign ? 'spin_to_win' : 'wallet'
          const eventAction = isGameCampaign ? 'win_voucher' : 'request_code'

          sendGAEvent({
            hitType: 'event',
            eventCategory,
            eventAction,
            eventLabel: data.campaignTitle
          })
          return res.data
        })
        .then(resolve)
        .catch(reject)
    })
  },

  getUser({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      generateGetReq(`${state.urlbase}/user`, state.token)
        .then(res => res.data)
        .then(user => {
          if (user && user.data && user.data.email) {
            dispatch('registerEmarsysUser', { email: user.data.email })
          }
          return user
        })
        .then(resolve)
        .catch(reject)
    })
  },

  saveUser({ state, commit, dispatch }, userData) {
    return new Promise((resolve, reject) => {
      generatePutReq(`${state.urlbase}/user`, state.token, userData)
        .then(res => res)
        .then(resolve)
        .catch(reject)
    })
  },

  updateOptIn({ state, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      generatePutReq(`${state.urlbase}/user/optIn`, state.token, data)
        .then(res => res)
        .then(resolve)
        .catch(reject)
    })
  },

  resetPassword({ state, commit, dispatch }, data) {
    dispatch('logout')
    generatePostReq(
      `${state.urlbase}/forgotten-password`,
      state.token,
      data
    ).then(res => res.data)
  },

  submitNewPassword({ state, commit, dispatch }, options) {
    return generatePostReq(
      `${state.urlbase}/reset-password`,
      state.token,
      options
    ).then(res => res.data)
  },

  emailVoucher({ state, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      generatePostReq(`${state.urlbase}/voucher-code`, state.token, data)
        .then(res => res.data)
        .then(resolve)
        .catch(reject)
    })
  },
  registerEmarsysUser({}, { email }) {
    if (!email) return false
    var isAndroid = window.Android && window.Android.registerUser
    var isIos =
      window &&
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.callback &&
      window.webkit.messageHandlers.callback.postMessage

    if (isAndroid) {
      window.Android.registerUser(email)
      return
    }
    if (isIos) {
      window.webkit.messageHandlers.callback.postMessage({
        data: { userEmail: email },
        id: 'registerUser'
      })
    }
  },
  deregisterEmarsysUser({}) {
    var isAndroid = window.Android && window.Android.deRegisterUser
    var isIos =
      window &&
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.callback &&
      window.webkit.messageHandlers.callback.postMessage

    if (isAndroid) {
      window.Android.deRegisterUser({ email: 'fakeEmail' })
      return
    }
    if (isIos) {
      window.webkit.messageHandlers.callback.postMessage({
        id: 'deRegisterUser'
      })
      console.log('deregistering IOS user')
    }
  },
  initFacebookSdk({ state }) {
    window.fbAsyncInit = function() {
      FB.init({
        appId: `${state.facebookAppId}`,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v4.0'
      })
    }
  },
  loadFacebookSdk({}) {
    const facebookSdk = document.createElement('script')
    facebookSdk.classList.add('facebook-script')
    facebookSdk.setAttribute('async', '')
    facebookSdk.setAttribute('defer', '')
    facebookSdk.setAttribute('src', 'https://connect.facebook.net/en_US/sdk.js')

    document.body.insertBefore(facebookSdk, document.body.firstChild)
  },
  unloadFacebookSdk({}) {
    const fbScripts = document.getElementsByClassName('facebook-script')
    Array.from(fbScripts).forEach(scriptElement => {
      document.body.removeChild(scriptElement)
    })
    delete window.fbAsyncInit
    delete window.FB
  },
  socialLogin({ getters, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      const config = {
        scope: 'email'
      }
      if (!getters.facebookPermissionsGranted) {
        config.auth_type = 'rerequest'
      }
      if (!window.FB) console.log('window.FB is not defined')
      window.FB.login(response => {
        console.log('response to FB.login', response)
        if (!response || response.error) {
          console.log('Facebook SDK error - ', response)
          return reject()
        }
        if (!response.status === 'connected') {
          console.log('Facebook SDK error - ', response)
          return reject()
        } else {
          const accessToken =
            response.authResponse && response.authResponse.accessToken
          if (accessToken) {
            window.FB.api('/me/permissions', permissionsResponse => {
              if (
                permissionsResponse &&
                permissionsResponse.data &&
                permissionsResponse.data.length
              ) {
                const emailPermission = permissionsResponse.data.find(
                  permissionObject => {
                    return (
                      permissionObject.permission === 'email' &&
                      permissionObject.status === 'granted'
                    )
                  }
                )
                if (emailPermission) {
                  commit('setFacebookPermissions', {
                    permissionGranted: true
                  })
                  window.FB.api(
                    '/me',
                    { fields: 'email' },
                    async apiResponse => {
                      if (apiResponse.error) {
                        console.log('Error returning user email')
                      }
                      const email = apiResponse && apiResponse.email

                      dispatch('authenticateFacebookUser', {
                        accessToken
                      })
                        .then(statusCode => {
                          return resolve({ statusCode, email })
                        })
                        .catch(err => {
                          console.log(err)
                          return reject(err)
                        })
                    }
                  )
                } else {
                  commit('setFacebookPermissions', {
                    permissionGranted: false
                  })
                  return reject({ code: 'PERMISSIONS' })
                }
              }
            })
          } else {
            console.log('Facebook SDK error - no access token', response)
            return reject({ code: 'UNKNOWN' })
          }
        }
      }, config)
    })
  },
  async authenticateFacebookUser({ state, commit }, { accessToken }) {
    try {
      const voucherApiResponse = await generatePostReq(
        `${state.urlbase}/social/facebook`,
        null,
        {
          access_token: accessToken,
          optIn: false
        }
      )
      const authToken =
        voucherApiResponse &&
        voucherApiResponse.data &&
        voucherApiResponse.data.data &&
        voucherApiResponse.data.data.authToken
      const responseStatus = voucherApiResponse && voucherApiResponse.status
      if (authToken) {
        commit('setSessionToken', authToken)
        return responseStatus
      } else {
        commit('setSessionToken', null)
        throw new Error('No auth token')
      }
    } catch (err) {
      console.log(err)
      throw new Error('Error sending request to voucher API')
    }
  },

  sendGoogleAnalyticsEvent(
    {},
    { hitType, eventCategory, eventAction, eventLabel }
  ) {
    return sendGAEvent({
      hitType,
      eventCategory,
      eventAction,
      eventLabel
    })
  }
}

const generatePostReq = (url, token, body) => {
  body.brand = 'chiq'
  const options = token ? { headers: { Authorization: 'Bearer ' + token } } : {}
  return Api.post(url, body, options)
}
const generatePutReq = (url, token, body) => {
  body.brand = 'chiq'
  const options = token ? { headers: { Authorization: 'Bearer ' + token } } : {}
  return Api.put(url, body, options)
}
const generateGetReq = (url, token) => {
  const options = token ? { headers: { Authorization: 'Bearer ' + token } } : {}
  return Api.get(url, options)
}
