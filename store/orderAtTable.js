import getIorderHeaders from '../libs/iOrderHeaders'
import axios from '~/plugins/axios'

export const state = () => {
  return {
    env: process.env.OAT_ENV,
    config: null,
    requiredSalesData: {
      siteId: null,
      salesAreaId: null,
      foodMenuId: null,
      drinksMenuId: null,
      serviceId: null,
      tableNumber: null
    },
    tables: [],
    menus: {
      food: {
        display: {
          displayGroups: []
        }
      },
      drinks: {
        display: {
          displayGroups: []
        }
      }
    },
    productsDictionary: {},
    choiceGroupsDictionary: {},
    location: {},
    allLocations: [],
    iOrderLocation: null,
    basket: {
      lines: [],
      voucherLines: []
    },
    error: {},
    upsellModalDisplayed: null,
    validVoucherApplied: null,
    lineItemsAddedCount: 0
  }
}

function compareChoiceArrays (arr1, arr2) {
  if (arr1.length !== arr2.length) return false

  function sortChoiceArray (array) {
    return array.sort((a, b) => {
      if (a.choiceId === b.choiceId) {
        return a.ingredientId - b.ingredientId
      }
      return a.choiceId - b.choiceId
    })
  }

  const arr1Copy = sortChoiceArray([...arr1])
  const arr2Copy = sortChoiceArray([...arr2])

  return arr1Copy.reduce((bool, choiceObject, index) => {
    return bool && choiceObject.choiceId === arr2Copy[index].choiceId && choiceObject.ingredientId === arr2Copy[index].ingredientId
  }, true)
}

function getRestaurantBySiteId ({ data }) {
  return axios({
    method: 'get',
    url: '/api/content/order-at-table/site',
    params: data
  }).then((response) => {
    return response.data
  })
}

function getTax (total) {
  return Number(
    (total - (total / 1.2)).toFixed(2)
  )
}

function getTotalLessTax (total) {
  return Number(
    (total / 1.2).toFixed(2)
  )
}

export const getters = {
  getBasketLineSummary (state, getters) {
    const items = state.basket.lines.map(item => {
      return [ getters.getProductSummary(item), ...getters.getChoiceSummary(item) ].filter(Boolean)
    })
    return [].concat.apply([], items)
  },
  getChoiceSummary (state, getters) {
    return (item) => {
      return item.choiceLines && item.choiceLines.length && item.choiceLines.map(getters.getProductSummary).filter(Boolean)
    }
  },
  getProductSummary (state, getters) {
    return (item) => {
      const meta = getters.getProduct(item.ingredientId)
      const productPrice = meta.portions && meta.portions.length && meta.portions[0].price

      return {
        quantity: item.quantity,
        SKU: item.ingredientId,
        productName: (meta.displayRecords && meta.displayRecords.length && meta.displayRecords[0].name || '').trim(),
        unitPrice: productPrice,
        unitPriceLessTax: Number((productPrice - getTax(productPrice)).toFixed(2))
      }
    }
  },
  getAllRequiredSalesData (state) {
    return state.requiredSalesData
  },
  getBasket (state) {
    return state.basket
  },
  getBasketCount (state, getters) {
    return state.basket.lines.reduce((sum, basketLine) => {
      return sum += basketLine.quantity
    }, 0)
  },
  getBasketIndex (state) {
    return lineItem => {
      return state.basket.lines.findIndex(basketItem => {
        return basketItem.ingredientId === lineItem.ingredientId &&
          basketItem.portionTypeId === lineItem.portionTypeId &&
          compareChoiceArrays(basketItem.choiceLines, lineItem.choiceLines)
      })
    }
  },
  getBasketIndexesFromIngredientId (state) {
    return productId => {
      return state.basket.lines.reduce((indexesArray, basketItem, index) => {
        if (basketItem.ingredientId === productId || basketItem.choiceLines.find(choiceLine => choiceLine.ingredientId === productId)) {
          return [...indexesArray, index]
        }
        return indexesArray
      }, [])
    }
  },
  getBasketTotal (state, getters) {
    let total = state.basket.lines.reduce((sum, basketLine) => {
      const productDetails = getters.getProduct(basketLine.ingredientId)
      const itemPrice = productDetails.portions.find(portion => portion.id === basketLine.portionTypeId).price
      const choiceSum = basketLine.choiceLines.reduce((choiceSum, choice) => {
        const aztecChoice = getters.getProduct(choice.ingredientId);
        return choiceSum + ((aztecChoice.portions && aztecChoice.portions[0] && aztecChoice.portions[0].price) || 0)
      }, 0)
      return sum + basketLine.quantity * itemPrice + basketLine.quantity * choiceSum
    }, 0)
    total = total || 0
    return total.toFixed(2)
  },
  getItemCount (state) {
    return productId => {
      return state.basket.lines.reduce((count, basketLine) => {
        return basketLine.ingredientId === productId ? count += basketLine.quantity : count
      }, 0)
    }
  },
  getChoices (state, getters) {
    return productId => {
      let choices = null;
      Object.values(state.menus).forEach(menu => {
        menu.display.displayGroups.forEach(displayGroup => {
          displayGroup.items.forEach(item => {
            if (item.itemType === 'product' && item.product.productId === productId) {
              const aztecProduct = getters.getProduct(item.product.productId);
              choices = aztecProduct && aztecProduct.portions && aztecProduct.portions[0] && aztecProduct.portions[0].choices;
            }
          })
        });
      });
      return choices;
    }
  },
  getChoiceGroup (state) {
    return groupId => {
      return state.choiceGroupsDictionary[groupId]
    }
  },
  getDisplayItem (state) {
    return productId => {
      let displayItem = null
      Object.values(state.menus).forEach(menu => {
        menu.display.displayGroups.forEach(displayGroup => {
          displayGroup.items.forEach(item => {
            if (item.itemType === 'product' && item.product.productId === productId) {
              displayItem = item.product
            }
          })
        })
      })
      return displayItem
    }
  },
  getDisplayGroupName(state) {
    return productId => {
      let category = null;
      state.menu &&
        state.menu.display &&
        state.menu.display.displayGroups &&
        state.menu.display.displayGroups.forEach(displayGroup => {
          displayGroup && displayGroup.items && displayGroup.items.forEach(item => {
            if (item.itemType === 'product' && item.product && item.product.productId === productId) {
              category = displayGroup;
            }
          })
        });
      return category && category.groupName;
    }
  },
  getKeyWord (state) {
    return keywordId => state.menu.display.keywords.find(keyword => {
      return keyword.id === keywordId
    })
  },
  getLineItemsAddedCount (state) {
    return state.lineItemsAddedCount
  },
  getLocation (state) {
    return state.location
  },
  getMatchingBasketItemsChoicesAndPortions (state, getters) {
    return productId => {
      const basketItems = state.basket.lines.filter(basketLine => {
        return basketLine.ingredientId === productId
      })
      return basketItems.map(item => {
        let itemDetail = {}
        const portions = getters.getProduct(productId).portions
        if (portions.length > 1) {
          itemDetail.portion = portions.find(portionObject => {
            return portionObject.id === item.portionTypeId
          }).name
        }
        itemDetail.quantity = item.quantity
        itemDetail.choices = item.choiceLines.map(choiceLine => {
          return {
            choiceName: getters.getChoiceGroup(choiceLine.choiceId).displayRecords[0].name,
            selected: getters.getProduct(choiceLine.ingredientId).displayRecords[0].name
          }
        })
        return itemDetail
      })
    }
  },
  getMenu (state) {
    return menuLabel => {
      return state.menus[menuLabel]
    }
  },
  getMenus (state) {
    return state.menus
  },
  getPrettyLocationQuery (state) {
    if (!state.location ||
        !state.location.title) {
      return null
    }
    return state.location.title
  },
  getPreviousTransaction () {
    return state.previousTransaction
  },
  getProduct (state) {
    return productId => {
      return state.productsDictionary[productId]
    }
  },
  getProductsDictionary (state) {
    return state.productsDictionary
  },
  getTableNumber (state, getters) {
    return getters.getAllRequiredSalesData &&
           getters.getAllRequiredSalesData.tableNumber;
  },
  getZonalSiteId (state) {
    return state.location.zonalSiteId
  },
  getSiteMeta (state) {
    return {
      siteId: state.requiredSalesData.siteId,
      salesAreaId: state.requiredSalesData.salesAreaId
    }
  },
  getTables (state) {
    return state.tables
  },
  getVoucher (state) {
    return state.basket.voucherLines[0]
  },
  getValidVoucherApplied (state) {
    return state.validVoucherApplied
  },
  gotAllRequiredSalesData (state) {
    return Object.values(state.requiredSalesData).filter(Boolean).length === 6
  },
  gotPartialSalesData (state) {
    return numItems => {
      return Object.values(state.requiredSalesData).filter(Boolean).length === numItems
    }
  },
  orderAtTableEnabled (state) {
    return state.location.orderAtTable;
  }
}

export const mutations = {
  initJourney (state) {
    state.requiredSalesData = {
      siteId:              null,
      salesAreaId:         null,
      foodMenuId:          null,
      drinksMenuId:        null,
      serviceId:           null,
      tableNumber:         null
    }
    state.basket = {
      lines: [],
      voucherLines: []
    }
    state.validVoucherApplied = null
    state.iOrderLocation = null
    state.error = { heading: null, message: null }
    state.menus = {
      food: {
        display: {
          displayGroups: []
        }
      },
      drinks: {
        display: {
          displayGroups: []
        }
      }
    }
    state.productsDictionary = {}
    state.choiceGroupsDictionary = {}
    state.tables = []
    state.config = getIorderHeaders(state.env, 'OAT')
  },
  addLineItemToBasket (state, { lineItem }) {
    state.basket.lines.push(lineItem)
    state.lineItemsAddedCount++
  },
  addUnavailableFlag (state, { basketItemIndex }) {
    state.basket.lines[basketItemIndex].unavailable = true
  },
  addVoucherCodeToBasket (state, { voucherCode }) {
    state.basket.voucherLines.push({ voucherCode })
  },
  clearBasketMessages (state) {
    state.basket.lines.forEach((line) => {
      if (line.messages) line.messages = []
    })
  },
  clearVoucherLines (state) {
    state.basket.voucherLines = []
  },
  decrementBasketItem (state, { basketItemIndex }) {
    state.basket.lines[basketItemIndex].quantity--
  },
  editBasketChoices (state, { basketIndex, choicesArray }) {
    state.basket.lines[basketIndex].choiceLines = choicesArray
  },
  incrementBasketItem (state, { basketItemIndex }) {
    state.basket.lines[basketItemIndex].quantity++
  },
  removeLineItemFromBasket (state, { basketItemIndex }) {
    state.basket.lines.splice(basketItemIndex, 1)
  },
  setAllLocations (state, { locations }) {
    state.allLocations = locations
  },
  setBasket (state, { basket }) {
    state.basket = basket
  },
  setBookingMeta (state, { name, email, siteId, dateTime, numPeople, bookingRef }) {
    state.booking.name = name
    state.booking.email = email
    state.booking.siteId = siteId
    state.booking.dateTime = dateTime
    state.booking.numPeople = numPeople
    state.booking.bookingRef = bookingRef
  },
  setChoiceGroupsDictionary (state, { choiceGroupsDictionary }) {
    state.choiceGroupsDictionary = choiceGroupsDictionary
  },
  setError (state, { heading, message, homeLink }) {
    state.error = { heading, message, homeLink }
  },
  setLocation (state, { location }) {
    state.location = location
  },
  setMenu (state, { label, menu }) {
    state.menus[label] = menu
  },
  setMenuId (state, { foodMenuId, drinksMenuId }) {
    state.requiredSalesData.foodMenuId = foodMenuId
    state.requiredSalesData.drinksMenuId = drinksMenuId
  },
  setProductsDictionary (state, { productsDictionary }) {
    state.productsDictionary = productsDictionary
  },
  setServiceId (state, { serviceId }) {
    state.requiredSalesData.serviceId = serviceId
  },
  setTableNumber (state, { tableNumber }) {
    state.requiredSalesData.tableNumber = tableNumber
  },
  setTables (state, { tables }) {
    state.tables = tables
  },
  setTillMessage (state, { messages }) {
    state.basket.lines.forEach((line) => {
      line.messages = messages
    })
  },
  setSalesAreaId (state, { salesAreaId }) {
    state.requiredSalesData.salesAreaId = salesAreaId
  },
  setValidVoucherApplied (state, { voucherDescription }) {
    state.validVoucherApplied = voucherDescription
  },
  setZonalSiteId (state, { siteId }) {
    state.requiredSalesData.siteId = siteId
  },
  setZonalVenueInfo (state, { restaurantData }) {
    state.iOrderLocation = restaurantData
  }
}

export const actions = {

  addItemToBasket ({ state, commit, getters }, { product, portionModifier, choicesArray }) {
    const lineItem = {
      'ingredientId': product.productId,
      'portionTypeId': portionModifier || product.defaultPortionId,
      'displayRecordId': product.displayRecordId,
      'courseId': getters['getProduct'](product.productId).defaultCourseId,
      'quantity': 1,
      'choiceLines': choicesArray || [],
      "basketKey": getters['getLineItemsAddedCount']
    }

    const matchIndex = getters['getBasketIndex'](lineItem)

    if (matchIndex !== -1) {
      commit('incrementBasketItem', { basketItemIndex: matchIndex })
    } else {
      commit('addLineItemToBasket', { lineItem })
    }
  },

  applyVoucher ({ state, commit }, { voucherCode }) {
    commit('addVoucherCodeToBasket', { voucherCode })
  },

  checkNecessaryDataToProceed ({ state, getters }, { salesDataCount }) {
    const menus = getters['getMenus'];
    const menusPopulated = menus && Object.values(menus).length && Object.values(menus).reduce((bool, menu) => bool && !!menu.display.displayGroups.length, true);
    const locationPopulated = getters['getLocation'] && !!Object.keys(getters['getLocation']).length;
    const gotSalesData = salesDataCount ? getters['gotPartialSalesData'](salesDataCount) : getters['gotAllRequiredSalesData'];
    const necessaryData = menusPopulated && locationPopulated && gotSalesData;
    if (!necessaryData) {
      this.app.router.push('/order');
    }
  },

  checkOrderAtTableEnabled ({ state, getters, dispatch }) {
    if (!getters.orderAtTableEnabled) {
      dispatch('showError', { heading: 'Oops, sorry about that', message: 'Order At Table is not available right now. (code: cmskill)' });
    }
  },

  clearBasket ({ commit, state }) {
    commit('setBasket', { basket: { lines: [] } })
  },

  clearVoucher ({ commit, state }) {
    commit('clearVoucherLines')
  },

  editBasketChoices ({ state, commit, getters }, { basketIndex, choicesArray }) {
    commit('editBasketChoices', { basketIndex, choicesArray })
  },

  incrementBasketItem ({ state, commit, getters }, { product, quantity, choicesArray }) {
    const lineItem = {
      'ingredientId': product.id,
      'portionTypeId': product.portions[0].id,
      'displayRecordId': product.displayRecords[0].id,
      'courseId': product.defaultCourseId,
      'quantity': quantity,
      'choiceLines': choicesArray || []
    }

    const matchIndex = getters['getBasketIndex'](lineItem)

    if (matchIndex !== -1) {
      commit('incrementBasketItem', { basketItemIndex: matchIndex })
    } else {
      commit('addLineItemToBasket', { lineItem })
    }
  },

  indexMenu ({ commit, state }, { menu }) {
    const productsDictionary = state.productsDictionary
    const choiceGroupsDictionary = state.choiceGroupsDictionary
    menu.aztec.products.forEach(product => {
      productsDictionary[product.id] = product
    })
    menu.aztec.choiceGroups.forEach(choiceGroup => {
      choiceGroupsDictionary[choiceGroup.id] = choiceGroup
    })
    commit('setProductsDictionary', { productsDictionary })
    commit('setChoiceGroupsDictionary', { choiceGroupsDictionary })
  },

  initState ({ commit, state, dispatch }) {
    commit('initJourney')
  },

  setIorderConfigs ({ commit, state }) {
    commit('iorderAuth/setIorderConfig',     { config: state.config }, { root: true })
    commit('iorderCheckout/setIorderConfig',   { config: state.config }, { root: true })
  },

  markItemsUnavailable ({ commit, state, getters }, { productId }) {
    const matchIndexes = getters['getBasketIndexesFromIngredientId'](productId)

    matchIndexes.forEach(basketItemIndex => {
      commit('addUnavailableFlag', { basketItemIndex })
    })
  },

  removeItemFromBasket ({ state, commit, getters }, { lineItem }) {
    const matchIndex = getters['getBasketIndex'](lineItem)

    if (state.basket.lines[matchIndex].quantity > 1) {
      commit('decrementBasketItem', { basketItemIndex: matchIndex })
    } else {
      commit('removeLineItemFromBasket', { basketItemIndex: matchIndex })
    }
  },

  removeLastMatchingProductFromBasket ({ state, commit }, { productId }) {
    const matchIndex = state.basket.lines.reduce((lastIndex, basketItem, currentIndex) => {
      return basketItem.ingredientId === productId ? currentIndex : lastIndex
    }, 0)

    if (state.basket.lines[matchIndex].quantity > 1) {
      commit('decrementBasketItem', { basketItemIndex: matchIndex })
    } else {
      commit('removeLineItemFromBasket', { basketItemIndex: matchIndex })
    }
  },

  setTableNumber ({ state, commit }, { tableNumber }) {
    commit('setTableNumber', { tableNumber })
  },

  setTillMessage ({ state, commit, getters }) {
    const messages = [
      'Order at Table'
    ]

    commit('clearBasketMessages')
    commit('setTillMessage', { messages })
  },

  showError ({ commit, state }, { heading, message, homeLink }) {
    commit('setError', { heading, message, homeLink })
    this.app.router.push('/order/error')
  },

  setVoucherDescription ({ state, commit }, { voucherDescription }) {
    commit('setValidVoucherApplied', { voucherDescription })
  },

  async validateVenueAndMenu ({ commit, state, dispatch }, { siteId }) {
    console.log('Starting validation process')
    dispatch('initState')

    const validRestaurantMeta = await dispatch('validateSiteId', { siteId })
    if (!validRestaurantMeta) {
      dispatch('showError', { heading: 'Oops, sorry about that!', message: 'Order At Table is currently unavailable for this restaurant. (code:restmeta)' })
      return Promise.resolve({
        success: false,
        message: 'Failed to validate restaurant'
      })
    }

    const validVenueAndMenu = await dispatch('getVenueAndMenu', { siteId: state.location.zonalSiteId })
    if (!validVenueAndMenu) {
      dispatch('showError', { heading: 'Oops, sorry about that!', message: 'Order At Table is unavailable at this time. (code:siteconfig)'})
      return Promise.resolve({
        success: false,
        message: 'Failed to get venue and menu'
      })
    }

    console.log('validation success')

    return Promise.resolve({
      success: true
    })
  },

  async getVenueAndMenu ({ commit, state, dispatch }, { siteId }) {
    const gotRestaurant = await dispatch('getRestaurantInfo', { siteId })
    if (!gotRestaurant) {
      console.log('cant find zonal restaurant data')
      return Promise.resolve(false)
    }

    const gotTables = await dispatch('getValidTableNumbers', { siteId, salesAreaId: state.requiredSalesData.salesAreaId })
    if (!gotTables) {
      console.log(`can't get tables for venue`)
      return Promise.resolve(false)
    }

    const gotMenuSummary = await dispatch('getMenuSummary', { siteId, salesAreaId: state.requiredSalesData.salesAreaId })
    if (!gotMenuSummary) {
      console.log('cant get menu summary ')
      return Promise.resolve(false)
    }

    const gotFoodMenu = await dispatch('getMenuData', { siteId, salesAreaId: state.requiredSalesData.salesAreaId, menuId: state.requiredSalesData.foodMenuId, label: 'food' })
    if (!gotFoodMenu) {
      console.log(`can't get Food menu data`)
      return Promise.resolve(false)
    }

    const gotDrinksMenu = await dispatch('getMenuData', { siteId, salesAreaId: state.requiredSalesData.salesAreaId, menuId: state.requiredSalesData.drinksMenuId, label: 'drinks' })
    if (!gotDrinksMenu) {
      console.log(`can't get Drinks menu data`)
      return Promise.resolve(false)
    }

    return Promise.resolve(true)
  },

  async validateSiteId ({ commit, state }, { siteId }) {
    return new Promise(resolve => {
      getRestaurantBySiteId({ data: { siteId }})
        .then(location => {
          if (!location.zonalSiteId || !location.slug && !location.orderAtTable) {
            return resolve(false)
          }
          commit('setLocation', { location })
          return resolve(true)
        })
    })
  },

  async getMenuSummary ({ state, getters, commit, dispatch }, { siteId, salesAreaId }) {
    return new Promise((resolve, reject) => {
      this.app.iOrder.getMenus({ siteId, salesAreaId, config: state.config }, (err, res) => {
        if (err) {
          dispatch('showError', { heading: 'Error returning venue menus', message: err.detail})
          return resolve(false)
        } else if (res.response === 'Error') {
          dispatch('showError', { heading: 'Error returning venue menus', message: res.detail})
          return resolve(false)
        }

        const drinksMenuIdentifier = state.env === 'production' ? new RegExp('chq drinks', 'i') : new RegExp('drinks', 'i');
        const foodMenuIdentifier = state.env === 'production' ? new RegExp('chq food', 'i') : new RegExp('breakfast', 'i');

        const foodMenu = res.menus.find(menu => foodMenuIdentifier.test(menu.name));
        const drinksMenu = res.menus.find(menu => drinksMenuIdentifier.test(menu.name));

        if (foodMenu && foodMenu.id && drinksMenu && drinksMenu.id) {
          commit('setMenuId', { drinksMenuId: drinksMenu.id, foodMenuId: foodMenu.id });
          return resolve(true)
        } else {
          dispatch('showError', { heading: 'Error returning venue menus', message: 'Menu is incorrectly configured'})
          return resolve(false)
        }
      })
    })
  },

  async getMenuData ({ state, getters, commit, dispatch }, { siteId, salesAreaId, menuId, label }) {
    return new Promise ((resolve, reject) => {
      this.app.iOrder.getMenuPages({ siteId, salesAreaId, menuId, config: state.config }, (err, res) => {
        if (err) {
          dispatch('showError', { heading: 'Error returning menu data', message: err.detail })
          return resolve(false)
        } else if (res.response === 'Error') {
          dispatch('showError', { heading: 'Error returning menu data', message: res.detail })
          return resolve(false)
        }

        const canPlaceOrder = res.canPlaceOrder === 1
        if (canPlaceOrder) {
          dispatch('indexMenu', { menu: res })
          delete res.aztec
          commit('setMenu', { label, menu: res })
          return resolve(true)
        } else {
          return resolve(false)
        }
      })
    })
  },

  getRestaurantInfo ({ state, getters, commit, dispatch }, { siteId }) {
    return new Promise((resolve, reject) => {
      this.app.iOrder.getVenue({ siteId, config: state.config }, (err, res) => {
        if (err) {
          dispatch('showError', { heading: 'Error returning venue information', message: err.detail})
          return resolve(false)
        } else if (res.response === 'Error') {
          dispatch('showError', { heading: 'Error returning venue information', message: res.detail})
          return resolve(false)
        }

        if (!res.venues.length) {
          dispatch('showError', { heading: 'Error returning venue information', message: 'No venues returned for that siteId'})
          return resolve(false)
        }

        const venueService = res.services.find(service => /click and collect/i.test(service.name))
        const salesArea = res.venues[0].salesArea.find(area => /mobile|mo downstairs/i.test(area.name))
        const canPlaceOrder = res.venues[0].canPlaceOrder === 1
        if (venueService && venueService.id && salesArea && salesArea.id && canPlaceOrder) {
          commit('setServiceId', { serviceId: venueService.id })
          commit('setSalesAreaId', { salesAreaId: salesArea.id })
          commit('setZonalVenueInfo', { restaurantData: res.venues[0] })
          commit('setZonalSiteId', { siteId: res.venues[0].id })
          return resolve(true)
        } else {
          dispatch('showError', { heading: 'Error returning venue information', message: 'Service not available' })
          return resolve(false)
        }
      })
    })
  },

  async getValidTableNumbers ({ state, getters, commit, dispatch }, { siteId, salesAreaId }) {
    return new Promise((resolve, reject) => {
      this.app.iOrder.getTables({ siteId, salesAreaId, config: state.config }, (err, res) => {
        if (err) {
          dispatch('showError', { heading: 'Error returning table information', message: err.detail })
          return resolve(false)
        } else if (res.response === 'Error') {
          dispatch('showError', { heading: 'Error returning table information', message: res.detail })
          return resolve(false)
        }
        const tables = res.map(tableObject => tableObject.number)
        if (!tables.length) {
          dispatch('showError', { heading: 'Error returning table information', message: 'No open tables returned' })
          return resolve(false)
        }
        commit('setTables', { tables })
        return resolve(tables)
      })
    })
  },

  setTableNumber ({ commit }, { tableNumber }) {
    commit('setTableNumber', { tableNumber });
  }
}
