<template>
  <div>
    <HeroCarousel :slides="content.heroCarouselSlides" />
    <main>
      <div class="large-cart-wrapper">
        <LargeCard
          :title="selectedItem.title"
          :description="selectedItem.description"
          :author="selectedItem.author"
          :date="selectedItem.date"
          :thumbnail="selectedItem.thumbnail"
        />
      </div>
    </main>
  </div>
</template>
<script>
import { getContent } from '~/libs/templateHelpers.js';
import HeroCarousel from '~/components/HeroCarousel.vue';

import LargeCard from '~/components/LargeCard.vue';
export default {
  components: {
    HeroCarousel,
    LargeCard
  },
  data() {
    return {
      content: null,
      selectedItem: {}
    };
  },
  methods: {},
  computed: {},

  async asyncData({ store, params, error }) {
    return getContent(store, 'home', error);
  },

  mounted() {
    const myItem = JSON.parse(localStorage.getItem('currentItem'));
    this.selectedItem = myItem.find(
      el => el.id.toString() === this.$route.params.slug
    );
    console.log(
      'asasas',
      myItem.find(el => el.id.toString() === this.$route.params.slug)
    );
  }
};
</script>
<style lang="scss" scoped>
h1 {
  font-size: 2rem;
  text-align: center;
  padding: 10px 0;
}
.large-cart-wrapper {
  margin-top: 50px;
}
</style>
