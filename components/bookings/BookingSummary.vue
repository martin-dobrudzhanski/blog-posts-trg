<template>
  <div class="booking-summary">
    <div class="booking-summary__header">
      <h2 class="booking-summary__header--text">Booking Summary</h2>
    </div>
    <div class="booking-summary__body">
      <BookingInfo summary="true" />
    </div>
  </div>
</template>

<script>
import BookingInfo from '~/components/bookings/BookingInfo.vue';

export default {
  name: 'BookingSummary',
  components: {
    BookingInfo,
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.booking-summary {
  min-height: 248px;
  width: 368px;
  display: flex;
  flex-direction: column;
  margin: 0 auto 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;

  @include whenScreenIs(xs) {
    width: 328px;
  }

  &__header {
    display: flex;
    align-items: center;
    color: $greyish-brown;
    font-family: $navigation-font;
    font-size: 18px;
    justify-content: center;
    height: 54px;
    background-color: $white;
    text-align: center;

    &--text {
      width: 100%;
      margin: 0 1rem;
      padding: 1rem;
      border-bottom: 2px dotted;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    background-color: $white;
    font-family: $font;
  }
}
</style>
