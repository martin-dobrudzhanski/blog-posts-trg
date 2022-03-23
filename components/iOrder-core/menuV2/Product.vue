<template>
  <div
    data-element="product-and-modal-container"
    :data-disabled="outOfStock"
    @click.self="handleClick"
  >
    <div
      data-component="product"
      :data-large="hasDescription"
      @click.self="handleClick"
    >
      <div data-element="product-heading" @click.self="handleClick">
        <p
          data-element="product-name"
          :data-selected="quantity > 0"
          :data-unavailable="outOfStock"
          @click.self="handleClick"
        >
          <span
            data-element="quantity"
            v-if="quantity"
            @click.self="handleClick"
          >
            x{{ quantity }}
          </span>
          {{ product.displayName }}
        </p>
      </div>
      <p
        data-element="product-description"
        :data-unavailable="outOfStock"
        :data-large="hasDescription"
        @click.self="handleClick"
      >
        {{ description }}
      </p>
      <div
        data-element="product-information"
        :data-fixed="!hasDescription"
        @click.self="handleClick"
      >
        <p
          data-element="from"
          v-if="hasMultiplePortions || hasChoices"
          :data-unavailable="outOfStock"
          @click.self="handleClick"
        >
          from
        </p>
        <p
          data-element="product-price"
          :data-unavailable="outOfStock"
          @click.self="handleClick"
        >
          £{{ displayPrice | fixedPrice }}
        </p>
        <icon
          v-if="isVeg(product.productId)"
          data-element="product-icon"
          icon="veg"
          size="xs"
        />
        <icon
          v-if="isVegan(product.productId)"
          data-element="product-icon"
          icon="vegan"
          size="xs"
        />
      </div>
    </div>

    <transition name="fade">
      <choices-modal
        v-if="showModal"
        :product="product"
        :portions="getProduct(product.productId).portions"
        :defaultPortionId="product.defaultPortionId"
        :choiceGroups="choiceGroups"
        :getProduct="getProduct"
        :getCG="getCG"
        :cgIndex="cgIndex"
        :addItemToBasket="addItemToBasket"
        @close-choices-modal="closeChoicesModal"
      />
    </transition>
  </div>
</template>

<script>
import ChoicesModal from '~/components/iOrder-core/menuV2/ChoicesModal';
import Icon from '~/components/iOrder-core/uiV2/Icon';
import VueScrollTo from 'vue-scrollto';

export default {
  props: {
    product: Object,
    getProduct: Function,
    getCG: Function,
    cgIndex: Function,
    getKeyWord: Function,
    addItemToBasket: Function,
    getItemCount: Function,
    removeItemFromBasket: Function,
    showDescription: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Function,
      default: function () {
        return false;
      },
    },
    isVegan: {
      type: Function,
      default: function () {
        return false;
      },
    },
    getMatchingBasketItemsChoicesAndPortions: Function,
  },
  components: {
    ChoicesModal,
    Icon,
  },
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    productDetails() {
      return this.getProduct(this.product.productId);
    },
    displayPrice() {
      const productDetails = this.productDetails;
      if (!productDetails.portions) {
        return false;
      }
      if (productDetails.portions.length === 1) {
        return productDetails.portions.find(
          (portion) => portion.id === this.product.defaultPortionId
        ).price;
      } else {
        return Math.min(
          ...productDetails.portions.map((portion) => portion.price)
        );
      }
    },
    hasMultiplePortions() {
      return (
        this.productDetails.portions && this.productDetails.portions.length > 1
      );
    },
    choiceGroups() {
      const aztecProduct = this.getProduct(this.product.productId);
      return (
        aztecProduct &&
        aztecProduct.portions &&
        aztecProduct.portions[0] &&
        aztecProduct.portions[0].choices
      );
    },
    hasChoices() {
      return this.choiceGroups && this.choiceGroups.length;
    },
    quantity() {
      return this.getItemCount(this.product.productId);
    },
    outOfStock() {
      return this.productDetails.isOutOfStock;
    },
    hasLongDisplayName() {
      return this.product.displayName.length > 15;
    },
    description() {
      return (
        this.productDetails.displayRecords &&
        this.productDetails.displayRecords[0].description
      );
    },
    descriptionVisible() {
      if (!this.description || this.matchingBasketItems.length > 0) {
        return false;
      }
      return this.showDescription;
    },
    matchingBasketItems() {
      return this.getMatchingBasketItemsChoicesAndPortions(
        this.product.productId
      );
    },
    hasDescription() {
      if (this.description && this.description.length) {
        return true;
      }
      return false;
    },
  },
  methods: {
    handleClick() {
      if (this.outOfStock) return false;
      if (this.hasMultiplePortions || this.hasChoices) {
        this.openChoicesModal();
      } else {
        this.addItemToBasket(this.product);
      }
    },
    openChoicesModal() {
      this.showModal = true;
      setTimeout(() => {
        document.documentElement.setAttribute('data-modal', true);
        document.body.setAttribute('data-modal', true);
      }, 500);
    },
    closeChoicesModal() {
      VueScrollTo.scrollTo(this.$parent.$refs.group, 1, { offset: -60 });
      document.body.removeAttribute('data-modal');
      document.documentElement.removeAttribute('data-modal');
      this.showModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-element='product-and-modal-container'] {
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  &[data-disabled] {
    pointer-events: none;
  }
  [data-component='product'] {
    background-color: $white;
    padding: 10px 8px 30px 8px;
    margin-bottom: 6px;
    position: relative;
    border-bottom: 1px solid $white-two;
    -webkit-tap-highlight-color: transparent;
    &[data-large] {
      min-height: 120px;
      padding-bottom: 8px;
    }
    [data-element='product-heading'] {
      margin-bottom: 7px;
      [data-element='product-name'] {
        font-size: 16px;
        font-weight: normal;
        line-height: 1.19;
        &[data-selected] {
          font-weight: bold;
          [data-element='quantity'] {
            margin-right: 3px;
          }
        }
        &[data-unavailable] {
          color: $grey;
          text-decoration: line-through;
        }
      }
    }
    [data-element='product-description'] {
      color: $grey;
      font-size: 13px;
      font-weight: normal;
      line-height: 1.4;
      &[data-unavailable] {
        color: $grey;
        text-decoration: line-through;
      }
      &[data-large] {
        min-height: 50px;
        padding-bottom: 6px;
      }
    }
    [data-element='product-information'] {
      display: flex;
      align-items: center;
      &[data-fixed] {
        position: absolute;
        bottom: 10px;
        left: 8px;
      }
      [data-element='from'],
      [data-element='product-price'],
      [data-element='product-icon'] {
        margin-right: 3px;
        &[data-unavailable] {
          color: $grey;
          text-decoration: line-through;
        }
      }
      [data-element='product-price'] {
        font-size: 15px;
        line-height: 1.13;
      }
    }
  }
}
</style>
