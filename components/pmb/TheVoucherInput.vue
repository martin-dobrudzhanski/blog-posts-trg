<template>
  <div class="voucher-input">
    <div class="voucher-input__container">
      <div
        v-if="!voucherApplied"
        class="voucher-input__prompt"
        :class="{ '--clickable': !voucherApplied }"
        @click="toggleExpanded"
      >
        <p>
          Do you have a voucher code?
        </p>
        <img
          src="@/assets/img/pmb/down.svg"
          alt="arrow"
          class="voucher-input__arrow"
          :class="{ '--expanded': expanded }"
        />
      </div>

      <transition name="expand">
        <div class="voucher-input__form" v-if="expanded && !voucherApplied">
          <v-input
            class="voucher-input__field"
            placeholder="Enter code here"
            @formSubmit="handleSubmit"
            @input="handleInput"
            inline
            bold
          />
          <v-button
            buttonText="Apply"
            inline
            :disabled="!voucherCode || !inputValid"
            :loading="checkingVoucher"
            @buttonClick="handleSubmit"
          />
        </div>
      </transition>

      <transition name="expand">
        <div v-if="voucherApplied" class="voucher-input__confirm">
          <div class="bill-item">
            <div class="bill-item__container">
              <div class="bill-item__title">
                <span>Subtotal</span>
              </div>
              <div class="bill-item__price">
                <span>£{{ parseFloat(billTotal).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          <div class="bill-item">
            <div class="bill-item__container">
              <div class="bill-item__title">
                <span>Discount</span>
              </div>
              <div class="bill-item__price">
                <span>
                  {{ discount !== 0 ? '-' : '' }} £{{ discount.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
const VButton = () => import('~/components/pmb/VButton');
const VInput = () => import('~/components/pmb/VInput');

export default {
  components: {
    VButton,
    VInput
  },
  props: {
    checkingVoucher: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: null
    },
    submitVoucher: {
      type: Function,
      default: () => {}
    },
    voucherApplied: {
      type: [String, Boolean],
      default: null
    },
    discount: {
      type: [String, Number],
      default: 0
    },
    billTotal: {
      type: [String, Number],
      default: 0
    }
  },
  data: () => ({
    expanded: false,
    voucherCode: '',
    inputValid: false
  }),
  computed: {
    formattedVoucherCode() {
      return this.voucherCode.toUpperCase();
    }
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
      this.voucherCode = '';
    },
    handleSubmit() {
      if (this.inputValid) {
        // Clear input
        const input = this.$el.querySelector('.voucher-input__field input');
        input.value = '';

        // Submit
        this.submitVoucher(this.formattedVoucherCode);
      }
    },
    handleInput(input) {
      this.voucherCode = input;
      this.inputValid = /^[a-zA-Z0-9-]*$/.test(input);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.voucher-input {
  padding: 16px;

  &__prompt {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 40px;
    width: 100%;

    p {
      color: $black;
      font-family: $secondary-body-font;
      font-size: 16px;
      font-weight: normal;
      margin-right: 6px;
    }
  }

  &__arrow {
    transform: rotate(-180deg);
    transition: transform 0.5s;

    &.--expanded {
      transform: rotate(0);
    }
  }

  &__form {
    display: flex;
    overflow: hidden;
    height: 48px;

    > * {
      flex: 1;
    }
  }

  .expand-enter-active,
  .expand-leave-active {
    transition: opacity 0.4s linear, max-height 0.7s ease,
      margin-bottom 0.7s ease;
    max-height: 104px;
  }
  .expand-enter,
  .expand-leave-to {
    max-height: 0;
    margin-bottom: 0;
    opacity: 0;
  }
}

.bill-item {
  display: flex;
  flex-direction: column;
  position: relative;

  &__container {
    display: flex;
    justify-content: space-between;
  }

  span {
    color: #2f2f2f;
    font-size: 16px;
    line-height: 1.6;
    text-align: left;
  }

  &__title {
    align-content: flex-start;
    display: flex;
    flex-direction: column;
  }

  &__price {
    font-weight: bold;
  }
}
</style>
