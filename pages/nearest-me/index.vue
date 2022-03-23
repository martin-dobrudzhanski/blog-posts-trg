<template>
  <section class="nearest-me" v-fullScreen>
    <clickable-banner
      v-bind="$store.getters['ui/getTakeawayBanner']"
      class="banner-desktop"
    />
    <transition name="fade" appear mode="out-in">
      <div class="content" key="content" v-if="closestVenues.length">
        <SingleInputButtonForm
          @submit="changeLocation"
          type="query"
          name="location"
          button-text="Search"
          placeholder="Enter postcode, city or town"
        />
        <RestaurantTile
          :locationInfo="closestVenues[0]"
          :openAccordion="true"
        ></RestaurantTile>

        <RestaurantTile
          v-if="secondaryVenues.length"
          v-for="venue in secondaryVenues"
          :key="venue.fields.slug"
          :locationInfo="venue"
        ></RestaurantTile>
      </div>

      <div v-else key="loader" class="loader"></div>
    </transition>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import RestaurantTile from '~/components/iOrder-core/uiV3/RestaurantTile.vue';
import sortByDistance from '~/libs/sortByDistance.js';
import { getContent } from '~/libs/templateHelpers.js';

import SingleInputButtonForm from '~/components/ui/SingleInputButtonForm';
import ClickableBanner from '~/components/click-collect/ClickableBanner.vue';

export default {
  components: {
    RestaurantTile,
    SingleInputButtonForm,
    ClickableBanner
  },

  head() {
    const getMeta = () => {
      if (!this.$store.state.ui.metaDescription) {
        return '';
      }
      return this.$store.state.ui.metaDescription;
    };
    return {
      title: 'Nearest restaurants',
      bodyAttrs: {
        'data-pagecolor': 'white'
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: getMeta()
        }
      ]
    };
  },

  data() {
    return {
      content: null,
      closestVenues: [],
      query: this.$route.query.lookup,
      mapUrlbase: '/nearest-me/map'
    };
  },

  async asyncData({ store, params, error }) {
    return getContent(store, 'nearest-me', error);
  },

  methods: {
    ...mapActions({
      getBrowserLocation: 'location/getBrowserLocation',
      getLocationFromQuery: 'location/getLocationFromQuery',
      flash: 'ui/flash'
    }),
    filterActiveRestaurants(sites) {
      return sites.filter(site => site.fields.displayInSiteDirectory);
    },
    sortLocationsByDistance() {
      const coords = this.$store.state.location.coords;

      this.closestVenues = sortByDistance(
        { latitude: coords.lat, longitude: coords.long },
        this.filterActiveRestaurants(this.content.restaurants.fields.list),
        {
          xName: 'latitude',
          yName: 'longitude',
          seperator: 'fields'
        }
      ).slice(0, 4);
    },

    changeLocation(query) {
      const self = this;
      this.getLocationFromQuery(query)
        .then(this.sortLocationsByDistance)
        .then(() => {
          self.$nuxt.$router.push({
            path: '/nearest-me',
            query: { lookup: query }
          });
        });
    },

    handleError(type) {
      this.$router.push({ path: '/restaurants' });
      let message =
        'Hmm, we cant seem to find your location, please try being more specific!';

      if (type === 'browser') {
        message =
          'As we couldn’t locate you, please search for your local restaurant below';
      }

      this.flash({
        message,
        timeout: 5000
      });
    }
  },

  computed: {
    secondaryVenues() {
      return this.closestVenues.slice(1, 4);
    },
    mapUrl() {
      return this.query
        ? `${this.mapUrlbase}?lookup=${this.query}`
        : this.mapUrlbase;
    }
  },

  created() {
    const query = this.query;
    if (query) {
      this.getLocationFromQuery(query)
        .then(this.sortLocationsByDistance)
        .catch(err => this.handleError('query'));
    } else {
      this.getBrowserLocation()
        .then(this.sortLocationsByDistance)
        .catch(err => this.handleError('browser'));
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.nearest-me {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .content {
    padding: 16px;
    padding-bottom: 8px;
    width: 100%;
    @include whenScreenIs(mdx) {
      position: relative;
      padding-bottom: 0;
      background: white;
    }
    .change-location {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      font-size: 12px;
      line-height: 1;
      font-weight: 500;
      text-decoration: underline;
      color: white;
      background-color: $jungle-green;
      a {
        color: white;
      }
      @include whenScreenIs(mdx) {
        font-size: 16px;
      }
    }
    h1 {
      color: $pinkish-red;
      margin: 24px 0px;
      @include whenScreenIs(mdx) {
        margin-top: 65px;
      }
    }
    .header-row {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 24px 0 0;
      @include whenScreenIs(mdx) {
        margin: 40px 0 0;
        padding-bottom: 16px;
        flex-direction: row;
      }
      h2.sub-header {
        margin: 0 0 10px;
        color: $pinkish-red;
        @include whenScreenIs(mdx) {
          margin: 0;
        }
      }
      .view-map {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 0 16px;
        @include whenScreenIs(mdx) {
          position: absolute;
          right: 16px;
        }
        img {
          width: 24px;
          height: 24px;
          margin: 0 2px 0 0;
        }
        span {
          font-size: 18px;
          line-height: 1;
          font-weight: 700;
          color: $jungle-green;
        }
      }
    }
  }
  .loader {
    margin: 30px 0;
  }
}
</style>
