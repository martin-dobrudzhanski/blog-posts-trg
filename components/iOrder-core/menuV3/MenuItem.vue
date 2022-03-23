<template>
  <div class="wrapper">
    <div class="menu-item" @click="openChoicesModal()">
      <div class="menu-item__new-icons">
        <img
          v-if="newIcon"
          class="menu-item__new-icon"
          :src="newIcon.url"
          :alt="newIcon.name"
          width="auto"
          height="32"
        />
      </div>
      <img
        class="menu-item__image"
        :src="image || placeholder"
        :alt="displayName"
      />
      <div class="menu-item__content">
        <p class="menu-item__name">{{ renderedName }}</p>
        <div class="menu-item__content__middle">
          <ul
            class="menu-item__content__icons"
            v-if="itemIcons && itemIcons.length"
          >
            <li
              class="menu-item__content__icon"
              v-for="(icon, index) in itemIcons"
              :key="index"
            >
              <img
                class="menu-item__content__icon__image"
                :src="icon.url"
                :alt="icon.name"
                width="auto"
                height="24"
              />
            </li>
          </ul>
        </div>
        <p v-if="productDescription" class="menu-item__text">
          {{ shortenDescription(productDescription) }}
        </p>
        <div class="menu-item__footer">
          <p class="menu-item__price">
            <span class="menu-item__price--text">From</span>
            <span v-if="originalPrice" class="menu-item__price--value">{{
              originalPrice
            }}</span>
            <span class="menu-item__price--discounted">{{
              displayPrice | fixedPrice
            }}</span>
          </p>
          <div v-if="quantity" class="menu-item__quantity-container">
            <Icon icon="icon-minus-round" size="md" clickable="true" />
            <p class="menu-item__quantity-text">
              {{ quantity }}
            </p>
            <Icon icon="icon-plus-round" size="md" clickable="true" />
          </div>
          <div v-else class="menu-item__cta">
            <Icon
              icon="icon-plus-round"
              class="menu-item__icon"
              size="md"
              clickable="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="modal-wapper">
      <transition name="fade">
        <ChoicesModal
          v-if="showModal"
          :product="product"
          :portions="portionsGroup"
          :defaultPortionId="defaultPortionId"
          :choiceGroups="choiceGroups"
          :getProduct="getProduct"
          :getCG="getCG"
          :cgIndex="cgIndex"
          :nutritionIcons="itemIcons"
          :newIcon="newIcon"
          :quantity="quantity"
          @addToBasket="addChoiceToBasket"
          @removeFromBasket="removeFromBasket"
          @close-choices-modal="closeChoicesModal"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';

import ChoicesModal from '~/components/iOrder-core/menuV3/ChoicesModal';
import Icon from '~/components/iOrder-core/uiV3/Icon';

export default {
  name: 'MenuItem',
  components: {
    ChoicesModal,
    Icon
  },
  inheritAttrs: false,
  props: {
    getCG: Function,
    cgIndex: Function,
    product: Object,
    getProduct: Function,
    getItemCount: Function,
    displayName: {
      type: String,
      required: true
    },
    choices: {
      type: [Array, Boolean],
      default: null
    },
    defaultPortionId: {
      type: [String, Number],
      default: null
    },
    displayRecordId: {
      type: [String, Number],
      default: null
    },
    mayStock: {
      type: [String, Number],
      default: null
    },
    productId: {
      type: [String, Number],
      default: null
    },
    showPrices: {
      type: [String, Number],
      default: null
    },
    image: {
      type: [String, Object],
      default: null
    },
    originalPrice: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    renderedName() {
      let { displayName } = this;
      const lcDisplayName = displayName.toLowerCase();
      const substrings = ['(vg)', '(v)', '(l)'];
      const hasSubstring = substrings.some(v => lcDisplayName.includes(v));
      if (hasSubstring) {
        displayName = displayName.replace(/ *\([^)]*\) */g, '');
      }
      if (displayName.length > 19) {
        return displayName.substring(0, 16) + '...';
      }
      return displayName;
    },
    placeholder() {
      return require('~/assets/img/iorder-coreV2/icons/placeholder-menu.png');
    },
    productDescription() {
      const { productDetails } = this;
      const description = get(productDetails, 'displayRecords[0].description');
      return description;
    },
    productName() {
      const { productDetails } = this;
      const name = get(productDetails, 'displayRecords[0].name');
      return name;
    },
    productDetails() {
      const { productId } = this;
      return this.getProduct(productId);
    },
    quantity() {
      return this.getItemCount(this.product.productId);
    },
    displayPrice() {
      const { productDetails, defaultPortionId } = this;
      if (!productDetails.portions) {
        return false;
      }
      if (productDetails.portions.length === 1) {
        return productDetails.portions.find(
          portion => portion.id === defaultPortionId
        ).price;
      } else {
        return Math.min(
          ...productDetails.portions.map(portion => portion.price)
        );
      }
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
    hasMultiplePortions() {
      return this.portionsGroup && this.portionsGroup.length > 1;
    },
    portionsGroup() {
      return this.getProduct(this.product.productId).portions;
    },
    hasChoices() {
      return this.choiceGroups && this.choiceGroups.length;
    },
    newIcon() {
      const { itemIcons } = this;

      if (itemIcons) {
        const containeNewIcon = itemIcons.find(icon => {
          const regex = new RegExp('new(?! recipe)', 'gi');

          return regex.test(icon.name)
            ? { name: icon.name, url: icon.iconUrl }
            : null;
        });

        return containeNewIcon;
      }

      return false;
    },
    itemIcons() {
      const IDs = this.$store.getters['clickAndCollect/getProductIcons'](
        this.productId
      );
      const array = IDs.reduce((array, id) => {
        const icon = this.$store.getters['clickAndCollect/getKeyWord'](id);
        const regex = new RegExp('new recipe', 'gi');
        const isNewRecipe = regex.test(icon.name);

        if (icon && icon.iconUrl && !isNewRecipe)
          array.push({ url: icon.iconUrl, name: icon.name });

        return array;
      }, []);

      return array;
    }
  },
  methods: {
    addChoiceToBasket(i) {
      this.$emit('addToBasket', i);
    },
    addToBasket(i) {
      if (this.outOfStock) return false;
      if (this.hasMultiplePortions || this.hasChoices) {
        this.openChoicesModal();
      } else {
        this.$emit('addToBasket', i);
      }
    },
    removeFromBasket(i) {
      const hasChoices = this.hasMultiplePortions || this.hasChoices;

      this.$emit('removeFromBasket', i, hasChoices);
    },
    openChoicesModal() {
      this.showModal = true;
    },
    closeChoicesModal() {
      this.showModal = false;
    },
    shortenDescription(desc) {
      if (this.itemIcons && this.itemIcons.length) {
        if (desc.length > 43) {
          return desc.substring(0, 40) + '...';
        }
      } else if (desc.length > 80) {
        return desc.substring(0, 77) + '...';
      }
      return desc;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.wrapper {
  overflow: hidden;
  min-height: 150px;
  position: relative;
}
.menu-item {
  display: flex;
  font-family: $navigation-font;
  color: $greyish-brown;
  border-radius: 10px;
}
.menu-item__name {
  font-size: 16px;
}
.menu-item__image {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}
.menu-item__content {
  width: 100%;
  max-height: 140px;
  display: flex;
  flex-direction: column;
  margin: 5px 0 5px -5rem;
  padding: 12px 11px 8px 100px;
  border-radius: 10px;
  background-color: $very-light-pink;
  @include whenScreenIs(xs) {
    margin: 0 0 0 -5rem;
    max-height: 150px;
  }
}
.menu-item__text {
  font-family: $font;
  font-size: 14px;
  margin-top: 0.5rem;
}
.menu-item__footer {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  align-items: flex-end;
}
.menu-item__icon {
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  bottom: 2px;
  right: 2px;

  @media (hover: hover) {
    &:hover {
      cursor: pointer;
    }
  }
}
.menu-item__price {
  position: relative;
  font-family: $font;
  font-size: 14px;
  color: $greyish-brown;
  &--value {
    text-decoration-line: line-through;
    margin-left: 4px;
  }
  &--discounted {
    font-size: 20px;
    font-weight: bold;
    margin-left: 4px;
  }
}
.menu-item__quantity {
  &-container {
    font-size: 20px;
    display: flex;

    &.justified {
      justify-content: center;
      margin-top: 2rem;
    }
  }
  &-text {
    padding: 5px 4px 0;
  }
}
.menu-item__cta {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 5px;
  height: 50px;
  width: 50px;
  border-radius: 0 0 10px;
  background-color: $pale-red;
  clip-path: polygon(100% 100%, 100% 0%, 0% 100%);
}
.menu-item__content__icons {
  display: flex;
  align-items: center;
  margin: 0.5rem 0 0;
}
.menu-item__content__middle {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.menu-item__content__icon__image {
  width: auto;
  height: 24px;
  margin-right: 0.5rem;
}
.menu-item__new-icon {
  width: auto;
  height: 32px;
  margin-right: 0.5rem;
}
.menu-item__new-icons {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 2;
}
.menu-item__content__info-icon {
  width: 1.5rem;
  height: auto;
  margin-right: 0.5rem;

  &:hover {
    cursor: pointer;
  }
}

.menu-item__info-modal--container {
  text-align: center;
}
.menu-item__info-modal__content {
  padding: 12rem 2rem 2rem;
}
.menu-item__info-modal__image {
  width: 232px;
  height: 232px;
  border-radius: 50%;
  position: relative;
  z-index: 1;
}
.menu-item__info-modal__heading {
  font-family: $navigation-font;
  text-align: left;
  margin-top: 1rem;
  color: $greyish-brown;
  font-size: 24px;
}
.menu-item__info-modal__description {
  text-align: left;
  font-family: $font;
  font-size: 14px;
  margin-top: 1rem;
}
.basket__button {
  align-items: center;
  display: flex;
  justify-content: center;
  background-color: $greyish-brown;
  border-radius: 20px;
  color: $white;
  border: 0;
  padding: 0.25rem;
  width: 300px;
  height: 40px;
  margin: 0;
  font-family: $font;
  font-size: 18px;
  font-weight: bold;
  transition: box-shadow 0.2s ease;
  &:hover {
    cursor: pointer;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    color: $mac-and-cheese;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.basket__button__wrapper {
  margin-top: 16px;
  display: flex;
  align-content: center;
  justify-content: center;
  background-color: $very-light-pink;
}
.basket__button__icon {
  margin-right: 0.5rem;
}
.basket__button__text {
  padding-top: 5px;
}
</style>
