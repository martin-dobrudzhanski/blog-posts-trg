<template>
  <div
    v-if="!isInstagramFeed"
    :class="['generic-card', { reverted: !leftSideImage }]"
  >
    <div
      :class="['generic-card__image-container', { reverted: !leftSideImage }]"
    >
      <img
        class="generic-card__left"
        :class="{ square: isSquare, reverted: !leftSideImage }"
        :src="ilustrationUrl"
        :alt="title"
      />
      <img
        class="generic-card__right"
        :class="{
          round: !isSquare,
          square: isSquare,
          reverted: !leftSideImage
        }"
        :src="imageUrl"
        :alt="title"
      />
    </div>
    <div
      :class="['generic-card__text-container', { reverted: !leftSideImage }]"
    >
      <h3 class="generic-card__title">{{ title }}</h3>
      <p class="generic-card__text">{{ text }}</p>
      <div v-if="buttonText && buttonLink" class="generic-card__cta-container">
        <BaseButton
          :to="buttonLink"
          :new-tab="newTab"
          class="generic-card__cta"
        >
          {{ buttonText }}
        </BaseButton>
      </div>
    </div>
  </div>
  <div v-else class="elfsight-app-2143b75f-4ab6-4300-aa5b-c1af70ccaded"></div>
</template>

<script>
import { resizeImage } from '@/libs/templateHelpers.js';

import BaseButton from '@/components/buttons/BaseButton';

export default {
  components: {
    BaseButton
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    ilustration: {
      type: Object,
      default: () => {}
    },
    image: {
      type: Object,
      default: () => {}
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
    },
    isSquare: {
      type: Boolean,
      default: true
    },
    leftSideImage: {
      type: Boolean,
      default: true
    },
    isInstagramFeed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getLinkInfo() {
      const external = this.external;
      const newTab = this.newTab;
      return {
        external,
        newTab
      };
    },
    renderButton() {
      return this.buttonText && this.buttonLink;
    },
    imageUrl() {
      return resizeImage(this.image.fields.file.url);
    },
    ilustrationUrl() {
      return resizeImage(this.ilustration.fields.file.url, false);
    }
  },
  mounted() {
    const instagramFeedScript = document.getElementById('instagram-feed-card');
    if (this.isInstagramFeed && !instagramFeedScript) {
      const instagramFeed = document.createElement('script');
      instagramFeed.setAttribute(
        'src',
        'https://apps.elfsight.com/p/platform.js'
      );
      instagramFeed.setAttribute('id', 'instagram-feed-card');
      document.head.appendChild(instagramFeed);
    }
  },
  beforeDestroy() {
    const instagramFeedScript = document.getElementById('instagram-feed-card');
    if (instagramFeedScript) {
      instagramFeedScript.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.generic-card {
  padding: 16px;
  display: flex;
  height: 100%;
  width: 100%;
  max-width: $max-width-desktop;
  margin: auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  margin-bottom: 16px;

  @include whenScreenIs(lg) {
    flex-direction: row;
  }

  @media (min-width: $generic-card-breakpoint) {
    margin-bottom: 0;
  }

  &.reverted {
    @include whenScreenIs(mdx) {
      flex-direction: row-reverse;
    }
  }

  &__image-container {
    display: flex;
    padding: 1rem;
    width: 50%;

    @include whenScreenIs(xs) {
      width: unset;
      justify-content: center;
    }

    @media (max-width: 1025px) {
      width: 100%;
    }

    &.reverted {
      align-items: center;

      @include whenScreenIs(mdx) {
        flex-direction: row-reverse;
        justify-content: flex-end;
      }
    }
  }

  &__left {
    position: relative;
    width: 410px;
    height: auto;

    @include whenScreenIs(xs) {
      left: 0px;
      width: 260px;

      &.square {
        display: none;
      }
    }

    &.reverted {
      @include whenScreenIs(mdx) {
        left: -140px;
      }
    }
  }

  &__right {
    position: relative;
    left: -210px;
    width: 420px;
    height: auto;
    border-radius: 5%;
    align-self: center; // flexbox default align for self is stretch, so we need to override it to keep the intrinsic aspect ratio

    @include whenScreenIs(xs) {
      left: -105px;
      width: 244px;
    }

    @include whenScreenIs(mdx) {
    }

    &.round {
      border-radius: 50%;
    }

    &.square {
      @include whenScreenIs(xs) {
        position: initial;
      }
    }

    &.reverted {
      @include whenScreenIs(mdx) {
        left: 5rem;
      }
    }
  }

  &__text-container {
    height: 100%;
    width: 100%;
    text-align: center;
    padding: 1rem;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @include whenScreenIs(lg) {
      padding-top: 1rem;
      text-align: left;
      width: 50%;
      &:not(.reverted) {
        padding-left: 6rem;
      }
    }
  }

  &__title {
    font-family: $card-display-font;
    font-size: 56px;
    color: $greyish-brown;
    line-height: 0.89;
    padding: 1rem 0;
    width: 100%;

    @include whenScreenIs(xs) {
      font-size: 40px;
    }
  }

  &__text {
    font-family: $font;
    color: $greyish-brown;
    font-size: 18px;
    line-height: 1.22;
    padding: 1rem 0;
    width: 100%;
  }

  &__cta-container {
    max-width: fit-content;
    min-width: 8rem;
    @media (max-width: 1200px) {
      margin: 0 auto;
    }
  }
}
</style>
