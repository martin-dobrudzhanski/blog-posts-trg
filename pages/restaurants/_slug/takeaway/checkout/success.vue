<template lang="html">
  <section
    class="restaurant-slug-takeaway-checkout-success"
    data-nofooter-fullscreen
  >
    <Spinner data-element="spinner" v-if="!pageReady" />

    <Success
      v-if="pageReady"
      :textTop="content.successTextTop"
      :textBottom="content.successTextBottom"
      :phoneNumber="successData.phoneNumber"
      :centerHeading="`Order details`"
      :location="successData.location"
      :orderRef="successData.orderRef"
      :collectionTime="successData.time"
      :lineItems="successData.basket.lines"
      :getProduct="getProduct"
      :total="successData.total"
      :discount="successData.discount"
      :buttonLink="buttonLink"
      :buttonText="buttonText"
      :basketCount="successData.basketCount"
      :content="content"
      :boxes="content.asideBoxes"
    />
  </section>
</template>

<script>
import { getContent } from '~/libs/templateHelpers.js';
import { mapGetters } from 'vuex';
import meta from '~/mixins/meta';
import Spinner from '~/components/iOrder-core/uiV2/Spinner';
import Success from '~/components/iOrder-core/checkout/Success';
export default {
  components: {
    Spinner,
    Success
  },
  layout: 'clickAndCollect',
  mixins: [meta],
  data() {
    return {
      content: null,
      pageReady: null,
      showDetails: false,
      successData: {}
    };
  },
  async asyncData({ store, params, error }) {
    return getContent(store, `click-and-collect/${params.slug}`, error);
  },
  computed: {
    buttonText() {
      return this.content && this.content.successPageButtonText;
    },
    buttonLink() {
      return this.content && this.content.successPageButtonLink;
    },
    ...mapGetters('clickAndCollect', {
      getLocation: 'getLocation',
      productsDictionary: 'getProductsDictionary'
    })
  },
  methods: {
    init() {
      if (!this.$store.getters['clickAndCollect/hasNecessaryDataToProceed']) {
        this.$nuxt.$router.push({ path: '/takeaway' });
        return;
      }

      const discountAmount =
        (this.$store.getters['iorderCheckout/getPromotionDiscountAmount'] ||
          0) +
        (this.$store.getters['iorderCheckout/getVoucherDiscountAmount'] || 0);

      this.successData = Object.assign(
        {},
        {
          basketCount: this.$store.getters['clickAndCollect/getBasketCount'],
          phoneNumber: this.$store.state.clickAndCollect.location.telephone,
          orderRef: this.$store.state.iorderCheckout.successData.uniqueRef,
          time: this.$store.getters['clickAndCollect/getTime'],
          email: this.$store.state.iorderCheckout.successData.receiptEmail,
          basket: this.$store.getters['clickAndCollect/getBasket'],
          discount: Math.abs(discountAmount),
          total: this.$store.state.iorderCheckout.requiredCheckoutData
            .basketTotal,
          location: this.$store.state.clickAndCollect.location.name
        }
      );
      this.pageReady = true;
    },
    getProduct(productId) {
      return this.productsDictionary[productId] || {};
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.$store.dispatch('clickAndCollect/initState');
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.restaurant-slug-takeaway-checkout-success {
  background-color: #fff;
  overflow-x: hidden;
}
</style>
