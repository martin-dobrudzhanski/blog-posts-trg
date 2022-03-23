import axios from '~/plugins/axios';
import dayjs from 'dayjs';
import get from 'lodash.get';

const noCacheHeaders = {
  'Cache-Control': 'no-cache'
};

const getDefaultDateTime = () => {
  const timeNow = new Date();

  const afternoonSlot = dayjs()
    .startOf('day')
    .set('hour', 11)
    .set('minute', 45)
    .toDate();

  const eveningSlot = dayjs()
    .startOf('day')
    .set('hour', 18)
    .set('minute', 45)
    .toDate();

  const isMorning = timeNow < afternoonSlot;
  const isEvening = timeNow > eveningSlot;
  const isAfternoon = !isMorning && !isEvening;

  /* 
  hardcode response for 13th for this week (1st week of July)

  */
  const deadline = dayjs('2020-07-13T11:00:00.00Z').toDate();

  if (timeNow < deadline) return deadline;

  /* ******************************************************** */

  if (isMorning) {
    return dayjs()
      .startOf('day')
      .set('hour', 12)
      .toDate();
  } else if (isAfternoon) {
    return dayjs()
      .startOf('day')
      .set('hour', 19)
      .toDate();
  } else {
    return dayjs()
      .startOf('day')
      .add(1, 'day')
      .set('hour', 12)
      .toDate();
  }
};

const addRandomQueryString = () => {
  return new Date().toISOString().replace(/\.|-|:/g, '');
};

const checkAvailability = ({ data }) => {
  const url = '/api/liveres/availability';
  data.v = addRandomQueryString();
  return axios({
    method: 'get',
    url,
    params: data,
    headers: noCacheHeaders
  }).then(response => {
    return response.data;
  });
};

const getSessions = ({ data }) => {
  const url = '/api/liveres/sessions';
  data.v = addRandomQueryString();
  return axios({
    method: 'get',
    url,
    params: data,
    headers: noCacheHeaders
  }).then(response => {
    return response.data;
  });
};

const createBooking = ({ data }) => {
  const url = '/api/liveres/booking';
  const params = { v: addRandomQueryString() };
  return axios({
    method: 'post',
    url,
    data: data,
    params,
    headers: noCacheHeaders
  }).then(response => {
    return response.data;
  });
};

const getBooking = ({ data }) => {
  const url = '/api/liveres/booking';
  return axios({
    method: 'get',
    url,
    params: data,
    headers: noCacheHeaders
  }).then(response => {
    return response.data;
  });
};

const updateBooking = ({ data }) => {
  const url = '/api/liveres/booking/amend';
  return axios({
    method: 'post',
    url,
    data: data,
    headers: noCacheHeaders
  }).then(response => {
    return response.data;
  });
};

const cancelBooking = ({ data }) => {
  const url = '/api/liveres/booking/cancel';
  return axios({
    method: 'post',
    url,
    params: data,
    headers: noCacheHeaders
  }).then(response => {
    return response.data;
  });
};

// TODO: Add restaurant details to store
export const state = () => {
  return {
    modalIsVisible: false,
    activeModal: null,
    bookingDetailsComplete: false,
    allLocations: [],
    sessions: {},
    bookingRef: null,
    location: null,
    locations: null,
    dateTime: getDefaultDateTime(),
    numAdults: 2,
    numChildren: 0,
    numPeopleMax: 10,
    partyMaxSizeErrorMsg: null,
    numPeopleToastIsVisible: false,
    name: '',
    email: '',
    tel: '',
    specialRequest: '',
    additionalCheckboxIds: [],
    additionalCheckboxDict: {},
    acceptTerms: false,
    acceptRegionalTerms: false,
    region: null,
    marketingOptOut: false,
    alternativeTimes: null,
    specialRequestMaxLength: 200,
    termsAndConditionsUrl:
      'https://bookings.liveres.co.uk/(S(sv04zffcnrmaaudgbjeoshn1))/tc.html',
    regionalTerms: null,
    unavailableSessions: [],
    amendUrl: null,
    cancelUrl: null,
    amendedBookingDetails: {
      timeslot: null,
      numAdults: null,
      numChildren: null,
      specialRequest: null
    },
    specialOcassionOptions: null,
    specialOccasion: null
  };
};

export const mutations = {
  showModal(state, { modal, modalOptions, locations }) {
    document.body.setAttribute('data-modal', true);
    document.documentElement.setAttribute('data-modal', true);
    state.modalIsVisible = true;
    state.activeModal = modal;
    state.locations = locations;
  },

  hideModal(state) {
    document.body.removeAttribute('data-modal');
    document.documentElement.removeAttribute('data-modal');
    state.modalIsVisible = false;
    state.activeModal = null;
    state.locations = null;
  },

  setAmendedBookingDetails(
    state,
    { dateTime, numAdults, numChildren, specialRequest }
  ) {
    state.amendedBookingDetails.timeslot = dayjs(dateTime).format(
      'DD-MM-YYYY HH:mm'
    );
    state.amendedBookingDetails.numAdults = numAdults;
    state.amendedBookingDetails.numChildren = numChildren;
    state.amendedBookingDetails.specialRequest = specialRequest;
  },

  setBookingUrls(state, { amendUrl, cancelUrl }) {
    state.amendUrl = amendUrl;
    state.cancelUrl = cancelUrl;
  },

  setBookingDetailsComplete(state, { complete }) {
    state.bookingDetailsComplete = complete;
  },

  setSessions(state, { sessions }) {
    if (!sessions || !sessions.length) {
      return;
    }
    state.sessions = Object.assign({}, sessions);
  },

  setAllLocations(state, { locations }) {
    state.allLocations = locations;
  },

  setBookingRef(state, { bookingRef }) {
    state.bookingRef = bookingRef;
  },

  setLocation(state, { location }) {
    state.location = location;
  },

  setNumAdults(state, { numAdults }) {
    state.numAdults = numAdults;
  },

  setNumChildren(state, { numChildren }) {
    state.numChildren = numChildren;
  },

  setNumPeopleMax(state, { numPeopleMax }) {
    state.numPeopleMax = numPeopleMax;
  },

  setPartyMaxSizeErrorMsg(state, { errorMsg }) {
    state.partyMaxSizeErrorMsg = errorMsg;
  },

  setDateTime(state, { dateTime }) {
    // 2017-03-30 12:00:00
    state.dateTime = dayjs(dateTime).toDate();
  },

  setDate(state, { year, month, date }) {
    state.dateTime = dayjs(state.dateTime)
      .set('y', year)
      .set('M', month)
      .set('date', date)
      .toDate();
  },

  setTime(state, { hour, minute }) {
    state.dateTime = dayjs(state.dateTime)
      .set('hour', hour)
      .toDate();
    state.dateTime = dayjs(state.dateTime)
      .set('minute', minute)
      .toDate();
  },

  setName(state, { name }) {
    state.name = name;
  },

  setEmail(state, { email }) {
    state.email = email;
  },

  setTel(state, { tel }) {
    state.tel = tel;
  },

  setAlternativeTimes(state, { times }) {
    state.alternativeTimes = times;
  },

  setSpecialRequest(state, { specialRequest }) {
    state.specialRequest = specialRequest;
  },

  setRegionalTerms(state, { terms }) {
    state.regionalTerms = terms;
  },

  setRegion(state, { region }) {
    state.region = region;
  },

  toggleAcceptRegionalTerms(state) {
    state.acceptRegionalTerms = !state.acceptRegionalTerms;
  },

  setAcceptRegionalTerms(state, { accept }) {
    state.acceptRegionalTerms = accept;
  },

  toggleAcceptTerms(state) {
    state.acceptTerms = !state.acceptTerms;
  },

  setAcceptTerms(state, { acceptTerms }) {
    state.acceptTerms = acceptTerms;
  },

  toggleMarketingOptOut(state) {
    state.marketingOptOut = !state.marketingOptOut;
  },

  setMarketingOptOut(state, { optOut }) {
    state.marketingOptOut = optOut;
  },

  clearAlternativeTimes(state) {
    state.alternativeTimes = null;
  },

  setAlternativeTimeSession(state, { index, session }) {
    state.alternativeTimes[index].session = session;
  },

  makeAlternativeTimeAvailable(state, { index }) {
    state.alternativeTimes[index].availability = true;
  },

  makeAlternativeTimeUnavailable(state, { index }) {
    state.alternativeTimes[index].availability = false;
  },

  clearCurrentLocation(state) {
    state.location = null;
  },

  setSessionUnavailable(state, { session }) {
    state.unavailableSessions.push(session);
  },

  resetUnavailableSessions(state) {
    state.unavailableSessions = [];
  },

  numPeopleToastIsVisible(state, { isVisible }) {
    state.numPeopleToastIsVisible = isVisible;
  },

  setAdditionalCheckboxes(
    state,
    { additionalCheckboxIds = [], additionalCheckboxDict = {} }
  ) {
    state.additionalCheckboxIds = additionalCheckboxIds;
    state.additionalCheckboxDict = additionalCheckboxDict;
  },

  toggleAdditionalCheckbox(state, { id, checked }) {
    state.additionalCheckboxDict[id].checked = checked;
  },

  setSpecialOcassionOptions(state, { specialOcassionOptions }) {
    state.specialOcassionOptions = specialOcassionOptions.map((opt, indx) => {
      return {
        label: opt,
        value: indx
      };
    });
  },

  setSpecialOccasion(state, { specialOccasion }) {
    state.specialOccasion = specialOccasion;
  }
};

export const actions = {
  initState({ commit, state }) {
    commit('clearAlternativeTimes');
    commit('setBookingRef', { bookingRef: null });
    commit('setSessions', []);
    commit('setDateTime', { dateTime: getDefaultDateTime() });
    commit('setNumAdults', { numAdults: 2 });
    commit('setNumChildren', { numChildren: 0 });
    commit('setName', { name: '' });
    commit('setEmail', { email: '' });
    commit('setTel', { tel: '' });
    commit('setMarketingOptOut', { optOut: false });
    commit('setAcceptTerms', { acceptTerms: false });
    commit('setSpecialRequest', { specialRequest: '' });
    commit('setSpecialOccasion', { specialOccasion: '' });
    commit('setAmendedBookingDetails', {
      dateTime: null,
      numAdults: null,
      numChildren: null,
      specialRequest: null
    });
  },

  async submitExponeaTracking({ state, getters }, { actionType, skipConsent }) {
    const get = getters;
    const createData = get.getCreateData;
    const {
      name,
      email,
      locationName,
      specialRequest,
      specialOccasion
    } = createData;
    this.$identifyExponea({
      username: name,
      useremail: email
    });

    if (!skipConsent) {
      this.$logExponeaConsent({
        action: createData.marketingOptOut ? 'reject' : 'accept'
      });
    }

    const amendedBookingDetails =
      actionType === 'update' && getters.getAmendedBookingDetails;
    const editUrls = get.getBookingUrls;
    this.$logExponeaBooking({
      id: get.getBookingRef,
      timeslot: get.getDateObject,
      username: name,
      useremail: email,
      siteId: get.getSiteRef,
      siteName: locationName,
      covers: get.getNumPeople,
      specialRequest: specialRequest,
      specialOccasion:
        get.getSpecialOccasionOptions && get.getSpecialOccasionOptions.label
          ? get.getSpecialOccasionOptions.find(
              opt => opt.value == specialOccasion
            ).label
          : undefined,
      actionType: `booking_${actionType}`,
      amendUrl: editUrls.amendUrl,
      cancelUrl: editUrls.cancelUrl,
      amendedBookingDetails,
      agreedRegionalTerms: state.acceptRegionalTerms ? get.getRegion : null
    });
  },

  setStateFromQuery({ commit, state }) {
    const {
      dateTime,
      numAdults,
      numChildren,
      specialRequest,
      specialOccasion
    } = this.$router.history.current.query;
    if (dateTime) {
      commit('setDateTime', { dateTime });
    }
    if (numAdults) {
      commit('setNumAdults', { numAdults: parseInt(numAdults) });
    }
    if (numChildren) {
      commit('setNumChildren', { numChildren: parseInt(numChildren) });
    }
    if (specialRequest) {
      commit('setSpecialRequest', { specialRequest });
    }
    if (specialOccasion) {
      commit('setSpecialOccasion', { specialOccasion });
    }
  },

  showError({ commit, state }) {
    this.app.router.push('/book/error');
  },

  redirectToAllLocations({ state }) {
    this.app.router.push({
      path: `/book/all`,
      query: {
        geolocate: `false`
      }
    });
  },

  async redirectToNearest({ state, dispatch, getters }) {
    var closestLocations;
    try {
      closestLocations = await dispatch(
        'location/getLocalRestaurants',
        {
          restaurantList: getters.getEnabledLocations
        },
        { root: true }
      );
    } catch (error) {
      dispatch(
        'ui/flash',
        {
          message:
            'As we couldn’t locate you, please search for your local restaurant below'
        },
        { root: true }
      );
    }
    if (closestLocations && closestLocations.length) {
      const {
        dateTime,
        numPeople,
        specialRequest,
        specialOccasion
      } = this.$router.history.current.query;

      const isSevenRooms = get(
        closestLocations[0],
        'fields.bookingConfiguration.fields.isSevenRooms'
      );
      if (isSevenRooms) {
        window.location.assign(
          `https://www.sevenrooms.com/reservations/${location.fields.bookingConfiguration.fields.venuName}`
        );
      } else {
        this.app.router.push({
          path: `/restaurants/${closestLocations[0].fields.slug}/book`,
          query: this.$router.history.current.query
        });
      }
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },

  async showLocationModal({ state, commit, dispatch, getters }, { query }) {
    if (!query) {
      return;
    }
    const closestLocations = await dispatch(
      'location/getLocalRestaurants',
      {
        query,
        restaurantList: getters.getEnabledLocations
      },
      { root: true }
    );
    if (!closestLocations || !closestLocations.length) {
      return;
    }
    commit('showModal', {
      modal: 'LocationModal',
      locations: closestLocations
    });
    return Promise.resolve(true);
  },

  showDateModal({ commit }) {
    commit('showModal', {
      modal: 'DateModal'
    });
  },

  showTimeModal({ commit }) {
    commit('showModal', {
      modal: 'TimeModal'
    });
  },

  showAddEventModal({ commit }) {
    commit('showModal', {
      modal: 'AddEventModal'
    });
  },

  getAlternativeTimesSessions({ state, getters, commit }) {
    getters.getAlternativeTimes.forEach(function(alternativeTime, index) {
      // adjust time of selectedDate to have alternativeTime (hour and minutes)
      let selectedDate = dayjs(getters.getDateObject);

      const hour = parseInt(alternativeTime.slot.substring(0, 2));
      const minute = parseInt(alternativeTime.slot.slice(-2));

      selectedDate = selectedDate.set('hour', hour);
      selectedDate = selectedDate.set('minute', minute);
      selectedDate = selectedDate.toDate();

      // get the Session of each AlternativeTime
      const session = Object.values(state.sessions).find(item => {
        const startTimeArray = item.startTime.split(':');
        const startTime = {
          h: startTimeArray[0],
          m: startTimeArray[1],
          s: startTimeArray[2]
        };
        const startDate = dayjs(selectedDate)
          .set('hour', startTime.h)
          .set('minute', startTime.m)
          .set('second', startTime.s)
          .toDate();
        const endTimeArray = item.endTime.split(':');
        const endTime = {
          h: endTimeArray[0],
          m: endTimeArray[1],
          s: endTimeArray[2]
        };
        const endDate = dayjs(selectedDate)
          .set('hour', endTime.h)
          .set('minute', endTime.m)
          .set('second', endTime.s)
          .toDate();
        if (selectedDate >= startDate && selectedDate <= endDate) {
          // Add the Session to alternativeTime element in state
          commit('setAlternativeTimeSession', {
            index: index,
            session: item.name
          });
          return true;
        }
        return false;
      });
    });
  },

  updateAlternativeTimesAvailability({ state, getters, commit }) {
    // getSession
    // check if it is the same as session in store (for selectedTime)
    // if same - do nothing, if different - change availability to true because we do not know if the slot is available/unavailable

    getters.getAlternativeTimes.forEach(function(alternativeTime, index) {
      // If the alternativeTime is during a different session that is not known as unavailable (ie. not in unavailableSessions), display it as available
      if (
        alternativeTime.session !== getters.getSession.name &&
        !getters.getSessionAvailabilty(alternativeTime.session)
      ) {
        commit('makeAlternativeTimeAvailable', { index: index });
      }
    });
  },

  isTimeslotValid({ state, getters, commit }) {
    getters.getAlternativeTimes.forEach(function(alternativeTime, index) {
      let timeslot = dayjs(getters.getDateObject);

      const hour = parseInt(alternativeTime.slot.substring(0, 2));
      const minute = parseInt(alternativeTime.slot.slice(-2));

      timeslot = timeslot.set('hour', hour);
      timeslot = timeslot.set('minute', minute);
      timeslot = timeslot.toDate();

      if (
        timeslot < getters.getFirstTimeslot ||
        timeslot > getters.getLastTimeslot
      ) {
        commit('makeAlternativeTimeUnavailable', { index: index });
      }
    });
  },

  async checkAvailability({ state, getters, commit, dispatch }) {
    // api needs to return status: available for success
    // api needs to return status: error for any error
    // api needs to return status: notAvailable for not available
    // if status is notAvailable api needs to return alternativeTimes array
    var response;
    const availabilityData = getters.getAvailabilityData;
    if (!availabilityData) {
      return false;
    }
    try {
      response = await checkAvailability({
        data: getters.getAvailabilityData
      });
    } catch (error) {
      dispatch('showError');
      return Promise.resolve(false);
    }
    // timeslots have not been populated in liveres response - returns an empty timeArray
    if (response.status === 'noTimeslots') {
      this.$toast.show(
        'Sorry, no times available on this day. Please try another day.',
        {
          className: 'booking-toast',
          closeOnSwipe: true,
          containerClass: 'bookings',
          duration: 4000,
          fullWidth: true,
          fitToScreen: true,
          position: 'bottom-center',
          singleton: true,
          action: {
            text: 'Close',
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        }
      );
      return Promise.resolve(false);
    }
    // error
    if (response.status === 'error') {
      dispatch('showError');
      return Promise.resolve(false);
    }
    // not available
    if (response.status === 'notAvailable') {
      if (!response.alternativeTimes) {
        // TODO: Show toast
        dispatch('showError');
        return Promise.resolve(false);
      }

      const sessionIsKnownUnavailable =
        getters.getUnavailableSessions.indexOf(response.session) !== -1;

      if (!response.sessionAvailable && !sessionIsKnownUnavailable) {
        commit('setSessionUnavailable', { session: response.session });

        if (!getters.getDayAvailability) {
          this.$toast.show(
            'Sorry, no times available on this day. Please try another day.',
            {
              className: 'booking-toast',
              closeOnSwipe: true,
              containerClass: 'bookings',
              duration: 4000,
              fullWidth: true,
              fitToScreen: true,
              position: 'bottom-center',
              singleton: true,
              action: {
                text: 'Close',
                onClick: (e, toastObject) => {
                  toastObject.goAway(0);
                }
              }
            }
          );
          return Promise.resolve(false);
        }
      }
      commit('setAlternativeTimes', { times: response.alternativeTimes });
      dispatch('getAlternativeTimesSessions');
      dispatch('updateAlternativeTimesAvailability', {
        session: response.session,
        sessionAvailable: response.sessionAvailable
      });
      dispatch('isTimeslotValid');

      return Promise.resolve(false);
    }
    // success
    var url = `/restaurants/${getters.getRestaurantSlug}/book/your-details`;
    commit('clearAlternativeTimes');
    if (state.bookingRef) {
      url = `/restaurants/${getters.getRestaurantSlug}/book/amend/${state.bookingRef}/your-details`;
    }
    commit('setBookingDetailsComplete', { complete: true });
    this.$router.push(url);
    Promise.resolve(true);
  },

  async getSessions({ state, getters, commit, dispatch }) {
    // api needs to return an array of sessions on success
    // api needs to return status: error for any error
    // api needs to return status: notAvailable for not available
    var response;
    const sessionsData = getters.getSessionsData;
    if (!sessionsData) {
      return false;
    }
    try {
      response = await getSessions({ data: sessionsData });
    } catch (error) {
      dispatch('showError', { heading: 'There was a problem' });
      return Promise.resolve(false);
    }
    // error
    if (response.status === 'error') {
      dispatch('showError', { heading: 'There was a problem' });
      return Promise.resolve(false);
    }
    // success
    commit('setSessions', { sessions: response });
    Promise.resolve(true);
  },

  async createBooking({ state, getters, commit, dispatch }) {
    // api needs to return status: available for success
    // api needs to return status: error for any error

    var response;

    try {
      response = await createBooking({ data: getters.getCreateData });
    } catch (error) {
      dispatch('showError');
      return Promise.resolve(false);
    }
    // error
    if (response.status === 'error') {
      dispatch('showError');
      return Promise.resolve(false);
    }
    let confirmUrl = `/restaurants/${getters.getRestaurantSlug}`;
    confirmUrl += `/book/confirm/${response.bookingRef}`;
    commit('setBookingRef', { bookingRef: response.bookingRef });
    commit('setBookingUrls', response);
    dispatch('submitExponeaTracking', { actionType: 'confirm' });

    commit('setAmendedBookingDetails', getters.getCreateData);
    this.$router.push(confirmUrl);
    return Promise.resolve(true);
  },

  async getBooking({ state, getters, commit, dispatch }, { bookingRef }) {
    // api needs to return status: success with booking
    // api needs to return status: error for any error
    if (!bookingRef) {
      dispatch('showError');
      return Promise.resolve(false);
    }
    var response;
    const data = { bookingRef };
    try {
      response = await getBooking({ data });
    } catch (error) {
      dispatch('showError');
      Promise.resolve(false);
    }

    commit('setAmendedBookingDetails', response);
    commit('setBookingUrls', response);
    dispatch('setBookingFromResponse', { response });
    Promise.resolve(true);
  },

  setBookingFromResponse({ state, getters, commit }, { response }) {
    const date = new Date(response.dateTime);

    commit('setDate', {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate()
    });

    commit('setTime', {
      hour: date.getHours(),
      minute: date.getMinutes()
    });
    commit('setNumAdults', { numAdults: response.numAdults });
    commit('setNumChildren', { numChildren: response.numChildren });
    commit('setSpecialRequest', { specialRequest: response.specialRequest });
    commit('setSpecialOccasion', { specialOccasion: response.specialOccasion });
    commit('setName', { name: response.name });
    commit('setEmail', { email: response.email });
    commit('setTel', { tel: response.tel });
    commit('setMarketingOptOut', { optOut: response.marketingOptOut });
  },

  async updateBooking({ state, dispatch, getters }) {
    // api needs to return status: success when successfuly cancelled
    // api needs to return status: error when booking ref not found
    // api needs to return status: error for any error
    var response;
    try {
      response = await updateBooking({ data: getters.getUpdateData });
    } catch (error) {
      dispatch('showError');
      return Promise.resolve(false);
    }
    if (response.status === 'error') {
      dispatch('showError');
      return Promise.resolve(false);
    }
    dispatch('submitExponeaTracking', { actionType: 'update' });
    let confirmUrl = `/restaurants/${getters.getRestaurantSlug}`;
    confirmUrl += `/book/amend/${response.bookingRef}/confirm`;
    this.$router.push(confirmUrl);
    return Promise.resolve(true);
  },

  async cancelBooking({ state, dispatch, getters }) {
    // api needs to return status: success when successfuly cancelled
    // api needs to return status: error when booking ref not found
    // api needs to return status: error for any error

    var response;
    const data = {
      bookingRef: state.bookingRef,
      email: state.email,
      name: state.name,
      locationTitle: state.location.title,
      locationStreet: state.location.street,
      locationAdditional: state.location.additional,
      locationName: state.location.name,
      locationCity: state.location.city,
      locationPostalCode: state.location.postalCode,
      locationTelephone: state.location.telephone,
      locationUrl: state.location.url,
      prettyDate: getters.getPrettyDate
    };

    try {
      response = await cancelBooking({ data });
    } catch (error) {
      dispatch('showError');
      return Promise.resolve(false);
    }

    if (response.status === 'error') {
      dispatch('showError');
      return Promise.resolve(false);
    }

    dispatch('submitExponeaTracking', {
      actionType: 'cancel',
      skipConsent: true
    });

    const confirmUrl = `/restaurants/${getters.getRestaurantSlug}/book/cancel/confirm`;
    this.$router.push(confirmUrl);
    return Promise.resolve(true);
  },

  numPeopleToastIsVisible({ commit }, { isVisible }) {
    commit('numPeopleToastIsVisible', { isVisible });
  },

  setSpecialOcassionOptions({ commit }, { specialOcassionOptions }) {
    commit('setSpecialOcassionOptions', { specialOcassionOptions });
  },

  setSpecialOccasion({ commit }, { specialOccasion }) {
    commit('setSpecialOccasion', { specialOccasion });
  }
};

export const getters = {
  getSpecialRequestLength: (state, getters) => {
    if (!state.specialRequest) {
      return 0;
    }
    return state.specialRequest.length;
  },

  getSpecialRequestRemainingChars: (state, getters) => {
    const remaining =
      state.specialRequestMaxLength - getters.getSpecialRequestLength;
    return `${remaining}/${state.specialRequestMaxLength}`;
  },

  getSiteRef: state => {
    if (!state.location) {
      return false;
    }
    if (!state.location.siteId) {
      return false;
    }
    return state.location.siteId;
  },

  getDateObject: state => {
    return new Date(state.dateTime);
  },

  getDateTime: state => {
    // 2017-03-30 12:00:00
    return dayjs(state.dateTime).format('YYYY-MM-DD HH:mm');
  },

  getDate: state => {
    return dayjs(state.dateTime).format('YYYY-MM-DD');
  },

  getTime: state => {
    return dayjs(state.dateTime).format('HH:mm');
  },

  getEndTime: state => {
    const time = state.dateTime;
    const endTime = dayjs(time).add(75, 'minute');
    return dayjs(endTime).format('HH:mm');
  },

  getAmendedBookingDetails: state => {
    return state.amendedBookingDetails;
  },

  getBookingUrls: state => {
    return {
      amendUrl: state.amendUrl,
      cancelUrl: state.cancelUrl
    };
  },

  getPrettyDate: state => {
    const date = dayjs(state.dateTime);
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');
    if (date > tomorrow.endOf('day') || date < today.startOf('day')) {
      return dayjs(state.dateTime).format('DD/MM/YYYY');
    }
    if (date > today.endOf('day')) {
      return 'Tomorrow';
    }
    return 'Today';
  },

  getPrettyTime: (state, getters) => {
    return `at ${getters.getTime}`;
  },

  getAvailabilityData: (state, getters) => {
    if (!getters.getSession) {
      return false;
    }
    if (!getters.getSiteRef) {
      return false;
    }
    return {
      session: getters.getSession.name,
      siteRef: getters.getSiteRef,
      date: getters.getDate,
      time: getters.getTime,
      numAdults: state.numAdults,
      numChildren: state.numChildren,
      numPeople: state.numAdults + state.numChildren || 0
    };
  },

  getSessionsData: (state, getters) => {
    return {
      siteRef: getters.getSiteRef,
      date: getters.getDate
    };
  },

  getSession: (state, getters) => {
    if (!state.sessions) {
      return false;
    }
    if (!getters.getDateObject) {
      return false;
    }
    const selectedDate = dayjs(getters.getDateObject);
    // return Object.values(state.sessions)[0];
    const session = Object.values(state.sessions).find(item => {
      const startTimeArray = item.startTime.split(':');
      const startTime = {
        h: startTimeArray[0],
        m: startTimeArray[1],
        s: startTimeArray[2]
      };
      const startDate = dayjs(getters.getDateObject)
        .set('hour', startTime.h)
        .set('minute', startTime.m)
        .set('second', startTime.s)
        .toDate();
      const endTimeArray = item.endTime.split(':');
      const endTime = {
        h: endTimeArray[0],
        m: endTimeArray[1],
        s: endTimeArray[2]
      };
      const endDate = dayjs(getters.getDateObject)
        .set('hour', endTime.h)
        .set('minute', endTime.m)
        .set('second', endTime.s)
        .toDate();
      if (selectedDate >= startDate && selectedDate <= endDate) {
        return true;
      }
      return false;
    });
    if (!session) {
      return false;
    }
    return session;
  },

  getFirstTimeslot: (state, getters) => {
    if (!state.sessions || !state.sessions[0]) {
      return false;
    }
    const timeArray = state.sessions[0].startTime.split(':');
    const time = {
      h: timeArray[0],
      m: timeArray[1],
      s: timeArray[2]
    };
    const date = dayjs(getters.getDateObject)
      .set('hour', time.h)
      .set('minute', time.m)
      .set('second', time.s);
    return date.toDate();
  },

  getLastTimeslot: (state, getters) => {
    if (
      !state.sessions ||
      !state.sessions[Object.keys(state.sessions).length - 1]
    ) {
      return false;
    }
    const timeArray = state.sessions[
      Object.keys(state.sessions).length - 1
    ].endTime.split(':');
    const time = {
      h: timeArray[0],
      m: timeArray[1],
      s: timeArray[2]
    };
    const date = dayjs(getters.getDateObject)
      .set('hour', time.h)
      .set('minute', time.m)
      .set('second', time.s);
    return date.toDate();
  },

  getLocation: state => state.location,

  getRegion: state => state.region,

  getRegionalTerms: state => state.regionalTerms,

  getPrettyLocationQuery: state => {
    if (!state.location || !state.location.title) {
      return null;
    }
    return state.location.title;
  },

  getNumPeopleString: state => {
    let str = state.numAdults + state.numChildren;
    str += state.numPeople === 1 ? ' Person' : ' People';
    return str;
  },

  getNumAdultsString: state => {
    let str = state.numAdults;
    str += state.numAdults === 1 ? ' Adult' : ' Adults';
    return str;
  },

  getNumChildrenString: state => {
    let str = state.numChildren;
    str += state.numChildren === 1 ? ' Child' : ' Children';
    return str;
  },

  getNumAdultsOptions: state => {
    const numAdultsAllowed = state.numPeopleMax - state.numChildren;
    const numAdultsOptions = [];

    for (let i = 0; i < numAdultsAllowed; i++) {
      const value = i + 1;
      const label = `${value} ${value === 1 ? ' Adult' : ' Adults'}`;
      numAdultsOptions.push({
        value,
        label
      });
    }

    return numAdultsOptions;
  },

  getNumChildrenOptions: state => {
    const numChildrenAllowed = state.numPeopleMax - state.numAdults;
    const numChildrenOptions = [
      {
        value: 0,
        label: 'No Children'
      }
    ];

    for (let i = 0; i < numChildrenAllowed; i++) {
      const value = i + 1;
      const label = `${value} ${value === 1 ? ' Child' : ' Children'}`;
      numChildrenOptions.push({
        value,
        label
      });
    }

    return numChildrenOptions;
  },

  getNumPeople: state => {
    return state.numAdults + state.numChildren;
  },

  showDecreaseNumPeopleButton: (state, getters) => {
    if (getters.getNumPeople <= 1) {
      return false;
    }
    return true;
  },

  getCreateData: (state, getters) => {
    if (!getters.getSession) {
      return false;
    }
    if (!getters.getSiteRef) {
      return false;
    }
    return {
      session: getters.getSession.name,
      siteSlug: getters.getRestaurantSlug,
      siteRef: getters.getSiteRef,
      dateTime: getters.getDateTime,
      numPeople: state.numPeople,
      numAdults: state.numAdults,
      numChildren: state.numChildren,
      name: state.name,
      email: state.email,
      tel: state.tel,
      specialRequest: state.specialRequest,
      marketingOptOut: state.marketingOptOut,
      locationTitle: state.location.title,
      locationStreet: state.location.street,
      locationAdditional: state.location.additional,
      locationName: state.location.name,
      locationCity: state.location.city,
      locationPostalCode: state.location.postalCode,
      locationTelephone: state.location.telephone,
      locationUrl: state.location.url,
      prettyDate: getters.getPrettyDate,
      prettyTime: getters.getPrettyTime
    };
  },

  getUpdateData: (state, getters) => {
    if (!getters.getSession) {
      return false;
    }
    if (!getters.getSiteRef) {
      return false;
    }
    return {
      session: getters.getSession.name,
      bookingRef: state.bookingRef,
      siteSlug: getters.getRestaurantSlug,
      siteRef: getters.getSiteRef,
      dateTime: getters.getDateTime,
      numPeople: state.numPeople,
      numAdults: state.numAdults,
      numChildren: state.numChildren,
      name: state.name,
      email: state.email,
      tel: state.tel,
      specialRequest: state.specialRequest,
      marketingOptOut: state.marketingOptOut,
      locationTitle: state.location.title,
      locationStreet: state.location.street,
      locationAdditional: state.location.additional,
      locationName: state.location.name,
      locationCity: state.location.city,
      locationPostalCode: state.location.postalCode,
      locationTelephone: state.location.telephone,
      locationUrl: state.location.url,
      prettyDate: getters.getPrettyDate,
      prettyTime: getters.getPrettyTime
    };
  },

  getBookingRef: state => {
    return state.bookingRef;
  },

  getRestaurantSlug: state => {
    if (!state.location || !state.location.title) {
      return null;
    }
    return state.location.slug;
  },

  getBookingConfirmationButtonLink: state => {
    if (!state.location || !state.location.bookingConfirmationButtonLink) {
      return null;
    }
    return state.location.bookingConfirmationButtonLink;
  },

  getBookingConfirmationButtonText: state => {
    if (!state.location || !state.location.bookingConfirmationButtonText) {
      return null;
    }
    return state.location.bookingConfirmationButtonText;
  },

  getAlternativeTimes: state => {
    return state.alternativeTimes;
  },

  // returns true if session is unavailable (and therefore in the array)
  getSessionAvailabilty: state => {
    return session => {
      return state.unavailableSessions.indexOf(session) !== -1;
    };
  },

  getUnavailableSessions: state => {
    return state.unavailableSessions;
  },

  // returns false if all sessions are unavailable
  getDayAvailability: state => {
    return (
      Object.keys(state.sessions).length !==
      Object.keys(state.unavailableSessions).length
    );
  },

  isBookingToday: (state, getters) => {
    const now = dayjs();
    return (
      getters.getBookingDate.$D === now.$D &&
      getters.getBookingDate.$M === now.$M
    );
  },

  isBookingEnabled: state => {
    if (!state.location) return false;
    return state.location.enableBooking;
  },

  getBookingDate: state => {
    return dayjs(state.dateTime);
  },

  isBookingBreakfast: (state, getters) => {
    const booking = new Date(state.dateTime);
    const finalBreakfastSlot = new Date(state.dateTime);

    finalBreakfastSlot.setHours(11);
    finalBreakfastSlot.setMinutes(30);

    return finalBreakfastSlot > booking;
  },

  getEnabledLocations: state => {
    return state.allLocations.filter(location => {
      return get(location, 'fields.displayInSiteDirectory');
    });
  },

  locationIsEnabled: state => {
    return state.location && state.location.displayInSiteDirectory;
  },

  getAdditionalCheckboxesArray: state => {
    return state.additionalCheckboxIds.map(id => ({
      id,
      ...(state.additionalCheckboxDict[id] || {})
    }));
  },

  getSpecialOccasionOptions: state => {
    return state.specialOcassionOptions;
  },

  getSpecialOccasion: state => {
    return state.specialOccasion;
  }
};
