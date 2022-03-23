<template>
  <div data-component="booking-header" :data-inverse="inverse">
    <h2 data-element="text" :data-size="size" :data-inverse="inverse">
      {{ text }}
    </h2>
  </div>
</template>

<script>
export default {
  props: ['text', 'size', 'inverse']
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='booking-header'] {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  width: 100%;
  &[data-inverse] {
    background: transparent;
  }
  [data-element='text'] {
    width: 80%;
    color: $greyish-brown;
    font-size: 48px;
    font-weight: normal;
    line-height: 1.2;
    text-align: center;
    font-family: $display-font;
    text-transform: uppercase;
    &[data-inverse] {
      color: $rebrand-green;
    }
    &[data-size='sm'] {
      font-size: 20px;
      @include whenScreenIs(sm) {
        width: 432px;
      }
    }
    @include whenScreenIs(xs) {
      width: 328px;
    }
    @include whenScreenIs(sm) {
      width: 610px;
    }
  }
}
</style>
