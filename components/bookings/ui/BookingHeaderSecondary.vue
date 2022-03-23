<template>
  <div data-component="booking-header-secondary">
    <h3 data-element="text">{{ text }}</h3>
    <p data-element="data">{{ data }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='booking-header-secondary'] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: $navigation-font;
  color: $greyish-brown;
  width: 100%;
  margin-bottom: 1.5rem;
  border-radius: 1.5rem;
  [data-element='text'] {
    font-size: 18px;
    line-height: 1.33;
    padding-bottom: 8px;
  }
  [data-element='data'] {
    font-size: 20px;
    line-height: 0.8;
  }
}
</style>
