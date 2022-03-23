<template>
  <div
    data-component="menu-component"
    id="menu-page-container"
    class="wide-width"
    ref="menuWrapper"
    :class="{ 'margin-top': isFixed }"
  >
    <NoSSR>
      <div
        data-element="menu-container"
        ref="menuContainer"
        :class="{ 'add-padding': basketCount }"
      >
        <p
          v-if="allergyMessage"
          v-text="allergyMessage"
          class="allergy-message"
        />

        <NoSSR>
          <div
            v-if="fullMenu && fullMenu.length"
            class="menu-categories"
            :class="{ 'margin-right': isFixed }"
          >
            <div
              v-for="category in fullMenu"
              class="menu-category"
              :key="category.groupName"
              :ref="category.groupName"
            >
              <h2 class="menu-category__header">
                <p class="menu-category__name">{{ category.groupName }}</p>
                <p class="menu-category__dots"></p>
              </h2>
              <div
                class="menu-items"
                v-if="category && category.items && category.items.length"
              >
                <template v-for="item in category.items">
                  <MenuItem
                    v-if="!item.separator"
                    :key="`${item.displayRecordId}-${item.itemId}`"
                    v-bind="item"
                    :getProduct="getProduct"
                    :getItemCount="getItemCount"
                    @addToBasket="addToBasket"
                    @removeFromBasket="removeFromBasket"
                    :cgIndex="cgIndex"
                    :getCG="getCG"
                  />
                  <div
                    v-else
                    class="menu-items--separator"
                    :data-menu-tab-separator="item.name"
                    :key="item.name"
                  ></div>
                </template>
              </div>
              <p v-else class="menu-items--none">
                Sorry, we’re not serving these dishes right now! We hope you can
                try them next time.
              </p>
            </div>
          </div>
          <p v-else class="menu-categories--none">
            Sorry, menu is currently unavailable.
          </p>
        </NoSSR>
        <NoSSR
          ><transition name="fade">
            <div
              v-if="basketCount"
              class="menu__checkout-button__mobile__wrapper"
            >
              <CheckoutBtn
                class="menu__checkout-button__mobile"
                :handleClick="handleCheckoutBtnClick"
                :basketTotal="basketTotal"
                :basketCount="basketCount"
                :inactive="!basketCount"
                :loading="loading"
                text="View order"
              />
              <div class="arrow-up" @click="goToTop()">
                <Icon
                  icon="collapse-arrow-white"
                  size="md"
                  class="icon-arrow"
                  clickable="true"
                />
              </div>
            </div> </transition
        ></NoSSR>
        <div
          class="arrow-up"
          @click="goToTop()"
          :class="{ reposition: basketCount }"
        >
          <Icon
            icon="collapse-arrow-white"
            size="md"
            class="icon-arrow"
            clickable="true"
          />
        </div>
      </div>
    </NoSSR>
    <div
      data-element="basket-container"
      id="basket-container"
      ref="basketContainer"
      :class="{ fixed: isFixed }"
    >
      <NoSSR>
        <div
          data-element="basket"
          class="basket__main"
          v-if="basketLink && loaded"
        >
          <InfoBlock>
            <div>
              <div class="basket__header">
                <div class="basket__header__container">
                  <h2 class="basket__header__heading">Basket</h2>
                </div>
                <transition name="fade">
                  <p class="basket__header__total" v-if="basketCount">
                    Total: <span>{{ basketTotal }}</span>
                  </p>
                </transition>
              </div>
              <transition-group name="fade" mode="out-in">
                <div
                  key="lines"
                  v-if="basket.lines.length"
                  data-element="basket-lines"
                  class="basket-lines"
                >
                  <LineItem
                    v-for="lineItem in reverseLines"
                    :getProduct="getProduct"
                    :lineItem="lineItem"
                    :removeItemFromBasket="removeItemFromBasket"
                    :addItemToBasket="addItemToBasket"
                    :incrementBasketItem="incrementBasketItem"
                    :decrementBasketItem="decrementBasketItem"
                    :getCG="getCG"
                    :cgIndex="cgIndex"
                    :getBasketIndex="getBasketIndex"
                    :editBasketChoices="editBasketChoices"
                    :displayProduct="getDisplayProduct(lineItem)"
                    :choiceGroups="getChoiceGroups(lineItem)"
                    :key="$uuid.v4()"
                  />
                </div>
                <div key="empty" v-else data-element="empty-text">
                  <p class="empty-text__heading">{{ emptyText }}</p>
                  <p class="empty-text__sub">{{ emptyTextSub }}</p>
                </div>
              </transition-group>
            </div>
            <transition name="fade">
              <div
                class="cutlery-toggle"
                v-if="basket.lines.length && cutleryEnabled"
              >
                <div class="cutlery-toggle__label">
                  <p class="cutlery-toggle__label__heading">Cutlery</p>
                  <p
                    class="cutlery-toggle__label__description"
                    v-if="cutleryText"
                  >
                    {{ cutleryText }}
                  </p>
                </div>
                <ToggleButton
                  :checked="cutlery"
                  @change="e => $emit('setCutlery', e)"
                />
              </div>
            </transition>
            <transition name="fade">
              <CheckoutBtn
                v-if="basketCount"
                :handleClick="handleCheckoutBtnClick"
                :basketTotal="basketTotal"
                :basketCount="basketCount"
                :inactive="!basketCount"
                :loading="loading"
                :text="checkoutButtonText || 'View order'"
            /></transition>
          </InfoBlock>
          <MenuAside :boxes="asideBoxes" class="menu-aside-container" />
        </div>
      </NoSSR>
    </div>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import menuAndBasket from '~/mixins/iOrder-core/menuAndBasket';

import LineItem from '~/components/iOrder-core/basketV3/LineItem';
import CheckoutBtn from '~/components/iOrder-core/uiV3/CheckoutBtn';
import InfoBlock from '~/components/iOrder-core/uiV3/InfoBlock';
import MenuAside from '~/components/iOrder-core/menuV3/MenuAside';
import ToggleButton from '~/components/iOrder-core/uiV3/ToggleButton';
import MenuItem from '~/components/iOrder-core/menuV3/MenuItem';
import Icon from '~/components/iOrder-core/uiV3/Icon';

export default {
  components: {
    NoSSR,
    LineItem,
    CheckoutBtn,
    InfoBlock,
    MenuAside,
    ToggleButton,
    MenuItem,
    Icon
  },
  mixins: [menuAndBasket],
  data() {
    return {
      showModal: null,
      searchQuery: '',
      isFromClickTab: false
    };
  },
  props: {
    loaded: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Object
    },
    menuTab: {
      type: Object
    },
    menuGroupsFiltered: {
      type: Array
    },
    addItemToBasket: {
      type: Function
    },
    removeItemFromBasket: {
      type: Function
    },
    getMatchingBasketItemsChoicesAndPortions: {
      type: Function
    },
    basketLink: {
      type: String
    },
    handleCheckoutBtnClick: {
      type: Function
    },
    loading: {
      type: Boolean
    },
    emptyText: {
      type: String
    },
    appLabel: {
      type: String
    },
    allergyMessage: {
      type: String
    },
    emptyTextSub: {
      type: String
    },
    selectedMenu: {
      type: Array
    },
    fullMenu: {
      type: Array
    },
    asideBoxes: {
      type: Array
    },
    cutleryEnabled: {
      type: Boolean
    },
    cutleryText: {
      type: String
    },
    cutlery: {
      type: Boolean
    },
    checkoutButtonText: {
      type: String
    },
    selectedTab: {
      type: String
    },
    smartScrolling: {
      type: Boolean,
      default: true
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    flattenedMenu() {
      const flattenedArray = [];
      this.menu &&
        this.menu.display &&
        this.menu.display.displayGroups.forEach(group => {
          if (group.groupName !== 'Upsell') {
            group.items.forEach(item => {
              if (item.itemType === 'product') {
                flattenedArray.push(item);
              }
            });
          }
        });
      return flattenedArray;
    },
    filteredMenu() {
      return this.flattenedMenu.reduce((arr, item) => {
        if (arr.length >= 20) return arr;
        if (
          item.product.displayName
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        ) {
          arr.push(item);
        }
        return arr;
      }, []);
    },
    reverseLines() {
      return this.basket.lines.slice().reverse();
    }
  },
  methods: {
    setShowModal(i) {
      this.showModal = i;
    },
    addToBasket(i) {
      if (i.product) {
        this.addItemToBasket(...Object.values(i));
      } else {
        this.addItemToBasket(i);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    removeActiveClass() {
      // used to counteract a bug on scrollactive which doesn't add active class to first scrollactive item
      this.$refs &&
        this.$refs.scrollactive &&
        this.$refs.scrollactive[0] &&
        this.$refs.scrollactive[0].classList &&
        this.$refs.scrollactive[0].classList.remove('scrollactive-first');
    },
    removeIsActive() {
      this.$refs &&
        this.$refs.scrollactive &&
        this.$refs.scrollactive[0] &&
        this.$refs.scrollactive[0].classList &&
        this.$refs.scrollactive[0].classList.remove('is-active');
    },
    isVeg(productId) {
      return (
        this.getProduct(productId).displayRecords &&
        this.getProduct(productId).displayRecords[0].keywords &&
        this.getProduct(productId).displayRecords[0].keywords.includes(301)
      );
    },
    isVegan(productId) {
      return (
        this.getProduct(productId).displayRecords &&
        this.getProduct(productId).displayRecords[0].keywords &&
        this.getProduct(productId).displayRecords[0].keywords.includes(302)
      );
    },
    getHref(groupName) {
      const id = this.setId(groupName);
      return `#${id}`;
    },
    setId(groupName) {
      const id = groupName
        .toLowerCase()
        .split(' ')
        .join('-');
      return id;
    },
    isHidden(name) {
      return name === 'Upsell';
    },
    updateSearchQuery(query) {
      this.searchQuery = query;
      if (this.searchQuery && this.searchQuery.length > 1) {
        window.scrollTo(0, 0);
      }
    },
    closeSearch() {
      this.searchQuery = '';
      if (!this.searchQuery)
        this.$refs.scrollactive[0].classList.add('scrollactive-first');
      window.scrollTo(0, 0);
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth > this.breakpoint) {
        return (this.screenIsMd = true);
      }
      this.screenIsMd = false;
    },
    getActiveElement() {
      let activeElement;

      this.$refs.scrollactive.forEach(element => {
        if (element.classList.contains('is-active')) activeElement = element;
      });
      return activeElement;
    },
    firstItemIsActive() {
      const activeElement = this.getActiveElement();
      if (!activeElement) {
        return true;
      }
      return this.$refs.scrollactive[0] === activeElement;
    },
    removeFromBasket(item, hasChoices) {
      if (!hasChoices) {
        const newItem = {
          ingredientId: item.productId,
          portionTypeId: item.defaultPortionId,
          choiceLines: item.choices
        };

        this.decrementBasketItem(newItem);
      } else {
        this.$store.dispatch(
          'orderAtTable/removeLastMatchingProductFromBasket',
          { productId: item.productId }
        );
      }
    },
    scrolling(e) {
      if (this.smartScrolling) {
        const scrollPosition = window.scrollY;
        let category = null;

        const mainHeader = document.getElementById('mainHeaderContainer');
        const subNav = document.getElementById('subNavContainer');
        const menuTabs = document.getElementById('menuTabsContainer');
        const topElements =
          (mainHeader ? mainHeader.offsetHeight : 0) +
          (subNav ? subNav.offsetHeight : 0) +
          (menuTabs ? menuTabs.offsetHeight : 0);

        for (const key in this.$refs) {
          if (this.$refs[key] && this.$refs[key].length) {
            const categoryPosition = this.$refs[key][0].offsetTop;
            if (Math.abs(scrollPosition - categoryPosition) <= topElements) {
              category = key;
            }
          }
        }
        if (
          category &&
          this.menuGroupsFiltered &&
          this.menuGroupsFiltered.length &&
          this.menuTab.groupName !== category
        ) {
          const selectedGroup = this.menuGroupsFiltered.filter(
            gr => gr.groupName === category
          );
          if (selectedGroup && selectedGroup.length && !this.isFromClickTab) {
            this.$emit('selectOnScroll', { ...selectedGroup[0] });
          } else {
            this.isFromClickTab = false;
          }
        }
      }
    },
    goToTop() {
      window.scrollTo(0, 0);
    }
  },
  created() {
    this.initMixin(`${this.appLabel}`);
  },
  mounted() {
    window.addEventListener('scroll', this.scrolling);
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrolling);
  },
  watch: {
    searchQuery() {
      if (this.searchQuery && this.searchQuery.length > 1) {
        this.removeActiveClass();
        this.removeIsActive();
      } else if (
        !this.searchQuery ||
        (this.searchQuery.length === 1 && this.firstItemIsActive())
      ) {
        this.$refs.scrollactive[0].classList.add('scrollactive-first');
      }
    },
    selectedTab(newVal) {
      const screenWidth = window.screen.width;
      const element = this.$refs[newVal];
      const top = element[0].offsetTop;
      const mainHeader = document.getElementById('mainHeaderContainer');
      const subNav = document.getElementById('subNavContainer');
      const menuTabs = document.getElementById('menuTabsContainer');
      this.$nextTick(() => {
        this.isFromClickTab = true;
        window.scrollTo(
          0,
          top -
            (screenWidth >= 1024
              ? mainHeader
                ? mainHeader.offsetHeight
                : 0
              : 0) -
            (subNav ? subNav.offsetHeight : 0) -
            (menuTabs ? menuTabs.offsetHeight : 0) -
            10
        );
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
.menu-category {
  margin-bottom: 1rem;
  &__header {
    display: flex;
    height: 26px;
    margin-bottom: 1rem;
  }
  &__name {
    font-family: $card-display-font;
    font-size: 26px;
    margin-right: 0.5rem;
    color: $greyish-brown;
  }
  &__dots {
    flex-grow: 1;
    border-bottom: 2px dotted $greyish-brown;
    height: 11px;
  }
}
.menu-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  grid-gap: 1rem;

  .wrapper {
    margin-bottom: 0.5rem;
    @include whenScreenIs(xs) {
      margin-bottom: 0;
    }
  }

  &--separator {
    grid-column-start: 1;
    grid-column-end: 3;
    padding: 2px 0;

    @include whenScreenIs(sm) {
      grid-column-end: 2;
    }
  }
}
.cutlery-toggle {
  font-family: $navigation-font;
  color: $greyish-brown;
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;

  &__label__heading {
    font-size: 18px;
    margin-bottom: 0.5rem;
  }
  &__label__description {
    font-family: $font;
    font-size: 14px;
    max-width: 153px;
  }
}
.basket__header {
  display: flex;
  justify-content: space-between;
  color: $greyish-brown;
  margin-bottom: 0.7rem;
  border-bottom: 2px dotted $greyish-brown;
  &__container {
    width: 100%;
    height: 45px;
    padding-left: -10px;
  }
  &__heading {
    font-size: 40px;
    font-family: $card-display-font;
  }

  &__total {
    display: flex;
    font-family: $font;
    font-size: 14px;
    margin-top: 5px;
    span {
      font-family: $navigation-font;
      font-size: 18px;
      padding-left: 0.5rem;
    }
  }
}
.wide-width {
  &.margin-top {
    margin-top: 70px;
    @include whenScreenIs(tablet) {
      margin-top: 145px;
    }
  }
  /deep/ .menu-aside {
    display: none;

    @include whenScreenIs(mdx) {
      display: flex;
    }
  }
  .basket__main {
    width: 100%;
  }
  .menu-categories {
    &.margin-right {
      @include whenScreenIs(mdx) {
        margin-right: 400px;
      }
    }
  }
  #basket-container {
    &.fixed {
      height: 70vh;
      overflow-y: auto;
      position: fixed;
      top: 224px;
      right: calc((100vw - 816px - 70px - 400px) / 2);
      @media (max-width: 1300px) {
        right: 10px;
      }
    }
    /deep/ .info-block {
      border-radius: 8px;
      overflow: hidden;
      background-color: $rebrand-very-light-pink;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    /deep/ .outer-container {
      margin: 0;
      width: 100%;
      height: auto;
    }

    /deep/ .inner-container {
      padding: 0;
      position: relative;
      margin: 0;
      width: 100%;
    }

    /deep/ .info-block {
      width: 100%;
    }
  }
}
[data-component='menu-component'] {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  @include whenScreenIs(mdx) {
    flex-direction: row;
    padding-top: 1.5rem;
  }
  [data-element='no-result-message'] {
    text-align: center;
    margin-top: 10px;
  }
  [data-element='menu-nav-container'] {
    height: auto;
    padding: 0 16px;
    display: none;
    @include whenScreenIs(mdx) {
      padding: 0;
      margin-left: 12px;
      width: 160px;
      height: 800px;
      display: block;
    }
    [data-element='menu-nav'] {
      @include whenScreenIs(mdx) {
        width: 152px;
      }
      [data-element='outer-container'] {
        @include whenScreenIs(mdx) {
          width: 152px;
          position: relative;
          overflow: hidden;
        }
        [data-element='scrollable-container'] {
          @include whenScreenIs(mdx) {
            position: absolute;
            left: 0;
            -ms-overflow-style: none;
            scrollbar-width: none;
            overflow-y: auto;
            overflow-x: hidden;
            height: 80vh;
            width: 152px;
            padding-bottom: 100px;
            &:-webkit-scrollbar {
              display: none;
            }
          }
          div.scrollactive-nav {
            overflow: hidden;
          }
          [data-element='menu-categories-container'] {
            display: none;
            @include whenScreenIs(mdx) {
              display: block;
              width: 170px; // to hide scrollbar on Firefox
            }
            [data-element='menu-categories'] {
              display: none;
              @include whenScreenIs(mdx) {
                display: block;
              }
              [data-element='category'] {
                display: block;
                min-height: 40px;
                border-bottom: 2px solid $white-two;
                font-size: 16px;
                padding: 13px 18px 7px 8px;
                font-family: $display-font;
                &.is-active,
                &.scrollactive-first {
                  font-weight: 800;
                  text-decoration: none;
                }
              }
            }
          }
          [data-element='dietary-requirements-link'] {
            margin-top: 16px;
            margin-bottom: 16px;
            color: $jungle-green;
            line-height: 1.33;
            text-decoration: underline;
            font-size: 13px;
            font-weight: 500;
            text-align: left;
            padding-left: 8px;
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  [data-element='search-input-mobile'] {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    @include whenScreenIs(mdx) {
      display: none;
    }
  }
  [data-element='dietary-requirements-link-mobile'] {
    padding: 12px 0;
    margin-bottom: 8px;
    color: $jungle-green;
    line-height: 1.33;
    text-decoration: underline;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
    @include whenScreenIs(mdx) {
      display: none;
    }
  }
  [data-element='menu-container'] {
    overflow-y: auto;
    flex-grow: 1;
    margin: 0;
    padding: 0 32px;
    @include whenScreenIs(xs) {
      padding: 0 1rem;
    }
    &.add-padding {
      @include whenScreenIs(tablet) {
        padding: 0 1rem 80px 1rem;
      }
    }

    .allergy-message {
      font-style: italic;
      padding-bottom: 16px;
    }

    [data-element='menu'] {
      .fade-leave-active,
      .fade-enter-active {
        transition: opacity 0.2s;
      }
      .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
      }
    }
  }
  [data-element='basket-container'] {
    display: none;
    min-width: 400px;
    @include whenScreenIs(mdx) {
      display: block;
    }
    [data-element='empty-text'] {
      font-size: 18px;
      padding: 1rem;
      padding-left: 0;
      text-align: left;

      .empty-text__heading {
        color: $greyish-brown;
        font-family: $navigation-font;
      }

      .empty-text__sub {
        margin-top: 0.5rem;
        color: $greyish-brown;
        font-family: $font;
      }
    }
  }
  [data-element='modal-container'] {
    display: flex;
    align-items: flex-start;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
.basket__heading {
  color: $jungle-green;
  font-size: 24px;
  margin-bottom: 1rem;
}
.basket-lines {
  max-height: 23rem;
  overflow-y: auto;
}
.menu-aside-container {
  margin-top: 1rem;
}
.menu__checkout-button__mobile__wrapper {
  display: flex;
  position: fixed;
  z-index: 999;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: $white;

  [data-element='checkout-btn-container'] {
    margin: auto;
  }

  @include whenScreenIs(mdx) {
    display: none;
  }
  .menu__checkout-button__mobile {
    min-width: 456px;
    @include whenScreenIs(xs) {
      min-width: 260px;
    }
  }
}
.arrow-up {
  background: $greyish-brown;
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 3;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
  .icon-arrow {
    position: relative;
    top: 18px;
    transform: rotate(180deg);
  }

  &.reposition {
    @include whenScreenIs(tablet) {
      display: none;
    }
  }
}
</style>
