const contentfulClient = require('../server/config/contentful').contentful
  .client;
const menuSubCats = [
  'main',
  'lunch',
  'breakfast',
  'drinks',
  'brunch',
  'desserts',
  'fixed-price',
  'hot-drink-and-dessert',
  'kids',
  'vegan'
];

const generateSiteSlugs = () => {
  return contentfulClient
    .getEntries({
      content_type: 'restaurant',
      limit: 300
    })
    .then(data => {
      const routes = [];
      data.items.map(restaurant => {
        const slug = restaurant.fields.slug;
        const isSevenRooms =
          restaurant &&
          restaurant.fields &&
          restaurant.fields.bookingConfiguration &&
          restaurant.fields.bookingConfiguration.fields &&
          restaurant.fields.bookingConfiguration.fields.isSevenRooms;
        routes.push(
          isSevenRooms
            ? `/${restaurant.fields.bookingConfiguration.fields.venuName}`
            : `/restaurants/${slug}/book`
        );
        routes.push(`/restaurants/${slug}/takeaway`);
        menuSubCats.map(subCat =>
          routes.push(`/restaurants/${slug}/menu/${subCat}`)
        );
      });

      menuSubCats.map(subCat => routes.push(`/menu/${subCat}`));
      return routes;
    })
    .catch(() => {
      return [];
    });
};

const generateGenericSlugs = () => {
  return contentfulClient
    .getEntries({
      content_type: 'genericPage',
      limit: 300
    })
    .then(data => {
      return data.items.map(page => `/${page.fields.slug}`);
    })
    .catch(() => {
      return [];
    });
};
module.exports = {
  path: '/sitemap.xml',
  hostname: 'https://www.chiquito.co.uk',
  cacheTime: 1000 * 60 * 15,
  exclude: [
    '/wifi',
    '/forgotten-password',
    '/takeaway/error',
    '/book/error',
    '/order/error',
    '/unsubscribe',
    '/book/v1',
    '/paymybill/result',
    '/paymybill/success',
    '/paymybill/failure',
    '/offers/spin-to-win/unavailable'
  ],
  routes(callback) {
    Promise.all([generateGenericSlugs(), generateSiteSlugs()])
      .then(data => [].concat.apply([], data))
      .then(data => callback(null, data))
      .catch(callback);
  }
};
