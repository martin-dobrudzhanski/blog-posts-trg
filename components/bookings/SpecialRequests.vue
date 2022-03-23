<template>
  <div data-component="special-requests" v-if="hasSpecialRequests">
    <div data-element="special-request-container">
      <Icon icon="user-circle" />
      <p data-element="text">{{ this.$store.state.booking.specialRequest }}</p>
    </div>
  </div>
</template>

<script>
import Icon from '~/components/bookings/ui/Icon';

export default {
  components: {
    Icon
  },
  computed: {
    hasSpecialRequests() {
      return this.$store.state.booking.specialRequest;
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='special-requests'] {
  margin: 0 auto;
  align-items: center;
  width: 100%;
  [data-element='special-request-container'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 0 0;
    [data-component='icon'] {
      margin-right: 8px;
    }
    [data-element='text'] {
      word-break: break-all;
      font-family: $navigation-font;
      color: $greyish-brown;
      font-size: 16px;
    }
  }
}
</style>
