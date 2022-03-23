<template>
  <nav
    id="mainHeaderContainer"
    :class="['header', `header--${headerDrawerOpen ? 'solid' : variant}`]"
  >
    <div class="header__container">
      <div
        v-if="showDrawerToggle"
        :class="{ fixed: isFixed }"
        class="header__mobile-actions"
      >
        <button
          type="button"
          :class="[
            'button-reset',
            'hamburger',
            'hamburger--white',
            'header__mobile-nav-toggle',
            {
              'is-active': headerDrawerOpen,
              'is-pink': isFixed
            }
          ]"
          @click="toggleDrawerOpen"
        >
          <div class="hamburger-box">
            <span class="hamburger-inner" />
          </div>
        </button>
      </div>
      <template>
        <div v-if="disableLogoLink" class="header__logo">
          <img
            class="header__logo-img"
            src="@/assets/img/yellow-logo.svg"
            alt="Chiquito"
          />
        </div>
        <BaseLink v-else class="header__logo" to="/">
          <img
            class="header__logo-img"
            src="@/assets/img/yellow-logo.svg"
            alt="Chiquito"
          />
        </BaseLink>
      </template>
      <div :class="['header__actions', { fixed: isFixed }]">
        <!-- Links -->
        <div
          v-for="(link, idx) in headerNavigationLinks"
          :key="idx"
          :class="[
            'header__action-item',
            'header__action-item--link',
            {
              'header__action-item--expanded': isSecondaryListExpanded(
                link,
                idx
              )
            }
          ]"
        >
          <BaseLink
            v-if="!getLinkSubLinks(link).length && link.href"
            disable-auto-new-tab
            class="header__action-item__link"
            :to="link.href"
            :new-tab="link.newTab"
            :external="link.external"
          >
            {{ link.text }}
          </BaseLink>
          <p
            v-else
            class="header__action-item__link"
            @click="toggleSecondaryList(link, idx)"
          >
            {{ link.text }}
          </p>
          <!-- Sub links dropdown -->
          <div
            v-if="getLinkSubLinks(link).length"
            class="header__dropdown-wrapper"
          >
            <Transition name="slide-down" mode="out-in">
              <div
                v-if="isSecondaryListExpanded(link, idx)"
                class="header__dropdown"
              >
                <BaseLink
                  v-for="(subLink, subLinkIdx) in getLinkSubLinks(link)"
                  :key="subLinkIdx"
                  disable-auto-new-tab
                  class="header__dropdown__link"
                  :to="subLink.href"
                  :new-tab="subLink.newTab"
                >
                  {{ subLink.text }}
                </BaseLink>
              </div>
            </Transition>
          </div>
        </div>
        <!-- CTA -->
        <div
          v-if="showCta && headerNavigationCta"
          class="header__action-item header__action-item--cta"
        >
          <BaseLink
            disable-auto-new-tab
            :to="headerNavigationCta.url"
            :new-tab="headerNavigationCta.newTab"
            class="header__action-item__cta"
          >
            {{ headerNavigationCta.text }}
          </BaseLink>
        </div>
        <!-- Basket -->
        <no-ssr>
          <div
            v-if="showBasketCta"
            class="header__action-item header__action-item--basket"
          >
            <BaseLink class="header__basket" :to="basketLink">
              <span class="header__basket__text">Basket</span>
              <span class="header__basket__icon-wrapper">
                <img
                  src="@/assets/img/icons/bag.svg"
                  alt="Basket"
                  class="header__basket__icon"
                />
                <span
                  v-if="basketCount"
                  class="header__basket__count"
                  v-text="basketCount"
                />
              </span>
            </BaseLink>
          </div>
        </no-ssr>
      </div>
    </div>

    <Transition name="slide-right" mode="out-in">
      <div
        v-if="headerDrawerOpen"
        class="mobile-drawer-wrapper"
        @click.self="toggleDrawerOpen"
      >
        <DrawerNavigation @close="toggleDrawerOpen" />
      </div>
    </Transition>
  </nav>
</template>

<script>
import Vue from 'vue';
import get from 'lodash.get';
import { mapGetters, mapMutations } from 'vuex';
import { elScrolled } from '@/libs/templateHelpers.js';
import BaseLink from '@/components/ui/BaseLink';
import DrawerNavigation from '~/components/ui/DrawerNavigation.vue';

const Variant = {
  SOLID: 'solid',
  FADED: 'faded'
};

export default {
  name: 'MainHeader',
  components: {
    BaseLink,
    DrawerNavigation
  },
  props: {
    disableLogoLink: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: Variant.SOLID,
      validator: val => Object.values(Variant).some(x => x === val)
    },
    showDrawerToggle: {
      type: Boolean,
      default: false
    },
    showCta: {
      type: Boolean,
      default: false
    },
    showBasketCta: {
      type: Boolean,
      default: false
    },
    basketCount: {
      type: [Number, String],
      default: null
    },
    basketLink: {
      type: String,
      default: null
    }
  },
  data: () => ({
    expandedLinksDict: {},
    isFixed: false
  }),
  computed: {
    ...mapGetters('ui', [
      'headerDrawerOpen',
      'headerNavigationLinks',
      'headerNavigationCta'
    ])
  },
  methods: {
    ...mapMutations('ui', ['showHeaderDrawer', 'hideHeaderDrawer']),
    toggleDrawerOpen() {
      if (this.headerDrawerOpen) {
        return this.hideHeaderDrawer();
      }

      this.showHeaderDrawer();
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
    getSocialLinkIconUrl(socialLink) {
      return get(socialLink, 'icon.fields.file.url', '');
    },
    getLinkSubLinks(link) {
      const subLinks = get(link, 'subLinks', []);
      return subLinks.map(subLink =>
        subLink && subLink.fields ? subLink.fields : {}
      );
    },
    handlePlacement() {
      const $el = document.querySelector('[data-component="hero__wrapper"]');
      if (this.$route.name !== 'restaurants-slug-takeaway-menu') return;
      this.isFixed = elScrolled($el);
    }
  },
  mounted() {
    this.handlePlacement();
    window.addEventListener('scroll', this.handlePlacement);
    window.addEventListener('resize', this.handlePlacement);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handlePlacement);
    window.removeEventListener('resize', this.handlePlacement);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.mobile-drawer-wrapper {
  z-index: 9999;
  position: absolute;
  top: $header-nav-height-mobile;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: calc(var(--innerHeight) - #{$header-nav-height-mobile});
  padding-right: 2rem;
}

.header {
  width: 100%;
  height: $header-nav-height-mobile;
  background: $greyish-brown;

  @include whenScreenIs(mdx) {
    height: $header-nav-height-desktop;
  }

  &--faded {
    background: linear-gradient(to bottom, $true-black, transparent);

    @include whenScreenIs(mdx) {
      background: $greyish-brown;
    }
  }

  &__container {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: $max-width-desktop;
    height: 100%;
    padding: 0 1.15rem;
    margin: 0 auto;
  }

  &__mobile-actions {
    @include whenScreenIs(mdx) {
      display: none;
    }
    &.fixed {
      position: fixed;
      top: 27px;
      left: 15px;
      z-index: 101;
    }
  }

  &__mobile-nav-toggle {
    width: 1.5rem;
    height: 1.5rem;
    color: $true-white;
    background-color: $greyish-brown;
    &.is-pink {
      background-color: transparent;
    }
  }

  &__logo {
    position: absolute;
    display: block;
    top: 3px;
    left: 0;
    bottom: 0;
    right: 0;
    width: 132px;
    height: 44px;
    margin: auto;

    @include whenScreenIs(mdx) {
      position: relative;
      margin: 0;
    }
  }

  &__logo-img {
    width: 100%;
    height: 100%;
  }

  &__actions {
    display: flex;
    align-items: center;
    height: 100%;
    margin: 0 0 0 auto;

    .headroom--not-top &.fixed {
      height: auto;
      position: fixed;
      top: 27px;
      left: calc(100% - 40px);
      z-index: 101;
      @include whenScreenIs(mdx) {
        position: static;
        height: 100%;
      }
    }
  }

  &__action-item {
    &--link {
      position: relative;
      display: none;

      @include whenScreenIs(mdx) {
        display: flex;
        align-items: center;
        height: 100%;

        &:not(:last-child) {
          margin-right: 2rem;
        }
      }
    }

    &--link.header__action-item--expanded {
      &:before {
        z-index: 1;
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -0.25rem;
        margin: 0 auto;
        width: 1rem;
        height: 1rem;
        background-color: $greyish-brown;
        border-radius: 0.25rem;
        transform: rotate(45deg);
      }
    }

    &__link,
    &__cta {
      cursor: pointer;
    }

    &__cta:hover {
      background-color: $light-mustard;
    }

    &__link {
      position: relative;
      font-family: $navigation-font;
      color: $white;
      white-space: normal;
      font-size: 1rem;

      &:hover,
      &.nuxt-link-exact-active {
        color: $rebrand-yellow;
        &:after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: $rebrand-yellow;
        }
      }
    }

    &__cta {
      display: none;
      font-family: $navigation-font;
      font-size: 1rem;
      font-weight: bold;
      line-height: 1rem;
      padding: 5px 19px 5px 16px;
      color: $greyish-brown;
      background-color: $mac-and-cheese;
      border-radius: 2rem;
      white-space: nowrap;

      @include whenScreenIs(mdx) {
        display: block;
      }
    }
  }

  &__basket {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;

    &__text {
      display: none;
      font-family: $navigation-font;
      font-size: 1rem;
      color: $white;
      white-space: nowrap;
      margin-right: 0.75rem;

      @include whenScreenIs(mdx) {
        display: inline-block;
      }

      &:hover {
        color: $mac-and-cheese;
      }
    }

    &__icon-wrapper {
      position: relative;
      display: block;
    }

    &__icon {
      width: 1.5rem;
      height: 1.5rem;
    }

    &__count {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: -0.5rem;
      bottom: -0.5rem;
      width: 1.25rem;
      min-height: 1.25rem;
      background-color: $mac-and-cheese;
      color: $greyish-brown;
      font-size: 0.875rem;
      font-weight: bold;
      border-radius: 50%;
      padding-top: 2px;
    }
  }

  &__dropdown-wrapper {
    z-index: -1;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 7rem;
  }

  &__dropdown {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    background-color: $white;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    box-shadow: 0 3px 1rem 0 rgba($true-black, 0.7);

    &__link {
      display: inline;
      position: relative;
      text-align: center;
      font-family: $font;
      font-size: 0.875rem;
      font-weight: 600;
      color: $mac-and-cheese;
      white-space: nowrap;

      &:not(:last-child) {
        margin-bottom: 1.25rem;
      }

      &:hover,
      &.nuxt-link-exact-active {
        &:after {
          content: '';
          position: absolute;
          bottom: -0.3rem;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: $mac-and-cheese;
        }
      }
    }
  }
}
</style>
