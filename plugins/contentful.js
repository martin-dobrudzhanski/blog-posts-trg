import config from '~/server/config/contentful'

const prodEnv = process.env.VUE_APP_ENV === 'Production'
const locationType = prodEnv ? 'Production' : 'UAT'

export const getGlobalContent = async () => {
  let res = null
  try {
    res = await config.contentful.client.getEntries({
      content_type: 'payMyBillPage',
      limit: 1
    })
    const content = res && res.items && res.items.length && res.items[0].fields

    if (!content) {
      return Promise.reject()
    }
    return Promise.resolve(content)
  } catch (err) {
    // TODO: Log to sentry
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

export const getLocationDetails = async siteId => {
  let res = null
  try {
    res = await config.contentful.client.getEntries({
      content_type: 'location',
      'fields.siteId': siteId,
      limit: 1
    })
    const location = res && res.items && res.items.length && res.items[0].fields

    if (!location) {
      return Promise.reject()
    }
    return Promise.resolve(location)
  } catch (err) {
    // TODO: Log to sentry
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

export const getNearestEnabledLocations = async coords => {
  const lat = coords.lat
  const lng = coords.lng
  let res = []

  try {
    res = await config.contentful.client.getEntries({
      content_type: 'location',
      'fields.coordinates[near]': `${lat},${lng}`,
      'fields.enabled': true,
      'fields.type': locationType,
      limit: 3
    })
    const content = res && res.items

    if (!content) {
      return Promise.reject()
    }
    return Promise.resolve(content)
  } catch (err) {
    // TODO: Log to sentry
    // eslint-disable-next-line no-console
    console.log(err)
  }
}
