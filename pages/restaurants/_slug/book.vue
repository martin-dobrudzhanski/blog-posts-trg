<template>
  <section class="book-page" data-fullscreen>
    <PageHeader
      :image="bookingsHeaderImage"
      :with-negative-margin="isRouteWithNav"
    />
    <div id="main-bookings-journey-wrapper">
      <nuxt-child />
    </div>
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
import PageHeader from '@/components/ui/PageHeader';
import bookingPage from '@/mixins/bookingPage';
import BookingModal from '@/components/bookings/ui/BookingModal';
import TileGrid from '@/components/TileGrid';
import Tile from '@/components/Tile';

export default {
  name: 'RestaurantBook',
  layout: 'bookings',
  mixins: [bookingPage],
  components: {
    PageHeader,
    BookingModal,
    TileGrid,
    Tile
  },
  computed: {
    isRouteWithNav() {
      // Checks based on the route name
      // Due to the BookingNav being used in child routes in some places but not others
      return [
        'restaurants-slug-book',
        'restaurants-slug-book-your-details',
        'restaurants-slug-book-amend-bookingRef',
        'restaurants-slug-book-amend-bookingRef-your-details'
      ].some(name => this.$route.name === name);
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.book-page {
  background-color: $white;

  &__desktop-tiles,
  &__mobile-tiles {
    background-color: $true-white;
    padding: 1rem 0;
  }
}
</style>
