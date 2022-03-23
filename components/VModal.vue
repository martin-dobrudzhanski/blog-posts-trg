<template>
  <div class="v-modal">
    <div class="v-modal__header">
      <img
        class="header__close"
        src="@/assets/img/iorder-coreV2/icons/close.svg"
        @click="$emit('close')"
      />
    </div>
    <div class="v-modal__body">
      <h1 v-if="title" class="body__title" v-text="title" />
      <p v-if="textFirst" class="body__text-first" v-text="textFirst" />
      <p v-if="textSecond" class="body__text-second" v-text="textSecond" />
      <button v-if="btnText" class="body__btn btn" @click="$emit('btn-click')">
        {{ btnText }}
      </button>
    </div>
    <img class="v-modal__background-left" src="./../assets/img/holly.svg" />
    <img class="v-modal__background-right" src="./../assets/img/holly.svg" />
    <img class="snowflake__top-left" src="./../assets/img/snowflake.svg" />
    <img class="snowflake__top-right" src="./../assets/img/snowflake.svg" />
    <img class="snowflake__bottom-left" src="./../assets/img/snowflake.svg" />
    <img class="snowflake__bottom-right" src="./../assets/img/snowflake.svg" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    textFirst: {
      type: String,
      default: ''
    },
    textSecond: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.v-modal {
  width: 100%;
  height: 100%;
  background-color: $green-xmas;
  position: relative;
  overflow: hidden;

  @include whenScreenIs(sm) {
    width: 504px;
    height: 500px;
  }

  &__header,
  &__body {
    padding: 16px;
    display: flex;
  }

  &__header {
    width: 100%;
    justify-content: flex-end;
  }

  .header {
    &__close {
      width: 24px;
      height: 24px;
      cursor: pointer;
      z-index: 10;
    }
  }

  &__body {
    flex-direction: column;
    align-items: center;

    @include whenScreenIs(sm) {
      padding-top: 0;
    }
  }

  .body {
    &__title,
    &__text-first,
    &__text-second {
      text-transform: uppercase;
      font-family: $display-font;
      text-align: center;
      z-index: 20;
    }

    &__title {
      color: $white;
      width: 266px;
      font-size: 68px;
      line-height: 0.71;
      padding-top: 10px;

      @include whenScreenIs(sm) {
        padding-top: 0;
      }
    }

    &__text-first,
    &__text-second {
      color: $charcoal;
      font-size: 38px;
      line-height: 0.89;
      padding-top: 26px;
      width: 100%;
      max-width: 328px;
    }

    &__btn {
      margin-top: 64px;
      width: 212px;
      background-color: $white;
      color: $rebrand-red;

      @include whenScreenIs(sm) {
        margin-top: 48px;
      }
    }
  }

  &__background-left,
  &__background-right {
    position: absolute;
    bottom: 4px;
    z-index: 5;
  }

  &__background-left {
    left: 4px;
  }

  &__background-right {
    right: 4px;
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
  }

  .snowflake__top-left,
  .snowflake__top-right,
  .snowflake__bottom-left,
  .snowflake__bottom-right {
    position: absolute;
    width: 40%;
    z-index: 1;
  }

  .snowflake__top-left,
  .snowflake__top-right {
    top: -50px;

    @include whenScreenIs(sm) {
      top: -100px;
    }
  }

  .snowflake__top-left,
  .snowflake__bottom-left {
    left: -30px;
  }

  .snowflake__top-right,
  .snowflake__bottom-right {
    right: -30px;
  }

  .snowflake__bottom-left,
  .snowflake__bottom-right {
    bottom: -50px;

    @include whenScreenIs(sm) {
      bottom: -100px;
    }
  }
}
</style>
