<template>
  <div data-element="outer-container" class="outer-container">
    <div data-element="inner-container" class="inner-container">
      <div data-component="info-block" class="info-block">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoBlock'
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-element='outer-container'] {
  width: 314px;
  height: 50vh;
  position: relative;
  margin-top: 6px;
  [data-element='inner-container'] {
    position: absolute;
    left: 0;
    padding: 5rem;
    margin: -5rem;
    [data-component='info-block'] {
      width: 314px;
      border-bottom: 1px solid $very-light-pink;
      min-height: 188px;
      background-color: #f8f8f8;
    }
  }
}
</style>
