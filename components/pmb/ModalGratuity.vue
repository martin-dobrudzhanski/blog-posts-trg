<template>
  <div class="modal-gratuity">
    <v-slider>
      <the-tip-selection
        key="tip"
        v-if="view === 'tip'"
        @handleTipSelection="handleTipSelection"
        @handleContinue="handleTip"
        @handleCloseModal="$emit('handleCloseModal')"
      />
      <the-details-input
        v-if="view === 'details'"
        @handleContinue="handleDetails"
        @handleCloseModal="$emit('handleCloseModal')"
        :key="1"
      />
      <the-payment-overview
        v-if="view === 'overview'"
        @handleContinue="handlePay"
        @handleCloseModal="$emit('handleCloseModal')"
      />
    </v-slider>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

const TheTipSelection = () => import('@/components/pmb/TheTipSelection')
const TheDetailsInput = () => import('@/components/pmb/TheDetailsInput')
const ThePaymentOverview = () => import('@/components/pmb/ThePaymentOverview')
const VSlider = () => import('@/components/pmb/VSlider')

export default {
  components: {
    TheTipSelection,
    TheDetailsInput,
    ThePaymentOverview,
    VSlider
  },
  data: () => ({
    view: 'tip'
  }),
  methods: {
    ...mapActions({
      setGratuityAmount: 'pay/setGratuityAmount',
      setEmailAddress: 'pay/setEmailAddress'
    }),
    handlePay() {
      this.$emit('handleCloseModal')
    },
    handleTipSelection({ clear, input, percentage }) {
      if (clear) {
        this.setGratuityAmount({ gratuityAmount: null })
        return
      }

      if (percentage || percentage === 0) {
        this.setGratuityAmount({ gratuityAmount: percentage })
      } else if (input) {
        this.setGratuityAmount({ gratuityAmount: input })
      }
    },
    handleTip({ input, percentage }) {
      this.view = 'details'
    },
    handleDetails(emailAddress) {
      this.setEmailAddress({ emailAddress })
      this.view = 'overview'
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-gratuity {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
}
</style>
