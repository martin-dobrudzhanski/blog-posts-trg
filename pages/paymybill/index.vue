<template>
  <div class="pay-page">
    <v-page :loading="loading || contentIsLoading">
      <main>
        <div>
          <section>
            <h1
              data-size="xl"
              data-color="rebrand-orange"
              data-weight="normal"
              class="heading"
              v-text="content.locationPageTitle"
            />
          </section>
          <section class="pay-page__form-section">
            <geolocation-input
              @geolocate="geolocate"
              @submitQuery="handleGeolocationQuery"
              @focus="focusLocation = true"
              @blur="focusLocation = false"
            />
            <v-input
              label="Enter your table number:"
              placeholder="Table Number"
              largeSpace
              disabled
            />
          </section>
        </div>
        <section
          class="pay-page__footer"
          :class="{ '--relative': focusLocation }"
        >
          <a href="#" class="link" target="_blank">
            Terms and Conditions
          </a>
          <v-button hasContainer disabled buttonText="Next" />
        </section>
      </main>
    </v-page>

    <transition name="fade">
      <modal-wrapper
        v-if="showLocationModal"
        @handleCloseModal="handleCloseModal"
      >
        <modal-location
          :locations="locations"
          @handleSelect="handleSelectLocation"
          @handleCloseModal="handleCloseModal"
        />
      </modal-wrapper>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getContent } from '~/libs/templateHelpers.js'
import hidefooter from '~/mixins/hidefooter'
import hidePrivacyBanners from '~/mixins/hidePrivacyBanners'
import meta from '~/mixins/meta'
import get from 'lodash.get'

import VPage from '~/components/pmb/VPage'
import GeolocationInput from '~/components/pmb/GeolocationInput'
import ModalLocation from '~/components/pmb/ModalLocation'
import ModalWrapper from '~/components/pmb/ModalWrapper'
import VButton from '~/components/pmb/VButton'
import VInput from '~/components/pmb/VInput'
export default {
  components: {
    GeolocationInput,
    ModalLocation,
    ModalWrapper,
    VButton,
    VInput,
    VPage
  },
  mixins: [hidefooter, hidePrivacyBanners, meta],
  data: () => ({
    content: null,
    focusLocation: false,
    loading: false
  }),
  asyncData({ store, params, error }) {
    return getContent(store, 'paymybill', error)
  },
  computed: {
    ...mapGetters({
      contentIsLoading: 'pay/getContentIsLoading',
      locations: 'pay/getNearestLocations',
      showLocationModal: 'pay/locationModalIsVisible'
    }),
    restaurantList() {
      return get(this.content, 'restaurants.fields.list')
    }
  },
  methods: {
    ...mapActions({
      handleGloballyDisabled: 'pay/handleGloballyDisabled',
      closeLocationModal: 'pay/closeLocationModal',
      handleGeolocate: 'pay/handleGeolocate',
      getLocationFromQuery: 'pay/getLocationFromQuery'
    }),
    geolocate() {
      if (!this.restaurantList) {
        // eslint-disable-next-line no-console
        console.log('No restaurant list!')
        return
      }
      this.handleGeolocate({ restaurantList: this.restaurantList })
    },
    handleCloseModal() {
      this.closeLocationModal()
    },
    handleGeolocationQuery(query) {
      this.getLocationFromQuery({ query, restaurantList: this.restaurantList })
    },
    handleSelectLocation(location) {
      this.loading = true
      const slug = location && location.slug
      this.closeLocationModal()
      if (slug) {
        this.$router.push(`/restaurants/${slug}/pay`)
      }
    },
    setLoading() {
      this.loading = true
    }
  },
  created() {
    // Check if globally enabled
    if (this.content && this.content.globallyEnabled === 'disabled') {
      this.handleGloballyDisabled()
    }
  },
  mounted() {
    this.geolocate()
  }
}
</script>

<style lang="scss">
@import '~assets/css/site.scss';

.pay-page {
  &__heading {
    @extend .pmb-heading;
  }

  &__form-section {
    padding: 48px 16px 160px;
  }

  &__footer {
    background-color: $white;
    bottom: 0;
    position: fixed;
    width: 100%;
    @media (min-width: 700px) {
      position: relative;
    }

    &.--relative {
      position: relative;
    }
  }

  .link {
    @extend .pmb-link;
    margin: 8px 0;
  }
}
</style>
