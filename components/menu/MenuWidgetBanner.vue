<template>
  <no-ssr>
    <affix
      relativeElementSelector="#menu-container"
      :offset="{ top: 64, bottom: 0 }"
      @affix="onSticky"
      @affixtop="onStickyTop"
      @affixbottom="onStickyBottom"
    >
      <aside class="menu-banner">
        <div class="menu-banner__inner">
          <div class="menu-banner__cta">
            <nuxt-link class="btn link link-view" :to="bookLink">Book a table</nuxt-link>
          </div>
          <div class="menu-banner__cta">
            <nuxt-link class="btn link link-view" :to="takeawayLink">Click & Collect</nuxt-link>
          </div>
        </div>
      </aside>
    </affix>
  </no-ssr>
</template>

<script>
export default {
  name: 'MenuWidgetBanner',
  props: {
    restaurant: {
      type: Object,
      required: true
    },
    onSticky: {
      type: Function,
      required: false,
      default: () => {}
    },
    onStickyTop: {
      type: Function,
      required: false,
      default: () => {}
    },
    onStickyBottom: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  computed: {
    bookLink() {
      const slug = this.restaurant.fields.slug
      const link = `/restaurants/${slug}/book`

      return link
    },
    takeawayLink() {
      const slug = this.restaurant.fields.slug
      const link = `/restaurants/${slug}/takeaway`

      return link
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.vue-affix {
  z-index: 15;
  width: 100%;
  max-width: 960px;
}

// Set top offset based on media queries
.affix {
  top: 55px !important;

  @include whenScreenIs(mdx) {
    top: 64px !important;
  }
}

.menu-banner {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  width: 100%;
  background-color: $white-two;

  @include whenScreenIs(xs) {
    padding: 8px;
  }

  &__inner {
    display: flex;
    flex-direction: row;
    margin: 0 -8px;

    @include whenScreenIs(xs) {
      width: 100%;
      max-width: 520px;
    }
  }

  &__cta {
    height: 40px;
    padding: 0 8px;

    @include whenScreenIs(sm) {
      min-width: 164px;
    }

    @include whenScreenIs(xs) {
      width: 50%;
    }

    .btn {
      display: block;
    }
  }
}
</style>