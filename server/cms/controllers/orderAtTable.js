import config from '../../config/contentful'
const client = config.contentful.client

import { filterSys } from '../../utils/contentFilters'

const listENVIdentifier = process.env.OAT_ENV === 'production' ? 'restaurants' : 'restaurantsUat'

export const getOne = (req, res) => {
	const slug = req && req.params && req.params.slug
	if (!slug) {
		return res.status(500).json({ message: 'missing params' })
	}
	client.getEntries({
		'content_type': 'orderAtTablePage',
		'include': 3
	})
	.then(filterSys)
	.then(data => {
		data.restaurants = data[listENVIdentifier]
		delete data.restaurantsUat
		const restaurant = data.restaurants.fields.list.filter(rest => rest.fields.slug === slug)
		data.restaurant = restaurant.length ? restaurant[0] : null
		return data
	})
	.then(data => {
		if (!data.restaurant) {
			res.status(404).json({ message: 'Record not found'})
		} else {
			res.json(data)
		}
	})
	.catch(err => res.status(500).json(err) )
}

export const getOneBySiteId = (req, res) => {
	const siteId = req && req.query && req.query.siteId
	if (!siteId) {
		return res.status(500).json({ message: 'missing params' })
	}
	client.getEntries({
		'content_type': 'orderAtTablePage',
		'include': 3
	})
	.then(filterSys)
	.then(data => {
		data.restaurants = data[listENVIdentifier]
		delete data.restaurantsUat
		return data.restaurants.fields.list.find(rest => rest.fields.siteId === siteId)
	})
	.then(restaurant => {
		if (!restaurant) {
			res.status(404).json({ message: 'Record not found'})
		} else {
			res.json(restaurant.fields)
		}
	})
	.catch(err => res.status(500).json(err) )
}
