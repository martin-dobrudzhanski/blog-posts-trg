<template>
  <div class="large-card-wrapper">
    <div class="image-container">
      <img class="left" src="@/assets/img/flower-green.png" alt="image" />
      <img
        class="right"
        src="http://images.ctfassets.net/w3qjq8no4dj7/2NoUGOFqwiJw7hjiHM0yNl/5984e29f07101a79ae8a5f10af80fd3a/DSC05898_2x.jpg?fit=fill&w=840&h=840"
        alt="image"
      />
    </div>
    <div class="text-container">
      <h2 class="title">{{ title }}</h2>
      <p class="text">
        {{ description }}
      </p>
      <p class="author">Author: {{ author }}</p>
      <p class="post-date">Date: {{ date }}</p>
      <div class="social-media-links">
        <BaseLink
          v-for="(socialLink, idx) in footerSocialLinks"
          :key="idx"
          class="footer__social-link"
          :title="socialLink.title"
          :to="socialLink.url"
          :new-tab="socialLink.newTab"
        >
          <img
            :src="getSocialLinkIconUrl(socialLink)"
            class="footer__social-link__icon"
          />
          <img
            :src="getSocialLinkIconUrl(socialLink, 'active')"
            class="footer__social-link__icon active"
          />
        </BaseLink>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import get from 'lodash.get';
import BaseLink from '~/components/ui/BaseLink.vue';
export default {
  components: {
    BaseLink
  },
  props: {
    title: {
      type: String
    },
    description: {
      type: String
    },
    author: {
      type: String
    },
    date: {
      type: String
    }
  },
  data() {
    return {
      selectedItem: null
    };
  },
  methods: {
    getSocialLinkIconUrl(socialLink, state = '') {
      const icon = !state ? 'icon' : 'activeIcon';
      return get(socialLink, `${icon}.fields.file.url`, '');
    }
  },
  computed: {
    ...mapGetters('ui', ['footerSocialLinks'])
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.large-card-wrapper {
  @include whenScreenIs(tablet) {
    flex-direction: column;
    align-items: center;
  }
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 1280px;
  margin: auto;
}
.image-container {
  @include whenScreenIs(tablet) {
    width: auto;
  }
  display: flex;
  padding: 1rem;
  width: 50%;

  .left {
    position: relative;
    width: 410px;
    height: auto;
  }
  .right {
    position: relative;
    left: -210px;
    width: 420px;
    height: auto;
    border-radius: 5%;
    align-self: center;
  }
}
.text-container {
  @include whenScreenIs(tablet) {
    width: auto;
    // text-align: center;
  }
  flex-direction: column;
  padding-left: 6rem;
  padding-top: 1rem;
  text-align: left;
  width: 50%;

  .title {
    font-family: 'BurfordExtrudeC', 'BurfordStripesA', 'HelloSidney',
      'BurfordExtrudeC', 'NeueHaasGroteskTextPro55Roman', 'Roboto',
      'Helvetica Neue', Helvetica, 'Fira Sans', 'Droid Sans', sans-serif;
    font-size: 56px;
    color: #3c3c3c;
    line-height: 0.89;
    padding: 1rem 0;
    width: 100%;
  }
  .text {
    font-family: 'NeueHaasGroteskTextPro55Roman', 'Roboto', 'Helvetica Neue',
      Helvetica, 'Fira Sans', 'Droid Sans', sans-serif;
    color: #3c3c3c;
    font-size: 20px;
    line-height: 1.22;
    padding: 1rem 0 2rem 0;
    width: 100%;
  }

  .author,
  .post-date {
    font-size: 24px;
    font-weight: bold;
    padding-bottom: 20px;
  }
}
.social-media-links {
  @include whenScreenIs(tablet) {
    justify-content: start;
  }
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
