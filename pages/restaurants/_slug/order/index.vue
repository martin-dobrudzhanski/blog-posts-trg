<template>
  <section class="restaurant-slug-order" data-nofooter-fullscreen>
    <spinner v-if="loading" />
    <div data-element="content-container" v-else>
      <section-header
        text="Order at Table"
      />
      <location-and-table-selector
        :handleSubmit="submitTableNumber"
        :submitted="submitted"
        :showError="showError"
        :queryStringTableNumber="queryStringTableNumber"
        :locationDisplayMode="true"
        :restaurantName="restaurantName"
      />
      <dynamic-link
        :link="true"
        href="/terms"
        text="Terms and Conditions"
        size="sm"
        data-element="terms-link"
        :newTab="true"
      />
    </div>
  </section>
</template>

<script>
  import { getContent }             from '~/libs/templateHelpers.js';
  import meta                       from '~/mixins/meta';
  import hidefooter                 from '~/mixins/hidefooter';
  import iOrderConfig               from '~/mixins/iOrderConfig';
  import hidePrivacyBanners         from '~/mixins/hidePrivacyBanners';
  import LocationAndTableSelector   from '~/components/iOrder-core/LocationAndTableSelector.vue';
  import SectionHeader              from '~/components/iOrder-core/uiV2/SectionHeader.vue';
  import DynamicLink                from '~/components/iOrder-core/uiV2/DynamicLink.vue';
  import Spinner                    from '~/components/iOrder-core/ui/GenericLoader.vue';
  import mobileOnly                 from '~/mixins/mobileOnly';
  import orderAtTable               from '~/mixins/orderAtTable';

  export default {
    mixins: [meta, hidefooter, iOrderConfig, mobileOnly, hidePrivacyBanners, orderAtTable],
    data () {
      return {
        content: null,
        submitted: null,
        showError: null,
        loading: true,
        toastIsVisible: false
      }
    },
    components: {
      LocationAndTableSelector,
      SectionHeader,
      DynamicLink,
      Spinner
    },
    async asyncData ({ store, params, error, query, redirect }) {
      return await getContent(store, `order-at-table/${params.slug}`, error);
    },
    computed: {
      queryStringTableNumber () {
        return this.$route.query.tableNumber
      },
      restaurantName () {
        return this.$store.getters['orderAtTable/getPrettyLocationQuery'];
      },
      siteId () {
        const siteId = this.content &&
                this.content.restaurant &&
                this.content.restaurant.fields &&
                this.content.restaurant.fields.siteId;

        return siteId;
      }
    },
    methods: {
      async init () {
        const mobileScreen = await this.isMobileScreen();
        if (!mobileScreen) {
          return this.$store.dispatch('orderAtTable/showError', {
            heading: 'Order At Table',
            message: 'Sorry, Order at Table is only available on mobile devices! Please see your server to order.',
            homeLink: true
          })
        }
        this.loading = false;

        this.clearIOrderAppStates();
        const validationOutput = await this.$store.dispatch('orderAtTable/validateVenueAndMenu', { siteId: this.siteId })
        if (!validationOutput.success) {
          return;
        }

        this.$store.dispatch('orderAtTable/checkNecessaryDataToProceed', { salesDataCount: 5 });
        this.checkOrderAtTableEnabled();

        this.setIorderConfigs('orderAtTable');
      },
      submitTableNumber (tableNumber) {
        this.submitted = true;
        const isValidTable = this.$store.getters['orderAtTable/getTables'].includes(Number(tableNumber))
        if (!isValidTable) {
          if (!this.toastIsVisible) {
            this.showToast();
          }
          this.submitted = false;
          return
        }
        this.$store.dispatch('orderAtTable/setTableNumber', { tableNumber });
        this.$router.push({ path: `/restaurants/${this.$route.params.slug}/order/menus` });
      },
      clearIOrderAppStates () {
        this.$store.dispatch('clickAndCollect/initState');
        this.$store.dispatch('iorderCheckout/clearState');
      },
      showToast () {
        this.toastIsVisible = true;
        this.$toast.show(`Please enter a valid table number`, {
          className: 'booking-toast',
          closeOnSwipe: true,
          containerClass: 'bookings',
          duration: 2000,
          fullWidth: true,
          fitToScreen: true,
          position: 'bottom-center',
          singleton: true,
          onComplete: () => this.toastIsNotVisible()
        })
      },
      toastIsNotVisible () {
        this.toastIsVisible = false;
      }
    },
    created () {
      this.init();
    }
  }
</script>

<style lang="scss" scoped>
  @import '~assets/css/variables.scss';
  @import '~assets/css/helpers.scss';

  .restaurant-slug-order {
    background-color:$white-two;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    [data-element='content-container'] {
      flex-grow:1;
      display:flex;
      flex-direction:column;
      [data-element='terms-link'] {
        align-self:center;
        margin: auto 0 140px;
        font-size:12px;
        font-weight:normal;
        text-decoration:underline;
      }
    }
  }
</style>
