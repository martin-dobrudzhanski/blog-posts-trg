<template>
  <div data-component="modal-wrapper" v-if="isVisible" @click.self="close">
    <component
      :is="getModalComponent"
      :salesData="salesData"
      :success="success"
      :failure="failure"
      :discountCopy="discountCopy"
      :applicationName="applicationName"
      :tableNumber="tableNumber"
      :location="location"
      :alertsCode="alertsCode"
    ></component>
  </div>
</template>

<script>
import CheckoutModal from '@/components/iOrder/modals/CheckoutModal';

export default {
  props: [
    'headertext',
    'serviceid',
    'salesData',
    'success',
    'failure',
    'discountCopy',
    'applicationName',
    'location',
    'tableNumber',
    'alertsCode'
  ],
  components: {
    CheckoutModal
  },
  computed: {
    getModalComponent() {
      return this.$store.state.iorderCheckout.activeModal;
    },
    isVisible() {
      return this.$store.state.iorderCheckout.modalIsVisible;
    }
  },
  methods: {
    close() {
      this.$store.commit('iorderCheckout/hideModal');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='modal-wrapper'] {
  position: fixed;
  z-index: 99999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
