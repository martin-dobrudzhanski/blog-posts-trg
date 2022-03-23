<template>
  <div
    data-component="choices-modal"
    @click.self="$emit('close-choices-modal')"
  >
    <div class="content__image-container">
      <img
        class="content__image"
        :src="productImage || placeholder"
        alt="product image"
      />
    </div>
    <div data-element="modal-container">
      <div data-element="modal-header" @click="$emit('close-choices-modal')">
        <div class="round-circle">
          <Icon
            class="close-modal-icon"
            icon="close-modal"
            size="md"
            clickable="true"
          />
        </div>
        <img
          v-if="newIcon"
          class="modal-header__new-icon"
          :src="newIcon.url"
          :alt="newIcon.name"
          width="auto"
          height="24"
        />
      </div>
      <div data-element="content-container" id="content-container">
        <div class="content__content">
          <h3 class="content__heading" v-if="product.displayName">
            {{ product.displayName }}
          </h3>
          <ul
            v-if="nutritionIcons && nutritionIcons.length"
            class="choice__nutrition__icons"
          >
            <li
              class="choice__nutrition__icon"
              v-for="(icon, index) in nutritionIcons"
              :key="index"
            >
              <img
                class="choice__nutrition__icon__image"
                :src="icon.url"
                :alt="icon.name"
                width="auto"
                height="24"
              />
            </li>
          </ul>
          <p data-element="description" v-if="description">
            {{ description }}
          </p>
          <PortionsGroup
            v-if="portions.length > 1"
            :portions="portions"
            :selectedPortionId="selectedPortionId"
            :selectPortion="selectPortion"
          />
          <div data-element="choice-groups-container">
            <ChoiceGroup
              data-element="choice-group"
              v-for="(choiceGroup, i) in choiceGroups"
              :key="i"
              :choiceGroup="choiceGroup"
              :getProduct="getProduct"
              :getCG="getCG"
              :cgIndex="cgIndex(product.productId, choiceGroup.choiceId)"
              :selectChoice="selectChoice"
              :deselectChoice="deselectChoice"
              :selectedChoices="selectedChoices"
              :scrollToId="getScrollToId(i)"
              :numChoiceGroups="getNumChoiceGroups"
              :index="i"
            />
          </div>
        </div>
      </div>
      <div class="basket__button__wrapper">
        <div v-if="!choiceGroups.length" class="menu-item__quantity-container">
          <Icon
            icon="icon-minus-round"
            size="md"
            clickable="true"
            @click.native="removeFromBasket()"
          />
          <p class="menu-item__quantity-text">
            {{ quantity || 0 }}
          </p>
          <Icon
            icon="icon-plus-round"
            size="md"
            clickable="true"
            @click.native="addToBasket()"
          />
        </div>
        <button
          class="basket__button"
          @click="handleClick"
          :disabled="!requiredSelectionsSelected"
        >
          <Icon class="basket__button__icon" icon="bag" size="md" />
          <span class="basket__button__text">Add to basket</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PortionsGroup from '~/components/iOrder-core/menuV3/PortionsGroup';
import ChoiceGroup from '~/components/iOrder-core/menuV3/ChoiceGroup';
import Icon from '~/components/iOrder-core/uiV3/Icon';

export default {
  name: 'ChoicesModal',
  components: {
    PortionsGroup,
    ChoiceGroup,
    Icon
  },
  data() {
    return {
      selectedPortionId: this.defaultPortionId,
      selectedChoices: []
    };
  },
  props: [
    'product',
    'portions',
    'defaultPortionId',
    'choiceGroups',
    'getProduct',
    'getCG',
    'cgIndex',
    'edit',
    'choiceLines',
    'editBasketChoices',
    'basketIndex',
    'newIcon',
    'nutritionIcons',
    'quantity'
  ],
  computed: {
    requiredSelectionsSelected() {
      const requiredCGs = this.choiceGroups.filter(cg => {
        return this.getCG(cg.choiceId).minimum;
      });
      const allRequiredSelectionsSelected = requiredCGs.reduce((bool, cg) => {
        const requiredCGMatch = this.selectedChoices.find(selectedChoice => {
          return selectedChoice.choiceId === cg.choiceId;
        });
        return bool && requiredCGMatch;
      }, true);
      return allRequiredSelectionsSelected;
    },
    getNumChoiceGroups() {
      return this.choiceGroups.length;
    },
    productDetails() {
      return this.getProduct(this.product.productId);
    },
    productImage() {
      const { productDetails } = this;
      const payload =
        productDetails &&
        productDetails.displayRecords &&
        productDetails.displayRecords[0] &&
        productDetails.displayRecords[0].image;
      if (typeof payload === 'string') {
        return payload;
      }
      return false;
    },
    placeholder() {
      return require('~/assets/img/iorder-coreV2/icons/placeholder-menu.png');
    },
    description() {
      return (
        this.productDetails.displayRecords &&
        this.productDetails.displayRecords[0].description
      );
    }
  },
  methods: {
    getNutritionIcon(icon) {
      try {
        const name = icon.name;
        const image = require(`~/assets/img/iorder-coreV2/icons/${name}-icon.svg`);
        return image;
      } catch (error) {
        console.log('could not find icon');
        return '';
      }
    },
    selectChoice(
      choiceGroup,
      choiceId,
      choiceGroupIndex,
      choiceGroupPositionIndex
    ) {
      const choice = {
        choiceId: choiceGroup.choiceId,
        ingredientId: choiceId,
        portionTypeId: 1,
        displayRecordId: choiceGroup.displayRecordId,
        quantity: 1,
        choiceIndex: choiceGroupIndex,
        choiceGroupPositionIndex
      };
      if (
        this.getCG(choiceGroup.choiceId).maximum <=
        this.selectedChoices.filter(
          choiceObject =>
            choiceObject.choiceId === choiceGroup.choiceId &&
            choiceObject.choiceGroupPositionIndex === choiceGroupPositionIndex
        ).length
      ) {
        this.selectedChoices = this.selectedChoices.filter(
          choiceObject =>
            choiceObject.choiceId !== choiceGroup.choiceId &&
            choiceObject.choiceGroupPositionIndex !== choiceGroupPositionIndex
        );
      }
      this.selectedChoices.push(choice);
    },
    deselectChoice(choiceGroup, choiceId, choiceGroupPositionIndex) {
      this.selectedChoices = this.selectedChoices.filter(choiceObject => {
        return (
          (choiceObject.choiceId !== choiceGroup.choiceId ||
            choiceObject.ingredientId !== choiceId) &&
          choiceObject.choiceGroupPositionIndex !== choiceGroupPositionIndex
        );
      });
    },
    selectPortion(portionId) {
      this.selectedPortionId = portionId;
    },
    handleClick() {
      const {
        edit,
        requiredSelectionsSelected,
        editBasketChoices,
        basketIndex,
        product,
        selectedPortionId,
        selectedChoices
      } = this;
      if ((edit && requiredSelectionsSelected) || !this.choiceGroups.length) {
        if (editBasketChoices) {
          editBasketChoices(selectedChoices, basketIndex);
        }
        this.$emit('close-choices-modal');
        return;
      }
      if (requiredSelectionsSelected) {
        this.$emit('addToBasket', {
          product,
          selectedPortionId,
          selectedChoices
        });
        this.$emit('close-choices-modal');
      }
    },
    addToBasket() {
      this.$emit('addToBasket', {
        product: this.product,
        selectedPortionId: this.selectedPortionId
      });
    },
    removeFromBasket() {
      if (this.quantity) {
        this.$emit('removeFromBasket', this.product);
      }
    },
    getScrollToId(index) {
      if (index === 0) return 'first';
      if (index === 1) return 'second';
      if (index === 2) return 'third';
      if (index === 3) return 'fourth';
      if (index === 4) return 'fifth';
      if (index === 5) return 'sixth';
      if (index === 6) return 'seventh';
      if (index === 7) return 'eighth';
    },
    isRequired(productId) {
      const cg = this.getCG(productId);
      const min = cg.Minimum || cg.minimum;

      return !!min;
    }
  },
  mounted() {
    if (this.edit) {
      this.selectedChoices = this.choiceLines.slice();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='choices-modal'] {
  position: fixed;
  z-index: 99999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.3);
  flex-direction: column;
  [data-element='modal-container'] {
    position: relative;
    margin-top: -12rem;
    max-height: 800px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 9px;
    background-color: $very-light-pink;

    @include whenScreenIs(xs) {
      width: 90%;
      max-height: 90vh;
    }

    @include whenScreenIs(sm) {
      width: 540px;
      max-height: 650px;
    }

    [data-component='sticky-footer'] {
      background-color: $white;

      [data-element='btn'] {
        background-color: $jungle-green;
      }
    }

    [data-element='modal-header'] {
      left: 0;
      top: 0;
      width: 100%;
      background-color: $white;
      z-index: 1;

      [data-component='section-header'] {
        background-color: $white;
      }
      .close-modal-icon {
        margin: auto;
      }
    }
    [data-element='content-container'] {
      padding: 12rem 0 3rem;
      overflow-y: hidden;
      width: 100%;
      [data-element='description'] {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.14;
        margin: 16px 10px 8px 0;
      }
      [data-element='choice-groups-container'] {
        padding: 24px 10px 16px 0;
        padding-bottom: 1rem;
        padding-top: 24px;
        max-height: 264px;
        overflow-y: auto;
      }
    }
  }
}
.content__content {
  padding: 27px;
  padding-right: 0;
  color: $greyish-brown;
}
.content__image-container {
  z-index: 1;
  text-align: center;
}
.content__image {
  width: 232px;
  height: 232px;
  border-radius: 50%;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
}
.content__heading {
  font-size: 24px;
  font-family: $navigation-font;
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
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.basket__button__wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 6rem;
  background-color: $very-light-pink;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.basket__button__icon {
  margin-right: 0.5rem;
}
.basket__button__text {
  padding-top: 5px;
}
.modal-header__new-icon {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
}
.choice__nutrition__icons {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}
.choice__nutrition__icon__image {
  width: auto;
  height: 24px;
  margin-right: 0.5rem;
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
    font-family: $navigation-font;
    padding: 5px 4px 0;
  }
}
</style>
