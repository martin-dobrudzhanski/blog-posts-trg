<template>
  <div data-component="success">
    <p data-element="text-top" v-if="textTop" class="heading" data-size="sm">
      {{ textTop }}
    </p>
    <div
      data-element="text-bottom"
      v-if="textBottom"
      class="heading"
      data-size="sm"
    >
      {{ textBottom }}
      <a
        data-element="phone-link"
        v-if="phoneNumber && !orderAtTable"
        :href="`tel:${phoneNumber}`"
      >
        {{ phoneNumber }}
      </a>
      <p data-element="table-number" v-if="tableNumber && orderAtTable">
        {{ tableNumber }}
      </p>
    </div>
    <div data-element="center-heading" v-if="centerHeading">
      {{ centerHeading }}
    </div>
    <div data-element="order-details-container">
      <table data-element="order-details">
        <tr data-element="order-details-row" v-if="location && !orderAtTable">
          <td data-element="label">Pick up:</td>
          <td data-element="order-detail">
            {{ location }}
          </td>
        </tr>
        <tr data-element="order-details-row" v-if="orderRef">
          <td data-element="label">Order ID:</td>
          <td data-element="order-detail">
            {{ orderRef }}
          </td>
        </tr>
        <tr data-element="order-details-row" v-if="collectionTime">
          <td data-element="label">'Collection Time:'</td>
          <td data-element="order-detail">
            {{ collectionTime }}
          </td>
        </tr>
        <tr data-element="order-details-row" v-if="bookingRef">
          <td data-element="label">Booking ID:</td>
          <td data-element="order-detail">
            {{ bookingRef }}
          </td>
        </tr>
      </table>

      <div data-element="show-details-container">
        <div data-element="show-details" @click="toggleDetail">
          <p data-element="text">{{ expanded ? 'Less' : 'More' }} details</p>
          <icon
            icon="collapse-arrow-light"
            size="xs"
            data-element="icon"
            :class="{ rotated: expanded }"
          />
        </div>
      </div>

      <transition name="expand">
        <div data-element="more-details" v-if="expanded">
          <div data-element="basket">
            <line-item
              v-for="(lineItem, index) in lineItems"
              data-element="line-item"
              :getProduct="getProduct"
              :key="`${index}-lineItem`"
              :lineItem="lineItem"
              :hideIncrementor="true"
              :hideEditChoices="true"
              :showQuantity="true"
              :fullWidth="true"
            />
          </div>
        </div>
      </transition>
      <div data-element="order-cost">
        <span data-element="basket-qty">
          {{ basketLengthCopy }}
        </span>
        <table data-element="cost-breakdown">
          <tr>
            <td class="label">Total amount:</td>
            <td>£{{ total | fixedPrice }}</td>
          </tr>
          <tr class="discount" v-if="discount">
            <td class="label">Discount:</td>
            <td>- £{{ discount | fixedPrice }}</td>
          </tr>
        </table>
      </div>
      <dynamic-link
        data-element="terms-link"
        text="Terms and conditions"
        size="xs"
        :link="true"
        href="/terms"
      />
    </div>
    <div data-element="bottom-button-container">
      <btn :text="buttonText" :href="buttonLink" :link="true" size="md" />
    </div>
  </div>
</template>

<script>
import DynamicLink from '~/components/iOrder-core/uiV2/DynamicLink';
import Icon from '~/components/iOrder-core/uiV2/Icon';
import LineItem from '~/components/iOrder-core/basketV2/LineItem';
import Btn from '~/components/iOrder-core/uiV2/Btn';

export default {
  components: {
    Btn,
    DynamicLink,
    Icon,
    LineItem,
  },
  data() {
    return {
      expanded: false,
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
    'orderAtTable',
    'tableNumber',
  ],
  computed: {
    basketLengthCopy() {
      const qty = this.basketCount;
      if (qty === 1) return `${qty} Item`;
      else return `${qty} Items`;
    },
  },
  methods: {
    toggleDetail() {
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='success'] {
  display: flex;
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  @include whenScreenIs(sm) {
    max-width: 448px;
  }
  [data-element='text-top'],
  [data-element='text-bottom'] {
    margin-bottom: 16px;
    padding: 0 16px;
    width: 100%;
    font-family: $secondary-body-font;
    font-size: 16px;
    @include whenScreenIs(sm) {
      max-width: 448px;
      font-weight: 18px;
    }
  }
  [data-element='text-top'] {
    padding-top: 24px;
  }
  [data-element='phone-link'] {
    display: block;
    margin-top: 8px;
    color: $rebrand-orange;
    text-decoration: underline;
  }
  [data-element='table-number'] {
    color: $rebrand-orange;
    font-family: $display-font;
    font-size: 20px;
    text-align: center;
    padding-top: 8px;
  }
  [data-element='center-heading'] {
    width: 100%;
    background-color: #fff;
    padding: 17px 0 16px;
    font-family: $display-font;
    font-size: 28px;
    font-weight: normal;
    line-height: 1.09;
    text-align: center;
    color: $rebrand-orange;
    text-transform: uppercase;
    @include whenScreenIs(sm) {
      margin-top: 24px;
      font-size: 38px;
    }
  }
  [data-element='order-details-container'] {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 16px 16px 0;
    width: 100%;
    [data-element='order-details'] {
      margin-top: 4px;
      width: 100%;
      font-size: 16px;
      font-weight: 400;
      [data-element='order-details-row'] {
        height: 32px;
        [data-element='label'] {
          width: 120px;
        }
        [data-element='order-detail'] {
          text-align: right;
        }
      }
      .bold {
        font-weight: bold;
      }
      .medium {
        font-weight: 700;
      }
      .light {
        font-size: 13px;
        font-weight: 500;
        width: 130px;
      }
    }
    [data-element='show-details-container'] {
      width: 100%;
      display: flex;
      [data-element='show-details'] {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-top: 10px;
        cursor: pointer;
        [data-element='icon'] {
          margin-top: 2px;
          -webkit-transition: all 0.5s ease-in-out;
          -o-transition: all 0.5s ease-in-out;
          transition: all 0.5s ease-in-out;
          &.rotated {
            -webkit-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            transform: rotate(180deg);
          }
        }
        [data-element='text'] {
          width: 95px;
          color: $black;
          font-weight: normal;
          font-size: 16px;
          padding-left: 2px;
        }
      }
    }
    [data-element='more-details'] {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      overflow: hidden;
      opacity: 1;
      transition: 0.5s linear;
      &.expand-enter-active,
      &.expand-leave-active {
        max-height: 999px;
        opacity: 0;
      }
      &.expand-enter, &.expand-leave-to /* .list-leave-active below version 2.1.8 */ {
        max-height: 0;
        opacity: 0;
      }
      [data-element='order-details'] {
        margin-bottom: 18px;
      }
      [data-element='basket'] {
        width: 100%;
        [data-element='line-item'] {
          width: 100%;
        }
      }
      [data-component='email-confirmation'] {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 8px;
        width: 100%;
        &[data-cancel] {
          align-items: left;
        }
        [data-element='message'] {
          font-size: 13px;
          font-weight: 500;
          line-height: 1.23;
          padding-top: 8px;
        }
        [data-element='information'] {
          font-size: 16px;
          font-weight: 100;
          padding: 8px 0 16px;
          [data-element='email'] {
            font-weight: bold;
          }
        }
      }
    }
    [data-element='order-cost'] {
      width: 100%;
      margin: 16px 0;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      text-align: right;
      justify-content: space-between;

      [data-element='cost-breakdown'] {
        .discount {
          td {
            padding-top: 8px;
            font-size: 13px;
          }
        }
        td.label {
          text-align: left;
          font-weight: 500;
          width: 125px;
        }
      }
    }
    [data-element='terms-link'] {
      margin: 10px 0;
    }
  }
  [data-element='sharing-container'] {
    display: flex;
    justify-content: center;
    background-color: $white-three;
    padding: 12px 5px;
    margin: 16px;
    @include whenScreenIs(sm) {
      margin: 16px 0;
    }
    [data-element='text'] {
      width: 216px;
      text-align: left;
      @include whenScreenIs(sm) {
        margin-bottom: 0px;
      }
    }
    [data-element='share-button'] {
      display: block;
      text-align: center;
      width: 88px;
      color: #fff;
      background-color: $rebrand-blue;
      font-family: $font;
      padding: 6px 16px;
      line-height: 1.33;
      font-size: 18px;
      font-weight: normal;
      font-family: $secondary-body-font;
      text-transform: uppercase;
      &:hover,
      &:active {
        cursor: pointer;
        background-color: $rebrand-green;
        color: #fff;
      }
    }
  }
  [data-element='bottom-button-container'] {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    padding: 8px 0;
    width: 100%;
    @include whenScreenIs(sm) {
      margin-top: 40px;
    }
  }
}
</style>
