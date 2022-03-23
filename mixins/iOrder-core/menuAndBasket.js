import meta from '~/mixins/meta';
import hidefooter from '~/mixins/hidefooter';
import hidePrivacyBanners from '~/mixins/hidePrivacyBanners';
import clickAndCollect from '~/mixins/clickAndCollect';

export default {
  data() {
    return {
      app: ''
    };
  },
  mixins: [meta, hidefooter, clickAndCollect, hidePrivacyBanners],
  computed: {
    basket() {
      return this.$store.getters[`${this.app}/getBasket`];
    },
    basketCount() {
      return this.$store.getters[`${this.app}/getBasketCount`];
    },
    /**
     * I've removed this.$store.getters['iorderCheckout/getBasketTotal'] from the logic to fix
     * the problem of the value not being reactive to the basket items.
     *
     * TODO:km Use the iOrder response, but reset and re-pull the value if the basket is mutated.
     *
     * @returns {string} total of the basket
     */
    basketTotal() {
      return this.$store.getters[`${this.app}/getBasketTotal`] || '0.00';
    },
    currentLocation() {
      return (
        this.content &&
        this.content.restaurant &&
        this.content.restaurant.fields
      );
    },
    discountCopy() {
      const restaurantDiscount =
        this.currentLocation &&
        this.currentLocation.clickAndCollectDiscountCopy;
      return (
        restaurantDiscount || (this.content && this.content.basketDiscountCopy)
      );
    }
  },
  methods: {
    initMixin(app) {
      this.app = app;
    },
    cgIndex(productId, choiceGroupId) {
      const aztecProduct = this.$store.getters[`${this.app}/getProduct`](
        productId
      );
      return aztecProduct.portions[0].choices.findIndex(choiceGroup => {
        return choiceGroup.choiceId === choiceGroupId;
      });
    },
    editBasketChoices(choicesArray, basketIndex) {
      return this.$store.dispatch(`${this.app}/editBasketChoices`, {
        basketIndex,
        choicesArray
      });
    },
    decrementBasketItem(lineItem) {
      this.$store.dispatch(`${this.app}/removeItemFromBasket`, { lineItem });
    },
    getBasketIndex(lineItem) {
      return this.$store.getters[`${this.app}/getBasketIndex`](lineItem);
    },
    getCG(groupId) {
      return this.$store.getters[`${this.app}/getChoiceGroup`](groupId) || {};
    },
    getChoiceGroups(lineItem) {
      // orderAtTable searches through 2 separate menus - food and drink
      if (this.app === 'orderAtTable') {
        return this.$store.getters['orderAtTable/getChoices'](
          lineItem.ingredientId
        );
      }
      const menu = this.$store.getters[`${this.app}/getMenu`];
      let choices;

      menu.display.displayGroups.forEach(displayGroup => {
        displayGroup.items.forEach(item => {
          if (
            item.itemType === 'product' &&
            item.product.productId === lineItem.ingredientId
          ) {
            const aztecProduct = this.$store.getters[`${this.app}/getProduct`](
              item.product.productId
            );
            choices =
              aztecProduct &&
              aztecProduct.portions &&
              aztecProduct.portions[0] &&
              aztecProduct.portions[0].choices;
          }
        });
      });
      return choices;
    },
    getDisplayProduct(lineItem) {
      // orderAtTable searches through 2 separate menus - food and drink
      if (this.app === 'orderAtTable') {
        return this.$store.getters['orderAtTable/getDisplayItem'](
          lineItem.ingredientId
        );
      } else {
        const menu = this.$store.getters[`${this.app}/getMenu`];
        let product;

        menu.display.displayGroups.forEach(displayGroup => {
          displayGroup.items.forEach(item => {
            if (
              item.itemType === 'product' &&
              item.product.productId === lineItem.ingredientId
            ) {
              product = item.product;
            }
          });
        });
        return product;
      }
    },
    getItemCount(productId) {
      return this.$store.getters[`${this.app}/getItemCount`](productId);
    },
    getKeyWord(keywordId) {
      return this.$store.getters[`${this.app}/getKeyWord`](keywordId) || {};
    },
    getProduct(productId) {
      return this.$store.getters[`${this.app}/getProduct`](productId) || {};
    },
    incrementBasketItem(product, quantity, choicesArray, portionTypeId) {
      if (this.getItemCount(product.id) >= 20) return false;
      return this.$store.dispatch(`${this.app}/incrementBasketItem`, {
        product,
        quantity,
        choicesArray,
        portionTypeId
      });
    }
  }
};
