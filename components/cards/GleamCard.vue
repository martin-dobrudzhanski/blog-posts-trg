<template>
  <no-ssr>
    <div class="card gleam-card">
      <a
        class="e-widget no-button"
        :href="card.fields.embedCodeHref"
        rel="nofollow"
      ></a>
      <script src="https://js.gleam.io/oi-c3Eit4rt.js" async="async"></script>
      <script
        type="text/javascript"
        src="https://js.gleam.io/e.js"
        async="true"
      ></script>
    </div>
  </no-ssr>
</template>
<script>
export default {
  props: ['card', 'child'],
  components: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/elements/card.scss';

.gleam-card {
  width: 100%;
  padding: 32px 16px 12px;
  @include whenScreenIs(mdx) {
    padding: 48px 48px 32px;
  }
  @media (max-width: 352px) {
    padding: 16px 0 0;
  }
}
</style>
