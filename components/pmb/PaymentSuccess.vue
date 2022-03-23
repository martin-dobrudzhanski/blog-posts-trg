<template>
  <div class="payment-success">
    <section>
      <div class="payment-success__container">
        <h1
          data-size="xl"
          data-color="rebrand-orange"
          data-weight="normal"
          class="heading"
          v-text="content.successPageTitle"
        />
        <p v-text="content && content.successPageText" />
      </div>
      <div class="payment-success__heading">
        <h1>Order details</h1>
      </div>
      <div class="payment-success__totals">
        <div class="payment-success__item">
          <span>Order ID:</span>
          <span>{{ accountId }}</span>
        </div>
        <div class="payment-success__item">
          <span>Number of items:</span>
          <span>{{ billQuantity }}</span>
        </div>
        <div class="payment-success__item">
          <span>Total amount:</span>
          <span>£{{ totalFormatted }}</span>
        </div>
        <v-collapse expandText="More details">
          <div class="payment-success__item">
            <span>{{ billQuantity }} items</span>
            <span>Total amount:</span>
            <span>£{{ totalFormatted }}</span>
          </div>
          <div class="payment-success__item --small">
            <span></span>
            <span>Discount:</span>
            <span>£{{ discountFormatted }}</span>
          </div>
          <div class="payment-success__item --small">
            <span></span>
            <span>Tip added:</span>
            <span>£{{ gratuityAmountFormatted }}</span>
          </div>
        </v-collapse>
      </div>
    </section>
    <section class="payment-success__footer">
      <a
        :href="content && content.termsAndConditionsLink"
        class="payment-success__footer-link"
        target="_blank"
      >
        Terms and Conditions
      </a>
      <v-button
        hasContainer
        :buttonText="content && content.successPageButtonText"
        @buttonClick="handleContinue"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const VButton = () => import('@/components/pmb/VButton')
const VCollapse = () => import('~/components/pmb/VCollapse')

export default {
  components: {
    VButton,
    VCollapse
  },
  computed: {
    ...mapGetters({
      content: 'pay/getContent',
      accountId: 'pay/getAccountId',
      tableNumber: 'pay/getTableNumber',
      billQuantity: 'pay/getBillQuantity',
      total: 'pay/getTotal',
      totalIncludingDiscount: 'pay/getTotalIncludingDiscount',
      totalIncludingDiscountAndGratuity:
        'pay/getTotalIncludingDiscountAndGratuity',
      discount: 'pay/getDiscount',
      gratuityAmount: 'pay/getGratuityAmount'
    }),
    totalFormatted() {
      return parseFloat(this.totalIncludingDiscountAndGratuity || 0).toFixed(2)
    },
    discountFormatted() {
      return parseFloat(this.discount || 0).toFixed(2)
    },
    gratuityAmountFormatted() {
      return parseFloat(this.gratuityAmount || 0).toFixed(2)
    }
  },
  methods: {
    handleContinue() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.payment-success {
  background-color: #fff;
  color: $black;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;

  &__container {
    padding: 0 16px;
    text-align: center;

    p {
      font-size: 16px;
      margin: 24px 0;
    }
  }

  &__heading {
    background-color: $white-two;
    margin: 12px 0;

    h1 {
      @extend .pmb-heading;
      color: $black;
      font-size: 28px;
      font-weight: normal;
    }
  }

  &__content {
    margin: 0 16px 170px;
  }

  &__totals {
    margin: 16px 0 0;
    padding: 0 16px;
  }

  &__item {
    align-items: center;
    display: flex;
    margin: 12px 0;
    width: 100%;

    span {
      flex: 1;
      font-size: 14px;
      text-align: left;

      &:last-child {
        text-align: right;
      }
    }

    &.--small {
      span {
        &:nth-child(2) {
          font-size: 13px;
        }
      }
    }

    .v-collapse__button span {
      margin: 10px 4px 10px 0;
    }
  }

  &__footer {
    text-align: center;

    &-link {
      @extend .pmb-link;
      margin-bottom: 8px;
    }
  }
}
</style>
