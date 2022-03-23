<template>
  <div data-component="voucher-input" :class="{ mobile }">
    <div data-element="voucher-input-container">
      <div
        data-element="voucher-prompt"
        :class="{ clickable: !voucherApplied }"
      >
        <p data-element="text">Do you have a voucher code?</p>
      </div>
      <transition name="expand">
        <form
          data-element="voucher-form"
          v-if="expanded"
          @submit.prevent="handleSubmit"
        >
          <input
            data-element="input"
            type="text"
            v-model="voucherCode"
            placeholder="Enter code here"
            aria-label="Enter voucher code"
            :disabled="voucherApplied"
          />
          <div class="voucher-input__apply">
            <Icon
              v-if="!checkingVoucher"
              class="voucher-input__apply__icon"
              icon="vouchercode"
              size="md"
              clickable="true"
            />
            <div class="loader" v-else />
          </div>
        </form>
      </transition>
      <transition name="fade-in">
        <div v-if="voucherApplied" data-element="voucher-confirm">
          <div>
            <p class="confirm-text" v-html="confirmText"></p>
            <p class="void-voucher" @click.prevent="voidVoucher(voucherCode)">
              Remove&nbsp;voucher
            </p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';
export default {
  name: 'VoucherInput',
  components: { Icon },
  props: [
    'mobile',
    'submitVoucher',
    'voidVoucher',
    'checkingVoucher',
    'voucherApplied'
  ],
  computed: {
    buttonText() {
      return this.voucherApplied ? 'Applied' : 'Apply';
    },
    formattedVoucherCode() {
      return this.voucherCode.toUpperCase();
    },
    confirmText() {
      return `Your <em>${this.voucherApplied.detail}</em> voucher will be applied when you checkout.`;
    }
  },
  data() {
    return {
      expanded: true,
      voucherCode: ''
    };
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    handleSubmit() {
      this.submitVoucher(this.formattedVoucherCode);
    }
  },
  created() {
    if (this.voucherApplied) this.voucherCode = this.voucherApplied.code;
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='voucher-input'] {
  width: 100%;
  color: $greyish-brown;
  position: relative;
  max-width: 456px;
  display: flex;
  flex-direction: column;
  &.mobile {
    background-color: transparent;
    max-width: none;
  }
  [data-element='voucher-prompt'],
  [data-element='voucher-confirm'] {
    display: flex;
    align-items: center;
    font-family: $navigation-font;
    width: 100%;
    height: 40px;
    .confirm-text {
      display: inline;
    }
    .void-voucher {
      text-decoration: underline;
      display: inline;
    }
    &.clickable {
      &:hover {
        cursor: pointer;
      }
    }
    [data-element='text'] {
      font-size: 18px;
    }
    [data-element='icon'] {
      margin: 2px 0 0 5px;
      -webkit-transition: all 0.5s ease-in-out;
      -o-transition: all 0.5s ease-in-out;
      transition: all 0.5s ease-in-out;
      -webkit-transform: rotate(180deg);
      -ms-transform: rotate(180deg);
      -o-transform: rotate(180deg);
      transform: rotate(180deg);
      &.rotated {
        -webkit-transform: none;
        -ms-transform: none;
        -o-transform: none;
        transform: none;
      }
    }
  }
  [data-element='voucher-confirm'] {
    font-size: 14px;
    color: $jungle-green;
    text-align: center;
    height: 40px;
    @include whenScreenIs(mdx) {
      height: 60px;
    }
  }
  [data-element='voucher-form'] {
    display: flex;
    margin-bottom: 8px;
    position: relative;
    @include whenScreenIs(mdx) {
      margin-bottom: 16px;
    }
    [data-element='input'] {
      font-size: 16px;
      text-transform: uppercase;
      background-color: #fff;
      padding: 0.25rem 2.5rem 0.25rem 1rem;
      margin-right: 4px;
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      opacity: 1;
      border-radius: 23px;
      border: 0;
      &::placeholder {
        text-transform: none;
      }
      &:focus::-webkit-input-placeholder {
        color: transparent;
      }
      &:focus:-moz-placeholder {
        color: transparent;
      } /* FF 4-18 */
      &:focus::-moz-placeholder {
        color: transparent;
      } /* FF 19+ */
      &:focus:-ms-input-placeholder {
        color: transparent;
      } /* IE 10+ */
      &:focus {
        outline: none;
        border-width: 1.5px;
      }
      &::-ms-clear {
        display: none;
      }
    }
    [data-element='button'] {
      margin-left: 4px;
      opacity: 1;
    }
    overflow: hidden;
  }
  .expand-enter-active,
  .expand-leave-active {
    transition: max-height 0.7s ease, margin-bottom 0.7s ease;
    max-height: 104px;
  }
  // &.mobile {
  .expand-enter-active {
    [data-element='voucher-form'],
    [data-element='input'],
    [data-element='button'] {
      transition: opacity 0.4s linear;
    }
  }
  .expand-leave-active {
    [data-element='voucher-form'],
    [data-element='input'],
    [data-element='button'] {
      transition: opacity 0.4s linear;
    }
  }
  // }
  .expand-enter,
  .expand-leave-to {
    max-height: 0;
    margin-bottom: 0;
    [data-element='voucher-form'],
    [data-element='input'],
    [data-element='button'] {
      opacity: 0;
    }
  }
}
.voucher-input__apply {
  padding: 0;
  border: 0;
  background-color: transparent;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}
</style>
