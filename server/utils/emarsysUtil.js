import crypto from 'crypto'
import iso8601 from 'iso8601'
import axios from 'axios'

async function base64Sha1 (str) {
  const hexDigest = await crypto.createHash('sha1')
    .update(str)
    .digest('hex')

  return Buffer.from(hexDigest).toString('base64')
}

async function getWsseHeader (user, secret) {
  const nonce = await crypto.randomBytes(16).toString('hex')
  const timestamp = iso8601.fromDate(new Date())
  const digest = await base64Sha1(nonce + timestamp + secret)
  const header = `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`

  return header
}

function generateEmarsysAuthHeader () {
  const user = process.env.EMARSYS_API_KEY
  const secret = process.env.EMARSYS_API_SECRET

  return getWsseHeader(user, secret)
};

function validateEmarsysContact (res) {
  let validEmarsysContact = false

  if (res && res.status && res.status === 200 && res.text) {
    const resText = JSON.parse(res.text)

    if (resText && resText.data && resText.data.errors && Array.isArray(resText.data.errors) && resText.data.errors.length === 0) {
      validEmarsysContact = true
    }
  }

  return validEmarsysContact
};

function emarsysGetContact (email) {
  const emarsysUser = {
    keyId: '3',
    keyValues: [
      email
    ],
    fields: [
      '3'
    ]
  }

  return generateEmarsysAuthHeader().then(authHeader => {
    return axios({
      method: 'post',
      url: process.env.EMARSYS_GET_CONTACT_URL,
      headers: { 'content-type': 'application/json', 'X-WSSE': authHeader },
      data: emarsysUser
    }).then(response => {
      return response
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
}

export function emarsysCreateContact (email, phone = '', optOut = true) {
  return emarsysGetContact(email).then(getContectRes => {
    if (validateEmarsysContact(getContectRes)) {
      return 409
    } else {
      const emarsysUser = {
        key_id: '3',
        contacts: [
          {
            '3': email,
            '15': phone,
            '31': (optOut === 'false' || optOut === false) ? '1' : '2',
            'source_id': process.env.EMARSYS_SOURCE_ID
          }
        ]
      }

      return generateEmarsysAuthHeader().then(authHeader => {
        return axios({
          method: 'post',
          url: process.env.EMARSYS_CREATE_CONTACT_URL,
          headers: {'content-type': 'application/json', 'X-WSSE': authHeader},
          data: emarsysUser
        }).then(() => {
          return authHeader
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
    }
  }).catch(err => {
    console.error(err)
    // gracefully fail, the promise chain must go on...
    return 500
  })
}

export function createSpecialRequest (specialRequest) {
  let specialRequestValue = ''

  if (specialRequest && specialRequest !== '') {
    specialRequestValue = `"The following request(s) were noted : ${specialRequest}"`
  }

  return specialRequestValue
}

export function createBookingDate (bookingDate) {
  if (bookingDate !== 'Today' && bookingDate !== 'Tomorrow') {
    bookingDate = `on ${bookingDate}`
  }

  return bookingDate
}
