<template>
  <div class="failure">
    <v-page :loading="loading || !paymentResult">
      <PaymentFailure />
    </v-page>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import hidefooter from '~/mixins/hidefooter'
import hidePrivacyBanners from '~/mixins/hidePrivacyBanners'
import meta from '~/mixins/meta'

const PaymentFailure = () => import('@/components/pmb/PaymentFailure')
const VPage = () => import('@/components/pmb/VPage')

export default {
  name: 'result',
  components: {
    PaymentFailure,
    VPage
  },
  mixins: [hidefooter, hidePrivacyBanners, meta],
  computed: {
    ...mapGetters({
      content: 'pay/getContent',
      loading: 'pay/getContentIsLoading',
      paymentResult: 'pay/getPaymentResult'
    })
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

.failure {
  height: 100%;
  width: 100%;
  background-color: $white;
}
</style>
