<template>
  <div class="modal-wrapper" v-if="$store.state.ui.modalIsVisible">
    <template v-if="!isLocationService">
      <div class="modal-container">
        <img
          class="close"
          src="~assets/img/generic/icon-close.svg"
          alt="close icon"
          @click="close"
        />
        <div class="header">
          <h1 class="heading" data-size="xl" data-weight="black">
            {{ getModalOptions.heading }}
          </h1>
        </div>
        <div class="content">
          <component
            :is="getModalComponent"
            :close="close"
            :location="getModalOptions.location"
          />
        </div>
      </div>
    </template>
    <component
      v-else
      :is="getModalComponent"
      :close="close"
      :heading="getModalOptions.heading"
    />
  </div>
</template>

<script>
import AllergyAdvice from '@/components/ui/modals/AllergyAdvice';
import OfferTerms from '@/components/ui/modals/OfferTerms';
import LocationServices from '@/components/ui/modals/LocationServices';
import OptIn from '@/components/ui/modals/OptIn';
import DeliveryOptionsModal from '@/components/restaurant/DeliveryOptionsModal';
import BookingDisabled from '@/components/ui/modals/BookingDisabled';
import { get } from 'lodash';

export default {
  props: ['heading', 'location'],
  components: {
    AllergyAdvice,
    OfferTerms,
    LocationServices,
    OptIn,
    DeliveryOptionsModal,
    BookingDisabled,
  },
  computed: {
    getModalComponent() {
      return this.$store.state.ui.activeModal;
    },
    getModalOptions() {
      return get(this, '$store.state.ui.modalOptions') || {};
    },
    isLocationService() {
      return this.$store.state.ui.activeModal === 'LocationServices';
    }
  },
  methods: {
    close() {
      const callback = this.$store.state.ui.modalOptions.cb;
      if (typeof callback == 'function') {
        callback();
      }
      this.$store.commit('ui/hideModal');
    },
  },
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.modal-wrapper {
  position: fixed;
  z-index: 99999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.5);
  .modal-container {
    position: relative;
    width: 100%;
    margin: 32px 16px;
    padding-bottom: 32px;
    background-color: $rebrand-very-light-pink;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    @include whenScreenIs(mdx) {
      width: 720px;
    }
    img.close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .header {
      padding: 0 16px;
      display: flex;
      justify-content: center;
      h1 {
        max-width: 560px;
        margin: 40px 0 0;
        color: $rebrand-orange;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        font-size: 20px;
        @include whenScreenIs(mdx) {
          font-size: 28px;
        }
      }
    }
    .content {
      margin: 24px 0 0;
      padding: 0 16px;
      text-align: left;
      box-sizing: border-box;
      @include whenScreenIs(mdx) {
        padding: 0 80px;
      }
      p,
      label {
        &:not(.heading) {
          font-size: 13px;
          line-height: 1.4;
        }
      }
      p {
        width: 100%;
        margin-bottom: 16px;
      }
      .btn {
        margin-top: 8px;
      }
    }
  }
}
</style>
