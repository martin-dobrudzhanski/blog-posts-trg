<template>
  <div class="success">
    <v-page :loading="loading || !paymentResult">
      <PaymentSuccess />
    </v-page>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import hidefooter from '~/mixins/hidefooter'
import hidePrivacyBanners from '~/mixins/hidePrivacyBanners'
import meta from '~/mixins/meta'

const PaymentSuccess = () => import('@/components/pmb/PaymentSuccess')
const VPage = () => import('@/components/pmb/VPage')

export default {
  name: 'result',
  components: {
    PaymentSuccess,
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

.success {
  height: 100%;
  width: 100%;
  background-color: $white;
}
</style>
