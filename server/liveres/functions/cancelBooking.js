import rp from 'request-promise'
import config from '../../config/liveres'
import * as LiveresUtil from '../../utils/liveresUtil'
import emarsysBookingCancellation from '../../utils/emarsysBookingCancellation'

export default function (req, res) {
  if (req && req.query && req.query.bookingRef) {
    const responseBody = LiveresUtil.createBookingCancellationResponseBody(req.query)
    const liveresOptions = LiveresUtil.createBookingCancellationLiveresOptions(config.liveres.defaultOptions, responseBody)
    const uri = `${config.liveres.LIVERES_URL}/reservation/${liveresOptions.bookingRef}`

    rp({
      method: 'DELETE',
      uri,
      headers: config.liveres.headers,
      json: true
    }).then(liveresResponse => {
      if (!liveresResponse ||
        !liveresResponse.StatusCode ||
        liveresResponse.StatusCode !== 200) {
        res.json({
          status: 'error',
          message: 'Error'
        })
      } else {
        res.json({
          status: 'success',
          data: liveresResponse.Data
        })

        if (liveresOptions) {
          return emarsysBookingCancellation(liveresOptions)
        }
      }
    }).catch((error) => {
      console.error(error)

      res.json({
        status: 'error'
      })
    })
  } else {
    res.status(500).json({ status: 'error', message: { bookingRef: 'bookingRef' } })
  }
};
