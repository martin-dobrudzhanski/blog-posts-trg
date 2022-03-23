<template>
  <div>
    <section class="hero">
      <h1 class="hero__title">
        <span
          v-if="content.unavailablePageTitleIntro"
          class="title__intro"
          v-text="content.unavailablePageTitleIntro"
        />
        <span
          v-if="content.unavailablePageTitleMain"
          class="title__main"
          v-text="content.unavailablePageTitleMain"
        />
      </h1>
    </section>
    <section>
      <card-row v-if="content.cardRow" :card="content.cardRow" />
    </section>
  </div>
</template>

<script>
import { getContent } from '~/libs/templateHelpers.js'
import meta from '~/mixins/meta'

const CardRow = () => import('@/components/cards/CardRow')

export default {
  components: {
    CardRow
  },
  mixins: [meta],
  async asyncData({ store, params, error }) {
    return await getContent(store, 'spin', error)
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 233px;
  width: 100%;
  background: $rebrand-red;
  border-bottom: 2px solid $white;

  @include whenScreenIs(sm) {
    height: 352px;
  }

  &__title {
    width: 328px;

    @include whenScreenIs(sm) {
      width: 525px;
    }
  }
}

.title {
  &__intro,
  &__main {
    display: block;
    font-family: $display-font;
    text-align: center;
    text-transform: uppercase;
  }

  &__intro {
    color: $charcoal;
    font-size: 38px;
    line-height: 0.89;

    @include whenScreenIs(sm) {
      font-size: 61px;
    }
  }

  &__main {
    color: $white;
    font-size: 68px;
    line-height: 0.71;

    @include whenScreenIs(sm) {
      font-size: 109px;
    }
  }
}
</style>
