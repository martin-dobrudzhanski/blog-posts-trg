<template>
  <div data-component="booking-details" class="booking-details">
    <Spinner v-if="isLoading" data-element="loading-spinner" />
    <div v-else data-element="form-container">
      <div data-element="form-row" data-form-section="search">
        <p class="booking-details__field-label">
          Where would you like to book?
        </p>
        <div class="booking-details__location-form-wrapper">
          <LocationForm
            size="md"
            :default-value="locationQuery"
            :is-geolocating="isGeolocating"
            @geolocate="handleGeolocate"
            @search="handleSearch"
          />
        </div>
        <Spinner v-if="isSearching" data-element="search-spinner" />
        <p
          v-else
          data-element="field-link"
          :class="{ visible: this.$store.state.booking.location }"
          @click="$store.dispatch('booking/redirectToAllLocations')"
        >
          Change location
        </p>
      </div>

      <div data-element="form-row" :data-disabled="noLocationSelected">
        <p class="booking-details__field-label">How many adults?</p>
        <div class="booking-details__select-wrapper">
          <BaseSelect
            placeholder="Select how many adults"
            :value="numAdults"
            :options="getNumAdultsOptions"
            @change="(option) => changeNumPeople(option, 'adults')"
          />
        </div>
      </div>
      <div data-element="form-row" :data-disabled="noLocationSelected">
        <p class="booking-details__field-label">How many children?</p>
        <div class="booking-details__select-wrapper">
          <BaseSelect
            placeholder="Select how many children"
            :value="numChildren"
            :options="getNumChildrenOptions"
            @change="(option) => changeNumPeople(option, 'children')"
          />
        </div>
      </div>

      <p data-element="booking-additional-note" v-if="bookingAdditionalNote">
        {{ bookingAdditionalNote }}
      </p>

      <form v-on:submit.prevent="$store.dispatch('booking/checkAvailability')">
        <div data-element="form-row" :data-disabled="noLocationSelected">
          <p class="booking-details__field-label">
            When would you like to come?
          </p>
          <div data-element="date-wrapper">
            <div
              data-element="select-launcher"
              data-select="date"
              @click="$store.dispatch('booking/showDateModal')"
            >
              <div data-element="text">
                {{ $store.getters['booking/getPrettyDate'] }}
              </div>
              <Icon icon="icon-down-arrow-grey" size="sm" />
            </div>
            <div
              data-element="select-launcher"
              data-select="time"
              @click="$store.dispatch('booking/showTimeModal')"
            >
              <div data-element="text">
                {{ $store.getters['booking/getPrettyTime'] }}
              </div>
              <Icon icon="icon-down-arrow-grey" size="sm" />
            </div>
          </div>
        </div>
        <BookingFooter :bookingDetails="true" :locationOnly="locationOnly" />
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import Icon from '~/components/bookings/ui/Icon';
import BookingFooter from '~/components/bookings/ui/BookingFooter';
import Spinner from '~/components/bookings/ui/Spinner.vue';
import LocationForm from '~/components/LocationForm.vue';
import BaseSelect from '~/components/ui/BaseSelect.vue';

export default {
  props: ['locationOnly', 'bookingAdditionalNote'],
  data: () => ({
    locationQuery: null,
    inputPlaceholder: 'Search by Town, City or Post Code',
    isGeolocating: false,
    pageReady: false,
    isSearching: false,
    isLoading: false,
  }),
  components: {
    Icon,
    BookingFooter,
    Spinner,
    LocationForm,
    BaseSelect,
  },
  computed: {
    ...mapState('booking', ['numAdults', 'numChildren']),
    ...mapGetters('booking', ['getNumAdultsOptions', 'getNumChildrenOptions']),
    isLocationQueryDisabled() {
      if (!this.$store.state.booking.bookingRef) {
        return false;
      }
      return true;
    },
    getBookingRefFromUrl() {
      if (!this.$route.params || !this.$route.params.bookingRef) {
        return false;
      }
      return this.$route.params.bookingRef;
    },
    noLocationSelected() {
      return this.$store.state.booking.location === null;
    },
  },
  methods: {
    ...mapMutations('booking', ['setNumAdults', 'setNumChildren']),
    getPrettyLocationQuery() {
      if (this.locationOnly) {
        return;
      }
      if (this.$store.getters['booking/getPrettyLocationQuery']) {
        this.locationQuery = this.$store.getters[
          'booking/getPrettyLocationQuery'
        ].replace('Chiquito, ', '');
      }
    },
    initState() {
      // if this is not the amend journey
      if (!this.getBookingRefFromUrl) {
        // if we have a booking ref in store
        if (this.$store.state.booking.bookingRef) {
          // clear all the data from the last booking
          this.$store.dispatch('booking/initState');
        }
      }
    },
    async handleGeolocate() {
      this.isGeolocating = true;
      this.inputPlaceholder = 'Finding your nearest restaurant...';
      const success = await this.$store.dispatch('booking/redirectToNearest');
      if (!success) {
        this.isGeolocating = false;
        this.inputPlaceholder = 'Search by Town, City or Post Code';
      }
    },
    async handleSearch(query) {
      this.isSearching = true;
      const success = await this.$store.dispatch('booking/showLocationModal', {
        query,
      });
      if (!success) {
        this.isSearching = false;
        this.inputPlaceholder = 'Search by Town, City or Post Code';
      } else {
        this.isSearching = false;
      }
    },
    changeNumPeople(option, type) {
      this.$store.commit('booking/clearAlternativeTimes');

      switch (type) {
        case 'adults':
          this.setNumAdults({ numAdults: +option });
          break;
        case 'children':
          this.setNumChildren({ numChildren: +option });
          break;
        default:
          // eslint-disable-next-line
          console.error("Invalid param 'type' passed to changeNumPeople");
      }
    },
  },
  mounted() {
    this.pageReady = true;
    this.$store.commit('booking/setBookingDetailsComplete', {
      complete: false,
    });
    this.getPrettyLocationQuery();
    this.initState();
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/bookings/form-row.scss';

.booking-details {
  background-color: $light-beige;
  padding-top: 3rem;
  margin: 0 auto;
  margin-bottom: 5rem;

  @include whenScreenIs(xs) {
    max-width: $max-width-tablet;
  }

  @include whenScreenIs(sm) {
    max-width: $max-width-tablet;
  }

  @include whenScreenIs(mdx) {
    max-width: $max-width-mdesktop;
  }

  @include whenScreenIs(lg) {
    max-width: $max-width-desktop;
  }

  &__field-label {
    font-family: $font;
    font-weight: bold;
    font-size: 1.125rem;
    color: $greyish-brown;
    margin-bottom: 1.25rem;
  }

  &__location-form-wrapper {
    width: 100%;
    max-width: 20.5rem;
  }

  &__select-wrapper {
    width: 100%;
    max-width: 20.5rem;
  }
}

[data-component='booking-details'] {
  [data-element='form-container'] {
    padding: 8px;
    [data-element='form-row'] {
      @extend .form-row;
      &[data-form-section='search'] {
        margin-bottom: 0;
        [data-element='field-link'] {
          margin-bottom: 32px;
        }
        [data-element='search-spinner'] {
          margin: 10px 0;
        }
      }
      [data-element='number-wrapper'] {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 328px;
        [data-element='number'] {
          font-size: 18px;
          margin-left: 4px;
        }
        [data-element='icon-container'] {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 40px;
          cursor: pointer;
          &[data-position='left'] {
            left: 68px;
          }
          &[data-position='right'] {
            right: 68px;
          }
        }
      }
      [data-element='date-wrapper'] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        position: relative;
        margin-bottom: 1rem;
        @media (min-width: $bookings-mobile) {
          width: 328px;
        }
        [data-element='select-launcher'] {
          border: 1px solid #979797;
          display: flex;
          align-items: center;
          height: 3.125rem;
          position: relative;
          border-radius: 1.5rem;
          flex: 1 0 0%;

          &[data-select='date'] {
            padding-left: 1.75rem;
            width: 150px;
            @media (min-width: $bookings-mobile) {
              width: 160px;
            }
          }
          &[data-select='time'] {
            margin-left: 6px;
            padding-left: 1.75rem;
            width: 120px;
            @media (min-width: $bookings-mobile) {
              margin-left: 16px;
            }
          }
          [data-element='text'] {
            font-size: 16px;
            font-weight: normal;
          }
          [data-component='icon'] {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 1rem;
            width: 1rem;
            height: 1rem;
            left: auto;
          }
        }
      }
    }

    [data-element='booking-additional-note'] {
      margin: 0 auto 2rem;
      max-width: $bookings-mobile;
      text-align: center;
    }
  }
}
</style>
