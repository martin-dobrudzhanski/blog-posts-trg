<template>
  <section class="restaurant-tile-container">
    <div class="mobile-tile">
      <h2 class="heading" data-size="md" data-weight="bold">
        {{ restaurant.title }}
      </h2>
      <p class="distance center">
        {{ restaurant.distance | distance }} miles away
      </p>

      <span class="section-break"></span>
      <span class="hours">Open today {{ restaurant.openToday }}</span>
      <a class="tel-container" :href="`tel:${restaurant.telephone}`">
        <span class="phone">{{ restaurant.telephone }}</span>
      </a>

      <div class="link-container">
        <!-- mobile = new tab -->
        <a
          v-if="!isV2"
          class="btn link link-view"
          data-size="lg"
          :href="
            `https://clickandcollect.omnifitrgsites.co.uk/chiquito.html#/locations/${(restaurant &&
              restaurant.zonalSiteId) ||
              ''}`
          "
          target="_blank"
        >
          Click and Collect
        </a>
        <nuxt-link
          v-else
          class="btn link link-view"
          data-size="lg"
          :to="`/restaurants/${(restaurant && restaurant.slug) || ''}/takeaway`"
        >
          Click and Collect
        </nuxt-link>
        <p v-if="hasDeliveryPartner" class="delivery-text">
          or select a delivery partner
        </p>
        <div class="delivery-icons">
          <a v-if="getDeliverooLink" target="_blank" :href="getDeliverooLink"
            ><div class="delivery-icon deliveroo-icon"></div
          ></a>
          <a v-if="getJustEatLink" target="_blank" :href="getJustEatLink"
            ><div class="delivery-icon just-eat-icon"></div
          ></a>
          <a v-if="getUberEatsLink" target="_blank" :href="getUberEatsLink"
            ><div class="delivery-icon uber-eats-icon"></div
          ></a>
        </div>
      </div>
    </div>

    <div class="desktop-tile">
      <div class="tile-top">
        <h2 class="heading" data-size="md" data-weight="bold">
          {{ restaurant.title }}
        </h2>
        <div class="top-right">
          <p class="distance">
            {{ restaurant.distance | distance }} miles away
          </p>
          <span class="hours">Open today {{ restaurant.openToday }}</span>
        </div>
      </div>

      <span class="section-break"></span>

      <div class="tile-bottom">
        <div class="bottom-left">
          <a class="tel-container" :href="`tel:${restaurant.telephone}`">
            <span class="phone">{{ restaurant.telephone }}</span>
          </a>

          <p class="address">
            {{ restaurant.street }}, {{ restaurant.city }},
            {{ restaurant.postal_code || restaurant.postalCode }}
          </p>
        </div>
        <div class="bottom-right">
          <a
            v-if="!isV2"
            class="btn link link-view"
            data-size="lg"
            :href="
              `https://clickandcollect.omnifitrgsites.co.uk/chiquito.html#/locations/${(restaurant &&
                restaurant.zonalSiteId) ||
                ''}`
            "
          >
            Click and Collect
          </a>
          <nuxt-link
            v-else
            class="btn link link-view"
            data-size="lg"
            :to="
              `/restaurants/${(restaurant && restaurant.slug) || ''}/takeaway`
            "
          >
            Click and Collect
          </nuxt-link>
          <p v-if="hasDeliveryPartner" class="delivery-text">
            or select a delivery partner
          </p>
          <div class="delivery-icons">
            <a v-if="getDeliverooLink" target="_blank" :href="getDeliverooLink"
              ><div class="delivery-icon deliveroo-icon"></div
            ></a>
            <a v-if="getJustEatLink" target="_blank" :href="getJustEatLink"
              ><div class="delivery-icon just-eat-icon"></div
            ></a>
            <a v-if="getUberEatsLink" target="_blank" :href="getUberEatsLink"
              ><div class="delivery-icon uber-eats-icon"></div
            ></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['locationInfo'],
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
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/helpers.scss';
@import '~assets/css/variables.scss';
.restaurant-tile-container {
  @include fadeIn();
  margin: 0 16px 8px;
  background-color: $white;
  padding: 0 8px;
  .mobile-tile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    @include whenScreenIs(mdx) {
      display: none;
    }
  }
  @include whenScreenIs(mdx) {
    margin: 16px;
  }
  span {
    display: block;
  }
  h2 {
    color: $black;
    margin: 8px 0px;
    font-size: 16px;
    font-weight: normal;
  }
  p {
    margin-bottom: 8px;
  }
  .section-break {
    height: 2px;
    width: 100%;
    background-color: $rebrand-orange;
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
  }
  .phone {
    margin-top: 12px;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.13;
    text-align: center;
    color: $black;
    text-decoration: none;
  }
  .distance {
    font-weight: bold;
  }
  .link-container {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    margin-top: 16px;
    flex-direction: column;
    .delivery-text {
      padding-top: 8px;
      text-align: center;
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

.desktop-tile {
  padding: 0 20px;
  display: none;
  height: 204px;
  overflow: hidden;
  @include whenScreenIs(mdx) {
    display: flex;
    flex-direction: column;
  }
  .tile-top {
    h2.heading {
      display: inline-block;
      margin-bottom: 8px;
      margin-top: 16px;
    }
    .top-right {
      float: right;
      overflow: hidden;
      padding-top: 16px;
      width: 320px;
      text-align: right;
      .hours {
        text-align: right;
        margin-top: 8px;
        margin-bottom: 10px;
      }
    }
  }
  .tile-bottom {
    .bottom-left {
      float: left;
    }
    .bottom-right {
      display: flex;
      flex-direction: column;
      float: right;
      padding-top: 12px;
      text-align: right;
      width: 212px;
      .btn {
        width: 212px;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        @include whenScreenIs(mdx) {
          font-size: 14px;
          line-height: 13px;
        }
      }
      .delivery-text {
        padding-top: 8px;
        text-align: center;
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
  }
}
</style>
