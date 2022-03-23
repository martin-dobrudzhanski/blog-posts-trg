<template>
  <div v-if="!isSmallDevice" class="location-card">
    <div class="location-card__text-container">
      <h3 class="location-card__title">{{ title }}</h3>
      <p class="location-card__text">{{ text }}</p>
      <LocationForm
        size="md"
        :is-geolocating="isGeolocating"
        @geolocate="handleGeolocate"
        @search="handleSearch"
      />
    </div>
    <div class="location-card__image-container">
      <img
        v-if="ilustration && ilustration.fields"
        class="location-card__left"
        :class="{ square: isSquare }"
        :src="ilustrationUrl"
        :alt="title"
      />
      <img
        v-if="image && image.fields"
        class="location-card__right"
        :class="{ round: !isSquare, square: isSquare }"
        :src="imageUrl"
        :alt="title"
      />
    </div>
  </div>
  <div v-else class="location-card">
    <div class="location-card__image-container" :class="{ mobile: isMobile }">
      <img
        v-if="ilustration && ilustration.fields"
        class="location-card__left"
        :class="{ square: isSquare }"
        :src="ilustrationUrl"
        :alt="title"
      />
      <img
        v-if="image && image.fields"
        class="location-card__right"
        :class="{ round: !isSquare, square: isSquare }"
        :src="imageUrl"
        :alt="title"
      />
    </div>
    <div class="location-card__text-container">
      <h3 class="location-card__title">{{ title }}</h3>
      <p class="location-card__text">{{ text }}</p>
      <LocationForm
        size="md"
        :is-geolocating="isGeolocating"
        @geolocate="handleGeolocate"
        @search="handleSearch"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { resizeImage } from '@/libs/templateHelpers.js';

import LocationForm from '~/components/LocationForm.vue';

export default {
  name: 'LocationCard',
  inheritAttrs: false,
  components: { LocationForm },
  props: {
    title: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    ilustration: {
      type: Object,
      default: () => {}
    },
    image: {
      type: Object,
      default: () => {}
    },
    isSquare: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    isGeolocating: false,
    isSmallDevice: false,
    isMobile: false
  }),
  computed: {
    imageUrl() {
      return resizeImage(this.image.fields.file.url);
    },
    ilustrationUrl() {
      return resizeImage(this.ilustration.fields.file.url, false);
    }
  },
  methods: {
    ...mapActions({
      getBrowserLocation: 'location/getBrowserLocation',
      flash: 'ui/flash'
    }),
    async handleGeolocate() {
      try {
        this.isGeolocating = true;
        const browserLocation = await this.getBrowserLocation();
        const { lat, long } = browserLocation;
        const query = `${lat},${long}`;

        window.location = `/restaurants/search?q=${query}`;
      } catch (error) {
        this.flash({
          message:
            'You need to allow location permissions in order to use this functionality'
        });
      } finally {
        this.isGeolocating = false;
      }
    },
    handleSearch(query = '') {
      window.location = `/restaurants/search?q=${query}`;
    },
    checkIfSmallDevice() {
      this.isSmallDevice = window.innerWidth <= 1199;
      this.isMobile = window.innerWidth <= 500;
    }
  },
  mounted() {
    this.checkIfSmallDevice();
    window.addEventListener('resize', this.checkIfSmallDevice);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfSmallDevice);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.location-card {
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

  &__image-container {
    display: flex;
    align-items: center;
    padding: 1rem;
    width: 50%;

    @include whenScreenIs(xs) {
      justify-content: center;
    }

    @media (max-width: 1025px) {
      width: 100%;
    }

    &.mobile {
      .location-card__left {
        right: 70%;
      }
    }
  }

  &__left {
    position: relative;
    left: 300px;
    width: 360px;
    height: auto;

    @include whenScreenIs(xs) {
      width: 200px;
      left: 240px;

      &.square {
        display: none;
      }
    }
  }

  &__right {
    position: relative;
    right: 320px;
    width: 420px;
    height: auto;
    border-radius: 5%;

    @include whenScreenIs(xs) {
      right: 25%;
      width: 244px;
    }

    @include whenScreenIs(mdx) {
      right: 300px;
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
    height: 100%;
    padding: 1rem;
    text-align: center;

    @include whenScreenIs(mdx) {
      width: calc(50% + 4rem);
      padding-left: 3rem;
    }

    @include whenScreenIs(lg) {
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: center;
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
    margin: 0 auto;
    max-width: fit-content;
    min-width: 8rem;
  }
}
</style>
