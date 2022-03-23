<template>
  <component
    :is="tag"
    :class="[
      'base-button',
      `base-button--size-${size}`,
      `base-button--width-${width}`,
      `base-button--height-${height}`,
      `base-button--colour-${colour}`,
      `base-button--bg-colour-${bg_colour}`,
      {
        'base-button--disabled': disabled,
        'base-button--outline': outline
      }
    ]"
    :disabled="isReallyDisabled"
    v-bind="props"
  >
    <div v-if="loading" class="base-button__loader" />
    <slot v-else />
  </component>
</template>

<script>
const Size = {
  NORMAL: 'normal',
  MEDIUM: 'medium',
  LARGE: 'large'
};

const Width = {
  AUTO: 'auto',
  FIT: 'fit'
};

const Height = {
  AUTO: 'auto',
  FIT: 'fit',
  FULL: 'full'
};

const BGColour = {
  GREYISH_BROWN: 'greyish-brown',
  MAC_AND_CHEESE: 'mac-and-cheese'
};

const Colour = {
  WHITE: 'white',
  GREYISH_BROWN: 'greyish-brown'
};

const Tag = {
  ANCHOR: 'a',
  BUTTON: 'button',
  NUXT_LINK: 'nuxt-link'
};

export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    to: {
      type: [String, Object],
      default: null
    },
    newTab: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: Size.NORMAL,
      validator: val => Object.values(Size).some(x => x === val)
    },
    width: {
      type: String,
      default: Width.AUTO,
      validator: val => Object.values(Width).some(x => x === val)
    },
    height: {
      type: String,
      default: Height.AUTO,
      validator: val => Object.values(Height).some(x => x === val)
    },
    bg_colour: {
      type: String,
      default: BGColour.GREYISH_BROWN,
      validator: val => Object.values(BGColour).some(x => x === val)
    },
    colour: {
      type: String,
      default: Colour.WHITE,
      validator: val => Object.values(Colour).some(x => x === val)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isReallyDisabled: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isAbsoluteWebUrl() {
      if (typeof this.to === 'string') {
        return !!this.to.match(/^((http(s)?|ftp):)?\/\//i);
      }

      return false;
    },
    isPhoneOrEmailUrl() {
      if (typeof this.to === 'string') {
        return !!this.to.match(/^(tel|mailto):/i);
      }

      return false;
    },
    isInternalUrl() {
      return this.to && !this.isAbsoluteWebUrl && !this.isPhoneOrEmailUrl;
    },
    tag() {
      if (!this.to) {
        return Tag.BUTTON;
      } else if (
        this.newTab ||
        this.isAbsoluteWebUrl ||
        this.isPhoneOrEmailUrl
      ) {
        return Tag.ANCHOR;
      } else if (this.isInternalUrl) {
        return Tag.NUXT_LINK;
      } else {
        return Tag.BUTTON;
      }
    },
    props() {
      const props = {
        ...this.$attrs
      };

      if (this.tag === Tag.BUTTON) return props;

      if (this.newTab || this.isAbsoluteWebUrl) {
        props.href = this.to;
        props.target = '_blank';
        props.rel = 'noreferrer noopener';
      }

      if (this.isInternalUrl) {
        props.to = this.to;
      }

      if (this.isPhoneOrEmailUrl) {
        props.href = this.to;
      }

      return props;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.base-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: auto;
  height: 2.5rem;
  padding: 0 1.25rem;
  border: none;
  border-radius: 1.5rem;
  cursor: pointer;
  font-family: $navigation-font;
  font-size: 1rem;
  transition: box-shadow 300ms ease-in-out, opacity 300ms ease-in-out;

  &:hover {
    box-shadow: 0 2px 0.5rem rgba($true-black, 0.5);
  }

  &--size {
    &-normal {
      font-size: 1rem;
    }

    &-medium {
      font-size: 1.125rem;

      @include whenScreenIs(mdx) {
        border-radius: 1.5rem;
      }
    }

    &-large {
      border-radius: 1.25rem;
      min-height: 2.5rem;
      font-size: 1.375rem;

      @include whenScreenIs(mdx) {
        border-radius: 2.5rem;
        min-height: 5rem;
        font-size: 2.5rem;
      }
    }
  }

  &--width {
    &-fit {
      width: 100%;
    }
  }

  &--height {
    &-fit {
      width: 100%;
    }

    &-full {
      height: auto;
    }
  }

  &--bg-colour {
    &-greyish-brown {
      background-color: $greyish-brown;
      &:active {
        color: $mac-and-cheese;
      }
    }

    &-mac-and-cheese {
      background-color: $mac-and-cheese;
      &:active {
        background-color: $light-mustard;
      }
    }
  }

  &--colour {
    &-white {
      color: $white;
    }

    &-greyish-brown {
      color: $greyish-brown;
    }
  }

  &--outline {
    border: 1px solid $grey;
  }

  &--disabled {
    cursor: default;
    opacity: 0.8;
    background-color: $brown-grey;

    &:hover {
      box-shadow: none;
    }
  }

  &__loader {
    content: '';
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    background-image: url('~/assets/img/icons/icon-tick-off-white.svg');
    background-size: 100%;
    background-position: center;
    animation: spin 1s infinite linear;
  }
}

.base-button--bg-colour {
  &-greyish-brown:hover {
    color: $mac-and-cheese;
  }
  &-mac-and-cheese:hover {
    background-color: $light-mustard;
  }
}
</style>
