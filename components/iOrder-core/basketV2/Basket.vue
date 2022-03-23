<template>
  <div data-component="basket-component">
    <section data-element="basket-listing">
      <div data-element="basket-header">
        <icon
          icon="arrow-left"
          size="md"
          data-element="icon"
          data-position="left"
          @click.native="goBack"
        />
        <h3
          data-element="basket-heading"
          class="heading"
          data-size="md"
          data-weight="black"
          :data-small="table"
        >
          {{ basketHeading || 'Your basket summary' }}
        </h3>
      </div>

      <div data-element="table-number-container" v-if="table">
        <span data-element="table-number" @click="openTableModal">
          Table {{ table }}
        </span>
      </div>

      <secondary-header
        v-if="discountCopy"
        data-element="payment-discount-mobile"
        :text="discountCopy"
      />
      <timeslot-display
        v-if="showTimeslotDisplay"
        data-element="timeslot-display"
        :timeslot="timeslot"
        :availableTimeslots="availableTimeslots"
        :setTimeslot="setTimeslot"
      />
      <div v-if="basket.lines.length">
        <div data-element="basket">
          <line-item
            :getProduct="getProduct"
            v-for="(lineItem, index) in basket.lines"
            :key="setKey(lineItem)"
            :lineItem="lineItem"
            :removeItemFromBasket="removeItemFromBasket"
            :getBasketIndex="getBasketIndex"
            :displayProduct="getDisplayProduct(lineItem)"
            :editBasketChoices="editBasketChoices"
            :choiceGroups="getChoiceGroups(lineItem)"
            :getCG="getCG"
            :cgIndex="cgIndex"
            :incrementBasketItem="incrementBasketItem"
            :decrementBasketItem="decrementBasketItem"
            :unavailable="lineItem.unavailable"
          />
        </div>
        <sticky-footer data-element="sticky-footer">
          <voucher-input
            v-if="voucheringEnabled"
            data-element="voucher-input"
            :mobile="true"
            :submitVoucher="submitVoucher"
            :checkingVoucher="checkingVoucher"
            :voucherApplied="voucherApplied"
            :voidVoucher="voidVoucher"
          />
          <checkout-btn
            :handleClick="placeOrder"
            :basketTotal="basketTotal"
            :basketCount="basketCount"
            :loading="checkingOrder"
            :inactive="!basketCount"
            containerSize="md"
            text="Pay now"
          />
        </sticky-footer>
      </div>

      <div data-element="empty-basket" v-else>
        <p data-element="text">You have no items in your basket</p>
        <btn text="Menu" size="md" @click.native="goBack" />
      </div>
    </section>
    <section data-element="desktop-summary">
      <checkout-btn
        :handleClick="placeOrder"
        :basketTotal="basketTotal"
        :basketCount="basketCount"
        :loading="checkingOrder"
        :inactive="!basketCount"
        text="Pay now"
      />
      <info-block>
        <voucher-input
          v-if="voucheringEnabled"
          data-element="voucher-input"
          :submitVoucher="submitVoucher"
          :checkingVoucher="checkingVoucher"
          :voucherApplied="voucherApplied"
          :voidVoucher="voidVoucher"
        />
      </info-block>
    </section>
    <transition name="fade-in" appear>
      <IorderCheckoutModal
        :success="handleCheckoutSuccess"
        :failure="handleCheckoutFailure"
        :headertext="currentLocation.name"
        :salesData="salesData"
        :serviceid="serviceId"
        :applicationName="`${applicationName}`"
        :location="content.restaurant.fields"
        :discountCopy="content.checkoutDiscountCopy"
        :alertsCode="`${alertsCode}`"
        :tableNumber="table"
      />
    </transition>
    <transition name="fade-in" appear>
      <IorderAuthModal :guestLoginCallback="handleGuestLogin" />
    </transition>
    <transition name="fade-in">
      <modal-container
        v-if="showModal === 'alternativeTimesModal'"
        :closeModal="closeModal"
      >
        <alternative-times-modal
          :close-modal="closeModal"
          :alternativeTimeslots="alternativeTimeslots"
          :setTimeslot="setTimeslot"
        />
      </modal-container>
    </transition>
    <transition name="fade-in">
      <modal-container
        v-if="showModal === 'tablePickerModal'"
        :closeModal="closeModal"
      >
        <table-picker-modal :appLabel="appLabel" :closeModal="closeModal" />
      </modal-container>
    </transition>
  </div>
</template>

<script>
import TimeslotDisplay from '~/components/iOrder-core/basketV2/TimeslotDisplay';
import menuAndBasket from '~/mixins/iOrder-core/menuAndBasket';
import basket from '~/mixins/iOrder-core/basket';
import IorderAuthModal from '~/components/iOrder/IorderAuthModal.vue';
import IorderCheckoutModal from '~/components/iOrder/IorderCheckoutModal.vue';
import AlternativeTimesModal from '~/components/iOrder-core/modalsV2/AlternativeTimesModal.vue';
import SecondaryHeader from '~/components/iOrder-core/uiV2/SecondaryHeader';
import ModalContainer from '~/components/iOrder-core/modalsV2/ModalContainer';
import VoucherInput from '~/components/iOrder-core/basketV2/VoucherInput';
import TablePickerModal from '~/components/iOrder-core/modalsV2/TablePickerModal';

export default {
  mixins: [menuAndBasket, basket],
  components: {
    IorderAuthModal,
    IorderCheckoutModal,
    AlternativeTimesModal,
    SecondaryHeader,
    TimeslotDisplay,
    ModalContainer,
    VoucherInput,
    TablePickerModal
  },
  props: [
    'appLabel',
    'content',
    'showTimeslotDisplay',
    'basketHeading',
    'table',
    'hideVouchering'
  ],
  methods: {
    closeModal() {
      document.body.removeAttribute('data-modal');
      document.documentElement.removeAttribute('data-modal');
      this.showModal = false;
    },
    setKey(lineItem) {
      if (this.appLabel === 'orderAtTable' || this.appLabel === 'orderAhead') {
        return lineItem.basketKey;
      }
      return this.$uuid.v4();
    },
    openTableModal() {
      document.body.setAttribute('data-modal', true);
      document.documentElement.setAttribute('data-modal', true);
      this.showModal = 'tablePickerModal';
    }
  },
  created() {
    this.initMixin(this.appLabel);
    this.initBasket();
  },
  computed: {
    voucheringEnabled() {
      if (this.content && this.content.voucheringEnabled) {
        return this.content.voucheringEnabled === 'Enabled';
      }
      return !this.hideVouchering;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='basket-component'] {
  width: 100%;
  display: flex;
  flex-direction: row;

  [data-element='basket-listing'] {
    width: 100%;
    @include whenScreenIs(mdx) {
      width: 529px;
      margin-left: 67px;
    }

    [data-element='basket-header'] {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      @include whenScreenIs(mdx) {
        justify-content: flex-start;
      }

      [data-element='icon'] {
        position: absolute;
        top: 28px;
        left: 16px;
        @include clickable(true);
        @include whenScreenIs(mdx) {
          top: 58px;
        }
      }

      [data-element='basket-heading'] {
        font-size: 28px;
        text-align: center;
        padding: 16px;
        font-family: $display-font;
        text-transform: uppercase;
        color: $rebrand-orange;
        font-weight: normal;

        &[data-small] {
          padding-bottom: 5px;
        }

        @include whenScreenIs(mdx) {
          text-align: left;
          margin: 24px 0 0 73px;
          padding-left: 0;
          font-size: 38px;
        }
      }
    }

    [data-element='table-number-container'] {
      display: flex;
      justify-content: center;

      [data-element='table-number'] {
        color: $black;
        font-family: $font;
        font-size: 16px;
        line-height: 1.25;
        text-align: center;
        text-decoration: underline;
        text-transform: none;
        font-weight: bold;
      }
    }

    [data-element='payment-discount-mobile'] {
      @include whenScreenIs(mdx) {
        display: none;
      }
    }

    [data-element='timeslot-display'] {
      margin: 16px;
      @include whenScreenIs(mdx) {
        margin: 16px 0 0 73px;
      }
    }

    [data-element='basket'] {
      margin: 0 16px 170px;
      @include whenScreenIs(mdx) {
        background-color: $white;
        margin: 24px 0 0 73px;
      }
    }

    [data-element='empty-basket'] {
      [data-element='text'] {
        font-size: 21px;
        color: $rebrand-orange;
        text-align: center;
        font-weight: 900;
        margin: 30px 0;
      }
    }

    [data-element='sticky-footer'] {
      display: flex;
      flex-direction: column;
      @include whenScreenIs(mdx) {
        display: none;
      }
    }
  }

  [data-element='desktop-summary'] {
    display: none;
    @include whenScreenIs(mdx) {
      display: flex;
      flex-direction: column;
      width: 314px;
      margin-top: 40px;
      margin-left: 38px;
      [data-element='info-block'] {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
}
</style>
