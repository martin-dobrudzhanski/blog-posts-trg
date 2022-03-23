<template>
  <div
    class="master-container"
    :class="{
      'device-xs': deviceXs,
      'device-sm': deviceSm,
      'device-md': deviceMd,
      'device-lg': deviceLg,
      'master-container--top-padding': isNearestMeMenuRoute
    }"
    :data-app="$store.state.ui.isApp"
  >
    <Modal />

    <FlashMessage />

    <Headroom :offset="64" :zIndex="9997" :disabled="headerDrawerOpen">
      <MainHeader
        show-cta
        :variant="headerVariant"
        :show-drawer-toggle="false"
      />
    </Headroom>

    <main class="main-content-container">
      <nuxt />
    </main>

    <BottomNavigation v-if="deviceXs || deviceSm" />

    <NoApp>
      <MainFooter />
    </NoApp>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Headroom from '~/components/ui/Headroom.vue';
import MainFooter from '~/components/ui/MainFooter.vue';
import MainHeader from '~/components/ui/MainHeader.vue';
import Modal from '~/components/ui/Modal.vue';
import FlashMessage from '~/components/ui/FlashMessage.vue';
import NoApp from '@/components/ui/NoApp';
import BottomNavigation from '~/components/ui/BottomNavigation.vue';

export default {
  components: {
    Headroom,
    MainHeader,
    MainFooter,
    Modal,
    NoApp,
    FlashMessage,
    BottomNavigation
  },
  data() {
    return {
      deviceXs: false,
      deviceSm: false,
      deviceMd: false,
      deviceLg: false
    };
  },
  computed: {
    ...mapState('ui', ['landingPopupIsVisible']),
    ...mapGetters('ui', ['headerDrawerOpen']),
    ...mapGetters('clickAndCollect', {
      clickAndCollectBasketCount: 'getBasketCount'
    }),
    ...mapState('clickAndCollect', {
      clickAndCollectLocation: 'location'
    }),
    isNearestMeMenuRoute() {
      return this.$route.name === 'nearest-me-menu';
    },
    headerVariant() {
      return 'solid';
    }
  },
  methods: {
    ...mapActions({
      flash: 'ui/flash',
      logout: 'auth/logout'
    }),

    checkResponsiveClass() {
      this.deviceXs =
        window.matchMedia('(min-width: 0px)').matches &&
        window.matchMedia('(max-width: 767px)').matches;
      this.deviceSm =
        window.matchMedia('(min-width: 768px)').matches &&
        window.matchMedia('(max-width: 991px)').matches;
      this.deviceMd =
        window.matchMedia('(min-width: 992px)').matches &&
        window.matchMedia('(max-width: 1299px)').matches;
      this.deviceLg = window.matchMedia('(min-width: 1300px)').matches;

      document.documentElement.style.setProperty(
        '--innerHeight',
        `${window.innerHeight}px`
      );
    }
  },

  mounted() {
    this.checkResponsiveClass();
    window.addEventListener('resize', this.checkResponsiveClass);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkResponsiveClass);
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.wide-width {
  min-width: 320px;
  max-width: $max-width-mobile;
  margin: 0 auto;

  @include whenScreenIs(mdx) {
    max-width: $max-width-mdesktop;
  }

  @include whenScreenIs(lg) {
    max-width: $max-width-desktop;
  }
}
</style>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.master-container {
  &--top-padding {
    padding-top: $header-nav-height-mobile;
  }

  @include whenScreenIs(mdx) {
    padding-top: $header-nav-height-desktop;
  }
  main.main-content-container {
    display: block;
    min-width: 320px;
    max-width: 100%;
    margin: 0 auto;
    background-color: $true-white;
    overflow: hidden;
  }
}

body[data-pagecolor='white'] {
  .master-container {
    main.main-content-container {
      background-color: #fff;
    }
  }
}
</style>
