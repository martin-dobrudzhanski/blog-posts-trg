import axios from 'axios'
import * as EmarsysUtil from './emarsysUtil'

export default function emarsysBookingCancellation (liveresData) {
  const EVENT_ID = process.env.EMARSYS_BOOKING_CANCELLATION_EVENT_ID
  const emarsysUrl = `${process.env.EMARSYS_EVENT_PREFIX_URL}/${EVENT_ID}/trigger`
  const emarsysBody = {
    key_id: '3',
    contacts: [
      {
        external_id: liveresData.Guest.Email,
        data: {
          global: {
            booking_guest_name: liveresData.Guest.FirstName,
            booking_restaurant_title: liveresData.locationTitle,
            booking_restaurant_street: liveresData.locationStreet,
            booking_restaurant_additional: liveresData.locationAdditional,
            booking_restaurant_name: liveresData.locationName,
            booking_restaurant_city: liveresData.locationCity,
            booking_restaurant_postal_code: liveresData.locationPostalCode,
            booking_restaurant_telephone: liveresData.locationTelephone,
            booking_restaurant_url: liveresData.locationUrl,
            booking_date: EmarsysUtil.createBookingDate(liveresData.prettyDate),
            booking_reference: liveresData.bookingRef
          }
        }
      }
    ]
  }

  EmarsysUtil.emarsysCreateContact(liveresData.Guest.Email).then(authHeader => {
    return axios({
      method: 'post',
      url: emarsysUrl,
      headers: { 'content-type': 'application/json', 'X-WSSE': authHeader },
      data: emarsysBody
    }).catch(err => {
      console.error(err)
      // gracefully fail, the promise chain must go on...
      return 500
    })
  }).catch(err => {
    console.error(err)
    // gracefully fail, the promise chain must go on...
    return 500
  })
};
