<template>
  <a
    v-if="isExternalUrl"
    :href="linkInfo.linkedFile ? linkInfo.linkedFile.fields.file.url : href"
    :target="shouldOpenNewTab ? '_blank' : '_self'"
    :rel="shouldOpenNewTab ? 'noopener' : ''"
  >
    <slot />
  </a>
  <nuxt-link v-else :to="href"><slot /></nuxt-link>
</template>

<script>
export default {
  props: {
    linkInfo: {
      type: Object,
      default: () => {}
    },
    href: {
      type: String,
      default: ''
    }
  },
  computed: {
    isAbsoluteWebUrl() {
      return this.href.match(/^((http(s)?|ftp):)?\/\//)
    },
    isExternalUrl() {
      return (
        this.linkInfo.external ||
        this.linkInfo.linkedFile ||
        this.isAbsoluteWebUrl
      )
    },
    shouldOpenNewTab() {
      return (
        this.linkInfo.newTab ||
        this.linkInfo.linkedFile ||
        this.isAbsoluteWebUrl
      )
    }
  }
}
</script>
