<template>
  <div data-component="mobile-only" data-nofooter-fullscreen>
    <section-header text="Tap & Drink" />
    <div data-element="mobile-only-content">
      <h1>Sorry, Tap & Drink is only available on mobile devices!</h1>
      <nuxt-link to="/">
        <button class="btn" data-size="sm">Homepage</button>
      </nuxt-link>
    </div>
  </div>
</template>
<script>
import SectionHeader from '~/components/iOrder-core/ui/SectionHeader';

export default {
  components: {
    SectionHeader,
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';

[data-component='mobile-only'] {
  [data-element='mobile-only-content'] {
    margin-top: 100px;
    h1 {
      font-size: 24px;
      font-weight: 900;
      color: $pinkish-red;
      line-height: 28px;
      max-width: 500px;
      margin: 0 auto;
    }
    .btn {
      margin-top: 40px;
    }
  }
  background-color: #fff;
  text-align: center;
}
</style>
