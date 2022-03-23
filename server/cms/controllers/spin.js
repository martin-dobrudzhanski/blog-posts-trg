import { filterSys } from '../../utils/contentFilters'
import config from '../../config/contentful'

const client = config.contentful.client

export const get = (req, res) => {
  client
    .getEntries({
      content_type: 'spinToWin',
      include: 9
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
