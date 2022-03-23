<template>
  <section class="restaurant-view-page" data-fullscreen>
    <aside class="rest-details">
      <h1 class="heading" data-size="xl" data-weight="normal">{{ content.restaurant.fields.title }}</h1>
      <h3 class="heading" data-size="sm" data-weight="bold">
        <a
          class="address"
          target="_blank"
          :href="
            `https://www.google.com/maps?q=${content.restaurant.fields.postalCode}+chiquito`
          "
        >
          {{ content.restaurant.fields.street }},
          {{
          content.restaurant.fields.additional &&
          content.restaurant.fields.additional + ','
          }}
          {{ content.restaurant.fields.city }},
          {{ content.restaurant.fields.postalCode }}
        </a>
      </h3>
      <a
        class="tel"
        :href="`tel:${content.restaurant.fields.telephone}`"
      >{{ content.restaurant.fields.telephone }}</a>
    </aside>

    <aside class="opening-hours">
      <div class="card-left">
        <h1 class="heading" data-size="sm" data-weight="bold">Opening Hours</h1>
        <table>
          <tbody>
            <tr>
              <td class="key">Monday:</td>
              <td class="value">{{ content.restaurant.fields.openMonday | openingHours }}</td>
            </tr>
            <tr>
              <td class="key">Tuesday:</td>
              <td class="value">{{ content.restaurant.fields.openTuesday | openingHours }}</td>
            </tr>
            <tr>
              <td class="key">Wednesday:</td>
              <td class="value">{{ content.restaurant.fields.openWednesday | openingHours }}</td>
            </tr>
            <tr>
              <td class="key">Thursday:</td>
              <td class="value">{{ content.restaurant.fields.openThursday | openingHours }}</td>
            </tr>
            <tr>
              <td class="key">Friday:</td>
              <td class="value">{{ content.restaurant.fields.openFriday | openingHours }}</td>
            </tr>
            <tr>
              <td class="key">Saturday:</td>
              <td class="value">{{ content.restaurant.fields.openSaturday | openingHours }}</td>
            </tr>
            <tr>
              <td class="key">Sunday:</td>
              <td class="value">{{ content.restaurant.fields.openSunday | openingHours }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-right">
        <div class="card-right__facilities" v-if="getFacilities">
          <div class="spacer" />
          <div>
            <h1 class="heading" data-size="sm" data-weight="bold">Facilities</h1>
            <Facilities :facilities="getFacilities" />
          </div>
        </div>
        <div class="btns">
          <nuxt-link
            class="btn"
            data-size="md"
            :to="`/menu/summer`"
          >View menus</nuxt-link>
          <nuxt-link
            :to="getBookingLink"
            class="btn"
            data-size="md"
            :event="content.restaurant.fields.enableBooking? 'click' : ''"
            :class="{ disabled: !content.restaurant.fields.enableBooking }"
          >Book now</nuxt-link>
          <nuxt-link
            class="btn"
            data-color="green"
            data-size="sm"
            :to="`/restaurants/${content.restaurant.fields.slug}/takeaway`"
            :event="!content.restaurant.fields.enableClickAndCollect ? '' : 'click'"
            :class="{ disabled: !content.restaurant.fields.enableClickAndCollect }"
          >Click &amp; Collect</nuxt-link>

          <nuxt-link
            class="btn"
            data-color="green"
            data-size="sm"
            :to="$route.fullPath"
            :event="content.restaurant.fields.enableDeliveries? 'click' : ''"
            :class="{ disabled: !content.restaurant.fields.enableDeliveries }"
            @click.native="showDeliveriesModal"
          >Delivery</nuxt-link>
        </div>
      </div>
    </aside>

    <div class="tiles">
      <Tile :card="content.cardSlot1" class="card-slot-1 desktop" />
      <Tile :card="content.cardSlot2" class="card-slot-2 desktop" />
      <Tile :card="content.cardSlot3" class="card-slot-3 desktop" />
      <Tile :card="content.cardSlot4" class="card-slot-4 desktop" />
      <Tile :card="content.cardSlot1Mobile" class="card-slot-1 mobile" />
      <Tile :card="content.cardSlot2Mobile" class="card-slot-2 mobile" />
      <Tile :card="content.cardSlot3Mobile" class="card-slot-3 mobile" />
      <Tile :card="content.cardSlot4Mobile" class="card-slot-4 mobile" />
    </div>

    <section class="nearby-resaurants">
      <h2 class="subhead heading" data-size="md" data-weight="bold">Other restaurants near to here</h2>
      <RestaurantTile
        v-for="venue in content.nearby"
        :key="venue.site_id"
        :distance="venue.distance"
        :locationInfo="venue"
      />
    </section>
  </section>
</template>

<script>
import Facilities from '~/components/restaurant/Facilities.vue';
import RestaurantTile from '~/components/restaurant/tile.vue';
import Tile from '~/components/Tile.vue';
import { getContent } from '~/libs/templateHelpers.js';
import facilities from '~/mixins/facilities.js';

import { get } from 'lodash';

export default {
  components: {
    Facilities,
    Tile,
    RestaurantTile
  },
  // validate ({ params }) {
  // 	return /^\d+$/.test(params.slug)
  // },
  head() {
    let getMeta = () => {
      if (!this.$store.state.ui.metaDescription) {
        return '';
      }
      return this.$store.state.ui.metaDescription;
    };
    let getTitle = () => {
      if (!this.content) {
        return 'Restaurant';
      }
      return this.content.restaurant.fields.title;
    };
    return {
      title: getTitle(),
      bodyAttrs: {
        'data-pagecolor': 'light-grey'
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: getMeta()
        }
      ]
    };
  },
  mixins: [facilities],
  data() {
    return {
      content: null
    };
  },
  async asyncData({ store, params, error }) {
    return await getContent(store, `restaurants/${params.slug}`, error);
  },
  methods: {
    showDeliveriesModal() {
      get(this, 'content.restaurant.fields.enableDeliveries') &&
        this.$store.commit('ui/showModal', {
          modal: 'DeliveryOptionsModal',
          modalOptions: {
            heading: 'Delivery Method',
            location: this.content.restaurant.fields
          }
        });
    }
  },
  computed: {
    deliveryUrl() {
      return (
        this.content.restaurant.fields.deliveryLink ||
        'https://deliveroo.co.uk/'
      );
    },
    getBookingLink() {
      if (!this.content.restaurant.fields.siteId) {
        return '/book';
      }
      return `/book/${this.content.restaurant.fields.slug}`;
    },
    facilities() {
      if (!this.content) {
        return false;
      }
      return this.content.restaurant.fields.taxonomy;
    },
    getDeliveryStyle() {
      const imgUrl =
        this.content &&
        this.content.cardDelivery &&
        this.content.cardDelivery.fields &&
        this.content.cardDelivery.fields.image &&
        this.content.cardDelivery.fields.image.fields &&
        this.content.cardDelivery.fields.image.fields.file &&
        this.content.cardDelivery.fields.image.fields.file.url;
      return {
        'background-image': `url(${imgUrl}?w=420&h=420&q=100)`
      };
    },
    coords() {
      return `${this.content.restaurant.fields.latitude},${this.content.restaurant.fields.longitude}`;
    },
    staticMapStyle() {
      return [
        `background-image: url(`,
        `https://maps.googleapis.com/maps/api/staticmap?`,
        `center=${this.coords}&`,
        `zoom=12&`,
        `scale=1&`,
        `size=680x444&`,
        `maptype=roadmap&`,
        `format=png&`,
        `visual_refresh=true&`,
        `key=AIzaSyD0DYuzF8WvLkWwQEAx2klixrqM2zc4yrE&`,
        `markers=${this.coords})`
      ].join('');
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

$desktop-card-width: 480px;

.restaurant-view-page {
  background: $white-three;

  .rest-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background-color: $booger-green;
    h1,
    h3,
    .tel {
      max-width: 100%;
      text-align: center;
      color: #fff;
    }
    h3 {
      margin-bottom: 8px;
      .address {
        color: white;
      }
    }
    .tel {
      color: white;
      text-decoration: underline;
      font-size: 12px;
    }
  }

  .opening-hours {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f6f6f6;
    padding-top: 24px;
    .card-left,
    .card-right {
      display: inline-block;
      vertical-align: top;
    }
    .card-left {
      width: 100%;
      max-width: 392px;
      padding: 0 16px;
      table {
        width: 100%;
        margin: 0 auto;
        margin-top: 16px;
        tr {
          margin: 10px 0px;
        }
        .key {
          width: 95px;
          height: 23px;
          font-size: 16px;
          line-height: 20px;
          font-weight: 500;
          color: $black;
          text-align: left;
          @include whenScreenIs(mdx) {
            width: 95px;
          }
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
    .card-right {
      width: 100%;
      max-width: 392px;
      margin: 16px 0;
      .card-right__facilities {
        display: flex;
        @include whenScreenIs(mdx) {
          flex-direction: column;
        }
        .spacer {
          flex: 1;
          @include whenScreenIs(mdx) {
            display: none;
          }
        }
      }
      .facilities-group {
        justify-content: center;
        margin-top: 12px;
      }
      .btns {
        margin: 32px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .btn {
          width: 48%;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
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
    h1 {
      color: $rebrand-orange;
      margin-bottom: 12px;
    }
  }

  .directions {
    height: 128px;
    position: relative;
    .map-container {
      padding: 16px;
      height: 128px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background-size: cover;
      background-position: center;
      .btn {
        max-width: 360px;
      }
    }
  }

  .delivery {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $booger-green;
    padding: 16px;
    .wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      max-width: 360px;
      background-repeat: no-repeat;
      padding-right: 120px;
      background-size: 130px auto;
      background-position: center right;
      .text {
        width: 100%;
        h1,
        p {
          color: #fff;
        }
        h1 {
          margin-bottom: 6px;
        }
        p {
          margin-bottom: 14px;
        }
      }
    }
  }

  .card-slot-1,
  .card-slot-2,
  .card-slot-3,
  .card-slot-4 {
    @include fadeIn();
    &.desktop {
      display: none;
    }
    &.mobile {
      display: block;
    }
  }
  .nearby-resaurants {
    background-color: white;
    padding-top: 16px;
    padding: 16px 8px 8px;
    h2.subhead {
      margin: 0 auto;
      // padding-top: 10px;
      margin-bottom: 10px;
      color: $rebrand-orange;
      font-size: 20px;
      width: 200px;
    }
  }
}

@include whenScreenIs(mdx) {
  .restaurant-view-page {
    display: flex;
    flex-wrap: wrap;
    .rest-details {
      width: 50%;
      .tel {
        font-size: 16px;
      }
    }
    .opening-hours {
      width: 50%;
      align-items: flex-start;
      flex-direction: row;
      .card-left {
        width: 284px;
        padding: 0 0 0 21px;
        table {
          margin-top: 12px;
        }
      }
      .card-right {
        width: 196px;
        margin-top: 0;
        padding: 0 12px 0 12px;
        .facilities-group {
          justify-content: center;
          margin-top: 20px;
        }
        .btns {
          flex-wrap: wrap;
          margin-top: 20px;
          .btn {
            width: 100%;
            margin: 0 0 8px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
    .directions {
      width: 50%;
      height: 224px;
      .map-container {
        height: 224px;
      }
    }
    .delivery {
      width: 50%;
      height: 224px;
      .wrapper {
        max-width: none;
        align-items: center;
        padding-right: 170px;
        background-size: 200px auto;
        background-position: center right;
        .text {
          h1 {
            line-height: 1.2;
            margin-bottom: 6px;
          }
          p {
            margin-bottom: 12px;
          }
        }
        .btn {
          &:hover {
            border-color: #fff;
          }
        }
      }
    }
    .tiles {
      width: 100%;
      display: flex;
      .card-slot-1,
      .card-slot-2,
      .card-slot-3,
      .card-slot-4 {
        &.desktop {
          display: block;
          width: 50%;
        }
        &.mobile {
          display: none;
        }
      }
      .plain-card {
        .desktop-card {
          &:after {
            content: none;
            display: none;
          }
        }
      }
    }
    .nearby-resaurants {
      width: 100%;
      padding-bottom: 0;
      padding-top: 0;
      h2.subhead {
        padding-top: 30px;
        width: 100%;
        font-size: 22px;
      }
    }
  }
}
</style>
