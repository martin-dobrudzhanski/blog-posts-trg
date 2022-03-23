<template>
  <section class="card-row">
    <component
      v-for="(card, index) in card.fields.cards"
      :key="index"
      :is="getComponent(card)"
      :card="card"
      :child="true"
    />
  </section>
</template>

<script>
import changeCase from 'change-case';
import PictureCard from './PictureCard.vue';
import ContentCard from './ContentCard.vue';

export default {
  props: ['card'],
  components: {
    PictureCard,
    ContentCard
  },
  methods: {
    getComponent(card) {
      return changeCase.pascal(card.sys.contentType.sys.id);
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/helpers.scss';

.card-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  @include whenScreenIs(mdx) {
    flex-direction: row;
  }
  .card {
    width: 100%;
    @include whenScreenIs(mdx) {
      flex-basis: 50%;
    }
    &.picture-card {
      order: 1;
      @include whenScreenIs(mdx) {
        order: 0;
      }
    }
  }
}
</style>
