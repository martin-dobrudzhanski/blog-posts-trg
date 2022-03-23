<template>
  <div
    data-component="timeslot-display"
    @click.self="openTimepicker"
    :class="{
      'timeslot-display--disabled': !filteredTimeslots.length
    }"
  >
    <p data-element="text" @click.self="openTimepicker">
      Pick up time:
      <span data-element="timeslot" @click.self="openTimepicker">{{
        formattedTimeslot
      }}</span>
    </p>
    <p data-element="change-timeslot-link" @click.self="openTimepicker">
      Change
    </p>
    <ModalContainer v-if="showTimepicker" :closeModal="closeTimepicker">
      <TimePicker
        data-element="time-picker"
        :defaultTime="timeslot"
        :times="filteredTimeslots"
        :selectTime="selectTime"
      />
    </ModalContainer>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import ModalContainer from '~/components/iOrder-core/modalsV3/ModalContainer';
import TimePicker from '~/components/iOrder-core/modalsV3/TimePicker';

export default {
  props: ['timeslot', 'availableTimeslots', 'setTimeslot'],
  components: {
    TimePicker,
    ModalContainer
  },
  data() {
    return {
      showTimepicker: false
    };
  },
  computed: {
    formattedTimeslot() {
      if (!this.availableTimeslots || !this.availableTimeslots[0])
        return 'No Timeslots Available';
      if (this.timeslot === this.availableTimeslots[0].time) {
        return `${dayjs(this.timeslot).format('HH:mm')}`;
      } else {
        return dayjs(this.timeslot).format('HH:mm');
      }
    },
    filteredTimeslots() {
      return this.availableTimeslots.reduce((arr, timeslot) => {
        if (timeslot.available) arr.push(timeslot.time);
        return arr;
      }, []);
    }
  },
  methods: {
    openTimepicker() {
      const { filteredTimeslots } = this;
      if (filteredTimeslots.length) {
        document.body.setAttribute('data-modal', true);
        document.documentElement.setAttribute('data-modal', true);
        this.showTimepicker = true;
      }
    },
    closeTimepicker() {
      document.body.removeAttribute('data-modal');
      document.documentElement.removeAttribute('data-modal');
      this.showTimepicker = false;
    },
    selectTime(hour, minute) {
      const matchingTimeslot = this.filteredTimeslots.find(timeslot => {
        return (
          dayjs(timeslot).format('HH') === hour &&
          dayjs(timeslot).format('mm') === minute
        );
      });
      this.setTimeslot(matchingTimeslot);
      this.closeTimepicker();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='timeslot-display'] {
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $mac-and-cheese;
  color: $greyish-brown;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    cursor: pointer;
  }
  [data-element='text'] {
    font-family: $font;
    font-size: 18px;
    [data-element='timeslot'] {
      font-family: $navigation-font;
      font-size: 24px;
    }
  }
  [data-element='change-timeslot-link'] {
    font-family: $navigation-font;
    font-size: 14px;
    font-weight: normal;
    text-decoration: none;
    background-color: $greyish-brown;
    color: $white;
    padding: 0.25rem 0.5rem;
    border-radius: 24px;
  }
}
.timeslot-display--disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
