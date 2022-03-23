<template>
  <component
    :is="tag"
    :class="['base-link', { 'base-link--clickable': isClickable }]"
    v-bind="props"
  >
    <slot />
  </component>
</template>

<script>
const Tag = {
  Anchor: 'a',
  Span: 'span',
  NuxtLink: 'nuxt-link'
};

export default {
  name: 'BaseLink',
  props: {
    to: {
      type: [String, Object],
      default: null
    },
    newTab: {
      type: Boolean,
      default: false
    },
    disableAutoNewTab: {
      type: Boolean,
      default: false
    },
    external: {
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
        return Tag.Span;
      } else if (
        this.newTab ||
        this.isAbsoluteWebUrl ||
        this.isPhoneOrEmailUrl ||
        this.external
      ) {
        return Tag.Anchor;
      } else if (this.isInternalUrl) {
        return Tag.NuxtLink;
      } else {
        return Tag.Span;
      }
    },
    props() {
      const props = {};

      if (this.tag === Tag.Span) return props;

      if (
        this.newTab ||
        this.isAbsoluteWebUrl ||
        this.isPhoneOrEmailUrl ||
        this.external
      ) {
        props.href = this.to;
      }

      if ((this.newTab || this.isAbsoluteWebUrl) && !this.disableAutoNewTab) {
        props.target = '_blank';
        props.rel = 'noreferrer noopener';
      }

      if (this.isInternalUrl) {
        props.to = this.to;
      }

      return props;
    },
    isClickable() {
      return !!this.to || !!this.$listeners.click;
    }
  }
};
</script>

<style lang="scss" scoped>
.base-link {
  &--clickable {
    cursor: pointer;
  }
}
</style>
