<template>
  <div class="result" :class="{ '--loading': isLoading }">
    <v-page :loading="isLoading">
      <component :is="getComponent" />
    </v-page>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import hidefooter from '~/mixins/hidefooter'
import hidePrivacyBanners from '~/mixins/hidePrivacyBanners'
import meta from '~/mixins/meta'

const PaymentFailure = () => import('@/components/pmb/PaymentFailure')
const PaymentSuccess = () => import('@/components/pmb/PaymentSuccess')
const VPage = () => import('@/components/pmb/VPage')

export default {
  name: 'result',
  components: {
    PaymentFailure,
    PaymentSuccess,
    VPage
  },
  mixins: [hidefooter, hidePrivacyBanners, meta],
  computed: {
    ...mapGetters({
      content: 'pay/getContent',
      paymentResult: 'pay/getPaymentResult'
    }),
    getComponent() {
      if (this.paymentResult === 'success') {
        return 'PaymentSuccess'
      }
      return 'PaymentFailure'
    },
    isLoading() {
      return this.paymentResult === null
    }
  },
  methods: {
    ...mapActions({
      getContent: 'pay/contentRequest'
    })
  },
  mounted() {
    if (!this.content) {
      this.getContent()
    }

    if (!this.paymentResult) {
      this.$router.push('/pay')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.result {
  height: 100%;
  width: 100%;
  background-color: $white;

  &.--loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
