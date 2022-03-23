<template>
  <no-ssr>
    <section class="nearest-me" data-fullscreen>
      <div class="content">
        <VHero
          :backgroundImage="heroBackgroundImage"
          :subNav="false"
          :searchQuery="searchLocation"
          @setSearchQuery="setSearchLocation"
          @search="search"
          searchPlaceholder="Search by town, city, or postcode"
          :heading="mainHeading"
          :searchHeading="searchHeading"
          :hasNearestIcon="true"
          :fullHeight="state === 'initial'"
        >
          <transition name="fade" mode="out-in">
            <div
              class="hero__boxes"
              v-if="state === 'initial' && boxes && boxes.length"
            >
              <InfoBox
                v-for="(box, index) in boxes"
                :key="index"
                :heading="box.heading"
                :copy="box.copy"
                :backgroundColor="box.backgroundColor"
                :link="box.link"
              >
                <img
                  v-if="box.image"
                  class="info-box__icon"
                  :src="boxImage(box.image)"
                  alt="safety icon"
                />
              </InfoBox>
            </div>
          </transition>
        </VHero>
        <transition name="fade" mode="out-in">
          <div v-if="state === 'loaded'">
            <h1 class="heading--grey heading" data-size="xl">
              YOUR NEAREST CHIQUITO IS
            </h1>
            <div class="restaurant-grid wide-width">
              <RestaurantTile
                v-for="venue in closestVenues.slice(0, 2)"
                :locationInfo="venue"
                :key="venue.fields.slug"
                :showDistance="true"
                :ctas="['collect', 'delivery']"
              ></RestaurantTile>
            </div>
            <div class="header-row">
              <h2 class="heading sub-header" data-size="lg">
                OTHER RESTAURANTS NEARBY
              </h2>
            </div>
            <div class="restaurant-grid wide-width">
              <RestaurantTile
                v-for="venue in closestVenues.slice(1, 10)"
                :key="venue.fields.slug"
                :locationInfo="venue"
                :showDistance="true"
                :ctas="['collect', 'delivery']"
              ></RestaurantTile>
            </div>
          </div>
          <div class="loader__wrapper" v-else-if="state === 'loading'">
            <div key="loader" class="loader"></div>
          </div>
          <div class="list__error wide-width" v-else-if="state === 'error'">
            <h2 class="list__error__heading">An error occurred</h2>
            <p class="list__error__copy" v-if="errorMessage">
              {{ errorMessage }}
            </p>
          </div>
        </transition>
      </div>
    </section>
  </no-ssr>
</template>

<script>
import { mapActions } from 'vuex';
import { getContent } from '~/libs/templateHelpers.js';
import get from 'lodash.get';
import VHero from '~/components/iOrder-core/uiV3/VHero';
import RestaurantTile from '~/components/iOrder-core/uiV3/RestaurantTile';
import InfoBox from '~/components/iOrder-core/uiV3/InfoBox';
export default {
  layout: 'clickAndCollect',
  components: {
    RestaurantTile,
    VHero,
    InfoBox
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
      searchLocation: null,
      state: 'initial',
      errorMessage: null
    };
  },
  async asyncData({ store, params, error }) {
    return getContent(store, 'restaurants-click-and-collect', error);
  },
  computed: {
    mainHeading() {
      const { content } = this;
      const payload = content.subHeading1;
      return payload;
    },
    searchHeading() {
      const { content } = this;
      const payload = content.headerText;
      return payload;
    },
    heroBackgroundImage() {
      const { content } = this;
      const payload = get(content, 'heroBackgroundImage.fields.file.url');
      return payload;
    },
    boxes() {
      const { content } = this;
      const rawPayload = get(content, 'boxes');
      const payload = rawPayload.map(i => {
        return {
          ...i.fields
        };
      });
      return payload;
    }
  },
  methods: {
    boxImage(image) {
      const payload = get(image, 'fields.file.url');
      return payload;
    },
    async search(e) {
      try {
        this.state = 'loading';
        this.closestVenues = await this.getLocalRestaurants({
          query: e,
          restaurantList: this.content.restaurants.fields.list
        });
        this.state = 'loaded';
      } catch (error) {
        this.handleError(error);
      }
    },
    ...mapActions({
      getLocalRestaurants: 'location/getLocalRestaurants',
      flash: 'ui/flash'
    }),
    setSearchLocation(payload) {
      this.searchLocation = payload;
    },
    handleError(type) {
      let message =
        "Hmm, we can't seem to find your location. Please try being more specific!";
      if (type === 'browser') {
        message =
          'As we couldn’t locate you, please search for your local restaurant below';
      }
      this.state = 'error';
      this.errorMessage = message;
    }
  },
  beforeMount() {
    this.$store.dispatch('clickAndCollect/initState');
    this.$store.dispatch('iorderCheckout/clearState');
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
  background-image: url('~/assets/img/background/paper.jpg');

  .restaurant-grid {
    display: flex;
    flex-direction: column;
    @include whenScreenIs(mdx) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 39px;
      grid-row-gap: 28px;
    }
  }

  .content {
    width: 100%;
    @include whenScreenIs(mdx) {
      position: relative;
      padding-bottom: 0;
    }
    .hero__heading {
      font-size: 3rem;
      line-height: 1.11;
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
      color: $black;
      background-color: $white-three;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      a {
        color: $black;
      }
      @include whenScreenIs(mdx) {
        font-size: 16px;
      }
    }
    .discount-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      color: white;
      background-color: $pinkish-red;
      padding: 0 15px;
      @include whenScreenIs(mdx) {
        font-size: 16px;
      }
    }
    .heading--grey {
      color: $greyish-brown;
      margin: 3rem auto 1.5rem;
      max-width: 90%;
    }
    h1 {
      color: $greyish-brown;
      margin: 24px 0px;
      @include whenScreenIs(mdx) {
        margin-top: 45px;
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
        color: $greyish-brown;
        @include whenScreenIs(mdx) {
          margin: 0;
        }
      }
    }
  }
  .list__error {
    text-align: center;
    .list__error__heading {
      color: red;
      font-size: 24px;
      margin: 2rem 0 1rem;
    }
    .list__error__copy {
      text-align: center;
    }
  }
  .loader__wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }
  .hero__boxes {
    display: flex;
    flex-direction: column;
    margin: 2rem 0;
    .info-box__icon {
      width: auto;
      height: 2rem;
      display: none;
      margin-bottom: 1rem;
      @include whenScreenIs(mdx) {
        display: block;
      }
    }
    .info-box__wrapper {
      width: 90%;
      margin: 1rem auto 0;
      @include whenScreenIs(mdx) {
        width: 15rem;
        &:not(:last-child) {
          margin-right: 1rem;
        }
      }
    }
    @include whenScreenIs(mdx) {
      flex-direction: row;
    }
  }
}
</style>
