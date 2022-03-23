<template>
  <footer id="site-footer" class="footer">
    <div class="footer__container">
      <section class="footer__top-section">
        <nuxt-link to="/" class="footer__logo-wrapper">
          <img
            class="footer__logo"
            src="@/assets/img/yellow-logo.svg"
            alt="Chiquito"
          />
        </nuxt-link>
        <div
          v-if="footerSocialLinks && footerSocialLinks.length"
          class="footer__social-links"
        >
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
      </section>
      <ul class="footer__link-section">
        <li
          v-for="(link, idx) in footerNavigationLinks"
          :key="idx"
          class="footer__primary-item"
        >
          <button
            v-if="getLinkSubLinks(link).length"
            class="footer__secondary-list-toggle"
            @click="toggleSecondaryList(link, idx)"
          >
            <img
              v-if="isSecondaryListExpanded(link, idx)"
              src="@/assets/img/icons/icon-minus-white.svg"
              class="footer__secondary-list-toggle__icon"
            />
            <img
              v-else
              src="@/assets/img/icons/icon-plus-white.svg"
              class="footer__secondary-list-toggle__icon"
            />
          </button>
          <template>
            <BaseLink
              v-if="!getLinkSubLinks(link).length && link.href"
              class="footer__primary-link"
              :to="link.href"
              :new-tab="link.newTab"
            >
              {{ link.text }}
            </BaseLink>
            <p
              v-else
              class="footer__primary-link"
              @click="
                getLinkSubLinks(link).length && toggleSecondaryList(link, idx)
              "
            >
              {{ link.text }}
            </p>
          </template>
          <ul
            v-if="getLinkSubLinks(link).length"
            :class="[
              'footer__secondary-list',
              {
                'footer__secondary-list--expanded': isSecondaryListExpanded(
                  link,
                  idx
                )
              }
            ]"
          >
            <li
              v-for="(subLink, subLinkIdx) in getLinkSubLinks(link)"
              :key="subLinkIdx"
              class="footer__secondary-item"
            >
              <template>
                <BaseLink
                  v-if="subLink.href"
                  class="footer__secondary-link"
                  :to="subLink.href"
                  :new-tab="subLink.newTab"
                >
                  {{ subLink.text }}
                </BaseLink>
                <p v-else class="footer__secondary-link">
                  {{ subLink.text }}
                </p>
              </template>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import get from 'lodash.get';
import BaseLink from '~/components/ui/BaseLink.vue';

export default {
  name: 'VFooter',
  components: { BaseLink },
  data: () => ({ expandedLinksDict: {} }),
  computed: {
    ...mapGetters('ui', ['footerNavigationLinks', 'footerSocialLinks'])
  },
  methods: {
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
    getSocialLinkIconUrl(socialLink, state = '') {
      const icon = !state ? 'icon' : 'activeIcon';
      return get(socialLink, `${icon}.fields.file.url`, '');
    },
    getLinkSubLinks(link) {
      const subLinks = get(link, 'subLinks', []);
      return subLinks.map(subLink =>
        subLink && subLink.fields ? subLink.fields : {}
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.footer {
  background-color: $greyish-brown;
  padding: 1.5rem 0 2rem;

  @include whenScreenIs(mdx) {
    padding: 3.75rem 0 3rem;
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: $max-width-mobile;
    margin: 0 auto;
    padding: 0 1rem;

    @include whenScreenIs(mdx) {
      max-width: $max-width-mdesktop;
    }

    @include whenScreenIs(lg) {
      max-width: $max-width-desktop;
    }
  }

  &__top-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
    text-align: center;

    @include whenScreenIs(mdx) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  &__logo-wrapper {
    width: 100%;
    max-width: 13.25rem;
    margin-bottom: 1.125rem;

    @include whenScreenIs(mdx) {
      max-width: 16rem;
      margin-bottom: 0;
    }
  }

  &__logo {
    width: 128px;
    height: 40px;
  }

  &__social-links {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  &__social-link {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;

    &:not(:last-child) {
      margin-right: 0.875rem;
    }

    &__icon {
      height: 100%;

      &.active {
        display: none;
      }
    }

    &:hover {
      @media (pointer: fine) {
        .footer__social-link__icon {
          display: none;

          &.active {
            display: block;
          }
        }
      }
    }
  }

  &__link-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: $max-width-desktop;

    @include whenScreenIs(mdx) {
      flex-direction: row;
      justify-content: center;
    }
  }

  &__primary-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    width: 100%;
    padding: 1.25rem 0;
    text-align: center;
    border-bottom: 1px solid $white;

    @include whenScreenIs(mdx) {
      flex-direction: column;
      border-bottom: none;
      width: 100%;
    }
  }

  &__primary-link,
  &__secondary-link {
    align-self: center;
    font-family: $font;
    font-size: 1rem;
    font-weight: bold;
    color: $white;
  }

  p.footer__primary-link,
  p.footer__secondary-link {
    cursor: default;
  }

  &__secondary-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: 0;
    padding: 0;
    opacity: 0;
    overflow: hidden;

    &--expanded {
      max-height: 9999px;
      padding: 0.75rem 0 0;
      opacity: 1;
      transition: opacity 300ms ease, max-height 700ms ease;
    }

    @include whenScreenIs(mdx) {
      &,
      &--expanded {
        padding: 1.5rem 0 0;
        max-height: initial;
        opacity: 1;
        overflow: initial;
      }
    }
  }

  &__secondary-link {
    position: relative;

    &:hover {
      @media (pointer: fine) {
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
  }

  &__secondary-item {
    &:not(:last-child) {
      margin-bottom: 0.5rem;

      @include whenScreenIs(mdx) {
        margin-bottom: 1.5rem;
      }
    }
  }

  &__secondary-list-toggle {
    display: block;
    width: 0.65rem;
    background: none;
    outline: none;
    border: none;
    margin: 0 1.5rem 0 calc(-1.5rem - 1rem);
    padding: 0;
    cursor: pointer;

    @include whenScreenIs(mdx) {
      display: none;
    }

    &__icon {
      height: 100%;
    }
  }
}
</style>
