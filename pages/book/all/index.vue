<template>
  <section id="main-bookings-journey-wrapper" class="book-page" data-fullscreen>
    <PageHeader with-negative-margin :image="bookingsHeaderImage" />
    <BookingNav />
    <BookingDetails :locationOnly="true" />
    <BookingModal />
    <div class="book-page__tiles-wrapper">
      <TileGrid
        v-if="mobileTiles.length"
        mobile-only
        class="book-page__mobile-tiles"
      >
        <Tile v-for="card in mobileTiles" :key="card.sys.id" :card="card" />
      </TileGrid>

      <TileGrid
        v-if="desktopTiles.length"
        desktop-only
        class="book-page__desktop-tiles"
      >
        <Tile v-for="card in desktopTiles" :key="card.sys.id" :card="card" />
      </TileGrid>
    </div>
  </section>
</template>

<script>
import { getContent } from '~/libs/templateHelpers.js';
import bookingPage from '@/mixins/bookingPage';
import PageHeader from '@/components/ui/PageHeader';
import BookingDetails from '@/components/bookings/BookingDetails';
import BookingNav from '@/components/bookings/ui/BookingNav';
import BookingModal from '@/components/bookings/ui/BookingModal';
import TileGrid from '@/components/TileGrid';
import Tile from '@/components/Tile';

export default {
  name: 'BookAll',
  layout: 'bookings',
  mixins: [bookingPage],
  data: () => ({
    locationOnly: true
  }),
  async asyncData({ store, params, error }) {
    return getContent(store, 'book', error);
  },
  components: {
    PageHeader,
    BookingNav,
    BookingModal,
    BookingDetails,
    TileGrid,
    Tile
  },
  computed: {
    shouldGeolocate() {
      if (
        this.$route.query &&
        this.$route.query.geolocate &&
        this.$route.query.geolocate === 'false'
      ) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    if (this.shouldGeolocate) {
      this.$store.dispatch('booking/redirectToNearest');
    }
    this.$router.replace({ query: null });
    window.scrollTo(0, 0);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.book-page {
  &__desktop-tiles,
  &__mobile-tiles {
    background-color: $true-white;
    padding: 1rem 0;
  }
}
</style>
