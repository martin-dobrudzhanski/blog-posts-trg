import config from '../../config/contentful'
const client = config.contentful.client

import { filterSys } from '../../utils/contentFilters'

export const getGeneric = (req, res) => {

  client.getEntries({
    'content_type': 'menuPage',
    'include': 4
  })
    .then(filterSys)
    .then(data => {
      data.restaurants.fields.list.forEach((rest, i) => delete rest.fields.menu)
      return data
    })
    .then(data => data ? res.json(data) : res.status(404).json({ message: 'Menu not found' }) )
    .catch(err => res.status(404).send() )
}

export const getDynamic = (req, res) => {
  var slug = req && req.params && req.params.id
    if (!slug) {
    return res.status(500).json({ message: 'Missing req params. requires [slug]' })
  }
  Promise.all([

    client.getEntries({
      'content_type': 'menuShowPage',
      'include': 2
    }).then(filterSys),

    client.getEntries({
      'content_type': 'restaurant',
      'fields.slug': slug,
      'include': 3
    })

  ])
  .then(dataArr => {
    const pageData = dataArr[0]
    delete pageData.restaurants
    pageData.restaurant = dataArr[1].items[0]
    return pageData
  })
  .then(data => data.restaurant ? res.json(data) : res.status(404).send())
  .catch(err => res.status(404).send() )

}

export const getMenuSection = (req, res) => {
  var sectionId = req && req.params && req.params.id
    if (!sectionId) {
    return res.status(500).json({ message: 'Missing req params. requires [sectionId]' })
  }
  Promise.all([

    client.getEntries({
      'content_type': 'menuShowPage',
      'include': 2
    }).then(filterSys),

    client.getEntries({
      'content_type': 'menuSection',
      'fields.name': sectionId,
      'fields.menuType': 'generic',
      'include': 2
    })

  ])
  .then(dataArr => {
    const pageData = dataArr[0]
    pageData.currentSection = dataArr[1].items[0]
    return pageData
  })
  .then(data => data.currentSection ? res.json(data) : res.status(404).send() )
  .catch(err => res.status(404).send() )

  }


// returns menu data by type
export const getByType = (req, res) => {
  var menuType = req && req.params && req.params.menuType
    if (!menuType) {
    return res.status(500).json({ message: 'Missing req params. requires [menuType]' })
  }

  client.getEntries({
    'content_type': 'menu',
    'fields.name': menuType,
    'include': 10
  })
    .then(filterSys)
    .then(data => {
      data ? res.json(data) : res.status(404).json({ message: 'Menu not found' })
    })
    .catch(err => res.status(404).json(err))
}


export const getBySection = (req, res) => {
  var menuType = req && req.params && req.params.menuType
  var menuSection = req && req.params && req.params.section

    if (!menuType || !menuSection) {
    return res.status(500).json({ message: 'Missing req params. requires [menuType][menuSection]' })
  }

  client.getEntries({
    'content_type': 'menu',
    'fields.name': menuType,
    'include': 10
  })
    .then(filterSys)
    .then(data => {
      data = data.sections.filter(item => item.fields.name === menuSection)
      return data
    })
    .then(data => data.length ? res.json(data[0]) : res.status(404).json({ message: 'Menu not found' }) )
    .catch(err => res.status(404).send())
}
