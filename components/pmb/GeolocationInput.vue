<template>
  <div class="geolocation-input">
    <label class="geolocation-input__label">Which restaurant are you at?</label>
    <div class="geolocation-input__input-wrapper">
      <button
        v-if="!selectedLocationName"
        @click="handleGeolocate"
        class="geolocation-input__geolocate-button"
      >
        <img
          src="@/assets/img/iorder-coreV2/icons/location-active.svg"
          class="geolocation-input__geolocate-icon"
          :class="{ '--loading': geolocationIsLoading }"
          alt="geolocate"
        />
      </button>
      <form v-if="!selectedLocationName" @submit.prevent="handleSubmit">
        <input
          type="text"
          name
          class="geolocation-input__input"
          v-model="query"
          @focus="$emit('focus')"
          @blur="$emit('blur')"
          placeholder="Search by town, city or postcode"
        />
        <button
          v-if="!selectedLocationName"
          class="geolocation-input__search-button"
        >
          <img
            src="@/assets/img/iorder-coreV2/icons/search.svg"
            class="geolocation-input__search-icon"
            alt="search"
          />
        </button>
      </form>
      <div v-else class="geolocation-input__location-display">
        <p v-text="selectedLocationName" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    selectedLocationName: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    query: ''
  }),
  computed: {
    ...mapGetters({
      geolocationIsLoading: 'pay/geolocationIsLoading'
    })
  },
  methods: {
    handleGeolocate() {
      if (this.geolocationIsLoading) {
        return
      }
      this.$emit('geolocate')
    },
    handleSubmit() {
      if (!this.query || this.geolocationIsLoading) {
        return
      }
      this.animateSearchIcon()
      this.$emit('submitQuery', this.query)
    },
    animateSearchIcon() {
      const el = this.$el.querySelector('.geolocation-input__search-icon')
      this.$velocity(el, { rotateZ: 10 }, { duration: 200, loop: 4 })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.geolocation-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &__label {
    @extend .pmb-label;
  }

  &__input-wrapper {
    border: 1px solid $black;
    display: flex;
    flex-direction: row;
    height: 48px;
    width: 100%;
  }

  &__geolocate-button,
  &__search-button {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: #fff;
    padding: 10px;

    img {
      height: 100%;
      width: 100%;
    }

    &:focus {
      outline: 0;
    }
  }

  &__geolocate-icon,
  &__search-icon {
    width: 24px;
    height: 24px;
    background-color: #fff;
  }

  &__search-icon {
    transform-origin: 100% 100%;
  }

  &__geolocate-icon {
    &.--loading {
      -webkit-animation: spin 0.8s infinite linear;
      animation: spin 0.8s infinite linear;
    }
  }

  form {
    display: flex;
    flex: 1;
  }

  &__input {
    border: none;
    display: flex;
    display: inline-block;
    flex: 1;
    font-size: 16px;
    height: 100%;
    line-height: 1.5;
    padding: 4px 0 0;
    text-align: center;

    &::placeholder {
      color: $black;
      @media (max-width: 368px) {
        font-size: 12px;
      }
    }

    &:focus {
      outline: none;
    }
  }

  &__location-display {
    align-items: center;
    background: #fff;
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 4px 0 0;
    width: 100%;

    p {
      font-size: 16px;
      text-align: center;
      line-height: 1.5;
    }
  }
}
</style>
