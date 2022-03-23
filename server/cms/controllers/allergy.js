import config from '../../config/contentful'
const client = config.contentful.client

import { filterSys } from '../../utils/contentFilters'

export const getGeneric = (req, res) => {
	client.getEntries({
		'content_type': 'alergyPage',
		'fields.name': 'generic',
		'include': 10
	})
	.then(filterSys)
	.then(data => {
		res.json(data);
	})
	.catch((err) => {
		console.log(err);
		res.status(404).json(err);
	})
}

export const getOne = (req, res) => {
	const slug = req && req.params && req.params.slug
	if (!slug) {
		return res.status(500).json({ message: 'missing params' })
	}
	client.getEntries({
		'content_type': 'alergyPage',
		'fields.name': slug,
		'include': 10
	})
	.then(filterSys)
	.then(data => {
		res.json(data)
	})
	.catch((err) => {
		console.log(err)
		res.status(404).json(err)
	})
}
