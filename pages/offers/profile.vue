<template>
  <div class="profile">
    <PageHeader with-negative-margin :image="walletHeaderImage" />
    <section class="profile-page">
      <nav class="profile-page__tabs">
        <nuxt-link
          class="profile-page__tab"
          to="/offers/profile"
          :class="{ active: isActive('/offers/profile') }"
          >Wallet
        </nuxt-link>
        <nuxt-link
          class="profile-page__tab"
          to="/offers/profile/edit"
          :class="{ active: isActive('/offers/profile/edit') }"
          >Profile
        </nuxt-link>
      </nav>

      <div class="profile-page__container">
        <div class="profile-page__form-wrapper">
          <nuxt-child :content="content" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import get from 'lodash.get';
import { getContent } from '~/libs/templateHelpers.js';

import PageHeader from '@/components/ui/PageHeader';

export default {
  layout: 'wallet',
  components: {
    PageHeader
  },
  data() {
    return {
      content: null,
      vouchers: []
    };
  },
  async asyncData({ store, error }) {
    return getContent(store, 'wallet-pages', error);
  },
  methods: {
    isActive(path) {
      return path === this.$route.path;
    }
  },
  computed: {
    walletHeaderImage() {
      return get(this.content, 'headerImage.fields', null);
    }
  },
  beforeMount() {
    if (!this.$store.getters['auth/userAuthenticated']) {
      this.$router.replace({ path: `/login` });
    }
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.profile {
  padding-bottom: 3rem;
  background-image: url('~/assets/img/background/paper.jpg');
}

.profile-page {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  padding: 1rem;

  @include whenScreenIs(sm) {
    max-width: $max-width-mdesktop;
  }

  @include whenScreenIs(lg) {
    max-width: 1088px;
    padding: 0;
  }

  &__tabs {
    display: grid;
    justify-content: center;
    grid-template-columns: 1fr 1fr;

    @include whenScreenIs(sm) {
      grid-gap: 1rem;
    }
  }

  &__tab {
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
    font-family: $card-heading-font;
    font-size: 18px;
    font-weight: bold;

    &:first-child {
      background-color: $light-beige;
    }

    &--disabled {
      cursor: default;
    }

    &__title {
      font-family: $display-font;
      font-weight: 900;
      font-size: 1.25rem;
      color: inherit;
      text-align: center;

      @include whenScreenIs(mdx) {
        font-size: 1.5rem;
      }
    }
  }

  &__form-wrapper {
    margin: auto;
  }

  &__desktop-tiles,
  &__mobile-tiles {
    background-color: $true-white;
    padding: 1rem 0;
  }
}
</style>
