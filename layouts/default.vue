<template>
  <div
    class="master-container"
    :class="{
      'device-xs': deviceXs,
      'device-sm': deviceSm,
      'device-md': deviceMd,
      'device-lg': deviceLg
    }"
    :data-app="$store.state.ui.isApp"
  >
    <Modal />

    <FlashMessage />

    <Headroom :offset="64" :zIndex="9997" :disabled="headerDrawerOpen">
      <MainHeader show-cta variant="solid" />
    </Headroom>

    <main class="main-content-container">
      <nuxt />
    </main>

    <no-app>
      <MainFooter />
    </no-app>
  </div>
</template>

<script>
import Headroom from '~/components/ui/Headroom.vue';
import MainFooter from '~/components/ui/MainFooter.vue';
import MainHeader from '~/components/ui/MainHeader.vue';
import Modal from '~/components/ui/Modal.vue';
import FlashMessage from '~/components/ui/FlashMessage.vue';
import NoApp from '@/components/ui/NoApp';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    Headroom,
    MainHeader,
    MainFooter,
    Modal,
    NoApp,
    FlashMessage
  },
  computed: {
    ...mapGetters('ui', ['headerDrawerOpen'])
  },
  data() {
    return {
      deviceXs: false,
      deviceSm: false,
      deviceMd: false,
      deviceLg: false
    };
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

.master-container {
  padding-top: $header-nav-height-mobile;
  @include whenScreenIs(mdx) {
    padding-top: $header-nav-height-desktop;
  }
  main.main-content-container {
    display: block;
    max-width: 960px;
    min-width: 320px;
    margin: 0 auto;
  }
}

body[data-pagecolor='light-grey'] {
  .master-container {
    main.main-content-container {
      background-color: $very-light-pink;
    }
  }
}
body[data-pagecolor='paper'] {
  .master-container {
    main.main-content-container {
      max-width: unset;
      background-image: url('~/assets/img/background/paper.jpg');
    }
  }
}
</style>
