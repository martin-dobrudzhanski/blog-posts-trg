<template>
  <div class="base-select__wrapper">
    <select
      :class="['base-select', { 'base-select--disabled': disabled }]"
      v-bind="$attrs"
      :value="value"
      @change="(event) => $emit('change', event.target.value)"
    >
      <option
        v-if="placeholder"
        disabled
        value=""
        class="base-select__option"
        v-text="placeholder"
        :selected="value == null"
      />
      <slot name="options">
        <option
          v-for="(option, index) in options"
          class="base-select__option"
          :key="getOptionKey(option, index)"
          :value="getOptionValue(option, index)"
          v-text="getOptionLabel(option, index)"
        />
      </slot>
    </select>
  </div>
</template>

<script>
import get from 'lodash.get';

export default {
  name: 'BaseSelect',
  inheritAttrs: false,
  model: {
    event: 'change',
    prop: 'value',
  },
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    getOptionKey: {
      type: Function,
      default: (option, index) => index,
    },
    getOptionLabel: {
      type: Function,
      default: (option) => get(option, 'label'),
    },
    getOptionValue: {
      type: Function,
      default: (option) => get(option, 'value'),
    },
  },
  methods: {
    handleChange() {
      if (!this.disabled) {
        this.$emit('change', !this.value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.base-select {
  display: block;
  width: 100%;
  height: 3rem;
  line-height: 1.5;
  border-radius: 1.5rem;
  padding: 0 1rem;
  appearance: none;
  color: $greyish-brown;
  background-color: $true-white;
  border: none;
  font-family: $font;
  font-size: 0.875rem;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;

  &__wrapper {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      right: 1rem;
      top: 50%;
      width: 1rem;
      height: 1rem;
      transform: translateY(-50%);
      background: url('~/assets/img/icons/icon-down-arrow-grey.svg') center
        no-repeat;
    }
  }

  @include whenScreenIs(lg) {
    height: 3.25rem;
    border-radius: 1.85rem;
  }

  &::placeholder {
    color: rgba($true-black, 0.625);
  }

  &:disabled {
    opacity: 0.3;
  }
}
</style>
