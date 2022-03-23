<template>
  <div
    class="v-button"
    :class="{
      'v-button__container': hasContainer,
      '--disabled': disabled,
      '--inline': inline,
      '--selected': selected
    }"
  >
    <button
      class="v-button__button"
      :class="{ '--disabled': disabled }"
      @click="handleClick"
    >
      <img
        v-if="loading"
        class="loader"
        src="@/assets/img/iorder-coreV2/icons/loader-white.svg"
        alt="loading"
      />

      <div v-else-if="tipAmount" class="v-button__content--dual">
        <span
          class="v-button__text"
          v-text="buttonText"
          :class="{ '--lighter': tipAmount }"
        />

        <span class="v-button__secondary-text" v-text="`£${tipAmount}`" />
      </div>

      <div v-else class="v-button__content">
        <div
          class="v-button__bill-items  v-button__bill-items--count"
          v-if="billTotal && billQuantity"
        >
          <img
            src="@/assets/img/iorder-coreV2/icons/basket.svg"
            alt="back"
            class="back-button__icon"
          />
          <span>{{ billQuantity }}</span>
        </div>

        <span class="v-button__text" v-text="buttonText" />

        <div
          class="v-button__bill-items v-button__bill-items--total"
          v-if="billTotal && billQuantity"
        >
          <span>£{{ billTotal.toFixed(2) }}</span>
        </div>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      default: ''
    },
    tipAmount: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    billTotal: {
      type: Number,
      default: null
    },
    billQuantity: {
      type: Number,
      default: null
    },
    hasContainer: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('buttonClick')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';
.v-button {
  width: 100%;
  min-height: 48px;
  transition: opacity 0.5s ease;

  &.--disabled {
    opacity: 0.4;
    pointer-events: none;

    .v-button__text {
      opacity: 0.2;
    }
  }

  &.--selected {
    .v-button__button {
      background: #4c95bd;
      border: 2px solid $rebrand-blue;
      box-sizing: border-box;
    }
  }

  &.--inline {
    height: auto;
  }

  &__container {
    min-height: 64px;
    padding: 8px 16px;
    background-color: $white-two;
    @media (min-width: 700px) {
      background-color: transparent;
    }
  }

  &__button {
    border: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-color: $rebrand-blue;
    border: 2px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0;

    &:focus {
      outline: 0;
    }
  }

  &__content,
  &__content--dual {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 0 12px;
    width: 100%;
  }

  &__content--dual {
    flex-direction: column;
  }

  &__text {
    font-family: $secondary-body-font;
    font-size: 20px;
    line-height: 1.2;
    color: #fff;
    text-transform: uppercase;
    width: 100%;

    &.--lighter {
      font-weight: normal;
      opacity: 0.8;
    }
  }

  &__secondary-text {
    color: #fff;
    font-family: $secondary-body-font;
    font-size: 20px;
  }

  &__bill-items {
    align-items: center;
    display: flex;
    width: 150px;

    img {
      margin-right: 6px;
    }

    span {
      color: $white;
      font-size: 16px;
      font-weight: bold;
    }

    &:last-child {
      justify-content: flex-end;
    }
  }
}

.loader {
  background-image: url('~/assets/img/iorder-coreV2/icons/loader-white.svg');
}
</style>
