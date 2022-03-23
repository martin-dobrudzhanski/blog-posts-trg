<template>
  <div
    data-component="line-item"
    :class="{ unavailable: unavailable }"
    ref="lineItem"
  >
    <div data-element="item-header">
      <p data-element="base-name" :data-wide="fullWidth">
        <span data-element="quantity" v-if="showQuantity">
          {{ quantity }}x
        </span>
        {{ baseName }}
      </p>
      <p data-element="item-price" :data-wide="fullWidth">
        £{{ itemPrice | fixedPrice }}
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
          <icon
            data-element="show-choices-chevron"
            icon="collapse-arrow-light"
            size="xxs"
            :class="{ rotated: showChoices }"
          />
        </div>
        <transition name="fade">
          <choices-modal
            v-if="showModal"
            :product="displayProduct"
            :portions="product.portions"
            :defaultPortionId="product.defaultPortionId"
            :choiceGroups="choiceGroups"
            :getProduct="getProduct"
            :getCG="getCG"
            :cgIndex="cgIndex"
            :addItemToBasket="addItemToBasket"
            :choiceLines="lineItem.choiceLines"
            :editBasketChoices="editBasketChoices"
            :basketIndex="basketIndex"
            edit="true"
            @close-choices-modal="closeChoicesModal"
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
            <icon
              icon="remove-icon"
              data-element="decrement"
              @click.native="handleDecrementClick"
              v-else
              size="sm"
              clickable="true"
            />
          </transition>
        </div>
        <span data-element="quantity">
          {{ quantity }}
        </span>
        <icon
          icon="add-icon"
          data-element="add"
          @click.native="handleIncrementClick"
          size="sm"
          clickable="true"
        />
      </div>
    </div>
    <div data-element="choices" v-if="showChoices" :data-wide="fullWidth">
      <div
        data-element="choice"
        v-if="lineItem.choiceLines.length"
        v-for="choice in lineItem.choiceLines"
      >
        <p data-element="choice-name">
          {{ getProduct(choice.ingredientId).displayRecords[0].name }}
        </p>
        <p
          data-element="choice-price"
          v-if="choicePrice(choice.ingredientId)"
          :data-wide="fullWidth"
        >
          £{{ choicePrice(choice.ingredientId) | fixedPrice }}
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
import Icon from '~/components/iOrder-core/uiV2/Icon';
import ChoicesModal from '~/components/iOrder-core/menuV2/ChoicesModal';
import VueScrollTo from 'vue-scrollto';

export default {
  data() {
    return {
      showChoices: false,
      showModal: false,
      showRemove: false,
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
    'fullWidth',
    'unavailable',
  ],
  components: {
    Icon,
    ChoicesModal,
  },
  computed: {
    baseName() {
      return this.getProduct(this.lineItem.ingredientId).displayRecords[0].name;
    },
    itemPrice() {
      const basePrice = this.getProduct(
        this.lineItem.ingredientId
      ).portions.find(
        (portionObject) => portionObject.id === this.lineItem.portionTypeId
      ).price;
      const choiceSum = this.lineItem.choiceLines.reduce(
        (sum, choiceObject) => {
          const aztecChoice = this.getProduct(choiceObject.ingredientId);
          return (
            sum +
            ((aztecChoice.portions &&
              aztecChoice.portions[0] &&
              aztecChoice.portions[0].price) ||
              0)
          );
        },
        0
      );
      return basePrice + choiceSum;
    },
    quantity() {
      return this.lineItem.quantity;
    },
    portionDescription() {
      return this.getProduct(this.lineItem.ingredientId).portions.find(
        (portionObject) => portionObject.id === this.lineItem.portionTypeId
      ).name;
    },
    choicesArray() {
      return this.lineItem.choiceLines;
    },
    product() {
      return this.getProduct(this.lineItem.ingredientId);
    },
    basketIndex() {
      return this.getBasketIndex(this.lineItem);
    },
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
      this.showModal = true;
      setTimeout(() => {
        document.documentElement.setAttribute('data-modal', true);
        document.body.setAttribute('data-modal', true);
      }, 500);
    },
    closeChoicesModal() {
      VueScrollTo.scrollTo(this.$refs.lineItem, 1, { offset: -60 });
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
      this.showRemove = false;
      this.incrementBasketItem(this.product, this.quantity, this.choicesArray);
    },
  },
  destroyed() {
    this.showRemove = false;
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='line-item'] {
  padding-bottom: 16px;
  &.unavailable {
    border: 1px solid $scarlet;
    background-color: $very-light-pink;
  }
  &:not(:last-child) {
    border-bottom: 1px solid $very-light-pink;
    &.unavailable {
      border-bottom: 1px solid $scarlet;
    }
  }
  [data-element='item-header'],
  [data-element='secondary-header'] {
    width: 100%;
    display: flex;
  }
  [data-element='item-header'] {
    padding: 16px 0 10px;
    [data-element='quantity'] {
      color: $black;
      font-weight: 700;
      font-size: 16px;
    }
    [data-element='base-name'] {
      width: 220px;
      padding-left: 10px;
      font-size: 16px;
      font-weight: bold;
      &[data-wide] {
        padding-left: 0;
      }
    }
    [data-element='item-price'] {
      text-align: right;
      font-size: 16px;
      font-weight: bold;
      flex: 1;
      padding-right: 10px;
      &[data-wide] {
        padding-right: 0;
      }
    }
  }
  [data-element='secondary-header'] {
    padding-right: 10px;
    [data-element='left-side'] {
      flex: 1;
      height: 100%;
      padding-left: 10px;
      &[data-wide] {
        padding-left: 0;
      }
      [data-element='show-choices'] {
        display: inline-flex;
        cursor: pointer;
        [data-element='button-text'] {
          color: $grey;
          font-size: 16px;
          font-weight: normal;
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
      [data-element='remove-container'] {
        display: flex;
        align-items: center;
        [data-element='remove'] {
          font-size: 14px;
          font-weight: bold;
          color: $rebrand-orange;
          cursor: pointer;
        }
      }
      [data-element='add'] {
        right: 0;
      }
      [data-element='quantity'] {
        font-size: 14px;
        font-weight: bold;
        color: $black;
        width: 20px;
        text-align: center;
      }
    }
  }
  [data-element='choices'] {
    padding-left: 10px;
    &[data-wide] {
      padding-left: 0;
    }
    [data-element='choice'] {
      display: flex;
      padding-top: 8px;
      &:first-of-type {
        padding-top: 12px;
      }
      [data-element='choice-name'],
      [data-element='choice-price'] {
        font-size: 16px;
        font-weight: normal;
      }
      [data-element='choice-name'] {
        width: 220px;
      }
      [data-element='choice-price'] {
        flex: 1;
        padding-right: 10px;
        text-align: right;
        &[data-wide] {
          padding-right: 0;
        }
      }
    }
    [data-element='edit-choices'] {
      margin: 12px 0 4px;
      font-size: 16px;
      font-weight: normal;
      text-decoration: underline;
      color: $grey;
      cursor: pointer;
    }
  }
}
</style>
