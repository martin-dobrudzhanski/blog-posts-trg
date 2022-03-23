<template>
  <div class="v-page">
    <transition name="fade">
      <div v-if="loading || defaultLoading" class="loader-container">
        <img
          class="loader"
          src="@/assets/img/iorder-coreV2/icons/loader.svg"
          alt="loading"
        />
      </div>
      <div v-else class="v-page__page-container">
        <slot></slot>
        <div class="v-page__mobile-only">
          <h1
            data-size="xl"
            data-color="rebrand-orange"
            data-weight="normal"
            class="heading"
          >
            Sorry mobile only
          </h1>
          <p class="v-page__text">
            {{ desktopErrorMessage }}
          </p>
          <v-button buttonText="Home" @buttonClick="$router.push('/')" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const VButton = () => import('@/components/pmb/VButton');

export default {
  components: {
    VButton
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    desktopErrorMessage: {
      type: String,
      required: false,
      default: 'Pay my bill is only available on mobile screens!'
    }
  },
  data: () => ({
    defaultLoading: true
  }),
  mounted() {
    setTimeout(() => {
      this.defaultLoading = false;
    }, 500);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/site.scss';

.v-page {
  border-top: 1px solid $very-light-pink;
  flex: 1;
  min-width: 320px;
  position: relative;
  text-align: center;
  width: 100%;

  // Sticky footer
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 72px);

  @media (min-width: 700px) {
    border: 0;
  }

  .loader-container {
    align-items: center;
    display: flex;
    flex: 1;
    height: 100%;
    justify-content: center;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: #fff;
  }

  &__page-container {
    background-color: #fff;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-top: 16px;

    > :nth-child(1) {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      background-color: #fff;
      @media (min-width: 700px) {
        display: none;
      }
    }

    > :nth-child(2) {
      display: none;
      @media (min-width: 700px) {
        display: block;
      }
    }
  }

  &__mobile-only {
    margin: 48px auto;
    max-width: 400px;
  }

  &__text {
    color: $black;
    margin: 24px 0;
  }
}
</style>
