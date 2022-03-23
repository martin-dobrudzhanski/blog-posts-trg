<template>
  <div
    data-component="booking-info"
    :data-summary="summary"
    :class="{ block: isBlock }"
  >
    <div data-element="info-block" data-info="location" :data-summary="summary">
      <Icon icon="location" size="sm" />
      <a :href="getLocationUrl" data-element="text" target="_blank">
        <p data-location>
          {{ $store.getters['booking/getPrettyLocationQuery'] }}
        </p>
      </a>
    </div>
    <div data-element="info-block" :data-summary="summary">
      <Icon icon="user" size="sm" />
      <p data-element="text">{{ $store.getters['booking/getNumPeople'] }}</p>
    </div>
    <div data-element="info-block" :data-summary="summary">
      <Icon icon="calendar" size="sm" />
      <p data-element="text">{{ $store.getters['booking/getPrettyDate'] }}</p>
    </div>
    <div data-element="info-block" :data-summary="summary">
      <Icon icon="clock-circle" size="sm" />
      <p data-element="text">
        {{ $store.getters['booking/getTime'] }}
      </p>
    </div>
    <BaseButton
      v-if="!summary"
      size="medium"
      class="info-block__cta"
      @click.native="$store.dispatch('booking/showAddEventModal')"
    >
      Add to calendar
    </BaseButton>
  </div>
</template>

<script>
import BaseButton from '~/components/buttons/BaseButton';
import Icon from '~/components/bookings/ui/Icon';

export default {
  components: {
    BaseButton,
    Icon
  },
  props: ['summary', 'isBlock'],
  computed: {
    getLocationUrl() {
      return `https://maps.google.com/?ll=${this.$store.state.booking.location.latitude},${this.$store.state.booking.location.longitude}`;
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='booking-info'] {
  display: flex;
  color: $greyish-brown;
  font-family: $navigation-font;
  font-size: 18px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 28px 16px 14px;
  width: 328px;
  &[data-summary] {
    padding: 1rem 0 0 24px;
  }
  @include whenScreenIs(sm) {
    justify-content: flex-start;
    padding: 1rem 0 0;
    &[data-summary] {
      width: 100%;
      padding-right: 1rem;
      padding-left: 1rem;
    }
  }
  &[data-summary] {
    flex-direction: column;
    flex-wrap: nowrap;
  }
  [data-element='info-block'] {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0 16px 16px 0;
    &[data-info='location'] {
      display: flex;
      margin-bottom: 20px;
      margin-right: 0;
      padding-left: 4px;
      @include whenScreenIs(sm) {
        width: 100%;
        justify-content: flex-start;
      }
      &[data-summary] {
        margin-bottom: 16px;
      }
      @include whenScreenIs(sm) {
        padding: 0;
      }
      [data-component='icon'] {
        margin: 0;
        @include whenScreenIs(sm) {
          margin-right: 8px;
        }
      }
      [data-element='text'] {
        line-height: 1;
        width: 225px;
        [data-location] {
          text-align: left;
          margin-left: 16px;
          font-weight: normal;
          @include whenScreenIs(sm) {
            margin-left: 0;
          }
        }
        @include whenScreenIs(sm) {
          font-size: 18px;
          font-weight: bold;
          width: auto;
        }
      }
    }
    [data-component='icon'] {
      margin-right: 8px;
    }
    [data-element='text'] {
      font-size: 18px;
      color: $greyish-brown;
      font-weight: normal;
      margin-top: 3px;
    }
  }
}
.block {
  display: block;
}
.info-block {
  &__cta {
    margin: auto;
  }
}
</style>
