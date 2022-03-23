<template>
  <section class="restaurant-tile-container">
    <div class="tile">
      <div class="tile_header">
        <h2 class="heading">{{ restaurant.name }}</h2>
        <span v-if="openingSoon" class="opening-date"> {{ openingSoon }} </span>
      </div>
      <div class="info-container">
        <button
          :class="`accordion-switch ${showAccordion ? 'active' : ''}`"
          @click="showAccordion = !showAccordion"
        >
          More info
        </button>
        <div :class="`accordion ${showAccordion ? 'active' : ''}`">
          <p class="address">
            {{ restaurant.street }}, {{ restaurant.city }},
            {{ restaurant.postal_code || restaurant.postalCode }}
          </p>
          <div class="facilities card-left">
            <Facilities :facilities="getFacilities" offset="8" />
          </div>
          <a class="tel-container" :href="`tel:${restaurant.telephone}`">
            <span class="phone">{{ restaurant.telephone }}</span>
          </a>
          <h1 class="heading" data-size="sm" data-weight="bold">
            Opening Hours
          </h1>
          <table>
            <tbody>
              <tr>
                <td class="key">Monday:</td>
                <td class="value">
                  {{ restaurant.openMonday | openingHours }}
                </td>
              </tr>
              <tr>
                <td class="key">Tuesday:</td>
                <td class="value">
                  {{ restaurant.openTuesday | openingHours }}
                </td>
              </tr>
              <tr>
                <td class="key">Wednesday:</td>
                <td class="value">
                  {{ restaurant.openWednesday | openingHours }}
                </td>
              </tr>
              <tr>
                <td class="key">Thursday:</td>
                <td class="value">
                  {{ restaurant.openThursday | openingHours }}
                </td>
              </tr>
              <tr>
                <td class="key">Friday:</td>
                <td class="value">
                  {{ restaurant.openFriday | openingHours }}
                </td>
              </tr>
              <tr>
                <td class="key">Saturday:</td>
                <td class="value">
                  {{ restaurant.openSaturday | openingHours }}
                </td>
              </tr>
              <tr>
                <td class="key">Sunday:</td>
                <td class="value">
                  {{ restaurant.openSunday | openingHours }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="link-container" v-if="restaurant.covidOpen">
        <a
          class="btn link link-book"
          data-size="md"
          :href="`/menus/summer`"
          >View menus
        </a>

        <nuxt-link
          :to="getBookingLink"
          class="btn link link-book"
          data-size="sm"
          :event="restaurant.enableBooking ? 'click' : ''"
          :class="{ disabled: !restaurant.enableBooking }"
          >Book now</nuxt-link
        >

        <nuxt-link
          class="btn link link-view"
          data-outline
          data-color="green"
          data-size="sm"
          :to="`/restaurants/${restaurant.slug}/takeaway`"
          :event="!restaurant.enableClickAndCollect ? '' : 'click'"
          :class="{ disabled: !restaurant.enableClickAndCollect }"
        >
          Click &amp; Collect
        </nuxt-link>

        <nuxt-link
          class="btn link link-view"
          data-outline
          data-color="green"
          data-size="sm"
          :to="$route.fullPath"
          :event="restaurant.enableDeliveries ? 'click' : ''"
          :class="{ disabled: !restaurant.enableDeliveries }"
          @click.native="showDeliveriesModal"
        >
          Delivery
        </nuxt-link>
      </div>
      <div class="link-container" v-else>
        <nuxt-link
          :to="`/restaurants/${restaurant.slug}`"
          class="btn link link-book"
          data-size="sm"
          >Get Updates</nuxt-link
        >
        <nuxt-link
          v-if="showBookingForClosedRestaurant"
          :to="`/restaurants/${restaurant.slug}/book`"
          class="btn link link-book"
          data-size="sm"
          >Book now</nuxt-link
        >
      </div>
    </div>
  </section>
</template>

<script>
import Facilities from '~/components/restaurant/Facilities.vue';
import facilities from '~/mixins/facilities';
import dayjs from 'dayjs';
import { get } from 'lodash';

export default {
  data: () => ({
    showAccordion: false
  }),
  mixins: [facilities],
  components: {
    Facilities
  },
  props: {
    locationInfo: {
      type: Object,
      required: true
    },
    openAccordion: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.showAccordion = this.openAccordion;
  },
  computed: {
    restaurant() {
      if (this.locationInfo.fields) {
        const dayMethods = [
          'openSunday',
          'openMonday',
          'openTuesday',
          'openWednesday',
          'openThursday',
          'openFriday',
          'openSaturday'
        ];
        const dayOfTheWeek = new Date().getDay();
        return Object.assign({}, this.locationInfo.fields, {
          distance: this.locationInfo.distance,
          openToday: this.locationInfo.fields[dayMethods[dayOfTheWeek]]
        });
      } else {
        return this.locationInfo;
      }
    },
    facilities() {
      if (!this.restaurant.taxonomy) {
        return false;
      }
      return this.restaurant.taxonomy;
    },
    getBookingLink() {
      if (!this.restaurant.siteId) {
        return '/book';
      }
      return `/book/${this.restaurant.slug}`;
    },
    showBookingForClosedRestaurant() {
      return (
        this.restaurant.afterCovidOpeningDate && this.restaurant.enableBooking
      );
    },
    openingSoon() {
      if (this.restaurant.afterCovidOpeningDate)
        return `Opening ${dayjs(this.restaurant.afterCovidOpeningDate).format(
          'D MMMM'
        )}`;
      if (!this.restaurant.covidOpen) return `Opening soon`;
      return false;
    }
  },
  methods: {
    getHoursMessage(openingTimes) {
      const isClosed = this.isClosed(openingTimes);

      if (isClosed) {
        return 'Closed';
      }

      return `Open today ${openingTimes}`;
    },
    isClosed(openingTimes) {
      const openingTimesFormatted = openingTimes.trim().toLowerCase();
      return /closed/.test(openingTimesFormatted);
    },
    showDeliveriesModal() {
      get(this, 'restaurant.enableDeliveries') &&
        this.$store.commit('ui/showModal', {
          modal: 'DeliveryOptionsModal',
          modalOptions: {
            heading: 'Delivery Method',
            location: this.restaurant
          }
        });
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/helpers.scss';
@import '~assets/css/variables.scss';
.restaurant-tile-container {
  @include fadeIn();
  margin: 0 0 8px;
  border-bottom: 2px solid $rebrand-orange;
  .tile {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    &_header {
      display: flex;
      align-items: center;
      font-family: $secondary-body-font;
      letter-spacing: 1px;
      line-height: 1.2;
      h2 {
        width: 65%;
      }
    }
  }
  .heading-logo {
    width: auto;
    height: 3rem;
    margin-left: auto;
    align-self: flex-start;
    @include whenScreenIs(mdx) {
      margin-left: 2rem;
    }
  }
  .info-container {
    .accordion-switch {
      background: unset;
      color: $rebrand-blue;
      border: none;
      position: relative;
      font-weight: 800;
      outline: none;
      &::before {
        display: inline-block;
        content: '';
        border-left: 12px solid $rebrand-blue;
        border-top: 5px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 5px solid transparent;
        transform: rotate(0) translateX(0);
        transition: 500ms;
      }
      &.active::before {
        transform: rotate(90deg) translateX(7px);
      }
    }
    .accordion {
      transition: 500ms;
      max-height: 0;
      overflow: hidden;
      &.active {
        max-height: 1200px;
      }
      p.address {
        font-size: 16px;
        font-weight: 500;
        line-height: 1.2;
        margin: 10px auto;
        text-align: center;
        max-width: 70%;
      }
      .heading {
        margin-top: 16px;
        font-size: 20px;
      }
      table {
        max-width: 420px;
        margin: 0 auto;
        margin-top: 16px;
        tr {
          margin: 10px 0px;
        }
        .key {
          width: 190px;
          height: 23px;
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
          color: $black;
          text-align: left;
        }
        .value {
          font-size: 16px;
          line-height: 20px;
          font-weight: 700;
          color: $black;
          text-align: right;
          letter-spacing: 0.5px;
        }
      }
    }
  }

  span {
    display: block;
  }
  h2 {
    color: $pinkish-red;
    margin: 8px 0px;
    font-size: 22px;
    text-align: left;
    font-weight: 800;
  }
  .section-break {
    height: 2px;
    width: 100%;
    background-color: $jungle-green;
    margin: 0;
  }
  .hours {
    margin-top: 6px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.25;
    text-align: center;
    color: #2b2929;
  }
  .tel-container {
    display: block;
    width: auto;
    text-decoration: none;
    margin: 0 auto;
    .phone {
      color: $rebrand-blue;
      margin-top: 12px;
      font-size: 18px;
      font-weight: bold;
      line-height: 1.11;
      text-align: center;
      text-decoration: none;
    }
  }
  .facilities {
    margin: 15px 0 0;
    .facilities-group {
      justify-content: center;
    }
  }
  .link-container {
    margin-bottom: 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    .link {
      width: 48%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      margin-bottom: 10px;
      img {
        margin-right: 5px;
      }
      &.disabled {
        opacity: 0.25;

        &:hover {
          background-color: $rebrand-blue;
          color: $true-white;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
