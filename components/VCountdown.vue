<template>
  <div class="v-countdown">
    <h2 v-if="title" class="v-countdown__title" v-text="title" />

    <no-ssr>
      <v-countdown-clock
        :end-time="endTime"
        class="v-countdown__clock"
        @finish="$emit('finish')"
      >
        <span slot="process" slot-scope="{ timeObj }" class="clock__items">
          <div class="clock-item">
            <div class="clock-item__data">{{ `0${timeObj.d}` }}</div>
            <div class="clock-item__name">Days</div>
          </div>
          <div class="clock-item">
            <div class="clock-item__data">{{ timeObj.h }}</div>
            <div class="clock-item__name">Hours</div>
          </div>
          <div class="clock-item">
            <div class="clock-item__data">{{ timeObj.m }}</div>
            <div class="clock-item__name">Minutes</div>
          </div>
          <div class="clock-item">
            <div class="clock-item__data">{{ timeObj.s }}</div>
            <div class="clock-item__name">Seconds</div>
          </div>
        </span>
      </v-countdown-clock>
    </no-ssr>

    <nuxt-link
      v-if="linkTo && linkText"
      class="v-countdown__btn btn"
      :to="linkTo"
      >{{ linkText }}</nuxt-link
    >
  </div>
</template>

<script>
import VCountdownClock from '@/components/VCountdownClock'
export default {
  components: {
    VCountdownClock
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    linkTo: {
      type: String,
      default: ''
    },
    linkText: {
      type: String,
      default: ''
    },
    endTime: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.v-countdown {
  background: $green-xmas;
  height: 412px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 8px;

  @media (min-width: 400px) {
    padding: 40px 16px;
  }

  @include whenScreenIs(sm) {
    height: 640px;
    padding-top: 56px;
    padding-bottom: 64px;
  }

  &__title {
    color: $white;
    font-family: $display-font;
    font-size: 42px;
    line-height: 0.86;
    width: 328px;
    text-align: center;

    @include whenScreenIs(sm) {
      font-size: 57px;
      line-height: 0.89;
      width: 550px;
    }
  }

  &__clock {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 27px 0;

    @include whenScreenIs(sm) {
      padding: 56px 0 64px;
    }
  }

  .clock {
    &__items {
      display: flex;
      justify-content: space-between;
      width: 100%;
      max-width: 328px;

      @media (min-width: 400px) {
        max-width: 400px;
      }

      @include whenScreenIs(sm) {
        max-width: 800px;
      }
    }
  }

  .clock-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 67px;

    @media (min-width: 400px) {
      width: 82px;
    }

    @include whenScreenIs(sm) {
      width: 170px;
    }

    &__data {
      height: 67px;
      padding-bottom: 10px;
      width: 100%;
      background-color: $pastel-pink;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: $display-font;
      color: $white;
      font-size: 54.4px;
      line-height: 0.71;

      @include whenScreenIs(sm) {
        height: 170px;
        padding-bottom: 20px;
        font-size: 108px;
      }
    }

    &__name {
      font-family: $display-font;
      color: $white;
      font-size: 20px;
      line-height: 0.89;
      padding-top: 12px;

      @media (min-width: 400px) {
        font-size: 24px;
      }

      @include whenScreenIs(sm) {
        font-size: 47px;
        line-height: 0.89;
      }
    }
  }

  &__btn {
    width: 200px;
    background-color: $white;
    color: $rebrand-red;

    @include whenScreenIs(sm) {
      width: 212px;
    }
  }
}
</style>
