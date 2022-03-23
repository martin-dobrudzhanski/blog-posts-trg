<template>
  <div ref="wrapper" class="bottom-navigation-wrapper">
    <!-- 
      The wrapper maintains it's height so that when the
      nav stops being fixed, it doesn't increase the wrapper height
      causing page content to shift
    -->
    <div
      :class="[
        'bottom-navigation',
        {
          'bottom-navigation--fixed': isFixed
        }
      ]"
    >
      <div class="bottom-navigation__container">
        <BaseLink
          v-for="(action, index) in bottomNavigationActions"
          :key="index"
          disable-auto-new-tab
          class="button-reset bottom-navigation__action"
          :to="getCorrectURL(action.url)"
          :new-tab="action.newTab"
          :external="action.external"
        >
          <img
            v-if="getActionIconSrc(action)"
            :src="getActionIconSrc(action)"
            class="bottom-navigation__action-icon"
          />
          <div
            v-if="action.title && getActionIconSrc(action)"
            class="bottom-navigation__action-spacer"
          />
          <p
            v-if="action.title"
            class="bottom-navigation__action-title"
            v-text="action.title"
          />
        </BaseLink>
        <button
          type="button"
          :class="[
            'button-reset',
            'bottom-navigation__action',
            {
              'bottom-navigation__action--active': bottomNavigationDrawerOpen
            }
          ]"
          @click="toggleDrawerOpen"
        >
          <svg
            class="bottom-navigation__action-icon"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:serif="http://www.serif.com/"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            height="100%"
            style="
              fill-rule: evenodd;
              clip-rule: evenodd;
              stroke-linejoin: round;
              stroke-miterlimit: 2;
            "
            version="1.1"
            viewBox="3.25 5.25 17.5 13.5"
            width="100%"
            xml:space="preserve"
          >
            <g id="Icon">
              <path
                fill="currentColor"
                d="M4,6.75l16,0c0.414,0 0.75,-0.336 0.75,-0.75c0,-0.414 -0.336,-0.75 -0.75,-0.75l-16,0c-0.414,0 -0.75,0.336 -0.75,0.75c0,0.414 0.336,0.75 0.75,0.75Z"
              ></path>
              <path
                fill="currentColor"
                d="M4,12.75l16,0c0.414,0 0.75,-0.336 0.75,-0.75c0,-0.414 -0.336,-0.75 -0.75,-0.75l-16,0c-0.414,0 -0.75,0.336 -0.75,0.75c0,0.414 0.336,0.75 0.75,0.75Z"
              ></path>
              <path
                fill="currentColor"
                d="M4,18.75l16,0c0.414,0 0.75,-0.336 0.75,-0.75c0,-0.414 -0.336,-0.75 -0.75,-0.75l-16,0c-0.414,0 -0.75,0.336 -0.75,0.75c0,0.414 0.336,0.75 0.75,0.75Z"
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>

    <Transition name="slide-left" mode="out-in">
      <div
        v-if="bottomNavigationDrawerOpen"
        class="mobile-drawer-wrapper"
        @click.self="toggleDrawerOpen"
      >
        <DrawerNavigation @close="toggleDrawerOpen" />
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import BaseLink from '@/components/ui/BaseLink';
import DrawerNavigation from '@/components/ui/DrawerNavigation';

export default {
  name: 'BottomNavigation',
  components: { BaseLink, DrawerNavigation },
  data: () => ({
    isFixed: false
  }),
  computed: {
    ...mapGetters('ui', [
      'bottomNavigationActions',
      'bottomNavigationDrawerOpen'
    ])
  },
  watch: {
    $route() {
      // (Re)Check placement on route change
      this.handlePlacement();
    },
    bottomNavigationDrawerOpen(newVal) {
      if (newVal) {
        this.isFixed = true;
      } else {
        this.handlePlacement();
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handlePlacement);
    window.addEventListener('resize', this.handlePlacement);
    setTimeout(() => {
      // Delay this first check to allow page content
      // to load, this is mainly for the C&C pages
      // as they have a small initial height due to client side loading
      this.handlePlacement();
    }, 50);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handlePlacement);
    window.removeEventListener('resize', this.handlePlacement);
  },
  methods: {
    ...mapMutations('ui', [
      'showBottomNavigationDrawer',
      'hideBottomNavigationDrawer'
    ]),
    toggleDrawerOpen() {
      if (this.bottomNavigationDrawerOpen) {
        return this.hideBottomNavigationDrawer();
      }

      this.showBottomNavigationDrawer();
    },
    handlePlacement() {
      const scrollHeight = window.scrollY + window.innerHeight;
      const scrollThreshold =
        this.$refs.wrapper.offsetTop + this.$refs.wrapper.offsetHeight;
      const isScrolledPastThreshold = scrollHeight > scrollThreshold;

      this.isFixed = !isScrolledPastThreshold;
    },
    detectCurrentRoute(url) {
      // Use case: links to /book should also match restaurants/{slug}/book and /book/all, etc.
      const string = `(^${url}/.+)|(.+${url}$)`;
      const regex = url ? new RegExp(string, 'i') : '';

      return url && (url === this.$route.path || this.$route.path.search(regex) !== -1)
    },
    getActionIconSrc(action = {}) {
      const iconSrc = action.iconSrc;
      const iconActiveSrc = action.iconActiveSrc || action.iconSrc;

      return this.detectCurrentRoute(action.url) ? iconActiveSrc : iconSrc;
    },
    getCorrectURL(URL) {
      return this.detectCurrentRoute(URL) ? this.$route.path : URL;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.bottom-navigation-wrapper {
  z-index: 5;
  width: 100%;
  height: $bottom-nav-height-mobile;
  background-color: $greyish-brown;
}

.mobile-drawer-wrapper {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: $bottom-nav-height-mobile;
  width: 100%;
  height: calc(var(--innerHeight) - #{$bottom-nav-height-mobile});
  padding-left: 2rem;
}

.bottom-navigation {
  z-index: 1;
  width: 100%;
  height: $bottom-nav-height-mobile;
  background-color: $greyish-brown;
  transition: box-shadow 200ms ease-in-out;

  &--fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0 -4px 12px rgba($greyish-brown, 0.19);
  }

  &__container {
    display: flex;
    flex: 1;
    width: 100%;
    max-width: 30rem;
    height: 100%;
    margin: 0 auto;
  }

  &__action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    align-items: center;
    cursor: pointer;

    &.nuxt-link-exact-active {
      border-top: 4px solid $rebrand-yellow;

      .bottom-navigation__action-title {
        color: $rebrand-yellow;
      }
    }
  }

  &__action-spacer {
    width: 100%;
    height: 0.5rem;
  }

  &__action-icon {
    max-width: 1.5rem;
    height: 1.5rem;
    fill: currentColor;
    color: $white;
  }

  &__action-title {
    font-family: proxima-nova, Proxima Nova, $font;
    font-size: 14px;
    font-weight: 600;
    color: $white;
  }
}
.bottom-navigation__action {
  background-color: $greyish-brown;
}
</style>
