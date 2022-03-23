<template>
  <div class="drawer-nav">
    <div class="drawer-nav__container">
      <header class="drawer-nav__header">
        <BaseLink to="/" class="drawer-nav__logo">
          <img src="@/assets/img/yellow-logo.svg" alt="Chiquito" />
        </BaseLink>
        <button
          class="button-reset drawer-nav__close-btn"
          @click="$emit('close')"
        >
          <img src="@/assets/img/icons/icon_blue_close.svg" alt="Chiquito" />
        </button>
      </header>
      <div class="drawer-nav__location-form-wrapper">
        <h1 class="drawer-nav__location-form-heading">Find a restaurant</h1>
        <LocationForm
          size="md"
          :is-geolocating="isGeolocating"
          @geolocate="handleGeolocate"
          @search="handleSearch"
        />
      </div>
      <ul class="drawer-nav__primary-link-list">
        <li
          v-for="(link, idx) in mobileNavigationLinks"
          :key="idx"
          class="drawer-nav__primary-link-item"
        >
          <BaseLink
            v-if="!getLinkSubLinks(link).length && link.href"
            class="drawer-nav__primary-link"
            :to="link.href"
            :new-tab="link.newTab"
          >
            {{ link.text }}
          </BaseLink>
          <p
            v-else
            class="drawer-nav__primary-link"
            @click="
              getLinkSubLinks(link).length && toggleSecondaryList(link, idx)
            "
          >
            {{ link.text }}
          </p>
          <ul
            v-if="getLinkSubLinks(link).length"
            :class="[
              'drawer-nav__secondary-link-list',
              {
                'drawer-nav__secondary-link-list--expanded':
                  isSecondaryListExpanded(link, idx),
              },
            ]"
          >
            <li
              v-for="(subLink, subLinkIdx) in getLinkSubLinks(link)"
              :key="subLinkIdx"
              class="drawer-nav__secondary-link-item"
            >
              <BaseLink
                class="drawer-nav__secondary-link"
                :to="subLink.href"
                :new-tab="subLink.newTab"
              >
                - {{ subLink.text }}
              </BaseLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import get from 'lodash.get';
import { mapGetters, mapActions } from 'vuex';
import BaseLink from '@/components/ui/BaseLink';
import LocationForm from '@/components/LocationForm';

export default {
  name: 'DrawerNavigation',
  components: { BaseLink, LocationForm },
  data: () => ({
    expandedLinksDict: {},
    isGeolocating: false,
  }),
  computed: {
    ...mapGetters('ui', ['mobileNavigationLinks']),
  },
  methods: {
    ...mapActions({
      getBrowserLocation: 'location/getBrowserLocation',
      flash: 'ui/flash',
    }),
    async handleGeolocate() {
      try {
        this.isGeolocating = true;
        const browserLocation = await this.getBrowserLocation();
        const { lat, long } = browserLocation;
        const query = `${lat},${long}`;

        // Redirect to the Yext reverse proxied search page
        window.location = `/restaurants/search?q=${query}`;
      } catch (error) {
        this.flash({
          message:
            'You need to allow location permissions in order to use this functionality',
        });
      } finally {
        this.isGeolocating = false;
      }
    },
    handleSearch(query = '') {
      // Redirect to the Yext reverse proxied search page
      window.location = `/restaurants/search?q=${query}`;
    },
    getLinkSubLinks(link) {
      const subLinks = get(link, 'subLinks', []);
      return subLinks.map((subLink) =>
        subLink && subLink.fields ? subLink.fields : {}
      );
    },
    toggleSecondaryList(link, index) {
      const linkUid = this.getLinkUid(link, index);
      Vue.set(
        this.expandedLinksDict,
        linkUid,
        !this.expandedLinksDict[linkUid]
      );
    },
    isSecondaryListExpanded(link, index) {
      const linkUid = this.getLinkUid(link, index);
      return !!this.expandedLinksDict[linkUid];
    },
    getLinkUid(link, index) {
      return `${link.text}-${index}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.drawer-nav {
  z-index: 1;
  width: 100%;
  height: 100%;
  background: $sky-blue;

  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 1.5rem 0;
  }

  &__header,
  &__location-form-wrapper,
  &__primary-link-list {
    padding: 0 1.5rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 3.5rem;
    padding: 0 1.5rem;
  }

  &__logo {
    width: 11.25rem;
    height: 3.25rem;

    img {
      max-width: 100%;
      height: 100%;
    }
  }

  &__close-btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: white;
    cursor: pointer;

    img {
      margin-top: 5px;
      width: 28.3px;
      height: 28.3px;
    }
  }

  &__location-form-wrapper {
    margin-bottom: 3.5rem;
  }

  &__location-form-heading {
    width: 100%;
    margin-bottom: 0.5rem;
    font-family: $drawer-navigation-font;
    font-size: 1.125rem;
    color: $white;
    text-align: center;
  }

  &__primary-link-item {
    margin-bottom: 1.25rem;
  }

  &__primary-link {
    font-family: $drawer-navigation-font;
    font-size: 1.5rem;
    font-weight: bold;

    &.nuxt-link-exact-active {
      color: $rebrand-yellow;
      &:after {
        content: '';
        position: absolute;
        bottom: -0.25rem;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: $rebrand-yellow;
      }
    }
  }

  &__secondary-link-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 0;
    padding: 0;
    opacity: 0;
    overflow: hidden;

    &--expanded {
      max-height: 9999px;
      padding: 1rem 0 0 1rem;
      opacity: 1;
      transition: opacity 300ms ease, max-height 700ms ease;
    }
  }

  &__secondary-link-item {
    &:not(:last-child) {
      margin-bottom: 0.85rem;
    }
  }

  &__secondary-link {
    font-family: $font;
    font-size: 1.15rem;

    &.nuxt-link-exact-active {
      &:after {
        content: '';
        position: absolute;
        bottom: -0.25rem;
        left: 0.8rem;
        width: 100%;
        height: 2px;
        background-color: $white;
      }
    }
  }

  &__primary-link,
  &__secondary-link {
    position: relative;
    display: inline;
    color: $white;
  }

  &__secondary-list {
    &--expanded {
      max-height: 9999px;
      padding: 0.75rem 0 0;
      opacity: 1;
      transition: opacity 300ms ease, max-height 700ms ease;
    }
  }
}
</style>
