<template>
  <nav class="tabs">
    <slot />
  </nav>
</template>

<script>
export default {
  name: 'VTabs',
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.tabs {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: $max-width-desktop;
  margin: 0 auto;

  @include whenScreenIs(xs) {
    max-width: $max-width-tablet;
  }

  @include whenScreenIs(sm) {
    max-width: $max-width-tablet;
  }

  @include whenScreenIs(mdx) {
    max-width: $max-width-mdesktop;
  }

  @include whenScreenIs(lg) {
    max-width: $max-width-desktop;
  }

  /deep/ .tab:not(:last-child) {
    margin-right: 1rem;
  }

  @include whenScreenIs(xs) {
    /deep/ .tab:not(:last-child) {
      margin-right: 0;
    }
  }
}
</style>
