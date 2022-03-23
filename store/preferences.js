import axios from 'axios'

const Api = axios.create({ timeout: 50000 })

export const state = () => {
  const baseUrl = process.env.UTIL_ENDPOINT || 'https://util-dev.omnifitrgsites.co.uk'
  return {
    urlbase: baseUrl
  }
}

export const actions = {
  unsubscribeUser ({ state }, { payload }) {
    return new Promise((resolve, reject) => {
      Api.post(`${state.urlbase}/chiquito/unsubscribe`, payload)
        .then(res => {
          if (res && res.data.message === 'success') {
            resolve(true)
            return
          }
          resolve(false)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }

}
