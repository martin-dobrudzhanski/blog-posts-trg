<template>
  <div class="success">
    <Icon class="nachos-icon" :icon="'nachos'" />
    <h1 class="success__header">
      ORDER SUCCESSFUL
    </h1>
    <p class="success__subheader">{{ textTop }}</p>
    <div class="success__order--container">
      <div class="success__order--steps card">
        <div class="card__header">What's next?</div>
        <div class="card__content--steps">
          <div class="left">
            <Icon class="steps-icon" :icon="'clock-deep-blue'" />
            <p class="steps-text">Arrive on time detailed below</p>
          </div>
          <div class="dotted-line"></div>
          <div class="middle">
            <Icon class="steps-icon odd" :icon="'people-blue'" />
            <p class="steps-text">
              Practice social distancing, follow the signs and use hand
              sanitiser
            </p>
          </div>
          <div class="dotted-line"></div>
          <div class="right">
            <Icon class="steps-icon" :icon="'basket-blue'" />
            <p class="steps-text">
              Listen out for your name to pick up your food
            </p>
          </div>
        </div>
      </div>
      <div class="success__order--details card" :class="{ expanded }">
        <div class="card__header">Order details</div>
        <div class="card__content--details">
          <div class="rows">
            <div class="title">Pick up:</div>
            <p class="text">{{ location }}</p>
          </div>
          <div class="rows">
            <div class="title">Order ID:</div>
            <p class="text">{{ orderRef }}</p>
          </div>
          <div class="rows">
            <div class="title">Collection Time:</div>
            <p class="text">{{ collectionTime }}</p>
          </div>
        </div>
        <div class="success__order--order">
          <div class="show-choices" @click="toggleDetail">
            <span class="button-text"
              >{{ expanded ? 'Less' : 'More' }} details</span
            >
            <Icon
              class="show-choices-chevron"
              icon="collapse-arrow-white"
              size="xxs"
              :class="{ rotated: expanded }"
              clickable="true"
            />
          </div>
        </div>
        <transition name="expand">
          <div class="more-details" v-if="expanded">
            <div class="basket">
              <LineItem
                v-for="(lineItem, index) in lineItems"
                class="line-item"
                :getProduct="getProduct"
                :key="`${index}-lineItem`"
                :lineItem="lineItem"
                :hideIncrementor="true"
                :hideEditChoices="true"
                :showQuantity="true"
                :fullWidth="true"
              />
            </div>
            <div class="order-cost">
              <span class="basket-qty">
                {{ basketLengthCopy }}
              </span>
              <table class="cost-breakdown">
                <tr>
                  <td class="label">
                    Total amount:
                  </td>
                  <td>£{{ total }}</td>
                </tr>
                <tr class="discount" v-if="discount">
                  <td class="label">
                    Discount:
                  </td>
                  <td>- £{{ discount }}</td>
                </tr>
              </table>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="success__text-cards">
      <InfoBox
        v-for="(box, index) in boxes"
        class="box"
        :key="index"
        :heading="box.fields.heading"
        :copy="box.fields.copy"
        :backgroundColor="box.fields.backgroundColor"
        :link="box.fields.link"
      >
      </InfoBox>
    </div>
    <BaseLink class="link" :to="'/terms'">Terms and conditions</BaseLink>
    <BaseButton class="button" @click.native="goHome">Home</BaseButton>
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';
import LineItem from '~/components/iOrder-core/basketV3/LineItem';
import InfoBox from '~/components/iOrder-core/uiV3/InfoBox';
import BaseLink from '~/components/ui/BaseLink';
import BaseButton from '@/components/buttons/BaseButton';

export default {
  components: {
    Icon,
    LineItem,
    InfoBox,
    BaseLink,
    BaseButton
  },
  data() {
    return {
      expanded: false
    };
  },
  props: [
    'textTop',
    'textBottom',
    'phoneNumber',
    'centerHeading',
    'location',
    'orderRef',
    'collectionTime',
    'lineItems',
    'getProduct',
    'total',
    'discount',
    'buttonLink',
    'buttonText',
    'basketCount',
    'toggleModal',
    'bookingRef',
    'content',
    'orderAtTable',
    'tableNumber',
    'boxes'
  ],
  computed: {
    basketLengthCopy() {
      const qty = this.basketCount;
      if (qty === 1) return `${qty} Item`;
      else return `${qty} Items`;
    }
  },
  methods: {
    toggleDetail() {
      this.expanded = !this.expanded;
    },
    goHome() {
      this.$nuxt.$router.push({ path: '/' });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.success {
  text-align: center;
  margin: 60px 0 24px;
  color: $greyish-brown;
  .nachos-icon {
    width: 144px;
    height: 109px;
  }
  &__header {
    font-family: $heading-font;
    font-size: 48px;
    line-height: 1.04;
    color: $peacock-blue;
  }
  &__subheader {
    font-family: $font;
    font-size: 18px;
    line-height: 1.22;
    margin-top: 16px;
    @include whenScreenIs(xs) {
      margin: 16px 24px 0;
    }
  }
  &__order {
    &--container {
      margin: 44px auto 24px;
      width: 1088px;
      display: flex;
      justify-content: space-between;

      @media (max-width: 1124px) {
        width: auto;
        max-width: 788px;

        flex-direction: column;
      }

      @include whenScreenIs(xs) {
        margin: 44px 24px 24px;
      }

      .card {
        width: 536px;
        height: 232px;
        padding: 16px 40px;
        border-radius: 7px;
        @media (max-width: 1124px) {
          width: 100%;
        }
        @include whenScreenIs(xs) {
          padding: 16px 0;
        }

        &.expanded {
          height: auto;
        }

        &__header {
          font-family: $navigation-font;
          font-size: 18px;
          padding-bottom: 16px;
          border-bottom: 2px dotted;
          @include whenScreenIs(xs) {
            margin: 0 8px;
          }
        }

        &__content--steps {
          display: flex;
          justify-content: space-between;
          padding: 25px 8px;
          .steps {
            &-icon {
              width: 48px;
              height: 48px;

              &.odd {
                width: 66px;
              }
            }
            &-text {
              width: 108px;
              font-size: 14px;
            }
          }
          .dotted-line {
            width: 85px;
            height: 1px;
            border-bottom: 1px dotted;
            margin-top: 23px;
          }
        }

        &__content--details {
          padding: 25px 8px;

          .rows {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            &:not(:first-child) {
              padding-top: 18px;
            }
            .text {
              font-family: $navigation-font;
            }
          }
        }
      }
    }

    &--steps {
      background-color: $light-pink;
    }

    &--details {
      background-color: $very-light-pink;
      @media (max-width: 1124px) {
        margin-top: 24px;
      }
    }

    &--order {
      text-align: left;
      padding-left: 8px;
      .show-choices {
        font-family: $navigation-font;
        font-size: 14px;
        border-radius: 23px;
        background-color: $greyish-brown;
        width: 112px;
        display: flex;
        height: 24px;
        color: white;
        align-items: center;

        .button-text {
          padding-left: 8px;
        }
      }
    }
  }
}
.rotated {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}
.more-details {
  text-align: left;
  padding: 8px;
}
.success__text-cards {
  max-width: 788px;
  display: flex;
  margin: 0 auto 24px;
  @include whenScreenIs(xs) {
    flex-direction: column;
  }
  .box {
    @include whenScreenIs(xs) {
      margin: 8px 24px;
    }
    &:last-child {
      margin-left: 16px;
      @include whenScreenIs(xs) {
        margin: 8px 24px;
      }
    }
  }
}
.link {
  font-family: $font;
  font-size: 13px;
  line-height: 1.46;
  letter-spacing: 0.1px;
  color: $greyish-brown;
  text-transform: uppercase;
  text-decoration: underline;
}
.button {
  margin: 26px auto;
  width: 138px;
}
</style>
