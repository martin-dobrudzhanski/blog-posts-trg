import { filterSys } from '../../utils/contentFilters'
import config from '../../config/contentful'

const client = config.contentful.client

export const getOne = (req, res) => {
  const slug = req && req.params && req.params.slug
  if (!slug) {
    return res.status(500).json({ message: 'missing params' })
  }
  client.getEntries({
    'content_type': 'genericPage',
    'include': 4,
    'fields.slug': slug
  })
    .then(filterSys)
    .then(data => {
			if (!data) {
				res.status(404).json({ message: 'Record not found'})
			}
      res.json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
}
