<template>
  <div data-component="portions">
    <h3 data-element="portion-title">Portion</h3>
    <Choice
      v-for="portion in reversedPortions"
      data-element="portion"
      :key="portion.id + 'portion'"
      :choice="portion"
      :selected="portion.id === selectedPortionId"
      :isPortion="true"
      @click.native="selectPortion(portion.id)"
    />
  </div>
</template>

<script>
import Choice from '~/components/iOrder-core/menuV3/Choice';

export default {
  props: ['portions', 'selectedPortionId', 'selectPortion'],
  components: {
    Choice,
  },
  computed: {
    reversedPortions() {
      const portions = this.portions.slice();
      return portions.reverse();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='portions'] {
  [data-element='portion-title'] {
    color: $jungle-green;
    font-weight: bold;
    font-size: 18px;
    margin-top: 16px;
    margin-bottom: 12px;
  }
}
</style>
