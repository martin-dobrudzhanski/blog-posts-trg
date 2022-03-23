<template>
  <div
    data-component="line-item"
    :class="{ unavailable: lineItem.unavailable }"
  >
    <div data-element="item-header">
      <p data-element="base-name" :data-wide="fullWidth">
        <span data-element="quantity" v-if="showQuantity">
          {{ quantity }}x
        </span>
        {{ baseName }}
      </p>
      <p data-element="item-price" :data-wide="fullWidth">
        {{ itemPrice | fixedPrice }}
      </p>
    </div>
    <div data-element="secondary-header">
      <div data-element="left-side" :data-wide="fullWidth">
        <div
          data-element="show-choices"
          v-if="lineItem.choiceLines.length"
          @click="showChoices = !showChoices"
        >
          <span data-element="button-text"> View choices </span>
          <Icon
            data-element="show-choices-chevron"
            icon="collapse-arrow-grey"
            size="xxs"
            :class="{ rotated: showChoices }"
            clickable="true"
          />
        </div>
        <transition name="fade">
          <ChoicesModal
            v-if="showModal"
            :product="displayProduct"
            :portions="gotProduct.portions"
            :defaultPortionId="gotProduct.defaultPortionId"
            :choiceGroups="choiceGroups"
            :getProduct="getProduct"
            :getCG="getCG"
            :cgIndex="cgIndex"
            :addItemToBasket="addItemToBasket"
            :choiceLines="lineItem.choiceLines"
            :editBasketChoices="editBasketChoices"
            :basketIndex="basketIndex"
            edit="true"
            @close-ChoicesModal="closeChoicesModal"
          />
        </transition>
      </div>
      <div data-element="quantity-container" v-if="!hideIncrementor">
        <div data-element="remove-container" :data-left="showRemove">
          <transition
            name="fade"
            mode="out-in"
            :duration="{ leave: 100, enter: 200 }"
          >
            <div
              data-element="remove"
              v-if="showRemove"
              @click="decrementBasketItem(lineItem)"
            >
              Remove
            </div>
            <Icon
              icon="icon-minus-round"
              data-element="decrement"
              @click.native="handleDecrementClick"
              v-else
              size="md"
              clickable="true"
            />
          </transition>
        </div>
        <span data-element="quantity">
          {{ quantity }}
        </span>
        <Icon
          icon="icon-plus-round"
          data-element="add"
          @click.native="handleIncrementClick"
          size="md"
          clickable="true"
        />
      </div>
    </div>
    <div data-element="choices" v-if="showChoices" :data-wide="fullWidth">
      <div
        data-element="choice"
        v-if="lineItem.choiceLines.length"
        v-for="choice in lineItem.choiceLines"
        :key="choice.ingredientId"
      >
        <p data-element="choice-name">
          {{ getProduct(choice.ingredientId).displayRecords[0].name }}
        </p>
        <!-- prettier-ignore -->
        <p
          data-element="choice-price"
          v-if="choicePrice(choice.ingredientId)"
          :data-wide="fullWidth"
        >
          +{{ choicePrice(choice.ingredientId) | fixedPrice }}
        </p>
      </div>
      <div
        data-element="edit-choices"
        v-if="!hideEditChoices"
        @click="openChoicesModal"
      >
        Edit choices
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash';

import Icon from '~/components/iOrder-core/uiV3/Icon';
import ChoicesModal from '~/components/iOrder-core/menuV3/ChoicesModal';

export default {
  name: 'LineItem',
  data() {
    return {
      showChoices: false,
      showModal: false,
      showRemove: false
    };
  },
  props: [
    'lineItem',
    'getProduct',
    'removeItemFromBasket',
    'addItemToBasket',
    'incrementBasketItem',
    'decrementBasketItem',
    'getCG',
    'cgIndex',
    'getBasketIndex',
    'editBasketChoices',
    'displayProduct',
    'choiceGroups',
    'hideIncrementor',
    'hideEditChoices',
    'showQuantity',
    'fullWidth'
  ],
  components: {
    Icon,
    ChoicesModal
  },
  computed: {
    gotProduct() {
      const { lineItem, getProduct } = this;
      const product = getProduct(lineItem.ingredientId);
      return product;
    },
    baseName() {
      const { gotProduct } = this;
      if (gotProduct) {
        const payload = get(gotProduct, 'displayRecords[0].name');
        return payload;
      }
      return false;
    },
    itemPrice() {
      const { gotProduct, lineItem } = this;
      const portions = gotProduct && gotProduct.portions;
      if (portions) {
        const basePrice = portions.find(
          portionObject => portionObject.id === lineItem.portionTypeId
        ).price;
        const choiceSum = this.lineItem.choiceLines.reduce(
          (sum, choiceObject) => {
            const aztecChoice = this.getProduct(choiceObject.ingredientId);
            const aztecPrice = get(aztecChoice, 'portions[0].price');
            return sum + (aztecPrice || 0);
          },
          0
        );
        return basePrice + choiceSum;
      }
      return false;
    },
    quantity() {
      return this.lineItem && this.lineItem.quantity;
    },
    portionDescription() {
      const { gotProduct } = this;
      return gotProduct.portions.find(
        portionObject => portionObject.id === this.lineItem.portionTypeId
      ).name;
    },
    choicesArray() {
      const { lineItem } = this;
      const choiceLines = get(lineItem, 'choiceLines');
      return choiceLines;
    },
    basketIndex() {
      return this.getBasketIndex(this.lineItem);
    }
  },
  methods: {
    choicePrice(ingredientId) {
      const aztecChoice = this.getProduct(ingredientId);
      return (
        (aztecChoice.portions &&
          aztecChoice.portions[0] &&
          aztecChoice.portions[0].price) ||
        0
      );
    },
    openChoicesModal() {
      document.body.setAttribute('data-modal', true);
      document.documentElement.setAttribute('data-modal', true);
      this.showModal = true;
    },
    closeChoicesModal() {
      document.body.removeAttribute('data-modal');
      document.documentElement.removeAttribute('data-modal');
      this.showModal = false;
    },
    handleDecrementClick() {
      if (this.lineItem.quantity === 1 && !this.showRemove) {
        return (this.showRemove = true);
      } else {
        return this.decrementBasketItem(this.lineItem);
      }
    },
    handleIncrementClick() {
      const { gotProduct, quantity, choicesArray, lineItem } = this;
      const portionTypeId = lineItem.portionTypeId;
      this.showRemove = false;

      this.incrementBasketItem(
        gotProduct,
        quantity,
        choicesArray,
        portionTypeId
      );
    }
  },
  destroyed() {
    this.showRemove = false;
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='line-item'] {
  font-family: $navigation-font;
  color: $greyish-brown;
  font-size: 18px;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-bottom: 2px dotted $greyish-brown;
  &.unavailable {
    border: 1px solid $pinkish-red;
    background-color: #fde8e8;
  }
  [data-element='item-header'],
  [data-element='secondary-header'] {
    width: 100%;
    display: flex;
  }
  [data-element='item-header'] {
    padding: 0;
    margin-bottom: 6px;
    [data-element='base-name'] {
      width: 220px;
      margin-right: 0.5rem;
      &[data-wide] {
        padding-left: 0;
      }
    }
    [data-element='item-price'] {
      text-align: right;
      flex: 1;
      &[data-wide] {
        padding-right: 0;
      }
    }
  }
  [data-element='secondary-header'] {
    align-items: center;
    [data-element='left-side'] {
      flex: 1;
      height: 100%;
      &[data-wide] {
        padding-left: 0;
      }
      [data-element='show-choices'] {
        display: inline-flex;
        cursor: pointer;
        [data-element='button-text'] {
          font-family: $font;
          font-size: 14px;
          padding-right: 4px;
        }
        [data-element='show-choices-chevron'] {
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
      }
    }
    [data-element='quantity-container'] {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      padding: 5px 0;

      [data-component='icon'] {
        background-size: contain;
      }

      [data-element='remove-container'] {
        display: flex;
        align-items: center;
        [data-element='remove'] {
          font-family: $font;
          font-size: 14px;
          color: $pale-red;
          cursor: pointer;
          padding-top: 2px;
        }
      }
      [data-element='add'] {
        right: 0;
      }
      [data-element='quantity'] {
        padding-top: 3px;
        width: 20px;
        text-align: center;
      }
    }
  }
  [data-element='choices'] {
    font-family: $font;
    font-size: 14px;
    color: $greyish-brown;
    &[data-wide] {
      padding-left: 0;
    }
    [data-element='choice'] {
      display: flex;
      padding-top: 8px;
      &:first-of-type {
        padding-top: 12px;
      }
      [data-element='choice-name'] {
        width: 220px;
      }
      [data-element='choice-price'] {
        flex: 1;
        text-align: right;
        &[data-wide] {
          padding-right: 0;
        }
      }
    }
    [data-element='edit-choices'] {
      width: fit-content;
      margin: 12px 0 4px;
      text-decoration: underline;
      color: $grey;
      cursor: pointer;
    }
  }
}
</style>
