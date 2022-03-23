<template>
  <div ref="wrapper" class="hero__wrapper" data-component="hero__wrapper">
    <div
      class="hero"
      :style="mainStyle"
      :class="{ 'hero--full-height': fullHeight }"
    >
      <h2
        :class="{
          hero__heading: subNav,
          hero__location: !subNav,
          'hero__heading--fullHeight': fullHeight
        }"
      >
        {{ heading }}
      </h2>
      <h2 v-if="locationName" class="hero__location">{{ locationName }}</h2>
      <nuxt-link v-if="button" :to="button.link" class="hero__button">{{
        button.copy
      }}</nuxt-link>
      <div
        v-if="!subNav"
        class="search-bar__wrapper"
        :class="{ 'search-bar__wrapper--bottom': !fullHeight }"
      >
        <h2 v-if="searchHeading" class="search__heading">
          {{ searchHeading }}
        </h2>
        <SearchInput
          v-if="searchBar"
          :placeholder="searchPlaceholder"
          @changed="setSearchQuery"
          :searchQuery="searchQuery"
          @search="e => $emit('search', e)"
          :hasNearestIcon="hasNearestIcon"
        />
      </div>
      <MenuAside v-if="asideBoxes" :boxes="asideBoxes" />
      <slot />
    </div>
    <div
      v-if="subNav"
      id="subNavContainer"
      class="hero__subnav__container"
      :class="{ fixed: isFixed, takeout: isTakeout }"
    >
      <div class="hero__subnav">
        <SearchInput
          v-if="searchBar"
          :class="['hero__search-bar', { takeout: isTakeout }]"
          :placeholder="searchPlaceholder"
          @changed="setSearchQuery"
          :searchQuery="searchQuery"
          @search="e => $emit('search', e)"
          :hasNearestIcon="hasNearestIcon"
          :hasClearIcon="hasClearIcon"
        />
        <p
          v-if="subnavHeading"
          class="hero__subnav__heading"
          :class="{ hidden: isFixed }"
        >
          {{ subnavHeading }}
        </p>
        <div
          class="hero__subnav__links"
          :class="{
            flex: dietaryRequirements,
            center: !dietaryRequirements,
            hidden: isFixed
          }"
        >
          <button
            @click="showModal = 'allergyAdvice'"
            class="hero__subnav__link"
          >
            ALLERGENS
          </button>
          <button
            v-if="dietaryRequirements"
            @click="showModal = 'dietaryRequirements'"
            class="hero__subnav__link"
          >
            DIETARY REQUIREMENTS
          </button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <ModalContainer
        v-if="showModal"
        data-element="modal-container"
        @close="showModal = false"
      >
        <DynamicModal
          :heading="modalHeading"
          :copy="modalCopy"
          :cta="dietaryRequirementsCTA"
          @close="showModal = false"
        />
      </ModalContainer>
    </transition>
  </div>
</template>

<script>
import { elScrolled } from '@/libs/templateHelpers.js';

import SearchInput from '~/components/iOrder-core/menuV3/SearchInput';
import MenuAside from '~/components/iOrder-core/menuV3/MenuAside';
import DynamicModal from '~/components/iOrder-core/modalsV3/DynamicModal';
import ModalContainer from '~/components/iOrder-core/modalsV3/ModalContainer';

export default {
  components: {
    SearchInput,
    MenuAside,
    DynamicModal,
    ModalContainer
  },
  name: 'VHero',
  data() {
    return {
      showModal: null,
      isFixed: false,
      isTakeout: false
    };
  },
  props: {
    allergyAdvice: {
      type: String,
      default: null
    },
    dietaryRequirements: {
      type: String,
      default: null
    },
    dietaryRequirementsCTA: {
      type: Object,
      default: null
    },
    hasNearestIcon: {
      type: Boolean,
      default: false
    },
    backgroundImage: {
      type: String,
      default: null
    },
    locationName: {
      type: String,
      default: null
    },
    subnavHeading: {
      type: String,
      default: null
    },
    searchQuery: {
      type: String,
      default: null
    },
    subNav: {
      type: Boolean,
      default: true
    },
    searchBar: {
      type: Boolean,
      default: true
    },
    heading: {
      type: String,
      default: null
    },
    searchHeading: {
      type: String,
      default: null
    },
    button: {
      type: Object,
      default: null
    },
    searchPlaceholder: {
      type: String,
      default: null
    },
    fullHeight: {
      type: Boolean,
      default: false
    },
    asideBoxes: {
      type: Array,
      default: null
    },
    hasClearIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setSearchQuery(e) {
      this.$emit('setSearchQuery', e);
    },
    handlePlacement() {
      const $el = this.$refs.wrapper;
      this.isFixed = elScrolled($el);
      this.isTakeout =
        this.isFixed && this.$route.name === 'restaurants-slug-takeaway-menu';
      this.$emit('handlePosition', this.isFixed);
    }
  },
  computed: {
    modalCopy() {
      const { showModal } = this;
      if (showModal) {
        return this[showModal];
      }
      return null;
    },
    modalHeading() {
      const { showModal } = this;
      if (showModal) {
        const headingMap = {
          allergyAdvice: 'Allergy advice',
          dietaryRequirements: 'Dietary requirements'
        };
        return headingMap[showModal];
      }
      return null;
    },
    mainStyle() {
      const { backgroundImage } = this;
      const payload = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${backgroundImage})`
      };
      return payload;
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
$max-width: 690px;
.hero {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: $grey;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 379px;
  position: relative;
  mix-blend-mode: multiply;
  background-blend-mode: multiply;
  transition: min-height 0.25s ease-out;
  @include whenScreenIs(xs) {
    min-height: 70vh;
  }
  @include whenScreenIs(sm) {
    min-height: 70vh;
  }
  @include whenScreenIs(mdx) {
    min-height: 322px;
  }
  &.hero--full-height {
    padding-top: 100px;
    min-height: calc(100vh - #{$header-nav-height-mobile});
    @include whenScreenIs(mdx) {
      min-height: calc(100vh - #{$header-nav-height-desktop});
    }
  }
}
.hero__wrapper {
  background-color: $true-white;
  /deep/ .menu-aside {
    margin: 1.5rem 0;
    @include whenScreenIs(mdx) {
      display: none;
    }
  }
}
.hero__heading {
  font-size: 24px;
  font-family: $navigation-font;
  color: $white;
  line-height: normal;
  text-align: center;
  padding: 0 2rem;
  margin-bottom: 1.5rem;
  max-width: $max-width;
  @include whenScreenIs(xs) {
    margin-top: 5rem;
    font-size: 18px;
  }

  @include whenScreenIs(sm) {
    margin-top: 5rem;
  }

  @include whenScreenIs(mdx) {
    margin-top: 0;
  }
}
.hero__heading--fullHeight {
  margin: 7.5rem 0 5rem;
  @include whenScreenIs(mdx) {
    margin: 0 0 0.5rem 0;
  }
}
.hero__location {
  font-size: 48px;
  font-family: $display-font;
  line-height: 1.2;
  color: $white;
  font-weight: normal;
  padding: 0 1rem;
  text-align: center;
  margin-top: 0;
}
.hero__button {
  font-family: $navigation-font;
  margin-top: 1.5rem;
  background-color: $mac-and-cheese;
  color: $greyish-brown;
  border: 0;
  padding: 0.5rem 1rem;
  border-radius: 23px;
  transition: box-shadow 0.2s ease;
  &:hover {
    cursor: pointer;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  }
}
.search-bar__wrapper {
  width: 90%;

  @include whenScreenIs(mdx) {
    margin-top: 1.5rem;
    max-width: 620px;
  }
}
.search-bar__wrapper--bottom {
  transform: translateY(3rem);
  position: absolute;
  bottom: 1.5rem;
  @include whenScreenIs(mdx) {
    position: relative;
    bottom: unset;
    transform: none;
  }
}
.hero__subnav__container {
  background-color: $rebrand-pink;

  &.fixed {
    position: fixed;
    width: 100%;
    z-index: 100;
    top: 64px;
    @include whenScreenIs(mdx) {
      top: 72px;
    }
  }

  &.takeout {
    top: 0;

    @include whenScreenIs(mdx) {
      top: 72px;
    }
  }
}
.hero__subnav {
  max-width: $max-width-desktop;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  padding: 1rem 1rem;
  @include whenScreenIs(mdx) {
    padding: 1rem;
    flex-direction: row;
    height: 72px;
  }
}
.hero__search-bar {
  max-width: 360px;
  order: 2;

  @include whenScreenIs(mdx) {
    order: unset;
  }

  &.takeout {
    width: calc(100% - 70px);
  }
}
.hero__subnav__heading {
  flex-grow: 1;
  flex-basis: 100%;
  color: $greyish-brown;
  font-size: 26px;
  font-family: $heading-font;
  text-align: center;
  order: 1;
  margin-bottom: 16px;

  @include whenScreenIs(mdx) {
    margin-top: 0;
    margin-bottom: 0;
    order: unset;
  }
}
.hero__subnav__dropdown {
  flex-grow: 1;
  flex-basis: 30%;
}
.hero__subnav__links {
  flex-grow: 1;
  order: unset;
  flex-basis: 30%;
  align-items: center;
  margin: 0rem auto;
  width: 90vw;
  justify-content: space-between;
  margin-top: 10px;
  order: 3;

  @include whenScreenIs(mdx) {
    margin-bottom: 0;
    margin-top: 0;
    order: unset;
    justify-content: flex-end;
    width: auto;
  }

  *:not(:last-child) {
    margin: 0 1rem 0 0;
  }

  &.flex {
    display: flex;
  }

  &.hidden {
    @include whenScreenIs(xs) {
      display: none;
    }
  }

  &.center {
    text-align: center;
  }
}
.search__heading {
  font-size: 24px;
  line-height: 0.79;
  color: $true-white;
  text-align: center;
  margin-bottom: 1rem;
  color: $white;
}
.hero__subnav__link {
  font-family: $font;
  color: $greyish-brown;
  font-size: 13px;
  text-decoration: underline;
  border: 0;
  background-color: transparent;
  padding: 0;
  &:hover {
    cursor: pointer;
  }
}
.hidden {
  @include whenScreenIs(xs) {
    display: none;
  }
}
</style>
