<template>
  <div
    class="label-input"
    :class="{
      '--disabled': disabled,
      '--large-space': largeSpace,
      '--inline': inline
    }"
  >
    <form @submit.prevent="handleFormSubmit">
      <label v-if="label">{{ label }}</label>
      <input
        v-model="input"
        :placeholder="placeholder"
        :inputmode="inputmode"
        :type="type"
        :class="{ '--bold': bold }"
      />
    </form>
  </div>
</template>

<script>
export default {
  props: {
    bold: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    inputmode: {
      type: String,
      default: null
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
    },
    type: {
      type: String,
      default: null
    }
  },
  data: () => ({
    input: ''
  }),
  methods: {
    handleFormSubmit() {
      if (!this.input) {
        return
      }
      this.$emit('formSubmit')
    }
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

  &.--inline {
    padding-top: 0;

    input {
      margin-right: 8px;
      text-transform: uppercase;
      width: auto;

      &::placeholder {
        text-transform: none;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;

    label {
      @extend .pmb-label;
    }

    input {
      border: 1px solid $black;
      border-radius: 0;
      box-sizing: border-box;
      height: 48px;
      font-size: 16px;
      line-height: 1.5;
      padding: 4px 0 0;
      text-align: center;
      width: 100%;
      -webkit-appearance: none;

      &::placeholder {
        color: $black;
        font-weight: normal;
      }

      &:focus {
        // border-width: 2px;
        outline: 0;
      }

      &.--bold {
        font-weight: bold;
      }
    }
  }
}
</style>
