<template>
  <component
    :is="getWrapperElementTag"
    data-component="booking-link"
    :to="href"
    :href="href"
    :data-size="size"
    :target="getTarget"
    :data-twin="twin"
  >
    <p data-element="text" :data-size="size">{{ text }}</p>
  </component>
</template>

<script>
export default {
  props: ['text', 'href', 'size', 'link', 'external', 'twin'],
  computed: {
    getTarget() {
      if (!this.external) {
        return false;
      }
      return '_blank';
    },
    getWrapperElementTag() {
      if (this.external === true) {
        return 'a';
      }
      if (this.link === true) {
        return 'nuxt-link';
      }
      return 'div';
    },
  },
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='booking-link'] {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &[data-twin] {
    width: 50%;
  }
  [data-element='text'] {
    color: $jungle-green;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.33;
    text-decoration: underline;
    &[data-size='sm'] {
      font-size: 12px;
      font-weight: 500;
      @include whenScreenIs(sm) {
        font-size: 16px;
        line-height: 1.13;
      }
    }
  }
}
</style>
