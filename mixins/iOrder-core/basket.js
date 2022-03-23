export default {
  data() {
    return {
      loaded: null,
      checkingOrder: null,
      checkingVoucher: null,
      showModal: null
    }
  },
  computed: {
    availableTimeslots() {
      return this.$store.getters[`${this.app}/getAvailableTimeslots`]
    },
    alertsCode() {
      if (this.app === 'clickAndCollect') {
        return 'cc'
      } else if (this.app === 'orderAtTable') {
        return 'oat'
      }
    },
    alternativeTimeslots() {
      return this.$store.getters[`${this.app}/getAlternativeTimeslots`]
    },
    appSlug() {
      if (this.app === 'clickAndCollect') {
        return 'takeaway'
      } else if (this.app === 'orderAtTable') {
        return 'order'
      }
    },
    actionType() {
      switch (this.app) {
        case 'clickAndCollect':
          return 'collection'
        case 'orderAtTable':
          return 'dine_in'
        default:
          return ''
      }
    },
    collectionMethod() {
      if (this.app !== 'clickAndCollect') {
        return null
      } else if (this.$store.getters['clickAndCollect/isKerbsideEnabled']) {
        return 'kerbside'
      } else {
        return 'standard'
      }
    },
    applicationName() {
      if (this.app === 'clickAndCollect') {
        return 'Click & Collect'
      } else if (this.app === 'orderAtTable') {
        return 'Order at Table'
      }
    },
    promotionDiscount() {
      return Math.abs(
        this.$store.getters[`iorderCheckout/getPromotionDiscountAmount`]
      )
    },
    voucherDiscount() {
      return Math.abs(
        this.$store.getters[`iorderCheckout/getVoucherDiscountAmount`]
      )
    },
    discountedTotal() {
      return (this.basketTotal - this.voucherDiscount).toFixed(2)
    },
    locationSlug() {
      return (
        this.$store.getters[`${this.app}/getLocation`] &&
        this.$store.getters[`${this.app}/getLocation`].slug
      )
    },
    salesData() {
      return this.$store.getters[`${this.app}/getAllRequiredSalesData`]
    },
    serviceId() {
      return this.salesData.serviceId
    },
    timeslot() {
      return this.$store.getters[`${this.app}/getTimeslot`]
    },
    voucherApplied() {
      if (this.$store.getters[`${this.app}/getValidVoucherApplied`]) {
        return {
          detail: this.$store.getters[`${this.app}/getValidVoucherApplied`],
          code: this.$store.getters[`${this.app}/getVoucher`].voucherCode
        }
      }
    }
  },
  methods: {
    goBack() {
      if (this.app === 'orderAtTable') {
        return this.$nuxt.$router.go(-1)
      }
      if (this.locationSlug) {
        this.$nuxt.$router.push({
          path: `/restaurants/${this.locationSlug}/${this.appSlug}/menu`
        })
      } else {
        this.$nuxt.$router.push(`/${this.appSlug}`)
      }
    },
    handleCheckoutSuccess() {
      this.loaded = false
      this.$store.dispatch('iorderCheckout/hideModal')
      this.$store.dispatch('iorderCheckout/submitEcomTracking', {
        env: this.$store.state[this.app].env,
        applicationName: this.app
      })

      const self = this
      const summedItems = this.$store.state[this.app].basket.lines.map(item => {
        const sum = self.$store.getters[`${self.app}/getProductSummary`](item)
        return {
          title: sum.productName,
          quantity: sum.quantity,
          product_code: sum.SKU,
          price: sum.unitPrice
        }
      })

      const exponeaParams = {
        id: this.$store.state.iorderCheckout.successData.uniqueRef,
        total: this.basketTotal,
        items: summedItems,
        username: this.$store.state.iorderAuth.user.name,
        useremail: this.$store.state.iorderAuth.user.email,
        timeslot: this.salesData.timeslot,
        siteId: this.currentLocation.siteId,
        siteName: this.currentLocation.name,
        paymentMethod: this.$store.state.iorderCheckout.successData.paidBy,
        actionType: this.actionType,
        collectionMethod: this.collectionMethod,
        discount: this.promotionDiscount + this.voucherDiscount
      }

      this.$logExponeaOrder(exponeaParams)

      const ecomData = {
        env: this.$store.state[this.app].env,
        applicationName: this.app,
        customerEmail: this.$store.state.iorderAuth.user.email,
        orderId: this.$store.state.iorderCheckout.successData.uniqueRef,
        basketLines: this.$store.state[this.app].basket.lines
      }

      this.$store.dispatch(
        'iorderCheckout/submitWebExtendConversionTracking',
        ecomData
      )

      this.sendABTastyData()

      if (this.appSlug === 'takeaway') {
        this.$store.dispatch('iorderCheckout/submitRakutenTracking', {
          customerEmail: this.$store.state.iorderAuth.user.email,
          orderId: this.$store.state.iorderCheckout.successData.uniqueRef,
          lineitems: this.$store.getters[`${this.app}/getBasketLineSummary`]
        })
      }
      this.$store.dispatch('clickAndCollect/confirmTimeslot', {
        siteId: this.salesData.siteId,
        reservationId: this.$store.getters[
          'clickAndCollect/getReservedTimeslotId'
        ]
      })

      this.$nuxt.$router.push({
        path: `/restaurants/${this.locationSlug}/${
          this.appSlug
        }/checkout/success`
      })
    },
    handleCheckoutFailure() {
      this.$store.dispatch('iorderCheckout/hideModal')
      this.$nuxt.$router.push({
        path: `/restaurants/${this.locationSlug}/${
          this.appSlug
        }/checkout/failure`
      })
    },
    handleGuestLogin() {
      this.$store.dispatch('iorderCheckout/showCheckoutModal')
    },
    async checkBasketValidity() {
      const basket = await this.$store.dispatch('iorderCheckout/checkBasket', {
        siteId: this.$store.state[this.app].requiredSalesData.siteId,
        salesAreaId: this.$store.state[this.app].requiredSalesData.salesAreaId,
        serviceId: this.$store.state[this.app].requiredSalesData.serviceId,
        basketLines: this.$store.state[this.app].basket.lines,
        voucherLines: this.$store.state[this.app].basket.voucherLines,
        user: this.$store.getters['iorderAuth/getCurrentUser'],
        timeslot: this.$store.state[this.app].requiredSalesData.timeslot,
        identifier: `Web - ${this.app}`
      })

      if (basket.success) {
        return
      }
      if (basket.status === 'unavailableLines') {
        this.$store.dispatch(`${this.app}/markItemsUnavailable`, {
          productId: basket.ingredientId
        })
        return
      }
      if (basket.status === 'timeslotUnavailable') {
        await this.$store.dispatch[
          `${this.app}/validateTimeslots`
        ]
        this.showModal = 'alternativeTimesModal'
        return
      }
      if (basket.status) {
        this.$store.dispatch(`${this.app}/showError`, {
          heading: 'Error',
          message: basket.status
        })
        return
      }

      this.$store.dispatch(`${this.app}/showError`, {
        heading: 'Error',
        message: 'Unknown error'
      })
    },
    async setNextAvailableTimeslot() {
      const siteId = this.$store.getters['clickAndCollect/getZonalSiteId']
      const timeslots = await this.$store.dispatch(
        'clickAndCollect/validateTimeslots',
        { siteId }
      )

      if (timeslots) this.$store.dispatch('clickAndCollect/setNextTimeslot')
    },
    async initBasket() {
      if (this.app === 'clickAndCollect') {
        await this.setNextAvailableTimeslot()
      }
      this.checkBasketValidity()
    },
    async placeOrder() {
      this.checkingOrder = true

      this.$store.dispatch(`${this.app}/setTillMessage`)
      if (this.app === 'clickAndCollect') {
        await this.$store.dispatch('clickAndCollect/reserveTimeslot', {
          siteId: this.salesData.siteId,
          timeslot: this.timeslot
        })
      }
      const basket = await this.$store.dispatch('iorderCheckout/checkBasket', {
        siteId: this.$store.state[this.app].requiredSalesData.siteId,
        salesAreaId: this.$store.state[this.app].requiredSalesData.salesAreaId,
        serviceId: this.$store.state[this.app].requiredSalesData.serviceId,
        basketLines: this.$store.state[this.app].basket.lines,
        voucherLines: this.$store.state[this.app].basket.voucherLines,
        user: this.$store.getters['iorderAuth/getCurrentUser'],
        timeslot: this.$store.state[this.app].requiredSalesData.timeslot,
        identifier: `Web - ${this.app}`
      })
      if (this.app === 'clickAndCollect') {
        const timeslotStillAvailable = this.availableTimeslots.find(
          slot => slot.time === this.timeslot
        )

        if (!timeslotStillAvailable) {
          this.showModal = 'alternativeTimesModal'
          this.checkingOrder = false
          return
        }
      }

      if (basket.success) {
        this.checkingOrder = false
        this.$store.dispatch('iorderAuth/showGuestLoginModal')
        return
      }
      if (basket.status === 'unavailableLines') {
        this.checkingOrder = false
        this.$store.dispatch(`${this.app}/markItemsUnavailable`, {
          productId: basket.ingredientId
        })
        return
      }
      if (basket.status === 'timeslotUnavailable') {
        await this.$store.dispatch[
          `${this.app}/validateTimeslots`
        ]
        this.showModal = 'alternativeTimesModal'
        this.checkingOrder = false
        return
      }
      if (basket.status) {
        this.$store.dispatch(`${this.app}/showError`, {
          heading: 'Error',
          message: basket.status
        })
        this.checkingOrder = false
        return
      }

      this.$store.dispatch(`${this.app}/showError`, {
        heading: 'Error',
        message: 'Unknown error'
      })
      this.checkingOrder = false
    },
    async submitVoucher(voucherCode) {
      this.checkingVoucher = true

      const voucher = await this.$store.dispatch(
        'iorderCheckout/checkVoucher',
        {
          siteId: this.$store.state[this.app].requiredSalesData.siteId,
          salesAreaId: this.$store.state[this.app].requiredSalesData
            .salesAreaId,
          voucherCode: voucherCode,
          identifier: `Web - ${this.app}`
        }
      )

      if (voucher.success) {
        this.$store.dispatch(`${this.app}/applyVoucher`, {
          voucherCode: voucher.voucherCode
        })

        const basket = await this.$store.dispatch(
          'iorderCheckout/checkBasket',
          {
            siteId: this.$store.state[this.app].requiredSalesData.siteId,
            salesAreaId: this.$store.state[this.app].requiredSalesData
              .salesAreaId,
            serviceId: this.$store.state[this.app].requiredSalesData.serviceId,
            basketLines: this.$store.state[this.app].basket.lines,
            voucherLines: this.$store.state[this.app].basket.voucherLines,
            user: this.$store.getters['iorderAuth/getCurrentUser'],
            timeslot: this.$store.state[this.app].requiredSalesData.timeslot,
            identifier: `Web - ${this.app}`
          }
        )

        if (basket.success) {
          this.checkingVoucher = false
          const voucherDescription = this.$store.getters[
            'iorderCheckout/getVoucherDetail'
          ].voucher.metaData.friendlyName
          this.$store.dispatch(`${this.app}/setVoucherDescription`, {
            voucherDescription
          })
          return
        }

        this.$store.dispatch(`${this.app}/clearVoucher`)
        this.checkingVoucher = false

        if (basket.status === 'timeslotUnavailable') {
          await this.$store.dispatch[
            `${this.app}/validateTimeslots`
          ]
          this.showModal = 'alternativeTimesModal'
          return
        }
        if (basket.status === 'voucherError') {
          this.$store.dispatch('iorderCheckout/showToast', {
            detail:
              'This voucher could not be applied to your basket. Please try again.',
            size: 'small'
          })
          return
        }
        if (basket.status) {
          this.$store.dispatch('iorderCheckout/showToast', {
            detail: basket.status,
            size: 'small'
          })
          return
        }
        this.$store.dispatch('iorderCheckout/showToast', {
          detail: 'Oops, an error has occurred. Please try again.',
          size: 'small'
        })
      }

      this.$store.dispatch(`${this.app}/clearVoucher`)
      this.checkingVoucher = false

      if (voucher.status === 'invalidVoucherCode') {
        this.$store.dispatch('iorderCheckout/showToast', {
          detail:
            'This voucher code is not valid. Please try a different voucher code.',
          size: 'small'
        })
        return
      }

      if (voucher.status) {
        this.$store.dispatch('iorderCheckout/showToast', {
          detail: voucher.status,
          size: 'small'
        })
        return
      }

      this.$store.dispatch('iorderCheckout/showToast', {
        detail: 'Oops, an error has occurred. Please try again.',
        size: 'small'
      })
    },
    async voidVoucher(voucherCode) {
      this.checkingVoucher = true
      const voidCoupon = await this.$store.dispatch(
        'iorderCheckout/voidVoucher',
        {
          siteId: this.$store.state[this.app].requiredSalesData.siteId,
          salesAreaId: this.$store.state[this.app].requiredSalesData
            .salesAreaId,
          voucherCode: voucherCode,
          identifier: `Web - ${this.app}`
        }
      )
      voidCoupon.success &&
        this.$store.dispatch(`${this.app}/clearVoucher`) &&
        (await this.checkBasketValidity())
      this.checkingVoucher = false
    },
    removeItemFromBasket(lineItem) {
      this.$store.dispatch(`${this.app}/removeItemFromBasket`, { lineItem })
    },
    sendABTastyData() {
      if (!window || !window.abtasty || !window.abtasty.send) {
        return
      }

      const transactionId = this.$store.state.iorderCheckout.successData.uniqueRef.toString()
      if (!transactionId) {
        return
      }

      this.sendABTastyTransactionData(transactionId)
      this.sendABTastyItemData(transactionId)
    },
    sendABTastyTransactionData(transactionId) {
      try {
        const transactionAffiliation = this.app
        const transactionRevenue = this.$store.getters[
          'iorderCheckout/getBasketTotal'
        ]
        const paymentMethod = this.$store.state.iorderCheckout.successData
          .paidBy
        const itemCountNumber = this.$store.getters[
          `${this.app}/getBasketCount`
        ]

        const transactionDetails = {
          tid: transactionId,
          ta: transactionAffiliation,
          tr: transactionRevenue,
          tc: 'GBP',
          pm: paymentMethod,
          icn: itemCountNumber
        }

        if (this.voucherApplied) {
          transactionDetails.tcc = this.voucherApplied.code
        }

        window.abtasty.send('transaction', transactionDetails)
      } catch (err) {
        console.log(err)
      }
    },
    sendABTastyItemData(transactionId) {
      const basket = this.$store.getters[`${this.app}/getBasket`]
      const items = basket && basket.lines

      if (!items || !items.length) {
        return
      }

      items.forEach(item => {
        const ingredientId = item.ingredientId
        if (!ingredientId) {
          return
        }
        const itemSummary = this.$store.getters[
          `${this.app}/getProductSummary`
        ](item)
        if (!itemSummary) {
          return
        }
        const itemName = itemSummary.productName
        if (!itemName) {
          return
        }
        const itemPrice = itemSummary.unitPrice
        const itemQuantity = itemSummary.quantity
        const itemCode = itemSummary.SKU && itemSummary.SKU.toString()

        const itemDetails = {
          tid: transactionId,
          in: itemName,
          ip: itemPrice,
          iq: itemQuantity,
          ic: itemCode
        }

        try {
          window.abtasty.send('item', itemDetails)
        } catch (err) {
          console.log(err)
        }
      })
    },
    setTimeslot(timeslot) {
      this.$store.commit(`${this.app}/setTimeslot`, { timeslot })
    }
  }
}
