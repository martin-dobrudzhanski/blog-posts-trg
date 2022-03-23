import config from '../../config/contentful'

import { filterSys } from '../../utils/contentFilters'
const client = config.contentful.client

const listENVIdentifier = process.env.BOOKING_ENV === 'production' ? 'restaurants' : 'uatRestaurants'

export const get = (req, res) => {
  client.getEntries({
    'content_type': 'bookPage',
    'include': 3
  })
    .then(filterSys)
    .then(data => {
      data.restaurants = data[listENVIdentifier]
			delete data.uatRestaurants
      res.json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(404).json(err)
    })
}

export const getOne = (req, res) => {
  const slug = req && req.params && req.params.slug
  if (!slug) {
    return res.status(500).json({ message: 'missing params' })
  }
  client.getEntries({
    'content_type': 'bookPage',
    'include': 3
  })
    .then(filterSys)
    .then(data => {
      data.restaurants = data[listENVIdentifier]
      delete data.uatRestaurants
      const restaurant = data.restaurants.fields.list.filter(rest => rest.fields.slug === slug)
      data.restaurant = restaurant.length ? restaurant[0] : null
      delete data.restaurants
      return data
    })
    .then(data => {
      if (!data.restaurant) {
        res.status(404).json({ message: 'Record not found' })
      } else {
        res.json(data)
      }
    })
    .catch(err => res.status(500).json(err))
}

export const getSlugForBooking = (req, res) => {
  const siteRef = req && req.params && req.params.siteref
  if (!siteRef) {
    return res.status(500).json({ message: 'missing params' })
  }
  console.log(siteRef)

  client.getEntries({
    'content_type': 'restaurant',
    'fields.siteId': siteRef,
    'select': 'fields.slug',
    'include': 1,
    'limit': 1
  })
  .then(filterSys)
  .then(results => {
    res.json(results);
  }).catch(err => res.status(500).json(err))
}
