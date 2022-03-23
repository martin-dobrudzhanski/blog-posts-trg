import axios from '~/plugins/axios';

export async function getContent(store, contentType, error) {
  return axios
    .get(`/api/content/${contentType}`)
    .then(content => {
      if (store !== false) {
        store.commit('ui/setNav', content.data.nav.fields);
        store.commit(
          'ui/setMetaDescription',
          content.data.nav.fields.metaDescription
        );
        if (content.data.optInMessage) {
          store.commit(
            'clickAndCollect/setOptInMessage',
            content.data.optInMessage
          );
        }
      }
      return {
        content: content.data
      };
    })
    .catch(() => {
      error({
        statusCode: 404
      });
    });
}

// Contentful Image API (https://www.contentful.com/developers/docs/references/images-api/)
export function resizeImage(path, main = true) {
  const method = main ? 'fill' : 'pad';

  return `${path}?fit=${method}&w=840&h=840`;
}

export const iconTagsIDs =
  process.env &&
  (process.env.NODE_ENV === 'production' ||
    process.env.APP_ENV === 'production')
    ? {
        lighter: 1489,
        new: 1482,
        newRecipe: 572,
        vegan: 260,
        vegetarian: 259
      }
    : {
        lighter: 570,
        new: 571,
        newRecipe: 572,
        vegan: 573,
        vegetarian: 574
      };

export function elScrolled($el, scrollY) {
  const currentScrollY = scrollY || window.scrollY;

  if (!$el) return;

  const marginTop = window.screen.width && window.screen.width > 1024 ? 72 : 64;
  const scrollHeight = currentScrollY + 3 * marginTop;
  const scrollThreshold = $el.offsetTop + $el.offsetHeight;

  return scrollHeight > scrollThreshold;
}
