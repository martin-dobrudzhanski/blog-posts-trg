export default {
  data() {
    return {
      content: null,
      locationInfoStored: null,
      loaded: null,
      showModal: false,
      emptyText: 'Your basket is empty',
      loading: false
    };
  },
  computed: {
    menu() {
      return this.$store.getters[`${this.app}/getMenu`];
    },
    basketLink() {
      return `/restaurants/${this.locationSlug}/${this.appSlug}/basket`;
    },
    locationSlug() {
      return (
        this.$store.getters[`${this.app}/getLocation`] &&
        this.$store.getters[`${this.app}/getLocation`].slug
      );
    },
    appSlug() {
      if (this.app === 'clickAndCollect') {
        return 'takeaway';
      }
    }
  },
  methods: {
    addItemToBasket(product, portionModifier, choicesArray) {
      if (this.getItemCount(product.productId) >= 20) return false;
      return this.$store.dispatch(`${this.app}/addItemToBasket`, {
        product,
        portionModifier,
        choicesArray
      });
    },
    getMatchingBasketItemsChoicesAndPortions(productId) {
      return this.$store.getters[
        `${this.app}/getMatchingBasketItemsChoicesAndPortions`
      ](productId);
    },
    goBack() {
      if (this.locationSlug) {
        this.$router.push(`/restaurants/${this.locationSlug}/${this.appSlug}`);
      } else {
        this.$router.push(`/${this.appSlug}`);
      }
    },
    removeItemFromBasket(productId) {
      return this.$store.dispatch(
        `${this.app}/removeLastMatchingProductFromBasket`,
        { productId }
      );
    },
    openUpsellModal() {
      document.body.setAttribute('data-modal', true);
      document.documentElement.setAttribute('data-modal', true);
      this.showModal = true;
      this.$store.commit(`${this.app}/setUpsellModalDisplayed`);
    },
    closeUpsellModal() {
      document.body.removeAttribute('data-modal');
      document.documentElement.removeAttribute('data-modal');
      this.showModal = false;
    },
    handleCheckoutBtnClick() {
      const upsellProduct = this.$store.getters[`${this.app}/getUpsellProduct`];
      const upsellImage = this.$store.getters[`${this.app}/getUpsellImage`];
      let outOfStock;
      let inBasket;

      if (upsellProduct && upsellImage) {
        outOfStock = this.getProduct(upsellProduct.productId).isOutOfStock;
        inBasket = this.getItemCount(upsellProduct.productId);
      }

      if (this.loading) {
        return false;
      }

      this.loading = true;

      if (
        this.content.globallyEnabled === 'enabled' &&
        upsellProduct &&
        upsellImage &&
        !outOfStock &&
        !inBasket &&
        !this.$store.getters[`${this.app}/upsellModalDisplayed`]
      ) {
        this.openUpsellModal();
      } else {
        this.$router.push(
          `/restaurants/${this.locationSlug}/${this.appSlug}/basket`
        );
      }
    }
  }
};