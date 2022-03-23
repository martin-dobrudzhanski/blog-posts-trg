export default {
  data () {
    return {
      maxScreenSize: 700,
      screenIsMobile: true
    }
  },
  methods: {
    isMobileScreen () {
      return window.innerWidth < this.maxScreenSize ? true : false;
    },
    checkScreenSize () {
      const mobileScreen = this.isMobileScreen();
      if (!mobileScreen) {
        return this.$store.dispatch('orderAtTable/showError', {
          heading: 'Order At Table',
          message: 'Sorry, Order at Table is only available on mobile devices! Please see your server to order.',
          homeLink: true
        })
      }
      this.loading = false;
    }
  }
}
