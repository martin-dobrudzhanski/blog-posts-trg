<template>
  <div data-component="location-delivery-modal">
    <div v-if="!isNavigating" data-element="delivery-methods">
      <div class="delivery-icons">
        <a v-if="getDeliverooLink" target="_blank" :href="getDeliverooLink">
          <div class="delivery-icon deliveroo-icon"></div>
        </a>
        <a v-if="getJustEatLink" target="_blank" :href="getJustEatLink">
          <div class="delivery-icon just-eat-icon"></div>
        </a>
        <a v-if="getUberEatsLink" target="_blank" :href="getUberEatsLink">
          <div class="delivery-icon uber-eats-icon"></div>
        </a>
      </div>
    </div>
    <spinner v-if="isNavigating" data-element="navigate-spinner" />
  </div>
</template>

<script>
import Spinner from '~/components/iOrder-core/ui/Spinner.vue'
export default {
  data() {
    return {
      isNavigating: false
    }
  },
  props: ['location'],
  components: {
    Spinner
  },
  computed: {
    getDeliverooLink() {
      return this.location && this.location.deliverooDirectLink
    },
    getJustEatLink() {
      return this.location && this.location.justEatDirectlink
    },
    getUberEatsLink() {
      return this.location && this.location.uberEatsDirectLink
    }
  },
  methods: {
    select(slug) {
      // Only clear location from state if user chooses a different location
      if (this.$route.params.slug !== slug) {
        this.$store.commit('booking/clearCurrentLocation')
      }
      this.isNavigating = true
      this.$router.push(
        {
          path: `/restaurants/${slug}/book`,
          query: this.$router.history.current.query
        },
        () => {
          this.$store.commit('booking/hideModal')
        }
      )
      this.$store.commit('booking/resetUnavailableSessions')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
[data-component='location-delivery-modal'] {
  position: relative;
  width: 100%;
  background-color: #fff;
  [data-element='navigate-spinner'] {
    margin-top: 100px;
  }
  [data-element='delivery-methods'] {
    color: $black;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.25;
    padding: 16px;
    text-align: center;
  }
}
.delivery-text {
        padding-top: 8px;
        text-align: center;
      }
      .delivery-icons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        a {
          margin-right: 16px;
          .delivery-icon {
            height: 40px;
            width: 40px;
          }
          .deliveroo-icon {
            background-image: url('/assets/img/icons/icon-deliveroo.svg');
          }
          .just-eat-icon {
            background-image: url('/assets/img/icons/icon-justeat.svg');
          }
          .uber-eats-icon {
            background-image: url('/assets/img/icons/icon-ubereats.svg');
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
</style>