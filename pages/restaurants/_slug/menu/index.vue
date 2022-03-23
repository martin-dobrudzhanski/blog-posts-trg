<template>
  <section class="menu-page" data-fullscreen>
    <MenuHeader
      :heading="content.pageHeading"
      :background-media="content.heroMedia"
      :restaurants="restaurantsList"
      :default-search-value="restaurantName"
      :enableSearchField="content.enableSearchField"
    />
    <TenKitesMenu :menu-url="menuUrl" />
  </section>
</template>

<script>
import get from 'lodash.get';
import { getContent } from '@/libs/templateHelpers.js';
import MenuHeader from '@/components/menu/MenuHeader';
import TenKitesMenu from '@/components/menu/TenKitesMenu';

export default {
  name: 'RestaurantMenu',
  layout: 'menu',
  components: { MenuHeader, TenKitesMenu },
  head() {
    const title = get(this.content, 'restaurant.fields.title', 'Menu');
    const description = get(this.$store, 'state.ui.metaDescription', '');

    return {
      title,
      bodyAttrs: {
        'data-pagecolor': 'white'
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        }
      ]
    };
  },
  data() {
    return {
      content: null
    };
  },
  computed: {
    menuUrl() {
      // The old menu type can still be linked in the CMS so check if a TKMenu has been linked
      const isTenKitesMenu =
        get(this.content, 'menu.sys.contentType.sys.id') === 'tenKitesMenu';
      const menuUrl = isTenKitesMenu
        ? get(this.content, 'menu.fields.menuUrl')
        : null;

      return menuUrl;
    },
    restaurantName() {
      return get(this.content, 'restaurant.fields.name');
    },
    restaurantsList() {
      return get(this.content, 'restaurants.fields.list');
    }
  },
  async asyncData({ store, params, error }) {
    const data = await getContent(
      store,
      `restaurants/${params.slug}/menu`,
      error
    );
    const restaurant = get(data, 'content.restaurant');

    if (!restaurant)
      return error({ statusCode: 404, message: 'Page not found' });

    return data;
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
