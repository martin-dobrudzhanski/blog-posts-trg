<template>
  <section class="booking-confirmation">
    <div class="booking-confirmation__icon--container">
      <div class="booking-confirmation__icon--tick"></div>
    </div>

    <BookingHeader :text="headerText" />

    <EmailConfirmation :cancel="cancel" />
    <div class="booking-confirmation__booking-content">
      <div class="booking-confirmation__booking-info--wrapper">
        <div class="booking-confirmation__booking-info--top">
          <BookingHeaderSecondary
            :text="headerSecondaryText"
            :data="this.$store.state.booking.bookingRef"
          />
          <h2 class="booking-confirmation__booking-info--title">
            Booking summary
          </h2>
          <BookingInfo :isBlock="true" />

          <SpecialRequests />
        </div>
        <div class="bottom-link">
          <BaseLink
            class="booking-confirmation__link"
            new-tab
            :to="$store.state.booking.termsAndConditionsUrl"
          >
            TERMS AND CONDITIONS
          </BaseLink>
        </div>
      </div>

      <div class="booking-confirmation__inner">
        <BaseButton
          v-if="cancel"
          size="medium"
          bg_colour="mac-and-cheese"
          colour="greyish-brown"
          class="booking-confirmation__cta"
          @click.native="cancelBooking"
        >
          Yes, cancel booking
        </BaseButton>
        <BaseButton
          v-else
          size="medium"
          bg_colour="mac-and-cheese"
          colour="greyish-brown"
          class="booking-confirmation__cta"
          :to="getMenuUrl"
        >
          {{ getButtonText }}
        </BaseButton>

        <div v-if="cancel" class="booking-confirmation__link-row">
          <BaseLink class="booking-confirmation__link--btn" :to="getChangeUrl">
            No, just change booking
          </BaseLink>
          <BaseLink
            class="booking-confirmation__link--btn"
            @click.native="getBackLink"
          >
            Go back
          </BaseLink>
        </div>

        <div
          v-else
          class="booking-confirmation__link-row booking-confirmation__link-row--center"
        >
          <BaseLink class="booking-confirmation__link--btn" :to="getChangeUrl">
            Change booking
          </BaseLink>
          <BaseLink class="booking-confirmation__link--btn" :to="getCancelUrl">
            Cancel booking
          </BaseLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from '@/components/buttons/BaseButton';
import BaseLink from '@/components/ui/BaseLink';
import BookingHeader from '@/components/bookings/ui/BookingHeader';
import BookingHeaderSecondary from '@/components/bookings/ui/BookingHeaderSecondary';
import BookingInfo from '@/components/bookings/BookingInfo';
import EmailConfirmation from '~/components/bookings/EmailConfirmation';
import SpecialRequests from '~/components/bookings/SpecialRequests';

export default {
  name: 'BookingConfirmation',
  props: {
    cancel: {
      type: Boolean,
      default: false
    },
    headerText: {
      type: String,
      default: undefined
    }
  },
  data: () => ({
    headerSecondaryText: 'Booking reference'
  }),
  components: {
    BaseButton,
    BaseLink,
    BookingHeader,
    BookingHeaderSecondary,
    BookingInfo,
    EmailConfirmation,
    SpecialRequests
  },
  computed: {
    restaurantSlug() {
      return this.$store.getters['booking/getRestaurantSlug'];
    },
    bookingRef() {
      return this.$store.getters['booking/getBookingRef'];
    },
    getMenuUrl() {
      return (
        this.$store.getters['booking/getBookingConfirmationButtonLink'] ||
        `/restaurants/${this.restaurantSlug}/menu`
      );
    },
    getChangeUrl() {
      return `/restaurants/${this.restaurantSlug}/book/amend/${this.$store.state.booking.bookingRef}`;
    },
    getCancelUrl() {
      return `/restaurants/${this.restaurantSlug}/book/cancel/${this.$store.state.booking.bookingRef}`;
    },
    getButtonText() {
      return (
        this.$store.getters['booking/getBookingConfirmationButtonText'] ||
        'View the menu'
      );
    }
  },
  methods: {
    cancelBooking() {
      this.$store.dispatch('booking/cancelBooking');
    },
    getBackLink() {
      return this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.booking-confirmation {
  background: $white;
  background-image: url('~/assets/img/background/paper.jpg');
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5rem;

  &__icon {
    &--container {
      margin-top: -5rem;
      width: 162px;
      height: 162px;
      border-radius: 50%;
      background-color: $white;

      @media (max-width: 1024px) {
        margin-top: -3.5rem;
        width: 120px;
        height: 120px;
      }
    }

    &--tick {
      margin: auto;
      margin-top: 10px;
      width: 143px;
      height: 143px;
      background-image: url('~/assets/img/background/booking-success.svg');
      background-size: contain;

      @media (max-width: 1024px) {
        width: 100px;
        height: 100px;
      }
    }
  }

  &__booking {
    &-content {
      display: flex;

      @include whenScreenIs(xs) {
        flex-direction: column;
      }
    }
    &-info {
      &--wrapper {
        width: 100%;

        @include whenScreenIs(xs) {
          max-width: 328px;
          margin-bottom: 1.5rem;
        }
        @include whenScreenIs(sm) {
          min-width: 370px;
        }
      }
      &--top {
        padding: 1rem;
        background-color: $sky-blue-10;
      }
      &--title {
        text-align: center;
        font-family: $navigation-font;
        color: $greyish-brown;
        font-size: 18px;
        padding: 1rem;
        border-top: 2px dotted $greyish-brown;
        border-bottom: 2px dotted $greyish-brown;
      }
    }
  }

  &__inner {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    @include whenScreenIs(xs) {
      max-width: 328px;
    }
    @include whenScreenIs(sm) {
      min-width: 370px;
    }
  }

  &__link-row {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    text-align: center;

    &--center {
      justify-content: center;

      .booking-confirmation__link {
        flex: 1;
      }
    }

    .booking-confirmation__link {
      font-size: 1.125rem;
    }
  }

  &__link {
    font-family: $font;
    font-size: 13px;
    text-align: center;
    color: $greyish-brown;
    text-decoration: underline;
    cursor: pointer;
    &--btn {
      font-family: $font;
      font-size: 1.125rem;
      background-color: $greyish-brown;
      color: $white;
      border-radius: 1.5rem;
      padding: 12px 1.25rem;
      width: 220px;
      margin-bottom: 24px;
      transition: box-shadow 300ms ease-in-out, opacity 300ms ease-in-out;

      &:hover {
        cursor: pointer;
        box-shadow: 0 2px 0.5rem rgba($true-black, 0.5);
      }
    }
  }

  &__cta {
    padding: 0 1.5rem;
    font-size: 1.125rem;
    width: 220px !important;
    margin-bottom: 24px;
  }
}
.bottom-link {
  text-align: center;
  margin-top: 1.5rem;
  line-height: 1.46;
  letter-spacing: 0.1px;
}
</style>
