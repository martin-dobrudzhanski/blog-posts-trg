<template>
	<section class="login" data-fullscreen>
    <PageHeader :image="headerImage" />
    <div class="login__tile-grid-wrapper">
      <TileGrid class="login__tile-grid-container" mobile-only>
        <Tile
          v-for="(card, index) in content.mobileTiles"
          :key="index"
          :card="card"
        />
      </TileGrid>
      <TileGrid class="login__tile-grid-container" desktop-only>
        <Tile :card="content.desktopLanding" class="jumbotron" />
        <Tile
          v-if="content.desktopLanding2"
          :card="content.desktopLanding2"
          class="jumbotron"
        />
        <Tile
          v-for="(card, index) in content.desktopTiles"
          :key="index"
          :card="card"
        />
      </TileGrid>
    </div>
	</section>
</template>

<script>
import { getContent } from '@/libs/templateHelpers.js';
import meta from '@/mixins/meta';

import PageHeader from '@/components/ui/PageHeader.vue';
import Tile from '@/components/Tile.vue';
import TileGrid from '@/components/TileGrid.vue';

export default {
  name: 'LoginPage',
  layout: 'fullWidth',
  components: {
    PageHeader,
    Tile,
    TileGrid
  },
  mixins: [meta],
  async asyncData({ store, params, error }) {
    return await getContent(store, 'login-page', error);
  },
  data() {
    return {
      content: null
    };
  },
  computed: {
    headerImage() {
      return this.content && this.content.headerImage.fields;
    }
  },
  beforeMount() {
    if (this.$store.getters['auth/userAuthenticated']) {
      this.$router.push({ path: `/offers/profile` });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.login {
  background-image: url('~/assets/img/background/paper.jpg');

  &__hero {
    width: 100%;
    height: 20rem;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  &__tile-grid-container {
    padding: 0 0 3rem;
  }
}
</style>
