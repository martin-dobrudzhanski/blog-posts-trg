<template>
  <div
    class="label-input"
    :class="{ '--disabled': disabled, '--large-space': largeSpace }"
  >
    <form @submit.prevent="handleFormSubmit">
      <label v-if="label">{{ label }}</label>
      <currency-input
        v-model="input"
        currency="GBP"
        :placeholder="placeholder"
        :distraction-free="false"
      />
    </form>
  </div>
</template>

<script>
import { CurrencyInput } from 'vue-currency-input'

export default {
  components: { CurrencyInput },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    largeSpace: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    }
  },
  data: () => ({
    input: null
  }),
  methods: {
    handleFormSubmit() {
      if (!this.input) {
        return
      }
      this.$emit('formSubmit')
    }
  },
  mounted() {
    const input = this.$el.querySelector('input')
    input.setAttribute('inputmode', 'numeric')
  },
  watch: {
    input() {
      this.$emit('input', this.input)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.label-input {
  padding-top: 24px;

  &.--large-space {
    padding-top: 48px;
  }

  &.--disabled {
    opacity: 0.3;
    pointer-events: none;
  }

  form {
    display: flex;
    flex-direction: column;
    min-height: 100px;

    label {
      @extend .pmb-label;
    }

    input {
      border: 1px solid $black;
      border-radius: 0;
      height: 48px;
      width: 100%;
      font-size: 16px;
      line-height: 1.5;
      padding: 4px 0 0;
      text-align: center;
      -webkit-appearance: none;

      &::placeholder {
        color: $black;
      }
    }
  }
}
</style>
