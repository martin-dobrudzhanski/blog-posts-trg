<template>
  <div data-route="book" data-child>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  head: {
    title: 'Amend booking',
    meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
</style>
