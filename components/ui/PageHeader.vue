<template>
  <div
    :class="[
      'page-header',
      { 'page-header--negative-margin': withNegativeMargin },
    ]"
    :style="{
      backgroundImage: `url(${backgroundImageUrl})`,
    }"
  />
</template>

<script>
import get from 'lodash.get';

import defaultHeader from '@/assets/img/background/header_default.jpg';

export default {
  name: 'PageHeader',
  props: {
    image: {
      type: Object,
      default: null,
    },
    withNegativeMargin: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    backgroundImageUrl() {
      return get(this.image, 'file.url', '') || defaultHeader;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.page-header {
  width: 100%;
  height: 20rem;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  &--negative-margin {
    margin-bottom: -3.25rem; // Allows the nav to overlay the image
  }
}
</style>
