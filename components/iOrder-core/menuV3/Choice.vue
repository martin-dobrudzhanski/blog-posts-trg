<template>
  <div data-component="choice">
    <p data-element="choice-name">{{ getName }}</p>
    <p v-if="getPrice" data-element="choice-price">
      + {{ getPrice | fixedPrice }}
    </p>
    <transition name="fade" mode="out-in">
      <Icon
        v-if="selected"
        class="choice__icon"
        icon="icon-tick-on"
        size="md"
        clickable="true"
      />
      <Icon
        v-else
        class="choice__icon"
        icon="icon-tick-off"
        size="md"
        clickable="true"
      />
    </transition>
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';

export default {
  name: 'ChoiceComponent',
  components: {
    Icon
  },
  props: ['choice', 'getProduct', 'selected', 'isPortion'],
  computed: {
    getIconUrl() {
      const { getIcon } = this;
      return `@/assets/img/icons/${getIcon}.svg`;
    },
    getIcon() {
      return this.selected ? 'checked-circle' : 'unchecked-circle';
    },
    getName() {
      return this.isPortion
        ? this.choice.name
        : this.getProduct(this.choice.productId).displayRecords.length &&
            this.getProduct(this.choice.productId).displayRecords[0].name;
    },
    getPrice() {
      if (this.isPortion) {
        return this.choice.price;
      } else {
        const aztecChoice = this.getProduct(this.choice.productId);
        return (
          (aztecChoice.displayRecords.length &&
            aztecChoice.portions &&
            aztecChoice.portions[0] &&
            aztecChoice.portions[0].price) ||
          0
        );
      }
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='choice'] {
  font-family: $font;
  color: $greyish-brown;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin-bottom: 7px;
  [data-element='choice-name'] {
    margin-right: 8px;
    margin-left: 0;
    flex-grow: 1;
    @include whenScreenIs(sm) {
      max-width: 244px;
    }
  }
  [data-element='choice-price'] {
    font-size: 14px;
    font-weight: 500;
    min-width: 54px;
    color: $greyish-brown;
    margin-left: auto;
  }
}
</style>
