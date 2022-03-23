import rp from 'request-promise'
import config from '../../config/liveres'
import * as LiveresUtil from '../../utils/liveresUtil'
import emarsysBookingConfirmation from '../../utils/emarsysBookingConfirmation'

export default function (req, res) {
  const validationErrors = LiveresUtil.validateBookingConfirmation(req.body)

  if (validationErrors.length === 0) {
    const responseBody = LiveresUtil.createBookingConfirmationResponseBody(req.body)
    const liveresOptions = LiveresUtil.createLiveresBookingConfirmationOptions(config.liveres.defaultOptions, responseBody)
    const uri = `${config.liveres.LIVERES_URL}/reservation`

    rp({
      method: 'POST',
      uri,
      headers: config.liveres.headers,
      body: liveresOptions,
      json: true
    }).then(liveresResponse => {
      if (!liveresResponse ||
        !liveresResponse.StatusCode ||
        liveresResponse.StatusCode !== 201 ||
        !liveresResponse.Data) {
        res.json({
          status: 'error',
          message: 'Error'
        })
      } else {
        res.json({
          status: 'success',
          bookingRef: liveresResponse.Data.reference,
          cancelUrl: liveresResponse.Data.cancelUrl,
          amendUrl: liveresResponse.Data.amendUrl
        })

        if (liveresResponse && liveresResponse.Data && liveresResponse.Data.cancelUrl &&
          liveresResponse.Data.amendUrl && liveresResponse.Data.reference) {
          return emarsysBookingConfirmation(liveresOptions, liveresResponse)
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
