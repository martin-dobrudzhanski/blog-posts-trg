<template>
  <div class="auth-card">
    <div class="auth-card__image-container">
      <img
        class="auth-card__left"
        :class="{ 'square': isSquare }"
        :src="ilustrationUrl"
        :alt="title"
      />
      <img
        class="auth-card__right"
        :class="{ 'round': !isSquare, 'square': isSquare }"
        :src="imageUrl"
        :alt="title"
      />
    </div>
    <div class="auth-card__text-container">
      <h3 class="auth-card__title">{{ title }}</h3>
      <p class="auth-card__text">{{ text }}</p>
      <div class="auth-card__form-container">
        <AuthForm :showFacebookButton="showFacebookButton" />
      </div>
    </div>
  </div>
</template>

<script>
import { resizeImage } from '@/libs/templateHelpers.js';

import AuthForm from '@/components/account/AuthForm.vue';

export default {
  name: 'AuthCard',
  components: {
    AuthForm
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
    isSquare: {
      type: Boolean,
      default: false
    },
    showFacebookLogin: {
      type: Boolean,
      default: false
    },
    showFacebookLoginApp: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showFacebookButton () {
      return this.$store.state.ui.isApp
        ? this.showFacebookLoginApp
        : this.showFacebookLogin;
	},
    imageUrl() {
      return resizeImage(this.image.fields.file.url);
    },
    ilustrationUrl() {
      return resizeImage(this.ilustration.fields.file.url, false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.auth-card {
  width: 100%;
  max-width: $max-width-desktop;
  margin: auto;
  background-color: transparent;

  @include whenScreenIs(sm) {
    padding: 1rem 16px;
  }

  @include whenScreenIs(mdx) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  &__image-container {
    display: none;
    width: unset;
    margin-bottom: -25px;

    @include whenScreenIs(mdx) {
      display: flex;
    }
  }

  &__left {
    position: relative;
    top: 165px;
    width: 420px;
    height: 420px;

    @include whenScreenIs(xs) {
      top: 50%;
      width: 260px;
      height: 230px;
      left: -10%;

      &.square {
        display: none;
      }
    }
  }

  &__right {
    position: relative;
    left: -235px;
    width: 420px;
    height: auto;
    border-radius: 5%;

    @include whenScreenIs(xs) {
      left: -180px;
      width: 244px;
      height: 244px;
    }

    &.round {
      border-radius: 50%;
    }

    &.square {
      @include whenScreenIs(xs) {
        position: initial;
      }
    }
  }

  &__text-container {
    text-align: center;

    @include whenScreenIs(sm) {
      padding: 0 1rem;
    }

    @include whenScreenIs(mdx) {
      width: 50%;
      padding-top: 1rem;
      text-align: left;
    }
  }

  &__title {
    width: 100%;
    font-family: $card-display-font;
    font-size: 56px;
    color: $greyish-brown;
    line-height: 0.89;

    @include whenScreenIs(xs) {
      font-size: 40px;
    }
  }

  &__text {
    width: 100%;
    font-family: $font;
    font-size: 18px;
    color: $greyish-brown;
    line-height: 1.22;
    padding-top: 1rem;
    padding-bottom: 1rem;

    @include whenScreenIs(sm) {
      padding-bottom: 0;
    }

    @include whenScreenIs(mdx) {
      padding: 1rem 0;
    }
  }

  &__form-container{
    max-width: 365px;
    margin: 0 auto;

    @include whenScreenIs(mdx) {
      max-width: fit-content;
      min-width: 8rem;
    }
  }
}
</style>
