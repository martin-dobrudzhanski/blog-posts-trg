<template>
  <div class="headed-banner">
    <SectionHeader
      v-if="text"
      :text="text"
      :textColor="textColor"
      size="sm"
      :inverse="inverse"
    />
    <template v-if="backgroundImage">
      <img
        class="desktop-background"
        :src="backgroundImage"
        :alt="banner.description"
      />
      <img
        class="mobile-background"
        v-if="backgroundImageMobile"
        :src="backgroundImageMobile"
        :alt="banner.description"
      />
    </template>
    <p v-else>{{ description }}</p>
  </div>
</template>

<script>
import SectionHeader from '~/components/iOrder-core/uiV3/SectionHeader';
import get from 'lodash.get';
export default {
  components: {
    SectionHeader
  },
  props: {
    text: {
      type: String
    },
    textColor: {
      type: String,
      default: 'pale'
    },
    banner: {
      type: [Object, Boolean],
      default: false
    },
    description: {
      type: String,
      default: 'Success Page Banner'
    },
    inverse: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    backgroundImage() {
      const { banner } = this;
      const payload = get(banner, 'fields.backgroundImage.fields.file.url');
      return payload;
    },
    backgroundImageMobile() {
      const { banner } = this;
      const payload = get(
        banner,
        'fields.backgroundMobileSpecific.fields.file.url'
      );
      return payload;
    },
    bannerTitle() {
      const { banner } = this;
      if (!banner) return '';
      const payload = get(banner, 'fields.backgroundImage.fields.title');
      return payload;
    },
    textBanner() {
      const { description, bannerTitle } = this;
      if (description) return description;
      if (bannerTitle) return bannerTitle;
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/helpers.scss';
.headed-banner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
</style>
