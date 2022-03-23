<template>
  <form data-component="payment-buttons" @submit.prevent="submitPayment">
    <div data-element="form-row">
      <div id="dropin-container"></div>
      <PaymentSecurityIcons />
      <BaseButton v-if="showPayButton" class="payment-btn" size="medium">
        Pay Now
      </BaseButton>
    </div>
  </form>
</template>

<script>
import * as dropin from 'braintree-web-drop-in';
import BaseButton from '@/components/buttons/BaseButton';
import PaymentSecurityIcons from '~/components/iOrder/PaymentSecurityIcons';

export default {
  name: 'PaymentButtons',
  components: {
    BaseButton,
    PaymentSecurityIcons
  },
  props: [
    'options',
    'successcb',
    'failurecb',
    'salesData',
    'applicationName',
    'tableNumber',
    'location'
  ],
  data() {
    return {
      showPayButton: false,
      loading: false
    };
  },
  methods: {
    async submitPayment() {
      this.instance.requestPaymentMethod(this.handlePaymentSubmit);
      this.loading = true;
    },
    async handlePaymentSubmit(requestPaymentMethodErr, payload) {
      if (requestPaymentMethodErr) {
        this.instance.clearSelectedPaymentMethod();
        return;
      }
      this.submitPaymentToPos(payload);
    },
    async authenitcateUser() {
      this.$store.dispatch('iorderCheckout/hideModal');
      this.$store.dispatch('iorderAuth/showLoginModal');
    },
    async submitPaymentToPos(payload) {
      const payment = await this.$store.dispatch(
        'iorderCheckout/makeBraintreePayment',
        {
          salesData: this.salesData,
          user: this.$store.getters['iorderAuth/getCurrentUser'],
          ...payload
        }
      );
      if (payment.success) {
        this.successcb();
        return;
      }
      if (payment.status === 'authRequired') {
        this.authenitcateUser();
        return;
      }
      this.failurecb();
    },
    async init() {
      const token = this.options.btToken;
      const total = this.options.basketTotal.toString();
      const btName = this.applicationName;
      const location = this.location;
      const recipientName = this.tableNumber
        ? `S2S Table ${this.tableNumber}, ${location.title}`
        : `S2S ${location.title}`;
      dropin
        .create({
          paymentOptionPriority: ['applePay', 'paypal', 'card'],
          authorization: token,
          container: '#dropin-container',
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
          }
        })
        .then(instance => {
          this.instance = instance;
          instance.on('paymentOptionSelected', ({ paymentOption }) => {
            const paymentMethodRequestable = this.instance.isPaymentMethodRequestable();
            this.showPayButton = false;
            if (paymentOption === 'card' && paymentMethodRequestable) {
              this.showPayButton = true;
            }
          });
          instance.on(
            'paymentMethodRequestable',
            ({ paymentMethodIsSelected, type }) => {
              if (paymentMethodIsSelected && type !== 'CreditCard') {
                this.submitPayment();
                this.loading = true;
              }
              this.showPayButton = true;
            }
          );
          instance.on('noPaymentMethodRequestable', () => {
            this.showPayButton = false;
          });
        })
        .catch(err => {
          console.log(err);
          this.$store.dispatch('iorderCheckout/hideModal');
        });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.payment-btn {
  margin: 1rem auto;
}
</style>
