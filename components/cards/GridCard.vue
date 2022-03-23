<template>
  <dual-link :href="link" :linkInfo="getLinkInfo">
    <div class="grid-card">
      <img class="grid-card__image" :src="getSrc" :alt="title">
      <h3 class="grid-card__title">{{ title }}</h3>
    </div>
  </dual-link>
</template>

<script>
import { getCompressedImage } from '@/libs/getCompressedImage';

const DualLink = () => import('@/components/ui/DualLink');

export default {
  components: {
    DualLink
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    newTab: {
      type: Boolean,
      default: false
    },
    external: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getLinkInfo () {
      const external = this.external;
      const newTab = this.newTab;
      return {
        external,
        newTab
      };
    },
    getSrc () {
      return getCompressedImage(this.imageUrl, { width: 500, height: 400 });
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

  .grid-card {
    display: flex;
    flex-direction: column;

    &__image, &__title {
      width: 100%;
    }

    &__image {
      max-height: 120px;

      @media (min-width: 350px) {
        max-height: 150px;
      }

      @media (min-width: 500px) {
        max-height: 200px;
      }
    }
    
    &__title {
      height: 40px;
      background-color: $rebrand-blue;
      font-family: $secondary-body-font;
      color: $white;
      font-size: 20px;
      line-height: 1.2;
      text-transform: uppercase;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>