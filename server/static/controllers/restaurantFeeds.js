import config from '../../config/contentful';
import { filterSys } from '../../utils/contentFilters';
const client = config.contentful.client;

export const restaurantFeeds = (req, res) => {
  client
    .getEntries({
      content_type: 'restaurants',
      include: 2
    })
    .then(filterSys)
    .then(data => {
      const array = data.restaurants.fields.list.map(item => {
        processRest(item, true);
        return item.fields;
      });

      const processedArray = array.map(item => {
        return processKeys(item);
      });

      res.json(processedArray);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json(err);
    });
};

export const restaurantFeedsFull = (req, res) => {
  client
    .getEntries({
      content_type: 'restaurants',
      include: 6
    })
    .then(filterSys)
    .then(data => {
      const array = data.restaurants.fields.list.map(item => {
        processRest(item, false);
        return item.fields;
      });

      const processedArray = array.map(item => {
        return processKeys(item);
      });

      res.json(processedArray);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json(err);
    });
};

const processRest = (rest, filterTax) => {
  rest.fields.url &&
  rest.fields.slug &&
  rest.fields.url.includes('/restaurants/')
    ? (rest.fields.url = `http://www.chiquito.co.uk/restaurant/${rest.fields.slug}`)
    : false;

  if (filterTax) {
    rest.fields.taxonomy = '';
  } else {
    if (rest.fields.taxonomy) {
      const taxonomy = rest.fields.taxonomy.map(item => {
        delete item.sys;
        item.fields.vocabulary = 'Facilities';
        item = item.fields;
        return item;
      });
      rest.fields.taxonomy = taxonomy;
    }
  }

  delete rest.sys;
  delete rest.fields.slug;
  delete rest.fields.menu;
  delete rest.fields.liveResId;

  return rest;
};

const processKeys = obj => {
  const keyDictionary = {
    name: 'name',
    additional: 'additional',
    bookingId: 'booking_id',
    city: 'city',
    country: 'country',
    latitude: 'latitude',
    longitude: 'longitude',
    openFriday: 'open_friday',
    openMonday: 'open_monday',
    openSaturday: 'open_saturday',
    openSunday: 'open_sunday',
    openThursday: 'open_thursday',
    openTuesday: 'open_tuesday',
    openWednesday: 'open_wednesday',
    postalCode: 'postal_code',
    region: 'region',
    siteId: 'site_id',
    street: 'street',
    telephone: 'telephone',
    title: 'title',
    url: 'url',
    taxonomy: 'taxonomy',
    body: 'body',
    deliveryLink: 'delivery_link'
  };

  const keyValues = {};

  Object.keys(obj).forEach(key => {
    const newKey = keyDictionary[key] || key;
    keyValues[newKey] = obj[key];
  });

  Object.values(keyDictionary).forEach(value => {
    if (!keyValues[value]) keyValues[value] = '';
  });

  return keyValues;
};
