<template>
  <div class="menu-page" data-fullscreen>
    <MenuHeader
      :heading="content.pageHeading"
      :background-media="content.heroMedia"
      :restaurants="restaurantsList"
      :gradient="content.gradient"
      :enableSearchField="content.enableSearchField"
    />
    <TenKitesMenu :menu-url="menuUrl" />
  </div>
</template>

<script>
import get from 'lodash.get';
import { getContent } from '~/libs/templateHelpers';
import MenuHeader from '@/components/menu/MenuHeader';
import TenKitesMenu from '@/components/menu/TenKitesMenu';

export default {
  name: 'Menu',
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
      return get(this.content, 'defaultMenu.fields.menuUrl');
    },
    restaurantsList() {
      return get(this.content, 'restaurants.fields.list');
    }
  },
  async asyncData({ store, error }) {
    return getContent(store, 'menu-page', error);
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
