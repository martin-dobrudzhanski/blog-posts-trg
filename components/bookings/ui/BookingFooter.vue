<template>
  <div
    ref="wrapper"
    :class="[
      'booking-footer',
      {
        'booking-footer--alternative-times':
          $store.state.booking.alternativeTimes && this.bookingDetails,
      },
    ]"
  >
    <div
      :class="[
        'booking-footer__inner',
        {
          'booking-footer__inner--fixed': isFixed,
        },
      ]"
      ref="bookingFooter"
    >
      <AlternativeTimes
        v-if="this.$store.state.booking.alternativeTimes && this.bookingDetails"
        :alternativeTimes="this.$store.state.booking.alternativeTimes"
      ></AlternativeTimes>

      <div
        v-if="
          !this.$store.state.booking.alternativeTimes && this.bookingDetails
        "
        class="booking-footer__cta-wrapper"
      >
        <BaseButton width="fit" size="medium" :disabled="noLocationSelected">
          Next
        </BaseButton>
      </div>

      <div v-if="this.userDetails" class="booking-footer__cta-wrapper">
        <BaseButton
          width="fit"
          size="medium"
          :disabled="!isSubmitBtnActive"
          @click.native="submit"
        >
          {{ getSubmitText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import AlternativeTimes from '~/components/bookings/AlternativeTimes';
import BaseButton from '@/components/buttons/BaseButton';

export default {
  name: 'BookingFooter',
  components: {
    AlternativeTimes,
    BaseButton,
  },
  data: () => ({
    isFixed: false,
    toastFired: null,
    isSubmitting: false,
  }),
  props: {
    locationOnly: {
      type: Boolean,
      default: false,
    },
    termsAndConditionsMissing: {
      type: Boolean,
      default: false,
    },
    isSubmitBtnActive: {
      type: Boolean,
      default: false,
    },
    bookingDetails: {
      type: Boolean,
      default: false,
    },
    userDetails: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getSubmitText() {
      if (this.$store.state.booking.bookingRef) {
        return 'Change booking';
      }
      return 'Book now';
    },
    noLocationSelected() {
      return this.$store.state.booking.location === null;
    },
  },
  methods: {
    submit() {
      if (this.termsAndConditionsMissing && !this.toastFired) {
        this.toastFired = true;

        return this.$toast.show(
          'You need to accept our Terms & Conditions in order to book',
          {
            className: 'booking-toast',
            closeOnSwipe: true,
            containerClass: 'bookings',
            duration: 4000,
            fullWidth: true,
            fitToScreen: true,
            position: 'bottom-center',
            singleton: true,
          }
        );
      }
      if (!this.isSubmitBtnActive || this.isSubmitting) return false;
      if (this.$store.state.booking.bookingRef) {
        this.$emit('updateBooking');
        this.isSubmitting = true;
        return;
      }
      this.isSubmitting = true;
      this.$emit('createBooking');
    },
    handlePlacement() {
      if (this.$store.state.ui.isApp) {
        // Old code
        // Left like this because I didn't have a reliable way of testing the app
        return (this.$refs.bookingFooter.style.bottom = '67px'); // Sits above the bottom navigation
      }

      const scrollHeight = window.scrollY + window.innerHeight - 67; // Includes the height of the bottom navigation
      const scrollThreshold =
        this.$refs.wrapper.offsetTop + this.$refs.wrapper.offsetHeight;
      const isScrolledPastThreshold = scrollHeight > scrollThreshold;

      this.isFixed = !isScrolledPastThreshold;
    },
  },
  destroyed() {
    window.removeEventListener('scroll', this.handlePlacement);
    window.removeEventListener('resize', this.handlePlacement);
  },
  mounted() {
    this.handlePlacement();
    window.addEventListener('scroll', this.handlePlacement);
    window.addEventListener('resize', this.handlePlacement);
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.booking-footer {
  width: 100%;
  min-height: 4.5rem;

  &--alternative-times {
    min-height: 8.5rem;

    .booking-footer__wrapper {
      padding: 0;
    }
  }

  &__inner {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1rem;

    &--fixed {
      @include whenScreenIs(xs) {
        position: fixed;
        bottom: $bottom-nav-height-mobile;
        left: 0;
      }
    }
  }

  &__cta-wrapper {
    width: 100%;
    max-width: 8.5rem;
  }
}
</style>
