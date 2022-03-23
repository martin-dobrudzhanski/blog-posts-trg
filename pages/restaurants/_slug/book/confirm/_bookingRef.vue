<template lang="html">
  <BookingConfirmation
    :headerText="
      content.bookingConfirmationHeaderText || 'Great, we can’t wait to see you'
    "
  />
</template>

<script>
import { getContent } from '~/libs/templateHelpers.js';
import BookingConfirmation from '~/components/bookings/BookingConfirmation.vue';

export default {
  data() {
    return {
      content: null
    };
  },
  async asyncData({ store, params, error }) {
    return getContent(store, `book/${params.slug}`, error);
  },
  components: {
    BookingConfirmation
  },
  head: {
    title: 'Booking confirmed',
    meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
