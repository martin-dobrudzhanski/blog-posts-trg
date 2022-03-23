<template>
  <div class="payment-overview">
    <div @click="$emit('handleCloseModal')" class="modal-wrapper__close">
      <img
        src="@/assets/img/generic/icon-close.svg"
        alt="close"
        class="modal-wrapper__close-icon"
      />
    </div>
    <section>
      <div class="payment-overview__container">
        <v-header :title="location.name" :subtitle="`Table ${tableNumber}`" />
        <p v-text="content && content.paymentOverviewText" />
      </div>
      <div class="payment-overview__totals">
        <div class="payment-overview__item">
          <span>Order Total:</span>
          <span>£{{ billTotalFormatted }}</span>
        </div>
        <div class="payment-overview__item" v-if="showPromotion">
          <span>Promotion:</span>
          <span>
            {{ discountFormatted !== '0.00' ? '-' : '' }} £{{
              discountFormatted
            }}
          </span>
        </div>
        <div class="payment-overview__item">
          <span>Tip added:</span>
          <span>£{{ gratuityAmountFormatted }}</span>
        </div>
        <div class="payment-overview__item">
          <span>New Total:</span>
          <span>£{{ finalBalanceFormatted }}</span>
        </div>
      </div>
      <div class="dropin-container"></div>
    </section>
    <section class="payment-overview__footer">
      <v-button
        v-if="showPayButton"
        hasContainer
        :buttonText="content && content.billPageButtonText"
        @buttonClick="submitPayment"
        :disabled="loading || processingPayment"
        :loading="loading || processingPayment"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as dropin from 'braintree-web-drop-in'

const VButton = () => import('@/components/pmb/VButton')
const VHeader = () => import('@/components/pmb/VHeader')

export default {
  components: {
    VButton,
    VHeader
  },
  data: () => ({
    loading: false,
    showPayButton: false
  }),
  computed: {
    ...mapGetters({
      content: 'pay/getContent',
      total: 'pay/getTotal',
      totalIncludingDiscount: 'pay/getTotalIncludingDiscount',
      totalIncludingDiscountAndGratuity:
        'pay/getTotalIncludingDiscountAndGratuity',
      discount: 'pay/getDiscount',
      gratuityAmount: 'pay/getGratuityAmount',
      location: 'pay/getLocation',
      tableNumber: 'pay/getTableNumber',
      braintreeToken: 'pay/getBraintreeToken',
      processingPayment: 'pay/getProcessingPayment'
    }),
    billTotalFormatted() {
      return parseFloat(this.total || 0).toFixed(2)
    },
    discountFormatted() {
      return parseFloat(this.discount || 0).toFixed(2)
    },
    gratuityAmountFormatted() {
      return parseFloat(this.gratuityAmount || 0).toFixed(2)
    },
    finalBalanceFormatted() {
      return parseFloat(this.totalIncludingDiscountAndGratuity || 0).toFixed(2)
    },
    showPromotion() {
      return this.discount !== 0
    }
  },
  methods: {
    ...mapActions({
      processPayment: 'pay/processPayment',
      paymentFailure: 'pay/setPaymentResult'
    }),
    async submitPayment() {
      this.instance.requestPaymentMethod(this.handlePaymentSubmit)
      this.loading = true
    },
    async handlePaymentSubmit(requestPaymentMethodErr, payload) {
      if (requestPaymentMethodErr) {
        this.paymentFailure({ paymentResult: 'failure' })
        this.$router.push('/paymybill/failure')
        this.instance.clearSelectedPaymentMethod()
        return
      }
      this.submitPaymentToPos(payload)
    },
    async submitPaymentToPos(payload) {
      await this.processPayment({
        ...payload
      })
      this.loading = false
      this.$emit('handleContinue')
    },
    async init() {
      const token = this.braintreeToken
      const total = this.totalIncludingDiscountAndGratuity.toString()
      const btName = 'Pay My Bill'
      const location = this.location
      const recipientName = this.tableNumber
        ? `S2S Table ${this.tableNumber}, ${location.title}`
        : `S2S ${location.title}`
      dropin
        .create({
          paymentOptionPriority: [
            'applePay',
            'card',
            // 'googlePay',
            'paypal'
          ],
          authorization: token,
          container: '.dropin-container',
          dataCollector: {
            kount: true
          },
          threeDSecure: {
            amount: total
          },
          paypal: {
            displayName: btName,
            amount: total,
            flow: 'checkout',
            intent: 'sale',
            currency: 'GBP',
            local: 'en_GB',
            buttonStyle: {
              shape: 'rect',
              size: 'responsive'
            },
            commit: true,
            enableShippingAddress: true,
            shippingAddressEditable: false,
            shippingAddressOverride: {
              recipientName,
              countryCode: 'GB',
              line1: location.street || 'Chiquito',
              city: location.city || '',
              postalCode: location.postalCode || 'TestSite',
              state: location.region || ''
            }
          },
          applePay: {
            displayName: btName,
            paymentRequest: {
              total: {
                label: 'Basket Total',
                amount: total
              }
            }
          },
          // googlePay: {
          //   googlePayVersion: 2,
          //   merchantId: process.env.GOOGLE_PAY_MERCHANT_ID,
          //   transactionInfo: {
          //     totalPriceStatus: 'FINAL',
          //     totalPrice: total,
          //     currencyCode: 'GBP'
          //   }
          // }
        })
        .then(instance => {
          this.instance = instance
          instance.on('paymentOptionSelected', ({ paymentOption }) => {
            const paymentMethodRequestable = this.instance.isPaymentMethodRequestable()
            this.showPayButton = false
            if (paymentOption === 'card' && paymentMethodRequestable) {
              this.showPayButton = true
              this.loading = false
            }
          })
          instance.on(
            'paymentMethodRequestable',
            ({ paymentMethodIsSelected, type }) => {
              if (paymentMethodIsSelected && type !== 'CreditCard') {
                this.submitPayment()
                this.loading = true
              }
              this.showPayButton = true
              this.loading = false
            }
          )
          instance.on('noPaymentMethodRequestable', () => {
            this.showPayButton = false
          })
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err)
        })
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.payment-overview {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow-y: scroll;
  width: 100%;

  > section {
    &:first-child {
      overflow-y: scroll;
      padding-bottom: 80px;
    }
    &:last-child {
      z-index: 10;
    }
  }

  &__container {
    padding: 0 16px;
  }

  &__heading {
    @extend .pmb-heading;
  }

  &__content {
    margin: 0 16px 170px;
  }

  &__totals {
    background-color: $white-two;
    margin: 24px 0 0;
    padding: 8px 16px;
  }

  &__item {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 12px 0;

    span {
      font-size: 16px;
    }
  }

  .dropin-container {
    margin: 16px;
  }

  &__footer {
    background-color: #fff;
    bottom: 0;
    text-align: center;
    width: 100%;

    &-link {
      @extend .pmb-link;
      margin-bottom: 8px;
    }
  }
}
</style>
