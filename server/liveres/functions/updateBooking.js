import rp from 'request-promise'
import config from '../../config/liveres'
import * as LiveresUtil from '../../utils/liveresUtil'
import emarsysBookingUpdate from '../../utils/emarsysBookingUpdate'

export default function (req, res) {
  const validationErrors = LiveresUtil.validateBookingUpdate(req.body)

  if (validationErrors.length === 0) {
    const responseBody = LiveresUtil.createBookingUpdateResponseBody(req.body)
    const liveresOptions = LiveresUtil.createLiveresBookingUpdateOptions(config.liveres.defaultOptions, responseBody)
    const uri = `${config.liveres.LIVERES_URL}/reservation/${liveresOptions.bookingRef}`

    rp({
      method: 'PUT',
      uri,
      headers: config.liveres.headers,
      body: liveresOptions,
      json: true
    }).then(liveresResponse => {
      if (!liveresResponse ||
        !liveresResponse.StatusCode ||
        liveresResponse.StatusCode !== 200 ||
        !liveresResponse.Data) {
        res.json({
          status: 'error',
          message: 'Error'
        })
      } else {
        res.json({
          status: 'success',
          cancelUrl: liveresResponse.Data.cancelUrl,
          amendUrl: liveresResponse.Data.amendUrl,
          bookingRef: liveresResponse.Data.reference
        })

        if (liveresResponse && liveresResponse.Data && liveresResponse.Data.cancelUrl &&
          liveresResponse.Data.amendUrl && liveresResponse.Data.reference) {
          return emarsysBookingUpdate(liveresOptions, liveresResponse)
        }
      }
    }).catch((error) => {
      console.error(error)

      res.json({
        status: 'error'
      })
    })
  } else {
    res.status(500).json({ status: 'error', message: `Missing ${validationErrors}` })
  }
}
