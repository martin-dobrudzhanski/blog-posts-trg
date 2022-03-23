<template>
  <div
    class="clickable-banner"
    :class="{ 'clickable-banner--no-image': !getImageUrl(backgroundImage) }"
    v-if="linkUrl"
  >
    <a class="clickable-banner-link" v-if="linkExternal" :href="linkUrl">
      <template
        v-if="
          getImageUrl(backgroundImage) || getImageUrl(backgroundMobileSpecific)
        "
      >
        <img
          class="desktop-background"
          :class="{
            'no-mobile-background': !getImageUrl(backgroundMobileSpecific)
          }"
          v-if="getImageUrl(backgroundImage)"
          :src="getImageUrl(backgroundImage)"
          :alt="backgroundImageTitle"
        />
        <img
          class="mobile-background"
          v-if="getImageUrl(backgroundMobileSpecific)"
          :src="getImageUrl(backgroundMobileSpecific)"
          :alt="backgroundImageTitle"
        />
      </template>
      <p v-else>{{ textCopy }}</p>
    </a>
    <nuxt-link class="clickable-banner-link" :to="linkUrl" v-else>
      <template
        v-if="
          getImageUrl(backgroundImage) || getImageUrl(backgroundMobileSpecific)
        "
      >
        <img
          class="desktop-background"
          :class="{
            'no-mobile-background': !getImageUrl(backgroundMobileSpecific)
          }"
          v-if="getImageUrl(backgroundImage)"
          :src="getImageUrl(backgroundImage)"
          :alt="backgroundImageTitle"
        />
        <img
          class="mobile-background"
          v-if="getImageUrl(backgroundMobileSpecific)"
          :src="getImageUrl(backgroundMobileSpecific)"
          :alt="backgroundImageTitle"
        />
      </template>
      <p v-else>{{ text }}</p>
    </nuxt-link>
  </div>
</template>

<script>
import get from 'lodash.get'
export default {
  name: 'ClickableBanner',
  props: {
    backgroundImage: {
      type: [Boolean, Object],
      default: false
    },
    backgroundMobileSpecific: {
      type: [Boolean, Object],
      default: false
    },
    link: {
      type: [Boolean, Object],
      default: false
    },
    text: {
      type: [Boolean, String],
      default: false
    }
  },
  computed: {
    backgroundImageTitle() {
      const { backgroundImage } = this
      const payload = get(backgroundImage, 'fields.title')
      return payload
    },
    linkUrl() {
      const { link } = this
      const payload = get(link, 'fields.href')
      return payload
    },
    linkTitle() {
      const { link } = this
      const payload = get(link, 'fields.title')
      return payload
    },
    linkExternal() {
      const { link } = this
      const payload = get(link, 'fields.external')
      return payload
    },
    textCopy() {
      const { text } = this
      return text || ''
    }
  },
  methods: {
    goToLink() {
      const { link } = this
      if (link.external) {
        this.$router.push(link)
      }
      return
    },
    getImageUrl(image) {
      const url = get(image, 'fields.file.url')
      return url
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.clickable-banner {
  display: flex;
  width: 100%;
}
.clickable-banner--no-image {
  min-height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    color: #fff;
    font-size: 2rem;
  }
}
.clickable-banner-link {
  height: 100%;
  width: 100%;
}
.desktop-background {
  display: none;

  @include whenScreenIs(mdx) {
    display: inherit;
  }
}
.mobile-background {
  display: inherit;

  @include whenScreenIs(mdx) {
    display: none;
  }
}
.no-mobile-background {
  display: inherit;
}
</style>
