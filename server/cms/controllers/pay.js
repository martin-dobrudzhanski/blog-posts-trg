import config from '../../config/contentful'
import { filterSys } from '../../utils/contentFilters'

const client = config.contentful.client
const listENVIdentifier =
  process.env.PMB_ENV === 'production' ? 'restaurants' : 'restaurantsUat'

// export const get = (req, res) => {
//   client.getEntries({
//     'content_type': 'payPage',
//     'include': 10
//   })
//     .then(filterSys)
//     .then(data => {
//       res.json(data)
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(404).json(err)
//     })
// } 

const getContent = async () => {
  try {
    const res = await client.getEntries({
      content_type: 'payMyBillPage',
      include: 3
    })
    if (!res) {
      throw new Error()
    }
    const content = filterSys(res)
    content.restaurants = content[listENVIdentifier]
    delete content.restaurantsUat

    return Promise.resolve(content)
  } catch (err) {
    console.log(err)
    Promise.reject(err)
  }
}

export const getAll = async (req, res) => {
  try {
    const content = await getContent()
    if (!content) {
      return res.status(404).json({ message: 'Record not found' })
    }
    res.json(content)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export const getOne = async (req, res) => {
  const slug = req && req.params && req.params.slug
  if (!slug) {
    return res.status(400).json({ message: 'missing params' })
  }
  try {
    const content = await getContent()
    if (!content) {
      return res.status(404).json({ message: 'Record not found' })
    }
    const restaurant = content.restaurants.fields.list.filter(
      rest => rest.fields.slug === slug
    )
    content.restaurant = restaurant.length ? restaurant[0] : null

    return res.json(content)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}
