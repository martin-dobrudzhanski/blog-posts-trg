<template>
  <div data-component="choice">
    <icon data-element="check-circle" size="sm" :icon="getIcon" />
    <p data-element="choice-name">{{ getName }}</p>
    <p data-element="choice-price">+ £{{ getPrice | fixedPrice }}</p>
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV2/Icon';

export default {
  props: ['choice', 'getProduct', 'selected', 'isPortion'],
  components: {
    Icon,
  },
  computed: {
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
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='choice'] {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  margin-bottom: 6px;
  margin-top: 6px;
  background-color: $white;
  [data-element='choice-name'] {
    font-size: 16px;
    font-weight: 500;
    line-height: 18px;
    margin-right: 8px;
    margin-left: 8px;
    flex-grow: 1;
    @include whenScreenIs(sm) {
      max-width: 244px;
    }
  }
  [data-element='choice-price'] {
    font-size: 16px;
    font-weight: 500;
    min-width: 54px;
  }
}
</style>
