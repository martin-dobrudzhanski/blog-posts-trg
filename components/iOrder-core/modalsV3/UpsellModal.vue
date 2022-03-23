<template>
  <div class="upsell-modal">
    <div class="upsell-modal__image-container">
      <img
        class="upsell-modal__image"
        :src="image"
        :alt="product.displayName"
      />
    </div>
    <div class="modal-container">
      <div class="upsell-modal__header">
        <div class="round-circle" @click="handleSkip">
          <Icon
            class="close-modal-icon"
            icon="close-modal"
            size="md"
            clickable="true"
          />
        </div>
      </div>
      <div class="upsell-modal__content">
        <h2 class="upsell-modal__content__heading" v-if="heading">
          {{ heading }}
        </h2>
        <p class="upsell-modal__content__text" v-if="text">{{ text }}</p>
        <p class="upsell-modal__content__details">
          {{ product.displayName }} {{ displayPrice | fixedPrice }}
        </p>
        <p class="upsell-modal__content__details--additional">
          {{ offerText }}
        </p>
      </div>
      <div class="upsell-modal__footer">
        <BaseButton
          size="medium"
          class="upsell-modal__cta left"
          @click.native="handleSkip"
        >
          Skip
        </BaseButton>
        <BaseButton
          size="medium"
          class="upsell-modal__cta right"
          @click.native="handleAdd"
        >
          <Icon class="basket" icon="bag" size="md" clickable="true" />
          <span class="cta-text">Add to basket</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';
import BaseButton from '~/components/buttons/BaseButton';

export default {
  name: 'UpsellModal',
  components: {
    Icon,
    BaseButton
  },
  data() {
    return {
      selectedPortionId: this.defaultPortionId,
      selectedChoices: []
    };
  },
  props: [
    'addItemToBasket',
    'product',
    'image',
    'getProduct',
    'heading',
    'text',
    'offerText'
  ],
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
          portion => portion.id === this.product.defaultPortionId
        ).price;
      } else {
        return Math.min(
          ...productDetails.portions.map(portion => portion.price)
        );
      }
    },
    textSize() {
      return this.offerText.length > 6 ? 'small-text' : '';
    },
    upsellImage() {
      return {
        backgroundImage: `url('${this.image}')`
      };
    }
  },
  methods: {
    handleAdd() {
      this.addItemToBasket(this.product);
      this.$router.push(
        `/restaurants/${this.$store.state.clickAndCollect.location.slug}/takeaway/basket`
      );
      this.$emit('close-upsell-modal');
    },
    handleSkip() {
      this.$router.push(
        `/restaurants/${this.$store.state.clickAndCollect.location.slug}/takeaway/basket`
      );
      this.$emit('close-upsell-modal');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.upsell-modal {
  position: fixed;
  z-index: 99999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.3);
}
.modal-container {
  position: relative;
  color: $greyish-brown;
  margin-top: -12rem;
  padding: 12rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 9px;
  background-color: $very-light-pink;
  display: flex;
  @include whenScreenIs(xs) {
    max-width: 480px;
    max-height: 500px;
    margin-left: 1rem;
    margin-right: 1rem;
  }
  @include whenScreenIs(sm) {
    height: 500px;
    width: 480px;
    padding-bottom: 0;
    max-height: none;
  }
}
.upsell-modal__image-container {
  z-index: 1;
  text-align: center;
}
.upsell-modal__image {
  width: 232px;
  height: 232px;
  border-radius: 50%;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
}
.upsell-modal__offer-text {
  min-width: 5rem;
  height: 2rem;
  background-color: red;
  transform: skewX(-30deg);
  transform-origin: top;
  margin: 10px;
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  border-radius: 10px;
  font-weight: bold;
  padding: 0.5rem 1rem;
  > span {
    transform: skewX(30deg);
  }
}
.upsell-modal__content {
  font-family: $navigation-font;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem 2rem;
}
.upsell-modal__content__heading {
  font-size: 24px;
  line-height: normal;
  text-align: left;
}
.upsell-modal__content__text {
  font-size: 18px;
  margin-top: 0.5rem;
  text-align: left;
  line-height: 1;
  padding-bottom: 1rem;
  border-bottom: 2px dotted $greyish-brown;
}
.upsell-modal__content__details {
  font-size: 18px;
  margin-top: 1rem;
  line-height: normal;
}
.upsell-modal__content__details--additional {
  font-family: $font;
  font-size: 14px;
}
.upsell-modal__footer {
  display: flex;
  margin-top: auto;
  margin-bottom: 2rem;
}
.upsell-modal__cta {
  &.left {
    margin-right: 1rem;
  }
  .cta-text {
    margin-top: 3px;
  }
}
.round-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: $white;
  position: absolute;
  top: 16px;
  right: 16px;
  text-align: center;
  align-items: center;
  display: flex;

  .close-modal-icon {
    margin: auto;
  }
}
</style>
