<template>
  <section class="restaurant-tile-container" :class="{ grey: !isOpen }">
    <NoSSR>
      <transition name="fade">
        <div v-if="showModal">
          <ModalContainer
            data-element="modal-container"
            @close="setShowModal(false)"
          >
            <DeliveryModal
              data-element="delivery-modal"
              @close="setShowModal(false)"
              :partners="partners"
            />
          </ModalContainer>
        </div>
      </transition>
    </NoSSR>
    <div class="desktop-tile">
      <div class="tile-top" :class="{ grey: !isOpen }">
        <h2 class="heading" data-size="md">
          {{ restaurant.title }}
        </h2>
        <div class="top-right">
          <p v-if="showDistance">{{ distance | distance }} mi. away</p>
        </div>
      </div>

      <div class="tile-mid">
        <div class="mid-left">
          <img
            v-if="isOpen"
            class="hours__icon"
            src="@/assets/img/iorder-coreV2/icons/clock.svg"
            alt="blue clock"
          />
          <img
            v-else
            class="hours__icon"
            src="@/assets/img/iorder-coreV2/icons/clock-black.svg"
            alt="black clock"
          />
          <p
            class="hours"
            v-if="
              restaurant.openToday &&
                restaurant.openToday.toLowerCase() !== 'closed'
            "
          >
            <span class="hours__copy" :class="{ grey: !isOpen }"
              >Open today</span
            >
            &#124;
            {{ restaurant.openToday }}
          </p>
          <span class="hours hours--closed" v-else>Closed</span>
        </div>
        <div class="mid-right">
          <a
            rel="noopener noreferrer"
            target="_blank"
            :href="
              `http://www.google.com/maps/place/${restaurant.latitude},${restaurant.longitude}`
            "
            class="directions"
            ><img
              v-if="isOpen"
              class="directions__icon"
              src="@/assets/img/iorder-coreV2/icons/direction-blue.svg"
              alt="directions"
            />
            <img
              v-else
              class="directions__icon"
              src="@/assets/img/iorder-coreV2/icons/direction-black.svg"
              alt="directions"
            />
            Directions
          </a>
        </div>
      </div>

      <div class="tile-bottom">
        <div class="bottom-left">
          <a
            v-if="!isOrderArea && !isV2"
            class="btn link link-view cc-button"
            :disabled="!isOpen"
            :class="{ disabled: !isOpen }"
            data-size="lg"
            :href="
              !isOpen
                ? ''
                : `https://clickandcollect.omnifitrgsites.co.uk/chiquito.html#/locations/${(restaurant &&
                    restaurant.zonalSiteId) ||
                    ''}`
            "
            target="_blank"
            >Click &amp; Collect</a
          >

          <nuxt-link
            v-if="hasOrder"
            tag="button"
            :disabled="!enableOrder"
            class="cc-button"
            :class="{ disabled: !enableOrder }"
            :event="!enableOrder ? '' : 'click'"
            :to="`/restaurants/${(restaurant && restaurant.slug) || ''}/order`"
            ><img
              class="collect__icon cta__icon"
              src="@/assets/img/iorder-coreV2/icons/bag.svg"
              alt="collect icon"
            />Order &amp; Pay</nuxt-link
          >
          <template v-if="hasCollect">
            <a
              v-if="!isV2"
              class="btn link link-view cc-button"
              :disabled="!enableCollect"
              :class="{ disabled: !enableCollect }"
              data-size="lg"
              :href="
                !enableCollect
                  ? ''
                  : `https://clickandcollect.omnifitrgsites.co.uk/chiquito.html#/locations/${(restaurant &&
                      restaurant.zonalSiteId) ||
                      ''}`
              "
              target="_blank"
              >Click &amp; Collect</a
            >

            <nuxt-link
              v-else
              tag="button"
              :disabled="!enableCollect"
              class="cc-button"
              :class="{ disabled: !enableCollect }"
              :event="!enableCollect ? '' : 'click'"
              :to="
                `/restaurants/${(restaurant && restaurant.slug) || ''}/takeaway`
              "
              ><img
                class="collect__icon cta__icon"
                src="@/assets/img/iorder-coreV2/icons/bag.svg"
                alt="collect icon"
              />Click &amp; Collect</nuxt-link
            >
          </template>
          <button
            class="cc-button cc-button--delivery"
            v-if="hasDelivery"
            @click="setShowModal('delivery')"
          >
            <img
              class="delivery__icon cta__icon"
              src="@/assets/img/iorder-coreV2/icons/delivery.svg"
              alt="delivery icon"
            /><span>Delivery</span>
          </button>
        </div>
        <div class="bottom-right">
          <template v-if="hasDelivery">
            <p v-if="hasDeliveryPartner" class="delivery-text">
              or select a delivery
            </p>
            <div class="delivery-icons">
              <a
                v-if="getDeliverooLink"
                target="_blank"
                :href="getDeliverooLink"
                ><div class="delivery-icon deliveroo-icon"></div
              ></a>
              <a v-if="getJustEatLink" target="_blank" :href="getJustEatLink"
                ><div class="delivery-icon just-eat-icon"></div
              ></a>
              <a v-if="getUberEatsLink" target="_blank" :href="getUberEatsLink"
                ><div class="delivery-icon uber-eats-icon"></div
              ></a>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { get } from 'lodash';
import { mapGetters } from 'vuex';
import NoSSR from 'vue-no-ssr';
import DeliveryModal from '~/components/iOrder-core/modalsV3/DeliveryModal';
import ModalContainer from '~/components/iOrder-core/modalsV3/ModalContainer';
import distanceBetweenPoints from '@/libs/calculateDistance.js';

export default {
  name: 'RestaurantTile',
  props: ['locationInfo', 'ctas', 'showDistance', 'appName', 'serviceArea'],
  components: {
    NoSSR,
    ModalContainer,
    DeliveryModal
  },
  data() {
    return {
      showModal: false
    };
  },
  methods: {
    setShowModal(modal) {
      this.showModal = modal;
    }
  },
  computed: {
    ...mapGetters({
      userLocation: 'location/userLocation'
    }),
    isOpen() {
      return (
        this.restaurant.openToday &&
        this.restaurant.openToday.toLowerCase() !== 'closed'
      );
    },
    partners() {
      const { getUberEatsLink, getJustEatLink, getDeliverooLink } = this;
      const payload = [];
      if (getUberEatsLink) {
        payload.push({
          name: 'UberEats',
          image: 'icon-ubereats.svg',
          link: getUberEatsLink
        });
      }
      if (getJustEatLink) {
        payload.push({
          name: 'JustEat',
          image: 'icon-justeat.svg',
          link: getJustEatLink
        });
      }
      if (getDeliverooLink) {
        payload.push({
          name: 'Deliveroo',
          image: 'icon-deliveroo.svg',
          link: getDeliverooLink
        });
      }
      return payload;
    },
    hoursColor() {
      const { restaurant } = this;
      const isOpen =
        restaurant.openToday && restaurant.openToday.toLowerCase() !== 'closed';
      return isOpen ? '#087e67' : '#b7253a';
    },
    hasOrder() {
      const { ctas, restaurantSlug } = this;
      const hasOrderCta = ctas.includes('order');
      return !!(hasOrderCta && restaurantSlug);
    },
    hasCollect() {
      const { ctas, restaurantSlug } = this;
      const hasCollectCta = ctas.includes('collect');
      return !!(hasCollectCta && restaurantSlug);
    },
    hasDelivery() {
      const { ctas, restaurantSlug, covidOpen, enableDeliveries } = this;
      const hasDeliveryCta = ctas.includes('delivery');
      return !!(
        covidOpen &&
        enableDeliveries &&
        restaurantSlug &&
        hasDeliveryCta
      );
    },
    covidOpen() {
      const { restaurant } = this;
      return get(restaurant, 'covidOpen');
    },
    enableDeliveries() {
      const { restaurant } = this;
      return get(restaurant, 'enableDeliveries');
    },
    enableCollect() {
      const { restaurant, covidOpen } = this;
      const enabledOnRestaurant = get(restaurant, 'enableClickAndCollect');
      // let closedToday = this.restaurant.openToday === 'Closed'
      // This is purely for COVID situation - checking covidOpen flag
      // if(this.restaurant.covidOpen) closedToday = false
      // *********************************************************** */
      // TODO: add closed at given time, i.e. now? Contentful update needed to enable this
      const payload = covidOpen && enabledOnRestaurant;
      return payload;
    },
    enableOrder() {
      const { restaurant, covidOpen } = this;
      const enabledOnRestaurant = get(restaurant, 'orderAtTable');
      // const openToday = get(restaurant, 'openToday') !== 'Closed'
      // This is purely for COVID situation - checking covidOpen flag
      // if(this.restaurant.covidOpen) closedToday = false
      // *********************************************************** */
      // TODO: add closed at given time, i.e. now? Contentful update needed to enable this
      const payload = !!(covidOpen && enabledOnRestaurant);
      return payload;
    },
    restaurantSlug() {
      const { restaurant } = this;
      return get(restaurant, 'slug');
    },
    restaurant() {
      const { locationInfo } = this;
      if (locationInfo.fields) {
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
        return Object.assign({}, locationInfo.fields, {
          openToday: locationInfo.fields[dayMethods[dayOfTheWeek]]
        });
      } else {
        return locationInfo;
      }
    },
    getBookingLink() {
      if (!this.restaurant.siteId) {
        return '/book';
      }
      return `/book/${this.restaurant.slug}`;
    },
    isV2() {
      return this.restaurant && this.restaurant.ccVersion === 'v2';
    },
    getDeliverooLink() {
      return (
        this.locationInfo.fields && this.locationInfo.fields.deliverooDirectLink
      );
    },
    getJustEatLink() {
      return (
        this.locationInfo.fields && this.locationInfo.fields.justEatDirectLink
      );
    },
    getUberEatsLink() {
      return (
        this.locationInfo.fields && this.locationInfo.fields.uberEatsDirectLink
      );
    },
    hasDeliveryPartner() {
      return (
        this.getDeliverooLink || this.getJustEatLink || this.getUberEatsLink
      );
    },
    isOrderArea() {
      return this.serviceArea === 'OAP';
    },
    distance() {
      const { restaurant, userLocation } = this;
      if (userLocation && userLocation.lat && userLocation.long) {
        return distanceBetweenPoints(
          restaurant.latitude,
          restaurant.longitude,
          userLocation.lat,
          userLocation.long
        );
      }
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/helpers.scss';
@import '~assets/css/variables.scss';
.restaurant-tile-container {
  @include fadeIn();
  margin: 0 16px 2rem;
  background-color: $rebrand-teal-alpha;
  overflow: hidden;
  border-radius: 8px;

  &.grey {
    background-color: $very-light-pink;
  }

  @include whenScreenIs(mdx) {
    margin: 16px;
  }
  span {
    display: block;
  }
  h2 {
    color: $pinkish-red;
    margin: 0px;
    font-size: 18px;
  }
  p {
    margin-bottom: 8px;
  }
  .section-break {
    height: 2px;
    width: 100%;
    background-color: $jungle-green;
    margin: 0;
  }
  .hours {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.25;
    text-align: center;
    color: #2b2929;
    margin: 0;
  }
  .tel-container {
    display: block;
    width: auto;
    text-decoration: none;
    margin: 0 auto;
  }
  .phone {
    margin-top: 12px;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.11;
    text-align: center;
    color: #008257;
    text-decoration: none;
  }
  .link-container {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    margin-top: 16px;
    flex-direction: column;

    .disabled {
      opacity: 0.25;
    }
    .delivery-text {
      padding-top: 8px;
      text-align: center;
      margin-right: 2rem;

      @include whenScreenIs(mdx) {
        display: none;
      }
      @include whenScreenIs(lg) {
        display: block;
      }
    }
    .delivery-icons {
      display: flex;
      flex-direction: row;
      justify-content: center;
      a {
        margin-right: 16px;
        .delivery-icon {
          height: 40px;
          width: 40px;
          background-color: $true-white;
          border-radius: 50%;
        }
        .deliveroo-icon {
          background-image: url('/assets/img/icons/icon-deliveroo.svg');
        }
        .just-eat-icon {
          background-image: url('/assets/img/icons/icon-justeat.svg');
        }
        .uber-eats-icon {
          background-image: url('/assets/img/icons/icon-ubereats.svg');
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
.cc-button {
  border: 0;
  font-family: $navigation-font;
  background-color: $greyish-brown;
  border-radius: 18px;
  padding: 6px 13px;
  color: $white;
  white-space: nowrap;
  display: inline-block;
  font-size: 17px;
  display: flex;
  align-items: center;
  transition: box-shadow 0.2s ease;
  &:hover {
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    cursor: pointer;
  }

  &--delivery {
    background-color: $greyish-brown;

    @include whenScreenIs(mdx) {
      display: none;
    }
  }

  &.disabled {
    opacity: 0.25;
    background-color: $greyish-brown;

    &:hover {
      cursor: not-allowed;
    }
  }
}
.desktop-tile {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  height: 100%;
  .tile-top {
    padding: 15px 0 7px;
    margin: 0 1rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 2px dotted $rebrand-teal;

    &.grey {
      border-bottom: 2px dotted $greyish-brown;
    }

    h2.heading {
      display: inline-block;
      color: $greyish-brown;
      text-align: left;
      font-size: 18px;
    }
    .top-left {
      flex-grow: 1;
    }
    .top-right {
      overflow: hidden;
      text-align: right;
      color: $greyish-brown;
      padding-top: 3px;
      p {
        font-size: 14px;
        margin-bottom: 0;
      }
    }
  }
  .tile-mid {
    display: flex;
    padding: 1rem 1rem 0.5rem;
    justify-content: space-between;

    .mid-left {
      flex-grow: 1;
      display: flex;
      align-items: center;
    }

    .mid-right {
      .directions {
        color: $greyish-brown;
        display: flex;
        align-items: center;
        &__icon {
          margin-right: 0.5rem;
        }
      }
    }
  }
  .tile-bottom {
    display: flex;
    margin-top: auto;
    flex-direction: column;

    @include whenScreenIs(mdx) {
      flex-direction: row;
    }
    .bottom-left {
      padding: 15px 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include whenScreenIs(mdx) {
        align-items: flex-end;
        padding: 15px 1rem;
      }
    }
    .bottom-right {
      display: none;
      flex-direction: row;
      padding: 12px 1rem 15px 0;
      margin-left: auto;

      @include whenScreenIs(mdx) {
        display: flex;
      }

      .delivery-text {
        padding-top: 8px;
        text-align: center;
        margin: 0 2rem;
        font-size: 14px;
        font-weight: 300;
        color: $greyish-brown;
      }
      .delivery-icons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        a {
          margin-right: 5px;
          .delivery-icon {
            height: 40px;
            width: 40px;
            background-color: $true-white;
            border-radius: 50%;
            padding: 5px;
          }
          .deliveroo-icon {
            background-image: url('/assets/img/icons/icon-deliveroo.svg');
          }
          .just-eat-icon {
            background-image: url('/assets/img/icons/icon-justeat.svg');
          }
          .uber-eats-icon {
            background-image: url('/assets/img/icons/icon-ubereats.svg');
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  .hours {
    text-align: left;
    font-size: 14px;
    font-weight: 300;
    white-space: nowrap;
    display: flex;
    &__copy {
      color: $rebrand-teal;
      font-weight: 600;
      margin-right: 0.25rem;
      &.grey {
        color: $greyish-brown;
      }
    }
    &__icon {
      margin-right: 0.5rem;
    }
    &--closed {
      color: $pinkish-red;
      font-weight: 600;
    }
  }
  .card-left {
    display: inline-block;
    float: left;
  }
  .card-right {
    float: right;
    overflow: hidden;
    width: 320px;
    text-align: right;
    .hours {
      text-align: right;
      margin-top: 8px;
      margin-bottom: 10px;
    }
    p {
      margin-top: 16px;
    }
    span.hours,
    span.phone {
      margin-top: 10px;
      margin-right: 0;
    }
    &.link-container {
      margin-top: 0;
      display: flex;
      justify-content: flex-end;
    }
  }

  p.address {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 16px;
    margin-bottom: 28px;
  }
  .phone {
    text-align: left;
    font-size: 18px;
    margin-left: 0;
    color: $black;
  }
}
.cta__icon {
  margin-right: 0.5rem;
}
</style>
