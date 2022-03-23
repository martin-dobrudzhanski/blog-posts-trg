<template>
  <section class="generic-page" data-fullscreen>
    <div
      v-if="content.heroCarouselSlides"
      class="generic-page__hero-carousel-wrapper"
    >
      <HeroCarousel :slides="content.heroCarouselSlides" />
    </div>
    <div class="generic-page__tile-grid-wrapper">
      <TileGrid desktop-only>
        <Tile
          v-for="(card, index) in cards"
          :key="index"
          :card="card"
          :wide="isWideCard(card)"
        />
      </TileGrid>

      <TileGrid mobile-only>
        <Tile
          v-for="(card, index) in mobileCards"
          :key="index"
          :card="card"
          :wide="isWideCard(card)"
        />
      </TileGrid>
    </div>
  </section>
</template>

<script>
import get from 'lodash.get';
import { getContent } from '~/libs/templateHelpers.js';
import Meta from '~/mixins/meta';
import HeroCarousel from '~/components/HeroCarousel.vue';
import TileGrid from '~/components/TileGrid.vue';
import Tile from '~/components/Tile.vue';

export default {
  name: 'GenericPage',
  layout: 'fullWidth',
  mixins: [Meta],
  components: {
    HeroCarousel,
    TileGrid,
    Tile
  },
  data() {
    return {
      content: null
    };
  },
  scrollToTop: true,
  async asyncData({ store, params, error }) {
    return getContent(store, `pages/${params.slug}`, error);
  },
  computed: {
    cards() {
      return get(this.content, 'cards', []);
    },
    mobileCards() {
      return get(this.content, 'mobileCards', this.cards);
    }
  },
  methods: {
    isWideCard(card) {
      return ['graphicCard', 'contentCard', 'offerCard'].some(
        cardId => card.sys.contentType.sys.id === cardId
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.generic-page {
  &__tile-grid-wrapper {
    padding: 1rem 0 3rem;
    background-image: url('~/assets/img/background/paper.jpg');

    @include whenScreenIs(mdx) {
      padding: 1rem 0 2.75rem;
    }
  }
}
</style>
