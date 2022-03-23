<template>
  <section
    :class="[
      'tile-grid',
      {
        'tile-grid--mobile-only': mobileOnly,
        'tile-grid--desktop-only': desktopOnly,
      },
    ]"
  >
    <div class="tile-grid__container">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: 'TileGrid',
  props: {
    mobileOnly: {
      type: Boolean,
      default: false,
    },
    desktopOnly: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.tile-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  &__container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }

  &--mobile-only {
    @include whenScreenIs(mdx) {
      display: none;
    }
  }

  &--desktop-only {
    display: none;

    @include whenScreenIs(mdx) {
      display: flex;
    }
  }
}
</style>
