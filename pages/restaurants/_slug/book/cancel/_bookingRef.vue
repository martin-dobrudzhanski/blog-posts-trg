<template>
  <div data-route="book" data-child>
    <BookingConfirmation
      headerText="Would you like to cancel your booking?"
      cancel
    />
  </div>
</template>

<script>
import BookingConfirmation from '~/components/bookings/BookingConfirmation';

export default {
  components: {
    BookingConfirmation
  },
  head: {
    title: 'Cancel booking',
    meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
</style>
