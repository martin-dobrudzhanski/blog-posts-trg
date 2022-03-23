<template>
  <div
    :class="[
      'base-checkbox',
      {
        'base-checkbox--checked': value,
      },
    ]"
    tabindex="0"
    @click="handleChange"
  >
    <input
      type="checkbox"
      class="base-checkbox__input"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <span class="base-checkbox__label">
      <slot>
        {{ label }}
      </slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'BaseCheckbox',
  inheritAttrs: false,
  model: {
    event: 'change',
    prop: 'value',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
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

.base-checkbox {
  position: relative;
  display: block;
  min-height: 1.5rem;
  margin: 0;
  width: 100%;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &--checked {
    .base-checkbox__label:after {
      background-image: url('~/assets/img/icons/icon-tick-on.svg');
    }
  }

  &__label {
    display: block;
    margin: 0;
    padding: 0.25rem 0 0 2.5rem;
    cursor: pointer;
    font-family: $font;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #858585;

    @include whenScreenIs(mdx) {
      font-size: 1.125rem;
    }

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 1.5rem;
      height: 1.5rem;
    }

    &:before {
      pointer-events: none;
      user-select: none;
    }

    // Foreground (icon)
    &:after {
      background-image: url('~/assets/img/icons/icon-tick-off.svg');
      background-size: 100%;
      background-repeat: no-repeat;
    }

    a {
      color: green;
      text-decoration: underline;
    }
  }

  &__input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
}
</style>
