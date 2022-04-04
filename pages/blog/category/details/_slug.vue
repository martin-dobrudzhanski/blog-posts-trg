<template>
  <div>
    <h1>Item id: {{ $route.params.slug }}</h1>
    <HeroCarousel :slides="content.heroCarouselSlides" />
    <main>
      <div class="large-card-wrapper">
        <h1>Title</h1>
        <div>Image</div>
        <p>Author</p>
        <p>Date</p>
        <p>Description</p>
        <div>Social media icons</div>
      </div>
    </main>
  </div>
</template>
<script>
import { getContent } from '~/libs/templateHelpers.js';
import HeroCarousel from '~/components/HeroCarousel.vue';
export default {
  components: {
    HeroCarousel
  },
  data() {
    return {
      content: null
    };
  },

  async asyncData({ store, params, error }) {
    return getContent(store, 'home', error);
  }
};
</script>
<style lang="scss" scoped>
h1 {
  font-size: 2rem;
  text-align: center;
  padding: 10px 0;
}
</style>
