<template>
  <transition name="slide-up-fade" mode="out-in">
    <div data-component="iorder-checkout-modal">
      <div class="white-circle">
        <Icon
          class="close-icon"
          :icon="'close-modal'"
          clickable="true"
          @click.native="$store.dispatch('iorderAuth/hideModal')"
        />
      </div>
      <header data-element="subheading">
        <h2 data-element="restaurant-name">{{ $parent.$props.headertext }}</h2>
        <h3 data-element="table-number" v-if="tableNumber">
          Table {{ tableNumber }}
        </h3>
      </header>

      <div data-element="text-block">
        If you are purchasing alcohol, you are agreeing that you and the
        intended consumer are over 18. If you cannot produce valid ID on
        request, you will not receive or be refunded for the alcohol purchased.
      </div>
      <img
        data-element="drinkaware-info"
        src="~assets/img/iorder/drink-aware.svg"
        alt="Drinkaware infographic"
      />

      <div data-element="payment-discount" v-if="discountCopy">
        {{ discountCopy }}
      </div>

      <div data-element="checkout-footer-container">
        <transition name="fade">
          <div data-element="content" v-if="basketTotal">
            <div
              data-element="subtotal"
              v-if="voucherDiscountAmount || promotionDiscountAmount"
            >
              <div data-element="description">Subtotal:</div>
              <div data-element="amount">£{{ subtotal }}</div>
            </div>
            <div data-element="discount" v-if="promotionDiscountAmount">
              <div data-element="description">Promotion:</div>
              <div data-element="amount">
                - £{{ promotionDiscountAmount.toFixed(2) }}
              </div>
            </div>
            <div data-element="discount" v-if="voucherDiscountAmount">
              <div data-element="description">{{ voucherDiscountText }}</div>
              <div data-element="amount">
                - £{{ voucherDiscountAmount.toFixed(2) }}
              </div>
            </div>
            <div data-element="total">
              <div data-element="description">Total:</div>
              <div data-element="amount">£{{ basketTotal | fixedPrice }}</div>
            </div>
            <PaymentButtons
              v-if="
                $store.state.iorderCheckout.requiredCheckoutData.basketTotal
              "
              :options="$store.getters['iorderCheckout/getPaymentOptions']"
              :successcb="dispatchAlert"
              :failurecb="failure"
              :salesData="salesData"
              :applicationName="applicationName"
              :location="location"
              :tableNumber="tableNumber"
            />
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';
import PaymentButtons from '~/components/iOrder/payment/PaymentButtons';

export default {
  props: [
    'headertext',
    'salesData',
    'success',
    'failure',
    'discountCopy',
    'applicationName',
    'location',
    'tableNumber',
    'alertsCode'
  ],
  components: {
    Icon,
    PaymentButtons
  },
  computed: {
    voucherDiscountText() {
      return `${this.voucherDescription} discount:`;
    },
    subtotal() {
      return (
        this.basketTotal +
        this.promotionDiscountAmount +
        this.voucherDiscountAmount
      ).toFixed(2);
    },
    voucherDescription() {
      return (
        this.$store.getters['iorderCheckout/getVoucherDetail'] &&
        this.$store.getters['iorderCheckout/getVoucherDetail'].voucher.metaData
          .friendlyName
      );
    },
    promotionDiscountAmount() {
      return Math.abs(
        parseFloat(
          this.$store.getters['iorderCheckout/getPromotionDiscountAmount']
        )
      );
    },
    voucherDiscountAmount() {
      return Math.abs(
        parseFloat(
          this.$store.getters['iorderCheckout/getVoucherDiscountAmount']
        )
      );
    },
    basketTotal() {
      return this.$store.getters['iorderCheckout/getBasketTotal'];
    }
  },
  data() {
    return {
      isSubmitting: false,
      email: null,
      password: null
    };
  },
  methods: {
    getIcon(fieldName) {
      if (!this[fieldName]) {
        return false;
      }
      if (this.errors.first(fieldName)) {
        return 'error-form';
      }
      return 'correct-form';
    },
    async dispatchAlert() {
      this.success();
      await this.$store.dispatch('iorderCheckout/dispatchAlert', {
        alertsCode: this.alertsCode
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/iorder-core/form-row.scss';

[data-component='iorder-checkout-modal'] {
  position: relative;
  border-radius: 9px;
  margin: 0 1rem;
  max-width: 460px;
  height: 560px;
  color: $greyish-brown;
  background-color: $very-light-pink;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  [data-element='subheading'] {
    font-family: $heading-font;
    text-align: center;
    position: relative;
    [data-element='restaurant-name'] {
      font-size: 40px;
      line-height: 0.9;
      padding-top: 44px;
    }
    [data-element='table-number'] {
      font-size: 17px;
      line-height: 30px;
    }
    [data-component='icon'] {
      position: absolute;
      top: 24px;
      right: 24px;
      @media only screen and (max-height: 450px) {
        top: 14px;
        right: 18px;
      }
    }
  }
  [data-element='payment-discount'] {
    margin: 40px 20px;
    text-align: center;
    font-size: 17px;
    line-height: 21px;
    padding: 5px;
    background-color: $rebrand-green;
  }
  [data-element='drinkaware-info'] {
    display: block;
    margin: 0 auto;
  }
  [data-element='text-block'] {
    font-family: $font;
    font-size: 14px;
    padding: 0 16px;
    margin: 22px 0;
    text-align: center;
  }
  [data-element='order-summary'] {
    padding: 0 16px;
    [data-element='heading'] {
      font-size: 18px;
      line-height: 35px;
      border-bottom: $rebrand-green solid 2px;
    }
  }
  [data-element='checkout-footer-container'] {
    position: absolute;
    bottom: 0;
    width: 100%;
    max-height: 100%;
    [data-element='content'] {
      background-color: $white;
      border-radius: 7px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
    }
    [data-element='discount'],
    [data-element='subtotal'],
    [data-element='total'] {
      width: 100%;
      display: flex;
      justify-content: space-between;
      [data-element='description'] {
        width: 80%;
      }
    }
    [data-element='discount'],
    [data-element='subtotal'] {
      font-size: 14px;
      margin-bottom: 5px;
    }
    [data-element='total'] {
      font-size: 18px;
      margin-bottom: 10px;
    }
  }
}
.white-circle {
  width: 40px;
  height: 40px;
  background: white;
  position: absolute;
  top: 8px;
  right: 8px;
  text-align: center;
  border-radius: 50%;
  z-index: 1;

  .close-icon {
    margin-top: 8px;
  }
}
</style>
