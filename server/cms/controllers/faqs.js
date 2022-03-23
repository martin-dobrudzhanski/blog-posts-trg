import config from '../../config/contentful'
const client = config.contentful.client

import { filterSys } from '../../utils/contentFilters'

export const get = (req, res) => {
  client.getEntries({
    'content_type': 'faqPage',
    'include': 10
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