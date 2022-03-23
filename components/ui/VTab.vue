<template>
  <component
    class="tab"
    :is="tag"
    :class="[
      {
        'tab--controlled': controlled,
        'tab--disabled': disabled,
        'tab--active': active,
        'tab--beige': color === 'beige'
      }
    ]"
    v-bind="$attrs"
  >
    <slot>
      <p class="tab__title">
        {{ title }}
      </p>
    </slot>
  </component>
</template>

<script>
export default {
  name: 'VTab',
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      default: 'button'
    },
    controlled: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'pink'
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 0 0%;
  min-height: 3.25rem;
  background-color: $light-pink;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  color: $greyish-brown;
  cursor: pointer;
  border: none;

  &--beige {
    background-color: $light-beige;
  }

  &--disabled {
    cursor: default;
  }

  &__title {
    font-family: $navigation-font;
    font-size: 22px;
    color: inherit;
    text-align: center;
  }
}
</style>
