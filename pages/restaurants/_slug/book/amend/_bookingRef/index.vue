<template>
  <div data-route="book" class="book" data-child>
    <BookingNav />
    <div class="book__container">
      <BookingDetails :bookingAdditionalNote="content.bookingAdditionalNote" />
    </div>
  </div>
</template>

<script>
import BookingNav from '@/components/bookings/ui/BookingNav';
import BookingDetails from '@/components/bookings/BookingDetails';
import { getContent } from '~/libs/templateHelpers.js';
import { mapGetters } from 'vuex';

export default {
  name: 'RestaurantBookIntro',
  layout: 'bookings',
  components: {
    BookingNav,
    BookingDetails
  },
  data: () => ({
    content: null
  }),
  computed: {
    ...mapGetters({
      locationIsEnabled: 'booking/locationIsEnabled',
      isBookingEnabled: 'booking/isBookingEnabled'
    })
  },
  async asyncData({ store, error }) {
    return getContent(store, 'book', error);
  },
  mounted() {
    window.scrollTo(0, 0);
    if (!this.locationIsEnabled) {
      this.$router.push('/book?geolocate=false');
    }
    !this.isBookingEnabled &&
      this.$store.commit('ui/showModal', {
        modal: 'BookingDisabled',
        modalOptions: {
          heading: 'Sorry',
          cb: () => {
            this.$router.push({
              path: `/book/all`
            });
          }
        }
      });
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.book__container {
  background-color: $true-white;
  background-image: url('~/assets/img/background/paper.jpg');
}
</style>
