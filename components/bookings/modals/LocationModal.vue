<template>
  <div data-component="location-modal">
    <p v-if="!isNavigating" data-element="subheading">
      Select where you<br />
      would like to book
    </p>
    <template v-for="(location, index) in filteredLocations">
      <div v-if="!isNavigating" data-element="locations" :key="index">
        <div
          data-element="modal-block"
          @click="select(location.fields.slug, location)"
        >
          <p data-element="location">
            {{ location.fields.title | stripBrandFromSiteTitle }}
          </p>
        </div>
      </div>
    </template>
    <Spinner v-if="isNavigating" data-element="navigate-spinner" />
  </div>
</template>

<script>
import Spinner from '~/components/bookings/ui/Spinner';
import get from 'lodash.get';

export default {
  data() {
    return {
      isNavigating: false
    };
  },
  components: {
    Spinner
  },
  computed: {
    filteredLocations() {
      const locations = this.$store.state.booking.locations.filter(location => {
        return location.fields && location.fields.displayInSiteDirectory;
      });
      return locations.slice(0, 3);
    }
  },
  methods: {
    select(slug, location) {
      // Only clear location from state if user chooses a different location
      if (this.$route.params.slug !== slug) {
        this.$store.commit('booking/clearCurrentLocation');
      }
      this.isNavigating = true;
      const isSevenRooms = get(
        location,
        'fields.bookingConfiguration.fields.isSevenRooms'
      );
      if (isSevenRooms) {
        window.location.assign(
          `https://www.sevenrooms.com/reservations/${location.fields.bookingConfiguration.fields.venuName}`
        );
      } else {
        this.$router.push(
          {
            path: `/restaurants/${slug}/book`,
            query: this.$router.history.current.query
          },
          () => {
            this.$store.commit('booking/hideModal');
          }
        );
      }

      this.$store.commit('booking/resetUnavailableSessions');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='location-modal'] {
  position: relative;
  width: 312px;
  height: 528px;
  margin: 20px;
  background-color: $white;
  box-shadow: 0 2px 1rem rgba($true-black, 0.5);
  border-radius: 14px;
  overflow: hidden;
  @include whenScreenIs(sm) {
    width: 400px;
    height: 360px;
  }
  [data-element='navigate-spinner'] {
    margin-top: 100px;
  }
  [data-element='subheading'] {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: normal;
    padding: 20px 12px;
    text-align: center;
  }
  [data-element='locations'] {
    margin: 6px 12px;
  }
  [data-element='modal-block'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 76px;
    color: $black;
    background: $white-ice;
    border-radius: 14px;
    cursor: pointer;
    &:active,
    &:hover {
      color: $white;
      background: $sky-blue;
    }
    [data-element='location'] {
      font-size: 1.125rem;
      font-weight: bold;
      line-height: 1.25;
      padding: 16px;
      text-align: center;
      border-radius: 14px;
    }
  }
}
</style>
