<template>
  <div data-component="user-details">
    <div data-element="form-wrapper">
      <div data-component="booking-summary-container">
        <BookingSummary />
      </div>
      <div data-element="user-form">
        <div
          data-element="form-row"
          v-if="!disableDetailsEdit"
          :data-disabled="disableDetailsEdit"
        >
          <p data-element="field-header">What's your name?</p>
          <div data-element="input-wrapper">
            <input
              data-element="input"
              placeholder="Your name"
              v-model="name"
              v-validate="'required'"
              name="name"
            />
            <Icon
              data-component="icon"
              data-position="left"
              v-if="getIcon('name')"
              :icon="getIcon('name')"
              size="sm"
            />
          </div>
          <div data-element="error-message">
            {{ errors.first('name') }}
          </div>
        </div>
        <div
          data-element="form-row"
          v-if="!disableDetailsEdit"
          :data-disabled="!isCompleted('name')"
        >
          <p data-element="field-header">Email</p>
          <div data-element="input-wrapper">
            <input
              data-element="input"
              placeholder="Your email"
              v-model="email"
              v-validate="'required|email'"
              name="email"
              type="email"
            />
            <Icon v-if="getIcon('email')" :icon="getIcon('email')" size="sm" />
          </div>
          <div data-element="error-message">
            {{ errors.first('email') }}
          </div>
        </div>
        <div
          data-element="form-row"
          v-if="!disableDetailsEdit"
          :data-disabled="!isCompleted('email')"
        >
          <p data-element="field-header">Mobile phone number</p>
          <div data-element="input-wrapper">
            <input
              data-element="input"
              placeholder="Your phone number"
              v-model="tel"
              v-validate="'verify_mobile_number'"
              name="tel"
              type="tel"
            />
            <Icon v-if="getIcon('tel')" :icon="getIcon('tel')" size="sm" />
          </div>
          <div data-element="error-message">
            {{ errors.first('tel') }}
          </div>
        </div>
        <div data-element="form-row">
          <p data-element="field-header">Special requests?</p>
          <div data-element="input-wrapper">
            <BaseSelect
              placeholder="Select occasion (Optional)"
              :value="specialOccasion"
              :options="specialOcassionOptions"
              @change="(option) => changeSpecialRequest(option)"
            />
          </div>
          <div data-element="error-message">
            {{ errors.first('request') }}
          </div>
        </div>
        <div data-element="form-row">
          <div data-element="textarea-wrapper">
            <div data-element="remaining-characters">
              <p>{{ getSpecialRequestRemainingChars }}</p>
            </div>
            <textarea
              data-element="textarea"
              v-model="specialRequest"
              placeholder="Additional requests; wheelchair, highchair needed, etc. (Optional)"
              :maxlength="$store.state.booking.specialRequestMaxLength"
            ></textarea>
          </div>
        </div>
        <div data-element="form-row" :data-disabled="disableCheckboxes">
          <BaseCheckbox :required="true" v-model="termsCheckbox">
            {{ termsLabel }}
            <BaseLink :to="termsLink.url">{{ termsLink.text }}</BaseLink>
          </BaseCheckbox>
        </div>

        <!-- Custom dynamic checkbox list -->
        <div
          v-for="checkbox in additionalCheckboxesArray"
          :key="checkbox.id"
          data-element="form-row"
          :data-disabled="disableCheckboxes"
        >
          <BaseCheckbox
            :required="true"
            :value="checkbox.checked"
            :label="checkbox.label"
            @change="
              (checked) =>
                toggleAdditionalCheckbox({ id: checkbox.id, checked })
            "
          />
        </div>

        <div data-element="form-row" :data-disabled="disableCheckboxes">
          <BaseCheckbox
            v-if="regionSpecificTerms"
            :label="regionSpecificTerms"
            :required="true"
            v-model="regionSpecificTermsCheckbox"
          />
        </div>
        <div data-element="form-row" :data-disabled="disableCheckboxes">
          <BaseCheckbox
            :label="marketingLabel"
            :required="true"
            v-model="marketingLabelCheckbox"
          />
        </div>
        <BookingFooter
          user-details
          :isSubmitBtnActive="isSubmitBtnActive"
          :termsAndConditionsMissing="termsAndConditionsMissing"
          @updateBooking="updateBooking"
          @createBooking="createBooking"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import BookingFooter from '~/components/bookings/ui/BookingFooter';
import BookingSummary from '~/components/bookings/BookingSummary.vue';
import BaseCheckbox from '~/components/ui/BaseCheckbox';
import BaseSelect from '~/components/ui/BaseSelect.vue';
import BaseLink from '~/components/ui/BaseLink';
import Icon from '~/components/bookings/ui/Icon';

export default {
  name: 'UserDetails',
  data: () => ({
    charLimit: 200,
    specialReqLabel: 'Add a special request?',
    marketingLabel:
      'We would like to contact you with discounts and news. If you do not wish to receive these, please tick here.',
    termsLabel:
      'To continue, please confirm you have read and accepted all of our',
    name: '',
    email: '',
    tel: '',
    specialRequest: '',
    specialOccasion: null,
  }),
  components: {
    BaseCheckbox,
    BaseSelect,
    BaseLink,
    BookingFooter,
    BookingSummary,
    Icon,
  },
  props: {
    disableDetailsEdit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('booking', {
      additionalCheckboxesArray: 'getAdditionalCheckboxesArray',
      specialOcassionOptions: 'getSpecialOccasionOptions',
    }),
    termsCheckbox: {
      get() {
        return this.$store.state.booking.acceptTerms;
      },
      set() {
        this.$store.commit('booking/toggleAcceptTerms');
      },
    },
    regionSpecificTermsCheckbox: {
      get() {
        return this.$store.state.booking.acceptRegionalTerms;
      },
      set() {
        this.$store.commit('booking/toggleAcceptRegionalTerms');
      },
    },
    marketingLabelCheckbox: {
      get() {
        return this.$store.state.booking.marketingOptOut;
      },
      set() {
        this.$store.commit('booking/toggleMarketingOptOut');
      },
    },
    termsLink() {
      return {
        text: 'terms and conditions',
        url: this.$store.state.booking.termsAndConditionsUrl,
      };
    },
    regionSpecificTerms() {
      return this.$store.getters['booking/getRegionalTerms'] || false;
    },
    isSubmitBtnActive() {
      if (
        this.regionSpecificTerms &&
        !this.$store.state.booking.acceptRegionalTerms
      ) {
        return false;
      }
      if (
        this.additionalCheckboxesArray.some((checkbox) => !checkbox.checked)
      ) {
        return false;
      }
      if (this.disableDetailsEdit && this.$store.state.booking.acceptTerms) {
        return true;
      }
      if (
        !this.name ||
        !this.email ||
        !this.tel ||
        !this.$store.state.booking.acceptTerms
      ) {
        return false;
      }
      if (
        this.errors.first('name') ||
        this.errors.first('email') ||
        this.errors.first('tel')
      ) {
        return false;
      }

      return true;
    },
    getBookingRefFromUrl() {
      if (!this.$route.params || !this.$route.params.bookingRef) {
        return false;
      }
      return this.$route.params.bookingRef;
    },
    disableCheckboxes() {
      if (this.disableDetailsEdit) {
        return false;
      }
      return !this.isCompleted('tel');
    },
    getSpecialRequestRemainingChars() {
      const maxLength = this.$store.state.booking.specialRequestMaxLength;
      const remaining = maxLength - this.getSpecialRequestLength;
      return `${remaining}/${maxLength}`;
    },
    getSpecialRequestLength() {
      if (!this.specialRequest) {
        return 0;
      }
      return this.specialRequest.length;
    },
    termsAndConditionsMissing() {
      if (
        this.errors.first('name') ||
        this.errors.first('email') ||
        this.errors.first('tel')
      ) {
        return false;
      }
      if (
        this.name &&
        this.email &&
        this.tel &&
        !this.$store.state.booking.acceptTerms
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapMutations('booking', ['toggleAdditionalCheckbox']),
    getIcon(fieldName) {
      if (!this[fieldName]) {
        return false;
      }
      if (this.errors.first(fieldName)) {
        return 'cross-circle';
      }
      return 'check-circle';
    },
    isCompleted(field) {
      return !this.errors.first(field) && this[field];
    },
    setInitialValues() {
      this.name = this.$store.state.booking.name;
      this.email = this.$store.state.booking.email;
      this.tel = this.$store.state.booking.tel;
      this.specialRequest = this.$store.state.booking.specialRequest;
    },
    setValues() {
      this.$store.commit('booking/setName', { name: this.name });
      this.$store.commit('booking/setEmail', { email: this.email });
      this.$store.commit('booking/setTel', { tel: this.tel });
      this.$store.commit('booking/setSpecialRequest', {
        specialRequest: this.specialRequest,
      });
      this.$store.commit('booking/setSpecialOccasion', {
        specialOccasion: this.specialOccasion,
      });
    },
    changeSpecialRequest(ocassion) {
      this.specialOccasion = ocassion;
    },
    createBooking() {
      this.setValues();
      this.$store.dispatch('booking/createBooking');
    },
    updateBooking() {
      this.setValues();
      this.$store.dispatch('booking/updateBooking');
    },
  },
  mounted() {
    this.setInitialValues();
    // if this is not the amend journey
    if (!this.getBookingRefFromUrl) {
      // if we have a booking ref in store
      if (this.$store.state.booking.bookingRef) {
        // go from user details to the booking details
        this.$router.push(
          `/restaurants/${this.$store.getters['booking/getRestaurantSlug']}/book`
        );
        return;
      }
    }
    if (!this.$store.state.booking.bookingDetailsComplete) {
      // if this is not the amend journey
      if (!this.getBookingRefFromUrl) {
        this.$router.push(
          `/restaurants/${this.$store.getters['booking/getRestaurantSlug']}/book`
        );
        return;
      }
      this.$router.push(
        `/restaurants/${this.$store.getters['booking/getRestaurantSlug']}/book/amend/${this.$store.state.booking.bookingRef}`
      );
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/bookings/form-row.scss';

[data-component='user-details'] {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background: $light-pink;
  padding-top: 24px;
  margin: 0 auto;
  margin-bottom: 5rem;

  @include whenScreenIs(xs) {
    max-width: $max-width-tablet;
  }

  @include whenScreenIs(sm) {
    max-width: $max-width-tablet;
  }

  @include whenScreenIs(mdx) {
    max-width: $max-width-mdesktop;
  }

  @include whenScreenIs(lg) {
    max-width: $max-width-desktop;
  }
  [data-element='form-wrapper'] {
    width: 100%;

    @include whenScreenIs(mdx) {
      max-width: 52rem;
    }

    @include whenScreenIs(sm) {
      display: flex;
      flex-direction: row;
    }

    [data-component='booking-summary-container'] {
      @include whenScreenIs(sm) {
        display: block;
        width: 50%;
      }
    }
    [data-element='user-form'] {
      padding: 0 16px 0;
      min-width: 370px;
      margin: 0 auto;
      @include whenScreenIs(xs) {
        width: 50%;
        padding-top: 30px;
        width: 328px;
      }

      @include whenScreenIs(sm) {
        width: 50%;
        padding-top: 30px;
      }
    }
  }
  [data-element='form-row'] {
    @extend .form-row;
    [data-element='input-wrapper'] {
      position: relative;
      [data-component='icon'] {
        position: absolute;
        right: 8px;
        top: 12px;
      }
    }
    [data-element='textarea-wrapper'] {
      position: relative;
      padding-top: 11px;
      border-radius: 7px;
      overflow: hidden;
      background: $white;
      width: 100%;
      @include whenScreenIs(xs) {
        width: 328px;
      }
      @include whenScreenIs(mdx) {
        min-width: 370px;
      }
      [data-element='textarea'] {
        border: none;
        font-family: $font;
        font-size: 14px;
        color: $greyish-brown;
        padding: 9px;
        resize: none;
      }
      [data-element='remaining-characters'] {
        position: absolute;
        top: 0;
        right: 0;
        color: #b2b2b2;
        font-size: 12px;
        font-weight: 500;
        padding: 4px 4px 0 0;
      }
    }
  }
}
</style>
