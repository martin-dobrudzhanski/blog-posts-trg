import dayjs from 'dayjs'
import config from './app.js'

const getAuth = ({ username, password }) => {
  let base64 = (Buffer.from(`${username}:${password}`)).toString('base64')
  return `Basic ${base64}`
}

const getConsentDate = () => {
  return dayjs().format('YYYY/MM/DD HH:mm:ss')
}

let liveresConfig = {
  liveres: {
    LIVERES_URL: process.env.LIVERES_URL || 'https://reservationsapi-stg02.liveres.co.uk',
    LIVERES_USERNAME: process.env.LIVERES_USERNAME || 'a1af8a75-a48d-4dd4-afff-408031645d95',
    LIVERES_PASSWORD: process.env.LIVERES_PASSWORD || 'mU1AwKjQn+KG',
    defaultOptions: {
      Guest: {
        Title: '.',
        LastName: '.'
      },
      Client: {
        UniqueId: 'trg-bookings',
        UserAgent: 'trg-bookings/chiquito',
        Referrer: config.NODE_ENV,
        IpAddress: 'trg-bookings',
        Url: 'trg-bookings'
      },
      consent: {
        consentDate: getConsentDate(),
        channel: 'trg-bookings/chiquito',
        sms: true,
        email: true,
        phone: true,
        smsText: 'We would like to contact you with discounts and news. If you do not wish to receive these, please tick here.',
        emailText: 'We would like to contact you with discounts and news. If you do not wish to receive these, please tick here.',
        phoneText: 'We would like to contact you with discounts and news. If you do not wish to receive these, please tick here.',
        profiling: false,
        pushNotification: false,
        postal: false,
        privacyStatementText: null,
        privacyStatementURL: 'https://bookings.liveres.co.uk/(S(sv04zffcnrmaaudgbjeoshn1))/tc.html',
        consentStatementText: null
      }
    }
  }
}

liveresConfig.liveres.headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': getAuth({
    username: liveresConfig.liveres.LIVERES_USERNAME,
    password: liveresConfig.liveres.LIVERES_PASSWORD
  })
}

export default liveresConfig
