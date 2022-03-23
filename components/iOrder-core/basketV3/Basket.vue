<template>
  <div data-component="basket-component">
    <section data-element="basket-listing">
      <TimeslotDisplay
        v-if="showTimeslotDisplay"
        data-element="timeslot-display"
        :timeslot="timeslot"
        :availableTimeslots="availableTimeslots"
        :setTimeslot="setTimeslot"
      />
      <transition name="fade">
        <div
          class="cutlery-toggle desktop"
          v-if="basket.lines.length && cutleryEnabled"
        >
          <div class="cutlery-toggle__label">
            <p class="cutlery-toggle__label__heading">Cutlery</p>
            <p v-if="cutleryText" class="cutlery-toggle__label__hint">
              {{ cutleryText }}
            </p>
          </div>
          <ToggleButton
            :checked="cutlery"
            @change="e => $emit('setCutlery', e)"
          />
        </div>
      </transition>
      <KerbsidePickup
        v-if="isKerbsideSupported"
        :instructions="kerbsideInstructions"
        class="kerbside-pickup"
      />
      <div class="basket-items" v-if="basket.lines.length">
        <div class="basket">
          <LineItem
            :getProduct="getProduct"
            v-for="lineItem in basket.lines"
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
          />
        </div>
        <div data-element="mobile-footer">
          <div class="basket__header">
            <div class="basket__header-with-icon">
              <div class="basket__header-icon">
                <Icon
                  icon="arrow-left"
                  size="md"
                  data-element="icon"
                  data-position="left"
                  @click.native="goBack"
                  clickable="true"
                />
              </div>
              <h2 class="basket__header__heading">Basket</h2>
            </div>
            <transition name="fade">
              <p class="basket__header__total" v-if="basketCount">
                Total: <span>{{ basketTotal }}</span>
              </p>
            </transition>
          </div>
          <LineItem
            :getProduct="getProduct"
            v-for="lineItem in basket.lines"
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
          />
          <transition name="fade">
            <div
              class="cutlery-toggle mobile"
              v-if="basket.lines.length && cutleryEnabled"
            >
              <div class="cutlery-toggle__label">
                <p class="cutlery-toggle__label__heading">Cutlery</p>
                <p v-if="cutleryText" class="cutlery-toggle__label__hint">
                  {{ cutleryText }}
                </p>
              </div>
              <ToggleButton
                :checked="cutlery"
                @change="e => $emit('setCutlery', e)"
              />
            </div>
          </transition>
          <VoucherInput
            data-element="voucher-input"
            :mobile="true"
            :submitVoucher="submitVoucher"
            :voidVoucher="voidVoucher"
            :checkingVoucher="checkingVoucher"
            :voucherApplied="voucherApplied"
            v-if="content.vouchersEnabled"
          />
          <CheckoutBtn
            :handleClick="placeOrder"
            :basketTotal="basketTotal"
            :basketCount="basketCount"
            :loading="checkingOrder"
            :inactive="!basketCount"
            containerSize="md"
            text="Pay now"
            mobile="true"
          />
        </div>
      </div>

      <div data-element="empty-basket" v-else>
        <p data-element="text">You have no items in your basket</p>
      </div>
    </section>
    <section class="text-cards">
      <InfoBox
        v-for="(box, index) in asideBoxes"
        :key="index"
        :heading="box.heading"
        :copy="box.copy"
        :backgroundColor="box.backgroundColor"
        :link="box.link"
      >
        <img
          v-if="box.image"
          class="info-box__icon"
          :src="boxImage(box.image)"
          alt="safety icon"
        />
      </InfoBox>
    </section>
    <section data-element="desktop-summary">
      <div class="desktop-summary__inner">
        <div class="basket__header">
          <div class="basket__header-with-icon">
            <div class="basket__header-icon">
              <Icon
                icon="arrow-left"
                size="md"
                data-element="icon"
                data-position="left"
                @click.native="goBack"
                clickable="true"
              />
            </div>
            <h2 class="basket__header__heading">Basket</h2>
          </div>
          <transition name="fade">
            <p class="basket__header__total" v-if="basketCount">
              Total: <span>{{ basketTotal }}</span>
            </p>
          </transition>
        </div>
        <VoucherInput
          data-element="voucher-input"
          :submitVoucher="submitVoucher"
          :voidVoucher="voidVoucher"
          :checkingVoucher="checkingVoucher"
          :voucherApplied="voucherApplied"
          v-if="content.vouchersEnabled && basketCount"
        />
        <CheckoutBtn
          v-if="basketCount && timeslot"
          :handleClick="placeOrder"
          :basketTotal="basketTotal"
          :basketCount="basketCount"
          :loading="checkingOrder"
          :inactive="!basketCount"
          text="Pay now"
        />
        <div v-if="!basketCount" data-element="empty-text">
          <p class="empty-text__heading">{{ emptyText }}</p>
          <p class="empty-text__sub">{{ emptyTextSub }}</p>
        </div>
      </div>
      <MenuAside :boxes="asideBoxes" />
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
      />
    </transition>
    <transition name="fade-in" appear>
      <IorderAuthModal :guestLoginCallback="handleGuestLogin" />
    </transition>
    <transition name="fade-in">
      <ModalContainer
        v-if="showModal === 'alternativeTimesModal'"
        :closeModal="closeModal"
      >
        <AlternativeTimesModal
          :close-modal="closeModal"
          :alternativeTimeslots="alternativeTimeslots"
          :setTimeslot="setTimeslot"
        />
      </ModalContainer>
    </transition>
  </div>
</template>

<script>
import get from 'lodash.get';
import menuAndBasket from '~/mixins/iOrder-core/menuAndBasket';
import basket from '~/mixins/iOrder-core/basket';
import ModalContainer from '~/components/iOrder-core/modalsV3/ModalContainer';
import KerbsidePickup from '~/components/iOrder-core/basketV3/KerbsidePickup';

import Icon from '~/components/iOrder-core/uiV3/Icon';
import LineItem from '~/components/iOrder-core/basketV3/LineItem';
import CheckoutBtn from '~/components/iOrder-core/uiV3/CheckoutBtn';
import ToggleButton from '~/components/iOrder-core/uiV3/ToggleButton';
import TimeslotDisplay from '~/components/iOrder-core/basketV3/TimeslotDisplay';
import IorderAuthModal from '~/components/iOrder/IorderAuthModal.vue';
import IorderCheckoutModal from '~/components/iOrder/IorderCheckoutModal.vue';
import AlternativeTimesModal from '~/components/iOrder-core/modalsV3/AlternativeTimesModal.vue';
import VoucherInput from '~/components/iOrder-core/basketV3/VoucherInput';
import MenuAside from '~/components/iOrder-core/menuV3/MenuAside';
import InfoBox from '~/components/iOrder-core/uiV3/InfoBox';

export default {
  name: 'Basket',
  mixins: [menuAndBasket, basket],
  components: {
    IorderAuthModal,
    IorderCheckoutModal,
    AlternativeTimesModal,
    TimeslotDisplay,
    ModalContainer,
    VoucherInput,
    KerbsidePickup,
    Icon,
    LineItem,
    CheckoutBtn,
    ToggleButton,
    MenuAside,
    InfoBox
  },
  data: () => ({
    emptyTextSub: 'What about adding some delicious food?',
    emptyText: 'Your basket is empty'
  }),
  props: [
    'appLabel',
    'content',
    'showTimeslotDisplay',
    'cutleryEnabled',
    'cutleryText',
    'cutlery',
    'asideBoxes'
  ],
  methods: {
    setKey(lineItem) {
      if (this.appLabel === 'orderAtTable') {
        return lineItem.basketKey;
      }
      return this.$uuid.v4();
    },
    closeModal() {
      document.body.removeAttribute('data-modal');
      document.documentElement.removeAttribute('data-modal');
      this.showModal = false;
    },
    boxImage(image) {
      const payload = get(image, 'fields.file.url');
      return payload;
    }
  },
  computed: {
    kerbsideInstructions() {
      const title = get(this.content, 'kerbsideInstructionsTitle');
      const description = get(this.content, 'kerbsideInstructionsDescription');

      return { title, description };
    },
    kerbsideList() {
      return get(this.content, 'kerbsideList', []);
    },
    isKerbsideSupported() {
      return this.kerbsideList.some(id => id === this.getSiteId);
    }
  },
  created() {
    this.initMixin(this.appLabel);
    this.initBasket();
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.text-cards {
  display: flex;
  max-width: 730px;
  margin: 4rem auto;

  @include whenScreenIs(xs) {
    flex-direction: column;
    max-width: 568px;
  }
  @media (min-width: 992px) {
    display: none;
  }
  @media (max-width: 600px) {
    margin: 4rem 1rem;
  }

  /deep/ a:first-child {
    @include whenScreenIs(xs) {
      margin-bottom: 1rem;
    }
    @include whenScreenIs(sm) {
      margin-right: 1rem;
    }
  }
}

[data-component='basket-component'] {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  @media (max-width: 992px) {
    flex-direction: column;
  }
  [data-element='empty-text'] {
    font-size: 18px;
    font-weight: bold;
    padding: 1rem;
    text-align: left;

    .empty-text__sub {
      margin-top: 0.5rem;
      color: grey;
      font-weight: 500;
      font-size: 14px;
    }
  }
  [data-element='basket-listing'] {
    width: 100%;
    @media (max-width: 992px) {
      max-width: 600px;
      margin: -2.5rem auto;
      position: relative;
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
        top: 16px;
        left: 16px;
        @include clickable(true);
        @include whenScreenIs(mdx) {
          top: 40px;
        }
      }
      [data-element='basket-heading'] {
        font-size: 20px;
        text-align: center;
        padding: 16px;
        @include whenScreenIs(mdx) {
          text-align: left;
          margin: 40px 0 0 73px;
          padding-left: 0;
        }
      }
    }
    [data-element='payment-discount-mobile'] {
      @include whenScreenIs(mdx) {
        display: none;
      }
    }
    .kerbside-pickup,
    [data-element='timeslot-display'] {
      margin: 16px;
      @include whenScreenIs(mdx) {
        margin: 40px 0 0 73px;
      }
    }
    [data-element='empty-basket'] {
      [data-element='text'] {
        font-size: 21px;
        color: $pinkish-red;
        text-align: center;
        margin: 30px 0;
      }
    }
    [data-element='mobile-footer'] {
      display: flex;
      flex-direction: column;

      @include whenScreenIs(mdx) {
        display: none;
      }
      [data-element='checkout-btn-container'] {
        width: 100%;
        padding: 0;

        [data-component='btn'] {
          border-radius: 23px;
        }
      }
    }
  }
  [data-element='desktop-summary'] {
    min-width: 400px;
    display: none;
    @include whenScreenIs(mdx) {
      display: flex;
      flex-direction: column;
      margin-top: 40px;
      margin-left: 38px;

      [data-element='info-block'] {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }

    [data-element='checkout-btn-container'] {
      margin-top: 0;
    }
  }
}
.desktop-summary__inner {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem 1rem;
  border-radius: 10px;
  background-color: $light-pink;
  margin-bottom: 1rem;
}
.basket__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  color: $greyish-brown;
  margin-bottom: 0.7rem;
  border-bottom: 2px dotted #3c3c3c;

  &-with-icon {
    display: flex;
    align-items: center;
  }
  &-icon {
    border-radius: 50%;
    background-color: $greyish-brown;
    width: 32px;
    height: 32px;
    text-align: center;
  }
  &__heading {
    font-size: 40px;
    margin-left: 5px;
    height: 25px;
    font-family: $heading-font;
  }
  &__total {
    display: flex;
    font-family: $font;
    font-size: 14px;
    margin-top: 5px;
    span {
      font-family: $navigation-font;
      font-size: 18px;
      padding-left: 0.5rem;
    }
  }
}
.cutlery-toggle {
  font-family: $navigation-font;
  color: $greyish-brown;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  margin: 1rem;

  &.desktop {
    @media (max-width: 992px) {
      display: none;
    }
  }

  &.mobile {
    padding: 0;
    margin: 1rem 0 1.5rem;
  }

  @include whenScreenIs(mdx) {
    margin: 1rem 0 0 73px;
  }

  &__label__heading {
    font-size: 18px;
    margin-bottom: 0.25rem;
  }
  &__label {
    font-family: $navigation-font;
    font-size: 18px;
    color: $greyish-brown;
    &__hint {
      margin-top: 8px;
      font-family: $font;
      font-size: 14px;
    }
  }
}
.basket-items {
  background-color: $rebrand-very-light-pink;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0 0 73px;
  @media (max-width: 992px) {
    margin: 1rem 1rem 0 1rem;
  }
}
.basket {
  @media (max-width: 992px) {
    display: none;
  }
}
</style>
