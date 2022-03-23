<template>
  <main
    class="menu-show-page"
    :data-padding="$store.getters['ui/showMenuSearch']"
    data-fullscreen
  >
    <div
      v-if="!$store.getters['ui/showMenuSearch']"
      data-element="menu-nav"
    >
      <nuxt-link
        data-element="menu-nav-item"
        :to="foodLink"
      >
        Food menu
      </nuxt-link>
      <nuxt-link
        data-element="menu-nav-item"
        :to="drinksLink"
      >
        Drinks menu
      </nuxt-link>
    </div>
    <menu-component
      :loaded="true"
      :menu="menu"
      :addItemToBasket="addItemToBasket"
      :removeItemFromBasket="removeItemFromBasket"
      :getMatchingBasketItemsChoicesAndPortions="getMatchingBasketItemsChoicesAndPortions"
      basketLink="/basket"
      :handleCheckoutBtnClick="handleCheckoutBtnClick"
      :emptyText="emptyText"
      :menuLabel="menuLabel"
      appLabel="orderAtTable"
      :mobileOnly="true"
      :toggleSearch="true"
    />
    <no-ssr>
      <transition name="fade">
        <sticky-footer
          v-if="basketCount"
          data-element="mobile-footer"
        >
          <checkout-btn
            :handleClick="handleCheckoutBtnClick"
            :basketTotal="basketTotal"
            :basketCount="basketCount"
            :inactive="!basketCount"
            :loading="loading"
            containerSize="md"
            text="View basket"
          />
        </sticky-footer>
      </transition>
    </no-ssr>
  </main>
</template>

<script>
  import iOrderConfig        from '~/mixins/iOrderConfig';
  import MenuComponent       from '~/components/iOrder-core/menuV2/Menu';
  import hidePrivacyBanners  from '~/mixins/hidePrivacyBanners';
  import hidefooter          from '~/mixins/hidefooter';
  import CheckoutBtn         from '~/components/iOrder-core/uiV2/CheckoutBtn';
  import StickyFooter        from '~/components/iOrder-core/uiV2/StickyFooter';

  export default {
    components: {
      MenuComponent,
      CheckoutBtn,
      StickyFooter
    },
    mixins: [
      iOrderConfig,
      hidePrivacyBanners,
      hidefooter
    ],
    props: [
      'location',
      'basketCount',
      'basketTotal',
      'addItemToBasket',
      'removeItemFromBasket',
      'getMatchingBasketItemsChoicesAndPortions',
      'emptyText'
    ],
    data () {
      return {
        loading: null
      }
    },
    validate ({ params }) {
      const menuLabel = params.menuLabel
      return menuLabel === 'food' || menuLabel === 'drinks'
    },
    scrollToTop: true,
    computed: {
      menuLabel () {
        return this.$route.params.menuLabel === 'drinks' ? 'drinks' : 'food'
      },
      header () {
        return {
          text: this.menuLabel === 'drinks' ? 'Food Menu' : 'Drinks Menu',
          link: `/menus/${this.menuLabel === 'drinks' ? 'food' : 'drinks'}`
        }
      },
      menu () {
        return this.$store.getters['orderAtTable/getMenu'](this.menuLabel)
      },
      slug () {
        return this.location && this.location.slug
      },
      foodLink () {
        return this.slug && `/restaurants/${this.slug}/order/menus/food`
      },
      drinksLink () {
        return this.slug && `/restaurants/${this.slug}/order/menus/drinks`
      }
    },
    methods: {
      handleCheckoutBtnClick () {
        if (this.slug) {
          this.loading = true
          return this.$router.push(`/restaurants/${this.slug}/order/basket`)
        }
      }
    },
    mounted () {
      console.log(this.$route.name)
    }
  }
</script>


<style lang="scss" scoped>
  @import '~assets/css/variables.scss';
  @import '~assets/css/iorder-core/helpers.scss';

  .menu-show-page {
    background-color:$white-two;
    padding-bottom:24px;
    width:100%;
    padding:0 0 24px 0;
    &[data-padding] {
      padding-top:16px;
    }
    [data-element='menu-nav'] {
      display:flex;
      a {
        display:flex;
        align-items:center;
        justify-content:center;
        text-align:center;
        width:50%; height:48px;
        background-color:$rebrand-blue;
        font-family:$display-font;
        text-transform:uppercase;
        font-weight:normal;
        font-size:28px; line-height:0.86;
        text-decoration:none;
        color:#fff;
        padding-top:4px;
        &.nuxt-link-exact-active {
          color:$black;
          background-color:$rebrand-very-light-pink;
        }
      }
    }
    [data-element='mobile-footer'] {
      height:64px;
    }
  }
</style>
