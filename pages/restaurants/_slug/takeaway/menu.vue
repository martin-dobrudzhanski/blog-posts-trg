<template>
  <NoSSR>
    <section class="menu-page" data-nofooter-fullscreen>
      <VHero
        :locationName="currentLocation.name"
        :backgroundImage="heroBackgroundImage"
        :subnavHeading="subnavHeading"
        :searchQuery="searchQuery"
        @setSearchQuery="findDish"
        heading="You're collecting from"
        :button="{ link: '/takeaway', copy: 'Change restaurant' }"
        searchPlaceholder="Search dish"
        @showModal="i => (showModal = i)"
        :allergyAdvice="content.allergyMessage"
        :dietaryRequirements="content.dietaryRequirementsCopy"
        :dietaryRequirementsCTA="content.dietaryRequirementsCta"
        :aside-boxes="asideBoxes"
        @handlePosition="handlePosition"
        hasClearIcon
      />
      <MenuTabs
        v-if="!hideCategories"
        :items="menuGroupsFiltered"
        @selected="selectMenuTab"
        :selected="menuTab"
        :isFixed="isFixed"
        withSelect
      />
      <MenuComponent
        :menuTab="menuTab"
        :menuGroupsFiltered="menuGroupsFiltered"
        :searchQuery="searchQuery"
        :loaded="loaded"
        :menu="menu"
        :addItemToBasket="addItemToBasket"
        :removeItemFromBasket="removeItemFromBasket"
        :getMatchingBasketItemsChoicesAndPortions="
          getMatchingBasketItemsChoicesAndPortions
        "
        :basketLink="basketLink"
        :handleCheckoutBtnClick="handleCheckoutBtnClick"
        :loading="loading"
        :emptyText="emptyText"
        :appLabel="app"
        :emptyTextSub="emptyTextSub"
        :selectedMenu="selectedMenu"
        :fullMenu="fullMenuTransformed"
        :cutlery="cutlery"
        @setCutlery="setCutlery"
        @selectOnScroll="setMenuTab"
        :cutleryEnabled="cutleryEnabled"
        :cutleryText="cutleryText"
        :asideBoxes="asideBoxes"
        :selectedTab="activeMenuTab"
        :smartScrolling="!hideCategories"
        :isFixed="isFixed"
      />
      <transition name="fade">
        <UpsellModal
          v-if="showModal"
          @close-upsell-modal="closeUpsellModal"
          :addItemToBasket="addItemToBasket"
          :image="$store.getters['clickAndCollect/getUpsellImage']"
          :product="$store.getters['clickAndCollect/getUpsellProduct']"
          :getProduct="getProduct"
          :heading="content.upsellModalHeading"
          :text="content.upsellModalText"
          :offerText="content.offerText"
        />
      </transition>
    </section>
  </NoSSR>
</template>

<script>
import { get } from 'lodash';
import NoSSR from 'vue-no-ssr';
import { mapGetters, mapActions } from 'vuex';

import { getContent } from '~/libs/templateHelpers.js';
import menuAndBasket from '~/mixins/iOrder-core/menuAndBasket';
import menu from '~/mixins/iOrder-core/menu';
import iOrderConfig from '~/mixins/iOrderConfig';
import clickAndCollect from '~/mixins/clickAndCollect';

import UpsellModal from '~/components/iOrder-core/modalsV3/UpsellModal';
import MenuComponent from '~/components/iOrder-core/menuV3/Menu';
import VHero from '~/components/iOrder-core/uiV3/VHero';
import MenuTabs from '~/components/iOrder-core/uiV3/MenuTabs';

export default {
  layout: 'clickAndCollect',
  mixins: [menuAndBasket, iOrderConfig, menu, clickAndCollect],
  components: {
    NoSSR,
    UpsellModal,
    MenuComponent,
    VHero,
    MenuTabs
  },
  async asyncData({ store, params, error }) {
    return getContent(store, `click-and-collect/${params.slug}`, error);
  },
  data: () => ({
    emptyTextSub: 'What about adding some delicious food?',
    content: null,
    loaded: false,
    showModal: false,
    activeMenuTab: '',
    hideCategories: false,
    isFixed: false
  }),
  computed: {
    ...mapGetters('clickAndCollect', {
      menuGroups: 'getDisplayGroups',
      menuTab: 'getMenuTab',
      searchQuery: 'getSearchQuery',
      selectedMenu: 'getSelectedMenu',
      cutlery: 'getCutlery',
      fullMenuTransformed: 'getSelectedMenu'
    }),
    menuGroupsFiltered() {
      const { menuGroups } = this;
      return menuGroups.filter(i => i.groupName !== 'Upsell');
    },
    subnavHeading() {
      const { content } = this;
      const payload = get(content, 'subnavHeading');
      return payload;
    },
    heroBackgroundImage() {
      const { content } = this;
      const payload = get(content, 'heroBackgroundImage.fields.file.url');
      return payload;
    },
    cutleryEnabled() {
      const { content } = this;
      const payload = get(content, 'cutleryEnabled');
      return payload;
    },
    cutleryText() {
      const { content } = this;
      const payload = get(content, 'cutleryText');
      return payload;
    },
    asideBoxes() {
      const { content } = this;
      const rawPayload = get(content, 'asideBoxes');
      const payload = rawPayload.map(i => {
        return {
          ...i.fields
        };
      });
      return payload;
    }
  },
  methods: {
    ...mapActions('clickAndCollect', [
      'setMenuTab',
      'setSearchQuery',
      'setCutlery'
    ]),
    selectMenuTab(tab) {
      this.activeMenuTab = tab.groupName;
      const { setMenuTab } = this;
      setMenuTab(tab);
    },
    findDish(e) {
      const { setSearchQuery } = this;
      setSearchQuery(e);
      this.hideCategories = e !== '';
    },
    setShowModal(i) {
      this.showModal = i;
    },
    handlePosition(fixed) {
      this.isFixed = fixed;
    },
    async init() {
      if (!this.displayInSiteDirectory) {
        return this.$nuxt.$router.replace({ path: '/takeaway' });
      }

      const canProceed = this.hasValidations();

      if (canProceed) {
        this.loaded = true;
        return;
      }

      this.setIorderConfigs('clickAndCollect');
    }
  },
  created() {
    const { menuGroups } = this;
    this.init();
    this.setMenuTab(menuGroups[0]);
    this.initMixin('clickAndCollect');
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.menu-page {
  width: 100%;
  padding-bottom: 10px;
  background-image: url('~/assets/img/background/paper.jpg');

  * {
    @include noselect;
  }

  [data-element='payment-discount'] {
    margin: 0 auto;
    max-width: 456px;
    margin-bottom: 16px;
    @include whenScreenIs(mdx) {
      max-width: none;
    }
  }

  &_subheader {
    max-width: 456px;
    margin: 0 auto 20px;
  }

  .clickable-banner {
    margin: 0 auto;
    max-width: 456px;
    @include whenScreenIs(mdx) {
      max-width: none;
    }
  }
  [data-element='mobile-footer'] {
    height: 64px;
    @include whenScreenIs(mdx) {
      display: none;
    }
  }
}
</style>
