<template>
  <section class="error" data-fullscreen>
    <img class="image" v-if="getImage" :src="getImage" alt="No image" />
    <h1 class="heading" data-size="xl">
      {{ getHeading }}
    </h1>
    <div class="wrapper">
      <p class="heading">
        {{ getText }}
      </p>
      <BaseButton
        v-if="content.buttonText"
        class="button"
        size="medium"
        :to="getButtonHref"
      >
        {{ getButtonText }}
      </BaseButton>
    </div>
  </section>
</template>

<script>
import { getContent } from '~/libs/templateHelpers.js';
import BaseButton from '@/components/buttons/BaseButton';

export default {
  name: 'PageNotFound',
  components: {
    BaseButton
  },
  props: ['error'],
  data() {
    return {
      content: {}
    };
  },
  head() {
    const getMeta = () => {
      if (!this.$store.state.ui.metaDescription) {
        return '';
      }
      return this.$store.state.ui.metaDescription;
    };
    return {
      title: 'Page not found',
      bodyAttrs: {
        'data-pagecolor': 'paper'
      },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: getMeta()
        }
      ]
    };
  },
  async mounted() {
    const data = await getContent(false, '404');
    this.content = data.content;
    this.$store.commit('ui/setNav', this.content.nav.fields);
    this.$store.commit(
      'ui/setMetaDescription',
      this.content.nav.fields.metaDescription
    );
  },
  computed: {
    getImage() {
      if (this.error.statusCode === 404) {
        if (
          this.content.image &&
          this.content.image.fields &&
          this.content.image.fields.file &&
          this.content.image.fields.file.url
        ) {
          return this.content.image.fields.file.url;
        }
      }
      return null;
    },
    getHeading() {
      if (this.error.statusCode === 404) {
        if (this.content.headerText) {
          return this.content.headerText;
        }
      }
      return '404';
    },
    getText() {
      if (this.error.statusCode === 404) {
        if (this.content.text) {
          return this.content.text;
        }
      }
      return 'Sorry, we cant find that page';
    },
    getButtonText() {
      if (this.error.statusCode === 404) {
        if (this.content.buttonText) {
          return this.content.buttonText;
        }
      }
      return 'Go to homepage';
    },
    getButtonHref() {
      if (this.error.statusCode === 404) {
        if (this.content.buttonUrl) {
          return this.content.buttonUrl;
        }
      }
      return '/';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

section.error {
  padding-bottom: 220px;
  text-align: center;
  color: $greyish-brown;
  h1 {
    font-family: $heading-font;
    font-size: 48px;
    color: $peacock-blue;
    line-height: 1.04;
  }
  .image {
    padding-top: 2rem;
  }
  .wrapper {
    p {
      font-family: $font;
      font-size: 18px;
      margin: 1rem 0 3rem;
      padding: 0 50px;
      line-height: 1.22;
    }
    .button {
      width: fit-content;
      margin: auto;
    }
  }
}
</style>
