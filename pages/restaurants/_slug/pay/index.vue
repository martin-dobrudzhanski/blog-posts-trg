<template>
  <div class="restaurant-pay-page">
    <v-page :loading="loading || contentIsLoading">
      <main>
        <div class="restaurant-pay-page__container">
          <section>
            <h1
              data-size="xl"
              data-color="rebrand-orange"
              data-weight="normal"
              class="heading"
              v-text="content.locationPageTitle"
            />
          </section>
          <section class="restaurant-pay-page__form-section">
            <geolocation-input
              :selectedLocationName="content.restaurant.fields.name"
            />
            <nuxt-link to="/pay" class="form-section__link" @click="setLoading"
              >Change location</nuxt-link
            >
            <v-input
              label="Enter your table number:"
              placeholder="Table Number"
              inputmode="numeric"
              @input="handleInput"
              @formSubmit="handleButtonClick"
              largeSpace
            />
            <p
              class="error-message"
              v-if="!tableNumberValid && tableNumberEntered"
            >
              Please enter a valid table number
            </p>
          </section>
        </div>
        <section class="restaurant-pay-page__footer">
          <a
            :href="content.termsAndConditionsLink"
            class="footer__link"
            target="_blank"
          >
            Terms and Conditions
          </a>
          <v-button
            @buttonClick="handleButtonClick"
            hasContainer
            :buttonText="content.tableButtonText"
            :disabled="!selectedTableNumber || !tableNumberValid"
          />
        </section>
      </main>
    </v-page>
  </div>
</template>

<script>
import { getContent } from '~/libs/templateHelpers.js'
import { mapActions, mapGetters } from 'vuex'
import hidefooter from '~/mixins/hidefooter'
import hidePrivacyBanners from '~/mixins/hidePrivacyBanners'
import meta from '~/mixins/meta'

const GeolocationInput = () => import('~/components/pmb/GeolocationInput')
const VButton = () => import('~/components/pmb/VButton')
const VInput = () => import('~/components/pmb/VInput')
const VPage = () => import('~/components/pmb/VPage')

export default {
  components: {
    GeolocationInput,
    VButton,
    VInput,
    VPage
  },
  mixins: [hidefooter, hidePrivacyBanners, meta],
  data: () => ({
    content: null,
    loading: false,
    tableNumberValid: false,
    tableNumberEntered: false
  }),
  asyncData({ store, params, error }) {
    return getContent(store, `pay/${params.slug}`, error)
  },
  computed: {
    ...mapGetters({
      contentIsLoading: 'pay/getContentIsLoading',
      selectedTableNumber: 'pay/getTableNumber'
    })
  },
  methods: {
    ...mapActions({
      handleGloballyDisabled: 'pay/handleGloballyDisabled',
      handleDisabledForRestaurant: 'pay/handleDisabledForRestaurant',
      selectTableNumber: 'pay/selectTableNumber'
    }),
    handleButtonClick() {
      if (!this.selectedTableNumber) {
        return
      }
      this.proceedToBill()
    },
    handleInput(tableNumber) {
      this.tableNumberEntered = true
      this.selectTableNumber({ tableNumber })
      const regex = /^(?:[1-9][0-9]{3}|[1-9][0-9]{2}|[1-9][0-9]|[1-9])$/
      this.tableNumberValid = regex.test(tableNumber)
    },
    proceedToBill() {
      if (!this.selectedTableNumber) {
        return
      }
      this.loading = true
      this.$router.push(
        `/restaurants/${this.$route.params.slug}/pay/${this.selectedTableNumber}`
      )
    },
    setLoading() {
      this.loading = true
    }
  },
  created() {
    const location = this.content.restaurant && this.content.restaurant.fields
    this.selectTableNumber({ tableNumber: null })

    // Check if globally enabled
    if (this.content.globallyEnabled === 'disabled') {
      this.handleGloballyDisabled()
    }

    // Check if pmb v2 enabled for restaurant. If not, push to pmb v1 (with coords)
    if (location && this.content.restaurant.fields.payMyBillVersion !== 'v2') {
      this.handleDisabledForRestaurant({ location })
    }
  },
  mounted() {
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.restaurant-pay-page {
  &__container {
    padding-bottom: 160px;
  }

  &__heading {
    @extend .pmb-heading;
  }

  &__form-section {
    padding: 48px 16px 0;
  }

  .form-section__link {
    @extend .pmb-link;
    margin-top: 8px;
  }

  &__footer {
    background-color: #fff;
    bottom: 0;
    position: fixed;
    width: 100%;
    @media (min-width: 700px) {
      position: relative;
    }
  }

  .footer__link {
    @extend .pmb-link;
    margin-bottom: 8px;
  }
}

.error-message {
  color: $pinkish-red;
  margin: 10px 0;
}
</style>
