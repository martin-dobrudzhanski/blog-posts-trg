<template>
  <div class="bill-page">
    <v-page :loading="basketIsLoading || contentIsLoading || pageIsLoading">
      <main>
        <div class="bill-page__container">
          <v-header
            backButton="/pay"
            :title="content.billPageTitle"
            noPadding
          />
          <p v-text="content.billPageText" />
          <section>
            <the-bill-items :items="billItems" v-if="billItems" />
          </section>
        </div>
        <section class="bill-page__footer">
          <div class="tax-item" v-if="taxAndServiceCharge">
            <div class="tax-item__title">
              <span>
                Taxes and Service Charges
              </span>  
            </div>
            <div class="tax-item__price">
              <span>£{{taxAndServiceCharge}}</span>
            </div>
          </div>
          <the-voucher-input
            v-if="voucheringEnabled || discount"
            :submitVoucher="handleVoucherApply"
            :checkingVoucher="voucherIsLoading"
            :voucherApplied="voucherApplied"
            :discount="discount"
            :billTotal="total"
          />
          <v-button
            @buttonClick="handleButtonClick"
            hasContainer
            :buttonText="content.billPageButtonText"
            :billTotal="totalIncludingDiscount"
            :billQuantity="billItems && billItems.length"
          />
        </section>
      </main>
    </v-page>

    <transition name="fade">
      <modal-wrapper v-if="showGratuityModal">
        <modal-gratuity @handleCloseModal="handleCloseModal" />
      </modal-wrapper>
    </transition>
  </div>
</template>

<script>
import { getContent } from '~/libs/templateHelpers.js'
import { mapActions, mapGetters } from 'vuex'
import hidefooter from '~/mixins/hidefooter'
import hidePrivacyBanners from '~/mixins/hidePrivacyBanners'
import meta from '~/mixins/meta'

const ModalWrapper = () => import('~/components/pmb/ModalWrapper')
const ModalGratuity = () => import('~/components/pmb/ModalGratuity')
const TheBillItems = () => import('~/components/pmb/TheBillItems')
const TheVoucherInput = () => import('~/components/pmb/TheVoucherInput')
const VButton = () => import('~/components/pmb/VButton')
const VHeader = () => import('~/components/pmb/VHeader')
const VPage = () => import('~/components/pmb/VPage')

export default {
  components: {
    ModalWrapper,
    ModalGratuity,
    TheBillItems,
    TheVoucherInput,
    VButton,
    VHeader,
    VPage
  },
  mixins: [hidefooter, hidePrivacyBanners, meta],
  data: () => ({
    content: null,
    showGratuityModal: false,
    pageIsLoading: true
  }),
  asyncData({ store, params, error }) {
    return getContent(store, `pay/${params.slug}`, error)
  },
  computed: {
    ...mapGetters({
      contentIsLoading: 'pay/getContentIsLoading',
      billItems: 'pay/getBillItems',
      total: 'pay/getTotal',
      totalIncludingDiscount: 'pay/getTotalIncludingDiscount',
      discount: 'pay/getDiscount',
      billQuantity: 'pay/getBillQuantity',
      siteId: 'pay/getSiteId',
      salesId: 'pay/getSalesId',
      tableNumber: 'pay/getTableNumber',
      basketId: 'pay/getBasketId',
      basketIsLoading: 'pay/getBasketIsLoading',
      voucherIsLoading: 'pay/getVoucherLoading',
      voucherApplied: 'pay/getVoucherApplied',
      location: 'pay/getLocation',
      taxAndServiceCharge: 'pay/getTaxAmount'
    }),
    voucheringEnabled() {
      return this.content && this.content.voucheringEnabled === 'Enabled'
    }
  },
  methods: {
    ...mapActions({
      handleGloballyDisabled: 'pay/handleGloballyDisabled',
      handleDisabledForRestaurant: 'pay/handleDisabledForRestaurant',
      getContent: 'pay/contentRequest',
      applyVoucher: 'pay/applyVoucher',
      getBasket: 'pay/getBasket',
      setLocation: 'pay/setLocation',
      setSiteId: 'pay/setSiteId',
      setSalesId: 'pay/setSalesId',
      setTableNumber: 'pay/setTableNumber',
      setTrgSiteId: 'pay/setTrgSiteId'
    }),
    handleButtonClick() {
      this.showGratuityModal = true
    },
    handleCloseModal() {
      this.showGratuityModal = false
    },
    handleVoucherApply(voucherCode) {
      this.applyVoucher({
        siteId: this.siteId,
        salesId: this.salesId,
        tableNum: this.tableNumber,
        basketId: this.basketId,
        voucherCode
      })
    }
  },
  async created() {
    const location = this.content.restaurant && this.content.restaurant.fields
    const siteId = location && this.content.restaurant.fields.zonalSiteId
    const trgSiteId = location && this.content.restaurant.fields.siteId
    const salesId = location && this.content.restaurant.fields.salesAreaId
    const tableNumber = this.$route.params.id

    this.setLocation({ location })
    this.setSiteId({ siteId })
    this.setTrgSiteId({ trgSiteId })
    this.setSalesId({ salesId })
    this.setTableNumber({ tableNumber })

    this.getContent()

    const basket = await this.getBasket({
      siteId: this.siteId,
      salesId: this.salesId,
      tableNumber: this.tableNumber
    })

    // Check if globally enabled
    if (this.content.globallyEnabled === 'disabled') {
      this.handleGloballyDisabled()
    }

    // Check if pmb enabled for restaurant
    if (location && this.content.restaurant.fields.enablePayMyBill !== 'yes') {
      this.handleDisabledForRestaurant({ location })
    }

    if (basket && basket.success) {
      this.pageIsLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.bill-page {
  &__container {
    padding: 0 16px 160px;

    p {
      font-size: 14px;
      margin-bottom: 24px;
    }
  }

  &__heading {
    @extend .pmb-heading;
  }

  &__content {
    margin: 0 16px 170px;
  }

  &__footer {
    background-color: #fff;
    bottom: 0;
    position: fixed;
    width: 100%;
    @media (min-width: 700px) {
      position: relative;
    }
    .tax-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      span {
        color: #2f2f2f;
        font-size: 16px;
        line-height: 1.6;
        text-align: left;
      }
    }
  }
}
</style>
