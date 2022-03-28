<template>
  <section class="offers" data-fullscreen>
    <div v-if="content.heroCarouselSlides" class="offers__hero-wrapper">
      <HeroCarousel :slides="content.heroCarouselSlides" />
    </div>
    <div class="offers__tile-grid-wrapper">
      <TileGrid mobile-only>
        <Tile
          v-for="(card, index) in content.mobileTiles"
          :key="index"
          :card="card"
        />
      </TileGrid>
      <TileGrid desktop-only>
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

import HeroCarousel from '@/components/HeroCarousel.vue';
import Tile from '@/components/Tile.vue';
import TileGrid from '@/components/TileGrid.vue';

export default {
  name: 'OffersIndexPage',
  layout: 'fullWidth',
  components: {
    HeroCarousel,
    Tile,
    TileGrid
  },
  mixins: [meta],
  async asyncData({ store, params, error }) {
    return await getContent(store, 'offers-page', error);
  },
  data() {
    return {
      content: null
    };
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

.offers {
  &__tile-grid-wrapper {
    padding: 0 0 3rem;
    background-image: url('~/assets/img/background/paper.jpg');

    @include whenScreenIs(mdx) {
      padding: 0 0 2.75rem;
    }
  }

  /deep/ .tile:not(.auth-cards):not(.input-cards) {
    @include whenScreenIs(mdx) {
      padding-bottom: 8rem;
    }
  }
}
</style>
