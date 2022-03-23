<template>
  <div data-element="search-container" class="search-container">
    <form data-component="search-input" v-on:submit.prevent>
      <input
        data-element="input"
        type="text"
        aria-label="Search for products in menu"
        v-bind:value="searchQuery"
        v-on:input="$emit('changed', $event.target.value)"
        :placeholder="placeholder"
        @keyup.enter="emitSearch"
        :style="paddingStyle"
      />
      <transition name="fade">
        <p v-if="location === 'error'" class="search-input__error">
          An error occurred, please try again.
        </p></transition
      >
    </form>
    <Icon
      v-if="hasClearIcon && searchQuery !== ''"
      class="input-icon"
      icon="close"
      size="sm"
      data-element="icon"
      @click.native="$emit('changed', '')"
      clickable="true"
    />
    <Icon
      v-else-if="!hasClearIcon"
      class="input-icon"
      icon="search"
      size="sm"
      data-element="icon"
      @click.native="emitSearch"
      clickable="true"
    />
    <transition name="fade" mode="out-in">
      <Icon
        class="nearest-icon"
        key="icon"
        v-if="hasNearestIcon && location !== 'error'"
        icon="icon-locationsearch"
        size="sm"
        data-element="icon"
        @click.native="searchLocation"
        :class="{ 'nearest-icon--loading': location === 'loading' }"
      />
      <p
        key="error"
        v-else-if="hasNearestIcon && location === 'error'"
        class="nearest-icon--error"
      >
        !
      </p></transition
    >
  </div>
</template>

<script>
import Icon from '~/components/iOrder-core/uiV3/Icon';

export default {
  data() {
    return {
      location: null
    };
  },
  components: {
    Icon
  },
  props: [
    'menu',
    'searchQuery',
    'closeSearch',
    'placeholder',
    'hasNearestIcon',
    'hasClearIcon'
  ],
  methods: {
    emitSearch() {
      const { searchQuery, location } = this;
      if (location === 'error') {
        this.location = null;
      }
      this.$emit('search', searchQuery);
    },
    getLocation() {
      return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not available.'));
        }

        navigator.geolocation.getCurrentPosition(
          pos => {
            resolve(pos);
          },
          err => {
            reject(err);
          }
        );
      });
    },
    async searchLocation() {
      const vm = this;
      try {
        vm.location = 'loading';
        vm.location = await vm.getLocation();
        vm.$emit('search', vm.location);
      } catch (e) {
        vm.location = 'error';
      }
    }
  },
  computed: {
    paddingStyle() {
      const { hasNearestIcon } = this;
      if (hasNearestIcon) {
        return {
          paddingLeft: '3rem'
        };
      }
      return '';
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-element='search-container'] {
  position: relative;
  height: 49px;
  width: 100%;

  [data-component='search-input'] {
    height: 100%;
    width: 100%;
    .search-input__error {
      color: red;
      text-align: center;
      margin-top: 0.5rem;
      font-weight: bold;
    }
    [data-element='input'] {
      width: 100%;
      height: 100%;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      border: 0px solid transparent;
      font-size: 17px;
      font-weight: 500;
      background-color: hsla(0, 0%, 100%, 1);
      padding: 14px 23px;
      border-radius: 23px;
      &::placeholder {
        color: $grey;
      }
      &:focus::-webkit-input-placeholder {
        color: transparent;
      }
      &:focus:-moz-placeholder {
        color: transparent;
      } /* FF 4-18 */
      &:focus::-moz-placeholder {
        color: transparent;
      } /* FF 19+ */
      &:focus:-ms-input-placeholder {
        color: transparent;
      } /* IE 10+ */
      &:focus {
        padding: 14px 23px;
        outline: none;
        border-width: 0;
      }
      &::-ms-clear {
        display: none;
      }
    }
    @include whenScreenIs(mdx) {
      margin-bottom: 8px;
    }
  }
  .input-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      cursor: pointer;
    }
  }
  .nearest-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      cursor: pointer;
    }

    &--loading {
      animation-duration: 3s;
      animation-name: rotating;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      transform-origin: top;
    }

    &--error {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: $white;
      background-color: red;
      border-radius: 50%;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
    }
  }
}
@keyframes rotating {
  0% {
    transform: rotate(0deg) translateY(-50%);
  }
  50% {
    transform: rotate(720deg) translateY(-50%);
  }
  100% {
    transform: rotate(0deg) translateY(-50%);
  }
}
</style>
