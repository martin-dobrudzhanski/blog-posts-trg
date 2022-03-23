import config from '../../config/contentful'
const client = config.contentful.client

import { filterSys } from '../../utils/contentFilters'
import sortByDistance from '../../utils/searchByDistance'

const CCListENVIdentifier = process.env.CC_ENV === 'production' ? 'restaurants' : 'restaurantsUat'
const OATListENVIdentifier = process.env.OAT_ENV === 'production' ? 'restaurants' : 'restaurantsUat'

export const get = (req, res) => {
  client.getEntries({
    'content_type': 'restaurants',
    'include': 2
  })
    .then(filterSys)
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(404).json(err)
    })
}

export const getClickAndCollect = (req, res) => {
  console.log(CCListENVIdentifier)
  client.getEntries({
    'content_type': 'restaurantsClickAndCollectIndexPage',
    'include': 2
  })
    .then(filterSys)
    .then(data => {
      data[CCListENVIdentifier].fields.list = data[CCListENVIdentifier].fields.list.filter(restaurantObject => {
        return restaurantObject.fields && restaurantObject.fields.clickAndCollect;
      });
      data.restaurants = data[CCListENVIdentifier]
      delete data.restaurantsUat
      return data
    })
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(404).json(err)
    })
}

export const getOrderAtTable = (req, res) => {
  console.log(OATListENVIdentifier)
  client.getEntries({
    'content_type': 'orderAtTablePage',
    'include': 2
  })
    .then(filterSys)
    .then(data => {
      data[OATListENVIdentifier].fields.list = data[OATListENVIdentifier].fields.list.filter(restaurantObject => {
        return restaurantObject.fields && restaurantObject.fields.orderAtTable;
      });
      data.restaurants = data[OATListENVIdentifier];
      delete data.restaurantsUat
      return data
    })
    .then(data => {
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
    'content_type': 'restaurantsShow',
    'include': 3
  })
    .then(filterSys)
    .then(data => {

      const restaurant = data.restaurants.fields.list.filter(rest => rest.fields.slug === slug)
      data.restaurant = restaurant.length ? restaurant[0] : null

      return data
    })
    .then(data => {
      if (data.restaurant) {
        data.nearby = sortByDistance(
          {
            latitude: data.restaurant.fields.latitude,
            longitude: data.restaurant.fields.longitude
          },
          data.restaurants.fields.list,
          {
            xName: 'latitude',
            yName: 'longitude',
            seperator: 'fields'
          }
        ).slice(1, 4)
        delete data.restaurants
      }
      return data
    })
    .then(data => {
      if (!data.restaurant) {
        res.status(404).json({ message: 'Record not found'})
      } else {
        res.json(data)
      }


    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
}
