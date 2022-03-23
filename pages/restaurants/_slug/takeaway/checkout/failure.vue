<template>
  <section class="checkout-failure-page" data-nofooter-fullscreen>
    <PaymentFailure />
  </section>
</template>

<script>
import { getContent } from '~/libs/templateHelpers.js';
import meta from '~/mixins/meta';
import PaymentFailure from '~/components/iOrder/payment/PaymentFailure';

export default {
  mixins: [meta],
  components: {
    PaymentFailure
  },
  async asyncData({ store, params, error }) {
    return getContent(store, `click-and-collect/${params.slug}`, error);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
.checkout-failure-page {
  background-color: #fff;
  [data-position='center'] {
    width: 300px;
    margin: 0 auto;
  }
}
</style>
