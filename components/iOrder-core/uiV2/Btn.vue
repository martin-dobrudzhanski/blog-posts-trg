<template>
  <div
    data-component="btn"
    :data-static-toggle="verticallyResponsiveFullWidthToggle"
  >
    <nuxt-link
      data-element="btn"
      v-if="link"
      :to="href"
      :data-size="size"
      :data-inverse="inverse"
      :data-loading="loading"
      :data-colour="colour"
      :class="{ inactive: inactive }"
    >
      <span v-if="!loading" data-element="text">{{ text }}</span>
      <div class="loader white inverse" v-else></div>
    </nuxt-link>
    <button
      v-else
      data-element="btn"
      :data-size="size"
      :data-inverse="inverse"
      :data-loading="loading"
      :data-colour="colour"
      :class="{ inactive: inactive }"
      :disabled="inactive || loading"
    >
      <div data-element="text-container">
        <span v-if="!loading" data-element="text">{{ text }}</span>
        <div class="loader white inverse" v-else></div>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  props: [
    'text',
    'link',
    'href',
    'size',
    'inactive',
    'loading',
    'inverse',
    'colour',
    'verticallyResponsiveFullWidthToggle',
  ],
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='btn'] {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  @include whenScreenIs(sm) {
    display: flex;
    justify-content: center;
  }
  &[data-static-toggle] {
    [data-element='btn'] {
      &[data-size] {
        @media only screen and (max-height: 542px) {
          margin: 0;
          width: 100%;
        }
      }
    }
  }
  [data-element='btn'] {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 100%;
    color: #ffffff;
    background: $rebrand-blue;
    font-family: $secondary-body-font;
    font-weight: normal;
    border: none;
    text-transform: uppercase;
    @include whenScreenIs(sm) {
      max-width: 336px;
    }
    &[data-colour='booger'] {
      background-color: $booger-green;
    }
    &[data-colour='transparent'] {
      background-color: transparent;
      border: 1px solid $rebrand-blue;
      color: $rebrand-blue;
      &:hover {
        background-color: $rebrand-green;
        color: $white;
      }
    }
    &[data-colour='white-black'] {
      color: #000;
      background-color: #fff;
    }
    &:hover {
      cursor: pointer;
    }
    &[data-size='md'] {
      width: calc(100% - 32px);
      margin: 0 16px;
      @include whenScreenIs(sm) {
        width: 336px;
      }
    }
    &[data-size='sm'] {
      height: 50px;
      width: 72px;
      @include whenScreenIs(sm) {
        height: 48px;
      }
      @media (max-width: 370px) {
        width: 65px;
      }
    }
    &[data-inverse] {
      background: #fff;
      border: 1px solid $rebrand-blue;
      color: $rebrand-blue;
      &:hover {
        color: #fff;
      }
    }
    &[data-loading] {
      background-color: $rebrand-green;
    }
    &.inactive {
      opacity: 0.3;
      pointer-events: none;
      &:hover {
        cursor: default;
      }
    }
    // Need this for Safari 10 flexbox button bug:
    [data-element='text-container'] {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    [data-element='text'] {
      text-align: center;
      line-height: 1.2;
      font-size: 20px;
      font-weight: normal;
    }
    outline: none;
    &:hover {
      cursor: pointer;
      @include whenScreenIs(sm) {
        background-color: $rebrand-green;
      }
    }
    &:focus,
    &:active {
      background-color: $rebrand-green;
    }
  }
}
</style>
