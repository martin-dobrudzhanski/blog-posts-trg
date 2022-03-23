<template>
  <div class="v-header" :class="{ '--no-padding': noPadding }">
    <div class="v-header__content">
      <a @click="handleBack" class="v-header__back-button" v-if="backButton">
        <img
          src="@/assets/img/iorder-coreV2/icons/arrow-left.svg"
          alt="back"
          class="v-header__icon"
        />
      </a>
      <div v-else class="v-header__back-button" />
      <div class="v-header__title-wrap">
        <h1
          data-size="xl"
          data-color="rebrand-orange"
          data-weight="normal"
          class="heading"
          v-text="title"
        />
        <h1
          data-size="xl"
          data-color="rebrand-orange"
          data-weight="normal"
          class="heading"
          v-text="subtitle"
          v-if="subtitle"
        />
        <slot></slot>
      </div>
      <div class="v-header__back-button" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    backButton: {
      type: [Boolean, String],
      default: false
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    subtitle: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleBack(path) {
      if (typeof this.backButton === 'string') {
        this.$router.push(this.backButton)
        return
      }
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/site.scss';

.v-header {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  width: 100%;

  &.--no-padding {
    padding: 0;
  }

  .heading {
    line-height: 0.75;
  }

  h2 {
    color: $black;

    span {
      font-size: 22px;
      font-weight: bold;
    }
  }

  &__content {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &__title {
    @extend .pmb-heading;
    height: auto;
    line-height: 1.6;
    text-align: center;
  }

  &__title-wrap {
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  &__back-button {
    box-sizing: content-box;
    min-width: 24px;
    // Hit area for fat fingers
    padding: 10px;
    padding-left: 0;
  }

  &__icon {
    height: 24px;
    width: 27px;
  }
}
</style>
