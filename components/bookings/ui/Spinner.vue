<template>
  <NoSSR>
    <div data-component="spinner-overlay">
      <div data-element="spinner-container">
        <img
          data-element="spinner"
          src="~/assets/img/bookings/icons/loader.svg"
          alt="Loading..."
        />
      </div>
    </div>
  </NoSSR>
</template>
<script>
import NoSSR from 'vue-no-ssr';

export default {
  components: {
    NoSSR,
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/helpers.scss';

[data-component='spinner-overlay'] {
  position: relative;
  [data-element='spinner-container'] {
    [data-element='spinner'] {
      animation: spinner 1.75s linear infinite;
      display: block;
      height: 26px;
      margin: 5px auto;
      width: 26px;
    }
    @keyframes spinner {
      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
