<template>
  <div data-component="modal-wrapper" v-if="isVisible" @click.self="close">
    <component
      :is="getModalComponent"
      :guestLoginCallback="guestLoginCallback"
    ></component>
  </div>
</template>

<script>
import GuestLoginModal from '@/components/iOrder/modals/GuestLoginModal';
import LoginModal from '@/components/iOrder/modals/LoginModal';
import RegisterModal from '@/components/iOrder/modals/RegisterModal';
import ResetModal from '@/components/iOrder/modals/ResetModal';

export default {
  props: {
    guestLoginCallback: {
      type: Function,
      default: () => 1
    }
  },
  components: {
    GuestLoginModal,
    LoginModal,
    RegisterModal,
    ResetModal
  },
  computed: {
    getModalComponent() {
      return this.$store.state.iorderAuth.activeModal;
    },
    isVisible() {
      return this.$store.state.iorderAuth.modalIsVisible;
    }
  },
  methods: {
    close() {
      this.$store.dispatch('iorderAuth/hideModal');
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
  @include whenScreenIs(sm) {
    // max-width:328px;
  }
}
</style>
