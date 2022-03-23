<template>
  <section class="order-all" data-nofooter-fullscreen>
    <spinner v-if="loading" />
    <div data-element="content-container" v-else>
      <section-header
        text="Order at Table"
        size="lg"
      />
      <location-and-table-selector
        :autoGeolocate="false"
        :restaurantsList="restaurantsList"
        :disableTableNumberField="true"
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
  import mobileOnly                 from '~/mixins/mobileOnly';
  import SectionHeader              from '~/components/iOrder-core/uiV2/SectionHeader.vue';
  import DynamicLink                from '~/components/iOrder-core/uiV2/DynamicLink.vue';
  import Spinner                    from '~/components/iOrder-core/ui/GenericLoader.vue';

  export default {
    mixins: [meta, hidefooter, iOrderConfig, mobileOnly, hidePrivacyBanners, DynamicLink],
    data () {
      return {
        content: null,
        loading: true
      }
    },
    async asyncData ({ store, params, error, query, redirect }) {
      return getContent(store, `restaurants-order-at-table`, error);
    },
    components: {
      LocationAndTableSelector,
      SectionHeader,
      Spinner,
      DynamicLink
    },
    computed: {
      restaurantsList () {
        return this.content &&
                this.content.restaurants &&
                this.content.restaurants.fields &&
                this.content.restaurants.fields.list;
      }
    },
    mounted () {
      this.checkScreenSize();
    }
  }
</script>

<style lang="scss" scoped>
  @import '~assets/css/variables.scss';
  @import '~assets/css/helpers.scss';

  .order-all {
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
