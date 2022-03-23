/* eslint-disable no-console,no-unused-vars */
import getIorderHeaders from '../libs/iOrderHeaders';
import axios from '~/plugins/axios';
import dayjs from 'dayjs';
import get from 'lodash.get';

import timeslotsApi from '@/libs/timeslots/index';
import { iconTagsIDs } from '@/libs/templateHelpers.js';

export const state = () => {
  return {
    env: process.env.CC_ENV,
    config: {
      iOrderUrl: null,
      headers: null
    },
    menuTab: null,
    leadtime: 30,
    requiredSalesData: {
      siteId: null,
      salesAreaId: null,
      menuId: null,
      serviceId: null,
      timeslot: null
    },
    availableTimeslots: [],
    menu: {
      display: {
        displayGroups: []
      }
    },
    searchQuery: null,
    productsDictionary: {},
    choiceGroupsDictionary: {},
    location: {},
    allLocations: [],
    iOrderLocation: null,
    basket: {
      lines: [],
      voucherLines: []
    },
    cutlery: false,
    error: {},
    upsellModalDisplayed: null,
    validVoucherApplied: null,
    useCustomTimeslots: true,
    reservedTimeslotId: null,
    kerbsideEnabled: false,
    optInMessage: null
  };
};

function compareChoiceArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  function sortChoiceArray(array) {
    return array.sort((a, b) => {
      if (a.choiceId === b.choiceId) {
        return a.ingredientId - b.ingredientId;
      }
      return a.choiceId - b.choiceId;
    });
  }

  const arr1Copy = sortChoiceArray([...arr1]);
  const arr2Copy = sortChoiceArray([...arr2]);

  return arr1Copy.reduce((bool, choiceObject, index) => {
    return (
      bool &&
      choiceObject.choiceId === arr2Copy[index].choiceId &&
      choiceObject.ingredientId === arr2Copy[index].ingredientId
    );
  }, true);
}

function getRestaurantBySiteId({ data }) {
  return axios({
    method: 'get',
    url: '/api/content/click-and-collect/site',
    params: data
  }).then(response => {
    return response.data;
  });
}
function getTax(total) {
  return Number((total - total / 1.2).toFixed(2));
}
function getTotalLessTax(total) {
  return Number((total / 1.2).toFixed(2));
}

const flattenGroups = displayGroups => {
  const mappedGroups = displayGroups.map(group => group.items);
  if (mappedGroups && mappedGroups.length) {
    const flattenedGroups = mappedGroups.flat();
    const productsOnly = normaliseProducts(flattenedGroups);
    return productsOnly;
  }
  return [];
};

const normaliseProducts = products => {
  const filteredProducts = products.filter(
    product => product.itemType === 'product'
  );
  const payload = filteredProducts.map(p => {
    if (p.product) {
      p = {
        ...p,
        ...p.product
      };
    }
    return p;
  });
  return payload;
};

export const getters = {
  getSelectedMenu(state, getters) {
    const searchQuery = state.searchQuery;
    const searchMenu = getters.getSearchMenu;
    if (searchQuery) {
      return searchMenu;
    } else {
      return getters.getAllMenuItems;
    }
  },
  getSearchMenu(state, getters) {
    try {
      const searchQuery = getters.getSearchQuery;
      const fullMenu = getters.getAllMenuItems;
      if (searchQuery && searchQuery.length) {
        let searchedMenu = fullMenu.map(cat => {
          if (cat.items && cat.items.length) {
            const categories = cat.items.filter(i => {
              return i.displayName
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            });
            return {
              groupName: cat.groupName,
              items: categories
            };
          }
        });
        searchedMenu = searchedMenu.filter(
          cat => cat && cat.items && cat.items.length
        );
        return searchedMenu;
      } else {
        return fullMenu;
      }
    } catch (error) {
      console.log('Error getting search menu', error);
    }
  },
  getFullMenu(state, getters) {
    const displayGroups = getters.getDisplayGroups;
    const payload = flattenGroups(displayGroups);
    return payload;
  },
  getCutlery(state) {
    return state.cutlery;
  },
  getSearchQuery(state) {
    return state.searchQuery;
  },
  getMenuTab(state) {
    return state.menuTab;
  },
  getMenuTabItems(state, getters) {
    const menuTab = state.menuTab;
    if (menuTab && menuTab.items) {
      const rawTabItems = menuTab.items;
      const tabItems = rawTabItems.filter(i => i.itemType === 'product');
      const payload = tabItems.map(i => {
        const productId = get(i, 'product.productId');
        const dictionaryProduct = getters.getProduct(productId);
        const DPDR = get(dictionaryProduct, 'displayRecords[0]');
        const flattedDictionaryProduct = {
          ...dictionaryProduct,
          ...DPDR
        };
        const getIcons = item => {
          try {
            const lightTags = {
              id: iconTagsIDs.lighter,
              shorthand: 'l',
              name: 'light'
            };

            const newItemTags = {
              id: iconTagsIDs.new,
              shorthand: 'n',
              name: 'new'
            };

            const newRecipeTags = {
              id: iconTagsIDs.newRecipe,
              shorthand: 'nr',
              name: 'new-recipe'
            };

            const veganTags = {
              id: iconTagsIDs.vegan,
              shorthand: 'vg',
              name: 'vegan'
            };

            const vegetarianTags = {
              id: iconTagsIDs.vegetarian,
              shorthand: 'v',
              name: 'vegetarian'
            };

            const tags = [
              veganTags,
              vegetarianTags,
              lightTags,
              newItemTags,
              newRecipeTags
            ];
            const menuKeywords = getters.getKeywords;
            if (menuKeywords && menuKeywords.length) {
              tags.map(tag => {
                const keywordsNames = menuKeywords.map(k => {
                  const name = k.name;
                  const newName = name.replace(/\s+/g, '-').toLowerCase();
                  return newName;
                });
                const indexOfKeyword = keywordsNames.findIndex(i => {
                  return i === tag.name;
                });
                if (indexOfKeyword > -1) {
                  tag.id = menuKeywords[indexOfKeyword].id;
                }
                return tag;
              });
            }
            const shorthandTags = tags
              .map(i => i.shorthand)
              .filter(el => el != null);
            const keywords = JSON.parse(JSON.stringify(item.keywords));
            const displayName = item.displayName.toLowerCase();
            const tagMatchRaw = displayName.match(/\((.*?)\)/);
            const tagMatch = get(tagMatchRaw, '[1]');
            let relevantShortnameTag;
            if (tagMatch) {
              const tagIndex = shorthandTags.findIndex(i => i === tagMatch);
              relevantShortnameTag = tags[tagIndex];
            }
            let relevantKeywordTags = [];
            if (keywords && keywords.length) {
              relevantKeywordTags = tags.filter(tag =>
                keywords.includes(tag.id)
              );
            }
            const rawPayload = [
              relevantShortnameTag,
              ...relevantKeywordTags
            ].filter(el => el != null);
            const payload = rawPayload.reduce((unique, item) => {
              return unique.includes(item) ? unique : [...unique, item];
            }, []);
            return payload;
          } catch (error) {
            console.log(error);
          }
        };

        const foo = {
          ...i,
          ...i.product,
          ...flattedDictionaryProduct,
          icons
        };
        const icons = getIcons(foo);
        const bar = {
          ...foo,
          icons
        };
        return bar;
      });
      return payload;
    }
    return null;
  },
  getAllMenuItems(state, getters) {
    if (state.menu && state.menu.display && state.menu.display.displayGroups) {
      const menu = state.menu.display.displayGroups;
      const categories = menu.map(cat => {
        if (cat.items && cat.items.length) {
          const rawTabItems = cat.items;
          const tabItems = rawTabItems.filter(i => i.itemType === 'product');
          const payload = tabItems.map(i => {
            const productId = get(i, 'product.productId');
            const dictionaryProduct = getters.getProduct(productId);
            const DPDR = get(dictionaryProduct, 'displayRecords[0]');
            const flattedDictionaryProduct = {
              ...dictionaryProduct,
              ...DPDR
            };
            const getIcons = item => {
              try {
                const lightTags = {
                  id: iconTagsIDs.lighter,
                  shorthand: 'l',
                  name: 'light'
                };

                const newItemTags = {
                  id: iconTagsIDs.new,
                  shorthand: 'n',
                  name: 'new'
                };

                const newRecipeTags = {
                  id: iconTagsIDs.newRecipe,
                  shorthand: 'nr',
                  name: 'new-recipe'
                };

                const veganTags = {
                  id: iconTagsIDs.vegan,
                  shorthand: 'vg',
                  name: 'vegan'
                };

                const vegetarianTags = {
                  id: iconTagsIDs.vegetarian,
                  shorthand: 'v',
                  name: 'vegetarian'
                };

                const tags = [
                  veganTags,
                  vegetarianTags,
                  lightTags,
                  newItemTags,
                  newRecipeTags
                ];
                const menuKeywords = getters.getKeywords;
                if (menuKeywords && menuKeywords.length) {
                  tags.map(tag => {
                    const keywordsNames = menuKeywords.map(k => {
                      const name = k.name;
                      const newName = name.replace(/\s+/g, '-').toLowerCase();
                      return newName;
                    });
                    const indexOfKeyword = keywordsNames.findIndex(i => {
                      return i === tag.name;
                    });
                    if (indexOfKeyword > -1) {
                      tag.id = menuKeywords[indexOfKeyword].id;
                    }
                    return tag;
                  });
                }
                const shorthandTags = tags
                  .map(i => i.shorthand)
                  .filter(el => el != null);
                const keywords = JSON.parse(JSON.stringify(item.keywords));
                const displayName = item.displayName.toLowerCase();
                const tagMatchRaw = displayName.match(/\((.*?)\)/);
                const tagMatch = get(tagMatchRaw, '[1]');
                let relevantShortnameTag;
                if (tagMatch) {
                  const tagIndex = shorthandTags.findIndex(i => i === tagMatch);
                  relevantShortnameTag = tags[tagIndex];
                }
                let relevantKeywordTags = [];
                if (keywords && keywords.length) {
                  relevantKeywordTags = tags.filter(tag =>
                    keywords.includes(tag.id)
                  );
                }
                const rawPayload = [
                  relevantShortnameTag,
                  ...relevantKeywordTags
                ].filter(el => el != null);
                const payload = rawPayload.reduce((unique, item) => {
                  return unique.includes(item) ? unique : [...unique, item];
                }, []);
                return payload;
              } catch (error) {
                console.log(error);
              }
            };

            const foo = {
              ...i,
              ...i.product,
              ...flattedDictionaryProduct,
              icons
            };
            const icons = getIcons(foo);
            const bar = {
              ...foo,
              icons
            };
            return bar;
          });
          return {
            groupName: cat.groupName,
            items: payload
          };
        }
        return {
          groupName: cat.groupName,
          items: null
        };
      });
      return categories.filter(c => c.groupName !== 'Upsell');
    }
    return null;
  },
  getBasketLineSummary(state, getters) {
    const items = state.basket.lines.map(item => {
      return [
        getters.getProductSummary(item),
        ...getters.getChoiceSummary(item)
      ].filter(Boolean);
    });
    return [].concat.apply([], items);
  },
  getChoiceSummary(state, getters) {
    return item => {
      return (
        item.choiceLines &&
        item.choiceLines.length &&
        item.choiceLines.map(getters.getProductSummary).filter(Boolean)
      );
    };
  },
  getProductSummary(state, getters) {
    return item => {
      const meta = getters.getProduct(item.ingredientId);
      const productPrice =
        meta.portions && meta.portions.length && meta.portions[0].price;

      return {
        quantity: item.quantity,
        SKU: item.ingredientId,
        productName: (
          (meta.displayRecords &&
            meta.displayRecords.length &&
            meta.displayRecords[0].name) ||
          ''
        ).trim(),
        unitPrice: productPrice,
        unitPriceLessTax: getTotalLessTax(productPrice)
      };
    };
  },

  getAllRequiredSalesData(state) {
    return state.requiredSalesData;
  },
  getAlternativeTimeslots(state) {
    // get array of 4 closest available timeslots to the current timeslot
    const timeslotIndex = state.availableTimeslots.findIndex(
      timeslot => timeslot.time === state.requiredSalesData.timeslot
    );
    const indexedTimeslots = state.availableTimeslots.map((timeslot, index) => {
      return { ...timeslot, index };
    });
    indexedTimeslots.sort((a, b) => {
      return (
        Math.abs(timeslotIndex - a.index) - Math.abs(timeslotIndex - b.index)
      );
    });
    return indexedTimeslots.reduce((arr, timeslot) => {
      if (
        timeslot.available &&
        timeslot.time !== state.requiredSalesData.timeslot &&
        dayjs(timeslot.time).isAfter(dayjs().add(25, 'minute')) &&
        arr.length < 4
      ) {
        arr.push({ available: timeslot.available, time: timeslot.time });
      }
      return arr;
    }, []);
  },
  getAvailableTimeslots(state) {
    return state.availableTimeslots;
  },
  getBasket(state) {
    return state.basket;
  },
  getBasketCount(state) {
    return state.basket.lines.reduce(
      (sum, basketLine) => sum + basketLine.quantity,
      0
    );
  },
  getBasketIndex(state) {
    return lineItem => {
      return state.basket.lines.findIndex(basketItem => {
        return (
          basketItem.ingredientId === lineItem.ingredientId &&
          basketItem.portionTypeId === lineItem.portionTypeId &&
          compareChoiceArrays(basketItem.choiceLines, lineItem.choiceLines)
        );
      });
    };
  },
  getBasketIndexesFromIngredientId(state) {
    return productId => {
      return state.basket.lines.reduce((indexesArray, basketItem, index) => {
        if (
          basketItem.ingredientId === productId ||
          basketItem.choiceLines.find(
            choiceLine => choiceLine.ingredientId === productId
          )
        ) {
          return [...indexesArray, index];
        }
        return indexesArray;
      }, []);
    };
  },
  getBasketTotal(state, getters) {
    let total = state.basket.lines.reduce((sum, basketLine) => {
      const productDetails = getters.getProduct(basketLine.ingredientId);
      const itemPrice = productDetails.portions.find(
        portion => portion.id === basketLine.portionTypeId
      ).price;
      const choiceSum = basketLine.choiceLines.reduce((choiceSum, choice) => {
        const aztecChoice = getters.getProduct(choice.ingredientId);
        return (
          choiceSum +
          ((aztecChoice.portions &&
            aztecChoice.portions[0] &&
            aztecChoice.portions[0].price) ||
            0)
        );
      }, 0);
      return (
        sum + basketLine.quantity * itemPrice + basketLine.quantity * choiceSum
      );
    }, 0);
    total = total || 0;
    return total.toFixed(2);
  },
  getItemCount(state) {
    return productId =>
      state.basket.lines.reduce(
        (count, basketLine) =>
          basketLine.ingredientId === productId
            ? count + basketLine.quantity
            : count,
        0
      );
  },
  getChoices(state) {
    return productId =>
      state.menu.display.displayGroups.forEach(displayGroup => {
        displayGroup.items.forEach(item => {
          if (
            item.itemType === 'product' &&
            item.product.productId === productId
          ) {
            return item.product.choices;
          }
        });
      });
  },
  getChoiceGroup(state) {
    return groupId => {
      return state.choiceGroupsDictionary[groupId];
    };
  },
  getDisplayGroups(state) {
    const menu = state.menu;
    const menuGroups = get(menu, 'display.displayGroups');
    return menuGroups;
  },
  getDisplayGroupName(state) {
    return productId => {
      let category = null;
      state.menu &&
        state.menu.display &&
        state.menu.display.displayGroups &&
        state.menu.display.displayGroups.forEach(displayGroup => {
          displayGroup &&
            displayGroup.items &&
            displayGroup.items.forEach(item => {
              if (
                item.itemType === 'product' &&
                item.product &&
                item.product.productId === productId
              ) {
                category = displayGroup;
              }
            });
        });
      return category && category.groupName;
    };
  },
  getKeyWord(state) {
    return keywordId =>
      state.menu.display.keywords.find(keyword => {
        return keyword.id === keywordId;
      });
  },
  getKeywords(state) {
    const menu = state.menu;
    const keywords = get(menu, 'display.keywords');
    return keywords;
  },
  getLocation(state) {
    return state.location;
  },
  getMatchingBasketItemsChoicesAndPortions(state, getters) {
    return productId => {
      const basketItems = state.basket.lines.filter(basketLine => {
        return basketLine.ingredientId === productId;
      });
      return basketItems.map(item => {
        const itemDetail = {};
        const portions = getters.getProduct(productId).portions;
        if (portions.length > 1) {
          itemDetail.portion = portions.find(portionObject => {
            return portionObject.id === item.portionTypeId;
          }).name;
        }
        itemDetail.quantity = item.quantity;
        itemDetail.choices = item.choiceLines.map(choiceLine => {
          return {
            choiceName: getters.getChoiceGroup(choiceLine.choiceId)
              .displayRecords[0].name,
            selected: getters.getProduct(choiceLine.ingredientId)
              .displayRecords[0].name
          };
        });
        return itemDetail;
      });
    };
  },
  getMenu(state) {
    return state.menu;
  },
  getPrettyDate(state) {
    const date = dayjs(state.dateTime);
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');
    if (date > tomorrow.endOf('day') || date < today.startOf('day')) {
      return dayjs(state.booking.dateTime).format('DD/MM/YYYY');
    }
    if (date > today.endOf('day')) {
      return 'Tomorrow';
    }
    return 'Today';
  },
  getPrettyLocationQuery(state) {
    if (!state.location || !state.location.title) {
      return null;
    }
    return state.location.title;
  },
  getPreviousTransaction() {
    return state.previousTransaction;
  },
  getProduct(state) {
    return productId => {
      return state.productsDictionary[productId];
    };
  },
  getProductIcons(state) {
    return productId => {
      const product = state.productsDictionary[productId];
      const keywords =
        product && product.displayRecords.length && product.displayRecords[0]
          ? product.displayRecords[0].keywords
          : [];

      return keywords;
    };
  },
  getProductsDictionary(state) {
    return state.productsDictionary;
  },
  getZonalSiteId(state) {
    return state.location.zonalSiteId;
  },
  getSiteMeta(state) {
    return {
      siteId: state.requiredSalesData.siteId,
      salesAreaId: state.requiredSalesData.salesAreaId
    };
  },
  getTime(state) {
    return dayjs(state.requiredSalesData.timeslot).format('HH:mm');
  },
  getTimeslot(state) {
    return state.requiredSalesData.timeslot;
  },
  getUpsellProduct(state) {
    const upsellDisplayGroup = state.menu.display.displayGroups.find(
      displayGroup => {
        return displayGroup.groupName === 'Upsell';
      }
    );
    if (!upsellDisplayGroup) return false;
    const upsellProductObject = upsellDisplayGroup.items.find(item => {
      return item.itemType === 'product';
    });
    return upsellProductObject && upsellProductObject.product;
  },
  getUpsellImage(state) {
    const upsellDisplayGroup = state.menu.display.displayGroups.find(
      displayGroup => {
        return displayGroup.groupName === 'Upsell';
      }
    );
    if (!upsellDisplayGroup) return false;
    const upsellImageObject = upsellDisplayGroup.items.find(item => {
      return item.itemType === 'image';
    });
    return upsellImageObject && upsellImageObject.image.imageURL;
  },
  getVoucher(state) {
    return state.basket.voucherLines[0];
  },
  getValidVoucherApplied(state) {
    return state.validVoucherApplied;
  },
  gotAllRequiredSalesData(state) {
    return Object.values(state.requiredSalesData).filter(Boolean).length === 5;
  },
  isTimeslotInMoreThanFiveMinutes(state) {
    return dayjs(state.requiredSalesData.timeslot).isAfter(
      dayjs().add(5, 'minute')
    );
  },
  hasNecessaryDataToProceed(state, getters) {
    return (
      getters.getMenu &&
      getters.getLocation &&
      getters.gotAllRequiredSalesData &&
      getters.getAvailableTimeslots.length > 1
    );
  },
  upsellModalDisplayed(state) {
    return state.upsellModalDisplayed;
  },
  getUseCustomTimeslot(state) {
    return state.useCustomTimeslots;
  },
  getReservedTimeslotId(state) {
    return state.reservedTimeslotId;
  },
  isKerbsideEnabled(state) {
    return state.kerbsideEnabled;
  },
  getOptInMessage(state) {
    return state.optInMessage;
  }
};

export const mutations = {
  setCutlery(state, payload) {
    state.cutlery = payload;
  },
  setSearchQuery(state, query) {
    state.searchQuery = query;
  },
  setMenuTab(state, { tab }) {
    state.menuTab = tab;
    state.searchQuery = '';
  },
  setMenuTabItems(state, { items }) {
    state.menuTabItems = items;
  },
  initJourney(state) {
    state.requiredSalesData = {
      siteId: null,
      salesAreaId: null,
      menuId: null,
      serviceId: null,
      timeslot: null
    };
    state.availableTimeslots = [];
    state.productsDictionary = {};
    state.basket = {
      lines: [],
      voucherLines: []
    };
    state.validVoucherApplied = null;
    state.iOrderLocation = null;
    state.error = { heading: null, message: null };
    state.menu = { display: { displayGroups: [] } };
    state.upsellModalDisplayed = null;
    state.productsDictionary = {};
    state.choiceGroupsDictionary = {};
    state.config = getIorderHeaders(state.env, 'CC');
    state.kerbsideEnabled = false;
  },
  addLineItemToBasket(state, { lineItem }) {
    state.basket.lines.push(lineItem);
  },
  addUnavailableFlag(state, { basketItemIndex }) {
    state.basket.lines[basketItemIndex].unavailable = true;
  },
  addVoucherCodeToBasket(state, { voucherCode }) {
    state.basket.voucherLines.push({ voucherCode });
  },
  clearBasketMessages(state) {
    state.basket.lines.forEach(line => {
      if (line.messages) line.messages = [];
    });
  },
  clearVoucherLines(state) {
    state.basket.voucherLines = [];
  },
  decrementBasketItem(state, { basketItemIndex }) {
    state.basket.lines[basketItemIndex].quantity--;
  },
  editBasketChoices(state, { basketIndex, choicesArray }) {
    state.basket.lines[basketIndex].choiceLines = choicesArray;
  },
  incrementBasketItem(state, { basketItemIndex }) {
    state.basket.lines[basketItemIndex].quantity++;
  },
  removeLineItemFromBasket(state, { basketItemIndex }) {
    state.basket.lines.splice(basketItemIndex, 1);
  },
  setAllLocations(state, { locations }) {
    state.allLocations = locations;
  },
  setAvailableTimeslots(state, { availableTimeslots }) {
    state.availableTimeslots = availableTimeslots;
  },
  setBasket(state, { basket }) {
    state.basket = basket;
  },
  setBookingMeta(
    state,
    { name, email, siteId, dateTime, numPeople, bookingRef }
  ) {
    state.booking.name = name;
    state.booking.email = email;
    state.booking.siteId = siteId;
    state.booking.dateTime = dateTime;
    state.booking.numPeople = numPeople;
    state.booking.bookingRef = bookingRef;
  },
  setProductsDictionary(state, { productsDictionary }) {
    state.productsDictionary = productsDictionary;
  },
  setChoiceGroupsDictionary(state, { choiceGroupsDictionary }) {
    state.choiceGroupsDictionary = choiceGroupsDictionary;
  },
  setError(state, { heading, message }) {
    state.error = { heading, message };
  },
  setLocation(state, { location }) {
    state.location = location;
  },
  setMenu(state, { menu }) {
    state.menu = menu;
  },
  setMenuId(state, { menuId }) {
    state.requiredSalesData.menuId = menuId;
  },
  setServiceId(state, { serviceId }) {
    state.requiredSalesData.serviceId = serviceId;
  },
  setTableNumber(state, { tableNumber }) {
    state.requiredSalesData.tableNumber = tableNumber;
  },
  setTimeslot(state, { timeslot }) {
    state.requiredSalesData.timeslot = timeslot;
  },
  setTillMessage(state, { messages }) {
    state.basket.lines.forEach(line => {
      line.messages = messages;
    });
  },
  setSalesAreaId(state, { salesAreaId }) {
    state.requiredSalesData.salesAreaId = salesAreaId;
  },
  setUpsellModalDisplayed(state) {
    state.upsellModalDisplayed = true;
  },
  setValidVoucherApplied(state, { voucherDescription }) {
    state.validVoucherApplied = voucherDescription;
  },
  setZonalSiteId(state, { siteId }) {
    state.requiredSalesData.siteId = siteId;
  },
  setZonalVenuInfo(state, { restaurantData }) {
    state.iOrderLocation = restaurantData;
  },
  setUseCustomTimeslots(state, { useCustomTimeslots }) {
    state.useCustomTimeslots = useCustomTimeslots;
  },
  setReservedTimeslotId(state, { reservedTimeslotId }) {
    state.reservedTimeslotId = reservedTimeslotId;
  },
  setKerbsideEnabled(state, { enabled }) {
    state.kerbsideEnabled = enabled;
  },
  setOptInMessage(state, optInMessage) {
    state.optInMessage = optInMessage;
  }
};

export const actions = {
  setCutlery({ commit }, payload) {
    commit('setCutlery', payload);
  },
  setSearchQuery({ commit }, payload) {
    commit('setSearchQuery', payload);
  },
  setMenuTab({ commit }, tab) {
    commit('setMenuTab', { tab });
  },
  addItemToBasket(
    { state, commit, getters },
    { product, portionModifier, choicesArray }
  ) {
    const lineItem = {
      ingredientId: product.productId,
      portionTypeId: portionModifier || product.defaultPortionId,
      displayRecordId: product.displayRecordId,
      courseId: getters.getProduct(product.productId).defaultCourseId,
      quantity: 1,
      choiceLines: choicesArray || []
    };

    const matchIndex = getters.getBasketIndex(lineItem);

    if (matchIndex !== -1) {
      commit('incrementBasketItem', { basketItemIndex: matchIndex });
    } else {
      commit('addLineItemToBasket', { lineItem });
    }
  },

  applyVoucher({ state, commit }, { voucherCode }) {
    commit('addVoucherCodeToBasket', { voucherCode });
  },

  incrementBasketItem(
    { state, commit, getters },
    { product, quantity, choicesArray }
  ) {
    const lineItem = {
      ingredientId: product.id,
      portionTypeId: product.portions[0].id,
      displayRecordId: product.displayRecords[0].id,
      courseId: product.defaultCourseId,
      quantity: quantity,
      choiceLines: choicesArray || []
    };

    const matchIndex = getters.getBasketIndex(lineItem);

    if (matchIndex !== -1) {
      commit('incrementBasketItem', { basketItemIndex: matchIndex });
    } else {
      commit('addLineItemToBasket', { lineItem });
    }
  },

  clearBasket({ commit }) {
    commit('setBasket', { basket: { lines: [] } });
  },

  clearVoucher({ commit, dispatch }) {
    commit('clearVoucherLines');
    dispatch('setVoucherDescription', { voucherDescription: null });
  },

  editBasketChoices({ state, commit, getters }, { basketIndex, choicesArray }) {
    commit('editBasketChoices', { basketIndex, choicesArray });
  },

  indexMenu({ commit, state }, { menu }) {
    const productsDictionary = state.productsDictionary;
    const choiceGroupsDictionary = state.choiceGroupsDictionary;
    menu.aztec.products.forEach(product => {
      productsDictionary[product.id] = product;
    });
    menu.aztec.choiceGroups.forEach(choiceGroup => {
      choiceGroupsDictionary[choiceGroup.id] = choiceGroup;
    });
    commit('setProductsDictionary', { productsDictionary });
    commit('setChoiceGroupsDictionary', { choiceGroupsDictionary });
  },

  async initState({ commit }) {
    await commit('initJourney');
  },

  setIorderConfigs({ commit, state }) {
    commit(
      'iorderAuth/setIorderConfig',
      { config: state.config },
      { root: true }
    );
    commit(
      'iorderCheckout/setIorderConfig',
      { config: state.config },
      { root: true }
    );
  },

  markItemsUnavailable({ commit, state, getters }, { productId }) {
    const matchIndexes = getters.getBasketIndexesFromIngredientId(productId);

    matchIndexes.forEach(basketItemIndex => {
      commit('addUnavailableFlag', { basketItemIndex });
    });
  },

  removeItemFromBasket({ state, commit, getters }, { lineItem }) {
    const matchIndex = getters.getBasketIndex(lineItem);

    if (state.basket.lines[matchIndex].quantity > 1) {
      commit('decrementBasketItem', { basketItemIndex: matchIndex });
    } else {
      commit('removeLineItemFromBasket', { basketItemIndex: matchIndex });
    }
  },

  removeLastMatchingProductFromBasket({ state, commit }, { productId }) {
    const matchIndex = state.basket.lines.reduce(
      (lastIndex, basketItem, currentIndex) => {
        return basketItem.ingredientId === productId ? currentIndex : lastIndex;
      },
      0
    );

    if (state.basket.lines[matchIndex].quantity > 1) {
      commit('decrementBasketItem', { basketItemIndex: matchIndex });
    } else {
      commit('removeLineItemFromBasket', { basketItemIndex: matchIndex });
    }
  },

  setTillMessage({ commit, getters }) {
    const cutlery = getters.getCutlery ? 'Add cutlery' : 'No cutlery';
    const messages = ['Takeaway', cutlery];
    commit('clearBasketMessages');
    commit('setTillMessage', { messages });
  },

  showError({ commit, state }, { heading, message }) {
    commit('setError', { heading, message });
    this.app.router.push('/takeaway/error');
  },

  setNextTimeslot({ commit, getters, dispatch }) {
    const now = dayjs();
    const timeslots = getters.getAvailableTimeslots;

    const nextAvailableTimeslot = timeslots.find(timeslot => {
      return (
        timeslot.available && dayjs(timeslot.time).isAfter(now.add(5, 'minute'))
      );
    });

    if (nextAvailableTimeslot) {
      commit('setTimeslot', { timeslot: nextAvailableTimeslot.time });
    } else {
      dispatch('showError', {
        heading: 'Oops, sorry about that!',
        message:
          'No Click and Collect pickup times left for today. (code:noslots)'
      });
    }
  },

  setVoucherDescription({ state, commit }, { voucherDescription }) {
    commit('setValidVoucherApplied', { voucherDescription });
  },

  async validateVenueAndMenu({ commit, state, dispatch }, { siteId }) {
    console.log('Starting validation process');
    await dispatch('initState');

    // Handling config not initialized properly
    if (!state.config || !state.config.iOrderUrl || !state.config.headers) {
      return Promise.resolve({
        success: false,
        message: 'Headers not configured'
      });
    }

    const validRestaurantMeta = await dispatch('validateSiteId', { siteId });
    if (!validRestaurantMeta) {
      dispatch('showError', {
        heading: 'Oops, sorry about that!',
        message:
          'Click and Collect is currently unavailable for this restaurant. (code:restmeta)'
      });
      return Promise.resolve({
        success: false,
        message: 'Failed to validate restaurant'
      });
    }

    const hasTimeslots = await dispatch('validateTimeslots', {
      siteId: state.location.zonalSiteId
    });
    if (!hasTimeslots) {
      dispatch('showError', {
        heading: 'Oops, sorry about that!',
        message:
          'Click and Collect is currently unavailable for this restaurant. (code:sloterror)'
      });
      return Promise.resolve({
        success: false,
        message: 'Failed to find available timeslot'
      });
    }

    if (!state.location.enableClickAndCollect && state.location.covidOpen) {
      dispatch(
        'ui/flash',
        {
          message:
            'Oops, sorry about that! Click and Collect is currently unavailable for this restaurant.'
        },
        { root: true }
      );
      return Promise.resolve({
        success: false,
        message: 'Failed to validate restaurant'
      });
    }

    const validVenueAndMenu = await dispatch('getVenueAndMenu', {
      siteId: state.location.zonalSiteId
    });
    if (!validVenueAndMenu) {
      dispatch('showError', {
        heading: 'Oops, sorry about that!',
        message:
          'Click and Collect is unavailable at this time. (code:siteconfig)'
      });
      return Promise.resolve({
        success: false,
        message: 'Failed to get venue and menu'
      });
    }

    console.log('validation success');

    return Promise.resolve({
      success: true
    });
  },

  async getVenueAndMenu({ commit, state, dispatch }, { siteId }) {
    const gotRestaurant = await dispatch('getRestaurantInfo', { siteId });
    if (!gotRestaurant) {
      console.log('cant find zonal restaurant data');
      return Promise.resolve(false);
    }

    const gotMenuSummary = await dispatch('getMenuSummary', {
      siteId,
      salesAreaId: state.requiredSalesData.salesAreaId
    });
    if (!gotMenuSummary) {
      console.log('cant get menu summary ');
      return Promise.resolve(false);
    }

    const gotClickAndCollectMenu = await dispatch('getMenuData', {
      siteId,
      salesAreaId: state.requiredSalesData.salesAreaId,
      menuId: state.requiredSalesData.menuId
    });
    if (!gotClickAndCollectMenu) {
      console.log('cant get clickAndCollect menu data');
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  },

  async validateSiteId({ commit, state }, { siteId }) {
    return new Promise(resolve => {
      getRestaurantBySiteId({ data: { siteId } }).then(location => {
        if (!location.zonalSiteId || !location.slug) {
          return resolve(false);
        }
        commit('setLocation', { location });
        return resolve(true);
      });
    });
  },

  async validateTimeslots({ commit, state, getters, dispatch }, { siteId }) {
    return new Promise(resolve => {
      this.app.iOrder.getTimeslots(
        { siteId, config: state.config },
        async (err, res) => {
          if (err) {
            // dispatch('showError', { heading: 'Error finding timeslots for venue', message: err.detail});
            return resolve(false);
          } else if (res.response === 'Error') {
            // dispatch('showError', { heading: 'Error finding timeslots for venue', message: res.detail});
            return resolve(false);
          }

          let availableTimeslots = res.timeSlots.filter(slot => slot.available);
          if (getters.getUseCustomTimeslot) {
            availableTimeslots = await timeslotsApi.getAvailableTimeslots({
              locationId: siteId,
              timeslots: availableTimeslots
            });
          }
          if (!availableTimeslots.length) {
            console.log('no available timeslots');
            return resolve(false);
          }
          commit('setAvailableTimeslots', { availableTimeslots });
          if (!getters.getTimeslot)
            commit('setTimeslot', { timeslot: availableTimeslots[0].time });
          resolve(true);
        }
      );
    });
  },

  async reserveTimeslot(
    { commit, state, getters, dispatch },
    { siteId, timeslot }
  ) {
    return new Promise(resolve => {
      if (!getters.getUseCustomTimeslot) {
        return;
      }

      const reservationId = getters.getReservedTimeslotId;
      if (reservationId) {
        // If someone change timeslot after reservation - we're removing that reserved one from current cap (to make it available)
        dispatch('cancelTimeslotReservation', { siteId, reservationId });
      }
      timeslotsApi
        .reserveTimeslot({ locationId: siteId, selectedTimeslot: timeslot })
        .then(resp => {
          if (resp.success) {
            commit('setReservedTimeslotId', { reservedTimeslotId: resp.id });
            resolve(resp);
          } else {
            if (
              resp.message === 'That slot is already taken' ||
              resp.message === 'No more slots available for Today'
            ) {
              commit('setAvailableTimeslots', {
                availableTimeslots: resp.available
              });
              resolve(resp);
            }
          }
        });
    });
  },

  async cancelTimeslotReservation(
    { commit, state, getters, dispatch },
    { siteId, reservationId }
  ) {
    return new Promise(resolve => {
      if (!getters.getUseCustomTimeslot) resolve({ success: true });

      // delete timeslot
      timeslotsApi
        .deleteReservation({ locationId: siteId, reservationId })
        .then(resp => {
          if (resp.succes) resolve(resp);
        });
    });
  },

  async confirmTimeslot(
    { commit, state, getters, dispatch },
    { siteId, reservationId }
  ) {
    return new Promise(resolve => {
      if (!getters.getUseCustomTimeslot) resolve({ success: true });

      timeslotsApi
        .confirmReservation({ location: siteId, reservationId })
        .then(resp => {
          if (resp.success) resolve(resp);
        });
    });
  },

  async getMenuSummary(
    { state, getters, commit, dispatch },
    { siteId, salesAreaId }
  ) {
    return new Promise(resolve => {
      this.app.iOrder.getMenus(
        { siteId, salesAreaId, config: state.config },
        (err, res) => {
          if (err) {
            dispatch('showError', {
              heading: 'Error returning venue menus',
              message: err.detail
            });
            return resolve(false);
          } else if (res.response === 'Error') {
            dispatch('showError', {
              heading: 'Error returning venue menus',
              message: res.detail
            });
            return resolve(false);
          }
          const clickAndCollectMenu = res.menus.find(menu =>
            /takeaway/i.test(menu.name)
          );
          if (clickAndCollectMenu && clickAndCollectMenu.id) {
            commit('setMenuId', { menuId: clickAndCollectMenu.id });
            return resolve(true);
          } else {
            dispatch('showError', {
              heading: 'Error returning venue menus',
              message: 'Menu is incorrectly configured'
            });
            return resolve(false);
          }
        }
      );
    });
  },

  async getMenuData(
    { state, getters, commit, dispatch },
    { siteId, salesAreaId, menuId }
  ) {
    return new Promise(resolve => {
      this.app.iOrder.getMenuPages(
        { siteId, salesAreaId, menuId, config: state.config },
        (err, res) => {
          if (err) {
            dispatch('showError', {
              heading: 'Error returning menu data',
              message: err.detail
            });
            return resolve(false);
          } else if (res.response === 'Error') {
            dispatch('showError', {
              heading: 'Error returning menu data',
              message: res.detail
            });
            return resolve(false);
          }

          const canPlaceOrder = res.canPlaceOrder === 1;
          if (canPlaceOrder) {
            dispatch('indexMenu', { menu: res });
            delete res.aztec;
            commit('setMenu', { menu: res });
            return resolve(true);
          } else {
            return resolve(false);
          }
        }
      );
    });
  },

  getRestaurantInfo({ state, getters, commit, dispatch }, { siteId }) {
    return new Promise(resolve => {
      this.app.iOrder.getVenue({ siteId, config: state.config }, (err, res) => {
        if (err) {
          dispatch('showError', {
            heading: 'Error returning venue information',
            message: err.detail
          });
          return resolve(false);
        } else if (res.response === 'Error') {
          dispatch('showError', {
            heading: 'Error returning venue information',
            message: res.detail
          });
          return resolve(false);
        }

        if (!res.venues.length) {
          dispatch('showError', {
            heading: 'Error returning venue information',
            message: 'No venues returned for that siteId'
          });
          return resolve(false);
        }

        const venueService = res.services.find(service =>
          /click and collect/i.test(service.name)
        );
        const salesArea = res.venues[0].salesArea.find(area =>
          /mobile|mo downstairs/i.test(area.name)
        );
        const canPlaceOrder = res.venues[0].canPlaceOrder === 1;
        if (
          venueService &&
          venueService.id &&
          salesArea &&
          salesArea.id &&
          canPlaceOrder
        ) {
          commit('setServiceId', { serviceId: venueService.id });
          commit('setSalesAreaId', { salesAreaId: salesArea.id });
          commit('setZonalVenuInfo', { restaurantData: res.venues[0] });
          commit('setZonalSiteId', { siteId: res.venues[0].id });
          return resolve(true);
        } else {
          dispatch('showError', {
            heading: 'Error returning venue information',
            message: 'Service not available'
          });
          return resolve(false);
        }
      });
    });
  },

  async getValidTableNumbers(
    { state, getters, commit, dispatch },
    { siteId, salesAreaId }
  ) {
    return new Promise(resolve => {
      this.app.iOrder.getTables(
        { siteId, salesAreaId, config: state.config },
        (err, res) => {
          if (err) {
            dispatch('showError', {
              heading: 'Error returning table information',
              message: err.detail
            });
            return resolve(false);
          } else if (res.response === 'Error') {
            dispatch('showError', {
              heading: 'Error returning table information',
              message: res.detail
            });
            return resolve(false);
          }
          const tables = res.map(tableObject => tableObject.number);
          if (!tables.length) {
            dispatch('showError', {
              heading: 'Error returning table information',
              message: 'No open tables returned'
            });
            return resolve(false);
          }
          return resolve(tables);
        }
      );
    });
  },
  setOptInMessage({ commit }, message) {
    commit('setOptInMessage', message);
  }
};
