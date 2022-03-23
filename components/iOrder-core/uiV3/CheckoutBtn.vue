<template>
  <div
    data-element="checkout-btn-container"
    :data-size="containerSize"
    :class="{ mobile }"
  >
    <nuxt-link
      data-component="btn"
      v-if="href"
      :to="href"
      :data-size="size"
      :class="{ inactive: inactive }"
    >
      <div data-element="quantity-container">
        <Icon
          v-if="!inactive"
          icon="bag"
          :class="{ jiggle: animateBasket }"
          size="sm"
          data-element="icon"
          data-position="left"
        />
        <span v-if="!inactive" data-element="quantity">
          {{ basketCount }}
        </span>
      </div>
      <span data-element="text" v-if="!loading">
        {{ text }}
      </span>
      <div class="loader inverse" v-else></div>
      <span v-if="!inactive" data-element="price"> {{ basketTotal }} </span>
    </nuxt-link>
    <div
      v-else
      data-component="btn"
      @click="handleClick"
      :class="{ inactive: inactive }"
    >
      <div data-element="quantity-container">
        <Icon
          v-if="!inactive"
          icon="bag"
          :class="{ jiggle: animateBasket }"
          size="sm"
          data-element="icon"
          data-position="left"
        />
        <span v-if="!inactive" data-element="quantity">
          {{ basketCount }}
        </span>
      </div>
      <span data-element="text" v-if="!loading">
        {{ text }}
      </span>
      <div class="loader inverse" v-else></div>
      <span v-if="!inactive" data-element="price"> £{{ basketTotal }} </span>
    </div>
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';

export default {
  data() {
    return {
      animateBasket: false
    };
  },
  props: [
    'href',
    'size',
    'text',
    'inactive',
    'basketTotal',
    'basketCount',
    'containerSize',
    'handleClick',
    'loading',
    'mobile'
  ],
  components: {
    Icon
  },
  watch: {
    basketCount() {
      this.animateBasket = true;
      setTimeout(() => {
        this.animateBasket = false;
      }, 500);
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-element='checkout-btn-container'] {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 456px;
  &.mobile {
    max-width: none;
    margin: 1rem 0 2rem;
  }
  background-color: transparent;
  cursor: pointer;
  margin-top: auto;
  &[data-size='md'] {
    padding: 8px 16px;
  }
  @include whenScreenIs(sm) {
    display: flex;
    justify-content: center;
  }
  [data-component='btn'] {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    width: 100%;
    color: $white;
    background: $greyish-brown;
    border: none;
    padding: 0 16px;
    border-radius: 40px;
    transition: box-shadow 0.2s ease;

    &[data-size='md'] {
      width: calc(100% - 32px);
      margin: 0 16px;
      @include whenScreenIs(sm) {
        width: 208px;
      }
    }
    &[data-size='sm'] {
      height: 50px;
      width: 72px;
      @include whenScreenIs(sm) {
        height: 48px;
      }
    }
    &.inactive {
      opacity: 0.3;
      pointer-events: none;
    }
    [data-element='quantity-container'] {
      display: flex;
      align-items: baseline;
      [data-element='icon'] {
        margin-right: 4px;
      }
      [data-element='quantity'] {
        font-family: $navigation-font;
        font-size: 13px;
        background-color: $mac-and-cheese;
        color: $greyish-brown;
        padding-top: 1px;
        border-radius: 50%;
        height: 16px;
        width: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: -10px;
      }
    }
    [data-element='text'] {
      text-align: center;
      line-height: 1.33;
      font-family: $navigation-font;
      font-size: 20px;
      margin-left: 1.5rem;
    }
    [data-element='price'] {
      font-family: $font;
      font-size: 18px;
    }
    outline: none;
    &:hover {
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      cursor: pointer;
    }
    &:focus,
    &:active {
      background-color: $greyish-brown;
    }
  }
}
</style>
