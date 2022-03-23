<template>
  <div class="promo-card">
    <img
      class="promo-card__image"
      :src="getSrc"
      :alt="title"
    >
    <div class="promo-card__body">
      <h3 class="promo-card__title">{{ title }}</h3>
      <hr class="promo-card__rule">
      <p v-if="text" class="promo-card__text">{{ text }}</p>
    </div>
    <dual-link
      v-if="renderButton"
      class="promo-card__button btn"
      :linkInfo="getLinkInfo"
      :href="buttonLink"
    >
      {{ buttonText }}
    </dual-link>
  </div>
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
    text: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    },
    buttonLink: {
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
    renderButton () {
      return this.buttonText && this.buttonLink;
    },
    getSrc () {
      return getCompressedImage(this.imageUrl, { width: 600, height: 500 });
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '~assets/css/variables.scss';
  @import '~assets/css/helpers.scss';
  
  .promo-card {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: $very-light-pink;
    margin-bottom: 16px;

    @media (min-width: $promo-card-breakpoint) {
      width: 49%;
      margin-bottom: 0;
    }

    &__image {
      height: 224px;
      width: 100%;

      @include whenScreenIs(sm) {
        height: 297px;
      }
    }

    &__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      align-items: center;
      min-height: 160px;
    }

    &__title {
      text-align: center;
      font-family: $display-font;
      font-size: 28px;
      color: $black;
      line-height: 0.86;
      padding: 16px 0;
      width: 100%;
    }

    &__rule {
      border-top: 5px dotted $rebrand-blue;
      width: 100px;
    }

    &__text {
      font-family: $secondary-body-font;
      font-size: 18px;
      line-height: 1.22;
      text-align: center;
      padding: 16px 0;
      width: 100%;
    }

    &__button {
      width: 100%;
    }
  }

</style>