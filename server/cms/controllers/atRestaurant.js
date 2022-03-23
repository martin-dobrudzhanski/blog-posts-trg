import config from '../../config/contentful'

import { filterSys } from '../../utils/contentFilters'
const client = config.contentful.client

export const get = (req, res) => {
  client
    .getEntries({
      content_type: 'atRestaurantPage',
      include: 2
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