<template>
  <header class="menu-header">
    <div class="menu-header__container">
      <div
        class="menu-header__gradient menu-header__gradient--sm"
        :style="{
          backgroundColor: `rgba(0,0,0,${gradient})`,
        }"
      />
      <div
        class="menu-header__gradient menu-header__gradient--lg"
        :style="{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,${gradient}), rgba(0,0,0,0))`,
        }"
      />
      <h1
        v-if="heading"
        class="line-height-reset menu-header__heading"
        v-text="heading"
      />
      <div v-if="enableSearchField" class="menu-header__location-form-wrapper">
        <LocationForm
          class="menu-header__location-form"
          mobile-colour="white"
          desktop-colour="white"
          :is-geolocating="isGeolocating"
          :default-value="defaultSearchValue"
          @geolocate="handleGeolocate"
          @search="handleSearch"
        />
      </div>
    </div>
    <div class="menu-header__cover">
      <template v-if="cover">
        <img
          v-if="cover.type.includes('image')"
          class="menu-header__cover-media"
          :src="cover.url"
          :alt="cover.title"
        />
        <video
          v-else-if="cover.type.includes('video')"
          class="menu-header__cover-media"
          :src="cover.url"
          autoplay
          loop
          playsinline
          muted
        >
          <source :src="cover.url" :type="cover.type" />
        </video>
      </template>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex';
import get from 'lodash.get';
import LocationForm from '@/components/LocationForm';

export default {
  name: 'MenuHeader',
  components: { LocationForm },
  props: {
    heading: {
      type: String,
      default: '',
    },
    backgroundMedia: {
      type: Object,
      default: null,
    },
    restaurants: {
      type: Array,
      default: () => [],
    },
    defaultSearchValue: {
      type: String,
      default: '',
    },
    gradient: {
      type: Number,
      default: 1,
    },
    enableSearchField: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isGeolocating: false,
  }),
  computed: {
    cover() {
      if (!this.backgroundMedia) return null;

      const type = get(this.backgroundMedia, 'fields.file.contentType');
      const url = get(this.backgroundMedia, 'fields.file.url');
      const title = get(this.backgroundMedia, 'fields.title');

      return {
        type,
        url,
        title,
      };
    },
  },
  methods: {
    ...mapActions('location', ['getLocalRestaurants']),
    ...mapActions('ui', ['flash']),
    handleGeolocate() {
      this.isGeolocating = true;
      this.getLocalRestaurants({ restaurantList: this.restaurants })
        .then(this.handleSuccess)
        .catch(this.handleError);
    },
    handleSearch(query) {
      this.getLocalRestaurants({ query, restaurantList: this.restaurants })
        .then(this.handleSuccess)
        .catch(this.handleError);
    },
    handleSuccess(closestVenues = []) {
      const currentSlug = this.$route.params.slug;
      const venue = get(closestVenues, '[0].fields');
      if (!venue) return this.handleError();
      this.isGeolocating = false;
      if (currentSlug === venue.slug) {
        this.flash({
          message: "You're already viewing the closest restaurant menu",
        });
      }
      this.$router.push(`/restaurants/${venue.slug}/menu`);
    },
    handleError(err = 'unknown') {
      // eslint-disable-next-line
      console.error(err);
      this.isGeolocating = false;
      if (err === 'browser') {
        this.flash({
          message:
            'We couldn’t locate you, please search for your local restaurant instead',
          autoHide: true,
        });
      } else {
        this.flash({
          message: "Oops! We couldn't find a restaurant matching your search",
          autoHide: true,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.menu-header {
  position: relative;
  padding-top: 100%;

  @include whenScreenIs(mdx) {
    padding-top: 0;
    min-height: 20rem;
  }

  &,
  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__container,
  &__cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__gradient {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    &--sm {
      @include whenScreenIs(lg) {
        display: none;
      }
    }

    &--lg {
      display: none;

      @include whenScreenIs(lg) {
        display: block;
      }
    }
  }

  &__container {
    z-index: 1;
    max-width: 1280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 1rem;

    @include whenScreenIs(mdx) {
      position: static;
    }
  }

  &__cover {
    background-color: black;
  }

  &__heading {
    width: 100%;
    margin-bottom: 1rem;
    font-size: 48px;
    font-family: $display-font;
    line-height: 1;
    color: $white;
    text-align: center;

    @include whenScreenIs(mdx) {
      margin-bottom: 1.5rem;
      font-size: 70px;
      text-align: left;
    }
  }

  &__location-form-wrapper {
    width: 100%;
  }

  &__location-form {
    width: 100%;
    @include whenScreenIs(mdx) {
      max-width: 500px;
    }
  }

  &__cover-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 1;
  }
}
</style>
