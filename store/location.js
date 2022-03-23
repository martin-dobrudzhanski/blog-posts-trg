import axios from '~/plugins/axios';
import sortByDistance from '~/libs/sortByDistance.js';


export const state = () => {
  return {
    accepted: false,
    error: false,
    localRestaurants: [],
    coords: { lat: null, long: null }
  }
}

export const getters = {
  userAcceptedLocationPopup (state) {
    return state.accepted
  },
  userLocation (state) {
    return state.coords
  },
  localRestaurants (state) {
    return state.localRestaurants
  }
}

export const mutations = {
  acceptPopUpTerms (state) {
    state.accepted = true
  },
  setUserLocation (state, value) {
    state.coords = value
  },
  locationError (state) {
    state.error = true;
  },
  setLocalRestaurants (state, restaurants) {
    state.localRestaurants = restaurants
  }
}

export const actions = {

  getLocalRestaurants ({ state, getters, commit, dispatch }, { query, restaurantList }) {
    return new Promise ((resolve, reject) =>  {

      if (query && query.length) {
        dispatch('getLocationFromQuery', query)
          .then(locateNearestRestaurants)
          .catch(err => reject('query'))
      } else if (state.localRestaurants.length) {
        resolve(state.localRestaurants)
      } else {
        dispatch('getBrowserLocation')
        .then(locateNearestRestaurants)
        .catch(err => reject('browser'))
      }

      function locateNearestRestaurants (coords) {
        dispatch('getNearestRestaurants', { coords, restaurantList, isQueryLookup: !!query })
          .then(resolve)
          .catch(reject)
      }
    })
  },

  getBrowserLocation ({ state, getters, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      if (!getters.userAcceptedLocationPopup) {
        commit('ui/showModal', {
          modal: 'LocationServices',
          modalOptions: {
            heading: 'We would like to know your location so that we can find the nearest restaurant to you',
            cb: () => {
              commit('acceptPopUpTerms')
              getLocation()
            }
          }
        }, { root: true });
      } else {
        getLocation()
      }

      function getLocation () {
        if (window && navigator && navigator.geolocation) {

          const options = {
            timeout: 10000
          }

          function success(position) {
            const coords = { lat: position.coords.latitude, long: position.coords.longitude}
            commit('setUserLocation', coords)
            resolve(coords)
          }

          function error(err) {
            console.log(err)
            reject()
          }

          navigator.geolocation.getCurrentPosition(success, error, options)

        } else {
          reject()
        }
      }
    })
  },

  getLocationFromQuery ({ state, getters, commit }, query) {
    return axios.get(`/api/geocode/${query.trim().split(' ').join('+')},+uk`)
    .then((res) => res.data.results[0] )
    .then(location => {
      const coords = {lat: location.geometry.location.lat, long: location.geometry.location.lng}
      commit('setUserLocation', coords)
      return coords
    })
  },

  getNearestRestaurants ({ state, getters, commit }, { coords, restaurantList, isQueryLookup }) {
    return new Promise ((resolve, reject) => {
      let origin = {
        latitude: coords.lat,
        longitude: coords.long
      };
      let points = restaurantList;
      let opts = {
        xName: 'latitude',
        yName: 'longitude',
        seperator: 'fields'
      };
      const closestVenues = sortByDistance(origin, points, opts).slice(0, 10);
      if (!isQueryLookup) {
        commit('setLocalRestaurants', closestVenues)
      }
      resolve(closestVenues)
    })
  },
  resetLocalRestaurants ({ commit }) {
    commit('setLocalRestaurants', [])
  }
}
