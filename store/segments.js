import axios from 'axios'
import { STATUS_CODES } from 'http';
const jwtDecode = require('jwt-decode');

var Api = axios.create({
  timeout: 50000
})

export const state = () => {
  const baseUrl = process.env.UTIL_ENDPOINT || 'https://util-stage.omnifitrgsites.co.uk'
  return {
    urlbase: baseUrl,
    contactId: null
  }
}

export const getters = {
  hasContactId (state) {
    return !!state.contactId
  },
  contactId (state) {
    return state.contactId
  }
}

export const mutations = {
  setContactId (state, value) {
    state.contactId = value || null
  }
}

export const actions = {
  isUserInSegment ({ commit, state, dispatch, rootState }, { segmentId }) {
    return new Promise((resolve, reject) => {
      let payload = { cID: state.contactId, sID: segmentId }

      if (!state.contactId) {
        try {
          payload = {
            e: jwtDecode(rootState.auth.token).data.email,
            sID: segmentId
          }
        } catch (e) {
          return resolve(false)
        }
      }

      Api.post(`${state.urlbase}/chiquito/lookup-segement`, payload)
        .then(res => {
          if (res && res.data.message === 'success') {
            commit('setContactId', res.data.data.contactId)
            resolve(res.data.data.withinSegement)
            return
          }
          resolve(false)
        })
    })
  }
  
}
