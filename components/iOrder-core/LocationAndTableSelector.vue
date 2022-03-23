<template lang="html">
  <div
    data-component="location-and-table-select"
  >
    <location-search
      :redirectToNearest="redirectToNearest"
      :getLocalRestaurants="getLocalRestaurants"
      :autoGeolocate="autoGeolocate"
      :restaurantName="restaurantName"
      :locationDisplayMode="locationDisplayMode"
      app="OAT"
    />
    <form
      data-element="table-number-form"
      @submit.prevent="handleSubmit(tableNumber)"
      :data-disabled="disableTableNumberField"
    >
      <label for="table-number-input" data-element="field-header">
        Enter your table number:
      </label>
      <div
        data-element="input-wrapper"
        :data-error="showError"
      >
        <input
          data-element="input"
          type="number"
          pattern="\d*"
          v-model="tableNumber"
          :disabled="disableTableNumberField"
        >
      </div>
      <sticky-footer backgroundColor="off-white" :verticallyResponsiveStaticToggle="true">
        <Btn
          data-element="table-number-submit"
          text="Let's go!"
          size="md"
          :inactive="!tableNumber"
          :loading="submitted"
          :verticallyResponsiveFullWidthToggle="true"
        />
      </sticky-footer>
      <p
        data-element="error-message"
        v-if="showError"
      >
        Please enter a valid table number
      </p>
    </form>
  </div>
</template>

<script>
  import Btn from '~/components/iOrder-core/uiV2/Btn'
  import LocationSearch from '~/components/iOrder-core/LocationSearch'
  import StickyFooter from '~/components/iOrder-core/uiV2/StickyFooter'

  export default {
    data () {
      return {
        tableNumber: null,
        locationQuery: null
      }
    },
    components: {
      Btn,
      LocationSearch,
      StickyFooter
    },
    props: [
      'autoGeolocate',
      'queryStringTableNumber',
      'handleSubmit',
      'submitted',
      'showError',
      'restaurantsList',
      'restaurantName',
      'locationDisplayMode',
      'disableTableNumberField'
    ],
    methods: {
      init () {
        if (this.queryStringTableNumber) this.tableNumber = this.queryStringTableNumber;
      },
      async redirectToNearest () {
        let closestLocations = null;
        try {
          closestLocations = await this.$store.dispatch('location/getLocalRestaurants', { restaurantList: this.restaurantsList });
        } catch (err) {
          this.$store.dispatch('ui/flash', {
            message: 'Hmm, we can\'t seem to find your location, please try searching for your location instead!'
          });
          return false;
        }
        if (closestLocations) {
          this.$store.commit('orderAtTable/setLocation', { location: closestLocations[0].fields });
          this.$router.push({
            path: `/restaurants/${closestLocations[0].fields.slug}/order`
          });
          return true;
        }
      },
      async getLocalRestaurants (query) {
        let localRestaurants = null;
        try {
          localRestaurants = await this.$store.dispatch('location/getLocalRestaurants', { restaurantList: this.restaurantsList, query });
        } catch (err) {
          this.$store.dispatch('ui/flash', {
            message: 'Hmm, we can\'t seem to find that location, please try again!'
          });
        }
        return localRestaurants;
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
  @import '~assets/css/iorder-core/form-row.scss';

  [data-component='location-and-table-select'] {
    background:transparent;
    [data-element='table-number-form'] {
      @extend .form-row;
      padding:8px;
      @media(min-width:346px) {
        padding:16px;
      }
      [data-element='field-header'] {
        margin-bottom:16px;
      }
      [data-element='table-number-submit'] {
        margin:8px 0;
      	@media only screen and (max-height:498px) {
			    position:static;
			    margin-top:40px;
		    }
      }
      [data-element='input-wrapper'] {
        &[data-error] {
          border-color:$scarlet;
        }
        [data-element='input'] {
          font-weight:bold;
          &:disabled {
            background-color:#fff;
          }
        }
      }
    }
  }
</style>
