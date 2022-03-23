<template>
  <div data-component="choice-group">
    <GroupHeader :expanded="true" :text="getRequirementCopy" :id="scrollToId" />
    <Choice
      v-for="(choice, index) in getCG(choiceGroup.choiceId).choices"
      :class="{
        disabled: isDisabled(choice.productId)
      }"
      :key="index + 'choice'"
      data-element="choice"
      :choice="choice"
      :getProduct="getProduct"
      :selected="isChoiceSelected(choice.productId)"
      @click.native="handleClick(choice.productId)"
    />
  </div>
</template>

<script>
import Choice from '~/components/iOrder-core/menuV3/Choice';
import GroupHeader from '~/components/iOrder-core/menuV3/GroupHeader';

export default {
  name: 'ChoiseGroup',
  props: [
    'choiceGroup',
    'getProduct',
    'getCG',
    'cgIndex',
    'selectChoice',
    'deselectChoice',
    'selectedChoices',
    'id',
    'numChoiceGroups',
    'index',
    'scrollToId'
  ],
  components: {
    Choice,
    GroupHeader
  },
  computed: {
    selectionsRemaining() {
      const maximum =
        this.getCG(this.choiceGroup.choiceId).Maximum ||
        this.getCG(this.choiceGroup.choiceId).maximum;
      if (!maximum) return true;
      const remaining =
        maximum -
        this.selectedChoices.filter(
          choice =>
            choice.choiceId === this.choiceGroup.choiceId &&
            choice.choiceGroupPositionIndex === this.index
        ).length;
      return remaining || false;
    },
    getRequirementCopy() {
      const cg = this.getCG(this.choiceGroup.choiceId);
      const min = cg.Minimum || cg.minimum;
      const max = cg.Maximum || cg.maximum;
      if (min && max && min === max)
        return `Please select ${min} item${min > 1 ? 's' : ''}`;
      if (min) return `${this.getGroupName} (required)`;
      return `${this.getGroupName} (optional)`;
    },
    scrollToElement() {
      if (this.index === 0) return 'second';
      if (this.index === 1) return 'third';
      if (this.index === 2) return 'fourth';
      if (this.index === 3) return 'fifth';
      if (this.index === 4) return 'sixth';
      if (this.index === 5) return 'seventh';
      if (this.index === 6) return 'eighth';
      return '';
    },
    hasNextChoiceGroup() {
      const numChoicesSelected = this.index + 1;
      return numChoicesSelected < this.numChoiceGroups;
    },
    getGroupName() {
      return this.getCG(this.choiceGroup.choiceId).displayRecords[0].name;
    }
  },
  methods: {
    async handleClick(choiceId) {
      if (this.isChoiceOutOfStock(choiceId)) return false;
      if (this.isChoiceSelected(choiceId)) {
        return this.deselectChoice(this.choiceGroup, choiceId, this.index);
      }
      if (this.selectionsRemaining) {
        await this.selectChoice(
          this.choiceGroup,
          choiceId,
          this.cgIndex,
          this.index
        );
        if (!this.selectionsRemaining) {
          if (this.hasNextChoiceGroup) {
            this.$scrollTo(`#${this.scrollToElement}`, 500, {
              container: '#content-container',
              offset: -10,
              easing: 'ease-in-out'
            });
          }
        }
      }
      return false;
    },
    isChoiceSelected(choiceId) {
      return this.selectedChoices.find(choice => {
        return (
          choice.choiceId === this.choiceGroup.choiceId &&
          choice.ingredientId === choiceId &&
          choice.choiceGroupPositionIndex === this.index
        );
      });
    },
    isChoiceOutOfStock(choiceId) {
      return this.getProduct(choiceId).isOutOfStock;
    },
    isDisabled(choiceId) {
      return (
        (!this.selectionsRemaining && !this.isChoiceSelected(choiceId)) ||
        this.isChoiceOutOfStock(choiceId)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
[data-component='choice-group'] {
  [data-element='choice'] {
    &.disabled {
      opacity: 0.35;
    }
  }
}
</style>
