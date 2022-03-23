<template>
  <section class="homepage">
    <div
      v-if="content.heroCarouselSlides"
      class="homepage__hero-carousel-wrapper"
    >
      <HeroCarousel :slides="content.heroCarouselSlides" />
    </div>

    <div v-if="content.introDescription" class="homepage__intro">
      <h2
        class="line-height-reset homepage__intro-description"
        v-text="content.introDescription"
      />
    </div>

    <div class="homepage__tile-grid-wrapper">
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
import { getContent } from '~/libs/templateHelpers.js';
import meta from '~/mixins/meta';

import Tile from '~/components/Tile.vue';
import TileGrid from '~/components/TileGrid.vue';
import HeroCarousel from '~/components/HeroCarousel.vue';

export default {
  components: {
    Tile,
    TileGrid,
    HeroCarousel,
  },
  mixins: [meta],
  layout: 'fullWidth',
  data() {
    return {
      content: null,
    };
  },
  async asyncData({ store, params, error }) {
    return getContent(store, 'home', error);
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.homepage {
  &__intro {
    width: 100%;
    max-width: $max-width-desktop;
    margin: 0 auto;
    padding: 2rem 1rem 1rem;

    @include whenScreenIs(mdx) {
      padding: 2rem 10% 1rem;
    }
  }

  &__intro-description {
    font-family: $font;
    font-size: 1.25rem;
    text-align: center;
    color: $true-black;
  }

  &__tile-grid-wrapper {
    padding: 1rem 0 3rem;
    background-image: url('~/assets/img/background/paper.jpg');

    @include whenScreenIs(mdx) {
      padding: 1rem 0 2.75rem;
    }
  }

  &__instagram-feed-wrapper {
    max-width: $max-width-mobile;
    padding: 1rem 0.75rem 2.25rem;

    @include whenScreenIs(mdx) {
      padding: 1rem 0 2.25rem;
      max-width: $max-width-mdesktop;
    }

    @include whenScreenIs(lg) {
      max-width: $max-width-desktop;
    }
  }
}
</style>
