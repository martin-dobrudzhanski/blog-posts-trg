import get from 'lodash.get';
import { getContent } from '~/libs/templateHelpers.js';
import meta from '~/mixins/meta';

export default {
  mixins: [meta],
  data: () => ({
    content: null
  }),
  async asyncData({ store, params, error }) {
    if (!params.slug) {
      if (
        store.state.booking.allLocations &&
        store.state.booking.allLocations.length
      ) {
        return;
      }
      return getContent(store, 'book', error);
    }
    return getContent(store, `book/${params.slug}`, error);
  },
  computed: {
    getAllLocations() {
      if (
        !this.content ||
        !this.content.restaurants ||
        !this.content.restaurants.fields ||
        !this.content.restaurants.fields.list
      ) {
        return [];
      }
      return this.content.restaurants.fields.list.filter(item => {
        return item.fields.enableBooking;
      });
    },
    getLocation() {
      if (
        !this.content ||
        !this.content.restaurant ||
        !this.content.restaurant.fields
      ) {
        return false;
      }
      return this.content.restaurant.fields;
    },
    getBookingRef() {
      if (!this.$route.params || !this.$route.params.bookingRef) {
        return false;
      }
      return this.$route.params.bookingRef;
    },
    bookingsHeaderImage() {
      return get(this.content, 'headerImage.fields', null);
    },
    mobileTiles() {
      return get(this.content, 'mobileTiles', []);
    },
    desktopTiles() {
      return get(this.content, 'desktopTiles', []);
    }
  },
  methods: {
    setAllLocations() {
      if (
        this.$store.state.booking.allLocations &&
        this.$store.state.booking.allLocations.length
      ) {
        return;
      }
      this.$store.commit('booking/setAllLocations', {
        locations: this.getAllLocations
      });
    },
    getRegionalTerms(location) {
      switch (location.region) {
        case 'Scotland':
          this.$store.commit('booking/setRegion', { region: 'Scotland' })
          return this.content.termsScotland;
          break
        case 'Wales':
          this.$store.commit('booking/setRegion', { region: 'Wales' })
          return this.content.termsWales;
          break
        case 'Northern Ireland':
          this.$store.commit('booking/setRegion', {
            region: 'Northern Ireland'
          })
          return this.content.termsNorthernIreland;
          break
        default:
          this.$store.commit('booking/setRegion', { region: 'England' })
          return this.content.termsEngland;
          break
      }
    },
    setLocation() {
      const location = this.getLocation;
      if (!location) {
        this.$store.commit('booking/setLocation', { location: null });
        return;
      }
      this.$store.commit('booking/setLocation', { location });
      this.$store.commit('booking/setRegionalTerms', {
        terms: this.getRegionalTerms(location)
      });
    },
    initState() {
      this.$store.dispatch('booking/initState');
    },
    initAdditionalCheckboxList() {
      try {
        const additionalCheckboxList = get(
          this.content,
          'additionalCheckboxList',
          []
        );
        const additionalCheckboxIds = [];
        const additionalCheckboxDict = {};

        for (let i = 0; i < additionalCheckboxList.length; i++) {
          const checkbox = additionalCheckboxList[i];
          const id = `${checkbox.sys.id}@${i}`;

          additionalCheckboxIds.push(id);
          additionalCheckboxDict[id] = {
            ...checkbox.fields,
            checked: false
          };
        }

        this.$store.commit('booking/setAdditionalCheckboxes', {
          additionalCheckboxIds,
          additionalCheckboxDict
        });
      } catch (error) {
        // eslint-disable-next-line
        console.error('Failed to init additional checkboxes');
      }
    },
    async setBookingRef() {
      if (this.getBookingRef) {
        this.$store.commit('booking/setBookingRef', {
          bookingRef: this.getBookingRef
        });
        await this.$store.dispatch('booking/getBooking', {
          bookingRef: this.getBookingRef
        });
      }
    },
    async init() {
      this.setAllLocations();
      this.setLocation();
      this.initAdditionalCheckboxList();
      this.initState();
      if (!this.locationOnly) {
        this.$store.dispatch('booking/getSessions');
      }
      await this.setBookingRef();
      if (this.content) {
        if (this.getLocation) {
          const dateTime = this.getLocation.afterCovidOpeningDate;
          dateTime && this.$store.commit('booking/setDateTime', { dateTime });
        }
        if (this.content.partyMaxSize) {
          this.$store.commit('booking/setNumPeopleMax', {
            numPeopleMax: this.content.partyMaxSize
          });
        }
        if (this.content.partyMaxSizeErrorMsg) {
          this.$store.commit('booking/setPartyMaxSizeErrorMsg', {
            errorMsg: this.content.partyMaxSizeErrorMsg
          });
        }
        this.$store.commit('booking/setSpecialOcassionOptions', {
          specialOcassionOptions: this.content.specialOccasions
        });
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.$store.dispatch('booking/setStateFromQuery');
  }
};
