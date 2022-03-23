<template>
  <div data-component="modal-wrapper" v-if="isVisible" @click.self="close">
    <component :is="getModalComponent" />
  </div>
</template>

<script>
import LocationModal from '@/components/bookings/modals/LocationModal';
import DateModal from '@/components/bookings/modals/DateModal';
import TimeModal from '@/components/bookings/modals/TimeModal';
import AddEventModal from '@/components/bookings/modals/AddEventModal';

export default {
  components: {
    LocationModal,
    DateModal,
    TimeModal,
    AddEventModal,
  },
  computed: {
    getModalComponent() {
      return this.$store.state.booking.activeModal;
    },
    isVisible() {
      return this.$store.state.booking.modalIsVisible;
    },
  },
  methods: {
    close() {
      this.$store.commit('booking/hideModal');
    },
  },
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
