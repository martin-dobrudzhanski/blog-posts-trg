import axios from 'axios'
import get from 'lodash/get'

const baseURL = process.env.timeslotsApiUrl
const client = axios.create({
  baseURL,
})
const getAvailableTimeslots = async ({ locationId, timeslots }) => {
  let openingTimes, res

  try {
    res = await client.post(`/validate`, {
      siteId: locationId,
      zonalTimeslots: timeslots,
      brand: 'chiquito',
    })

    openingTimes = openingTimes = get(res, 'data.available')

    // check response has correct format
    const isArray = Array.isArray(openingTimes)
    if (!isArray) {
      throw new Error('Availability response format is invalid', 'timeslots')
    }

    return openingTimes
  } catch (error) {

    console.log(error)

    throw error
  }
}

const confirmReservation = async ({ locationId, reservationId }) => {
  let res

  try {
    res = await client.post(`/confirm`, {
      reservationId,
      brand: 'chiquito',
    })

    return { success: true }
  } catch (error) {

    console.log(error)

    throw error
  }
}

const reserveTimeslot = async ({ locationId, selectedTimeslot }) => {
  let reservationData, res
  try {
    res = await client.post(`/reserve`, {
      siteId: locationId,
      timeslot: selectedTimeslot,
      brand: 'chiquito',
    })

    reservationData = get(res, 'data')

    return reservationData
  } catch (error) {
    console.log(error)

    throw error
  }
}

const deleteReservation = async ({locationId, reservationId}) => {
  let reservationData, res
  try {
    res = await client.post(`/delete`, {
      siteId: locationId,
      reservationId: reservationId,
      brand: 'chiquito',
    })

    reservationData = get(res, 'data')

    return reservationData
  } catch (error) {
    console.log(error)

    throw error
  }
}

export default {
  getAvailableTimeslots,
  confirmReservation,
  reserveTimeslot,
  deleteReservation
} 