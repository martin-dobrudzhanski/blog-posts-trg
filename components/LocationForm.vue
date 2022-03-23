<template>
  <form
    :class="[
      'location-form',
      `location-form--size-${size}`,
      `location-form--colour-mobile-${mobileColour}`,
      `location-form--colour-desktop-${desktopColour}`,
    ]"
    @submit.prevent="handleSearch"
  >
    <button
      type="button"
      :class="[
        'location-form__btn',
        {
          'location-form__btn--spinning': isGeolocating,
        },
      ]"
      @click="$emit('geolocate')"
    >
      <img
        src="@/assets/img/icons/icon-locationsearch.svg"
        alt="geolocate"
        class="location-form__btn-icon"
      />
    </button>
    <input
      ref="queryInput"
      type="text"
      class="location-form__input"
      :placeholder="placeholder"
      v-model="query"
    />
    <button type="submit" class="location-form__btn location-form__btn--search">
      <img
        src="@/assets/img/icons/icon-magnifying-glass.svg"
        alt="geolocate"
        class="location-form__btn-icon"
      />
    </button>
  </form>
</template>

<script>
const Sizes = {
  Medium: 'md',
  Large: 'lg',
};

const Colours = {
  WHITE: 'white',
};

export default {
  name: 'LocationForm',
  inheritAttrs: false,
  props: {
    isGeolocating: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: Sizes.Medium,
      validator: (val) => Object.values(Sizes).some((x) => x === val),
    },
    mobileColour: {
      type: String,
      default: Colours.WHITE,
      validator: (val) => Object.values(Colours).some((x) => x === val),
    },
    desktopColour: {
      type: String,
      default: Colours.WHITE,
      validator: (val) => Object.values(Colours).some((x) => x === val),
    },
    placeholder: {
      type: String,
      default: 'Search by town, city or postcode',
    },
    defaultValue: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    query: '',
  }),
  watch: {
    defaultValue: {
      immediate: true,
      handler(val, oldVal) {
        if (val !== undefined && val !== oldVal) {
          this.query = val;
        }
      },
    },
  },
  methods: {
    handleSearch() {
      if (!this.query || !this.query.trim()) {
        // Move focus back on the input if the user hasn't typed anything
        // On mobile, this brings up the keyboard and focuses on the input field
        this.$refs.queryInput.focus();
        return;
      }

      this.$emit('search', this.query);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.location-form {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 3rem;
  overflow: hidden;
  border-radius: 1.5rem;

  &--size-md {
    .location-form__input {
      font-size: 1rem;

      @include whenScreenIs(lg) {
        font-size: 1.125rem;
      }
    }
  }

  &--size-lg {
    @include whenScreenIs(mdx) {
      height: 5.5rem;
      border-radius: 2.75rem;
    }

    .location-form__input {
      @include whenScreenIs(mdx) {
        font-size: 1.5rem;
      }
    }

    .location-form__btn {
      @include whenScreenIs(mdx) {
        width: 5.5rem;
        height: 5.5rem;
      }
    }

    .location-form__btn-icon {
      @include whenScreenIs(mdx) {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  }

  &--colour-mobile {
    &-white {
      background-color: $white;
    }
  }

  @include whenScreenIs(mdx) {
    &--colour-desktop {
      &-white {
        background-color: $true-white;
      }
    }
  }

  &__input,
  &__btn {
    border: 0;
    background: none;
    outline: none;
  }

  &__input {
    flex: 1 0 0%;
    width: 100%;
    height: 100%;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    margin: 0;
    padding: 0;
    cursor: pointer;

    &--spinning {
      animation: spin 1s linear infinite;
    }
  }

  &__btn-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
