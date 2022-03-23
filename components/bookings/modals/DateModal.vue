<template>
  <div data-component="date-modal">
    <div data-element="row">
      <BaseButton data-element="date-btn" @click.native="selectToday">
        Today
      </BaseButton>
      <BaseButton data-element="date-btn" @click.native="selectTomorrow">
        Tomorrow
      </BaseButton>
    </div>
    <v-date-picker
      :is-inline="true"
      :show-day-popover="false"
      mode="single"
      @input="selectDate"
      :value="getDate"
      :theme-styles="themeStyles"
      :min-date="new Date()"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs';

import BaseButton from '@/components/buttons/BaseButton';

export default {
  name: 'DateModal',
  components: { BaseButton },
  data: () => ({
    themeStyles: {
      wrapper: {
        background: '#ffffff'
      },
      header: {
        color: '#0068a2',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '15px'
      },
      dayCellNotInMonth: {
        opacity: '0.4'
      },
      dayContent: {
        fontSize: '11px'
      },
      weekdays: {
        color: '#0068a2'
      }
    }
  }),
  computed: {
    getDate() {
      return this.$store.getters['booking/getDateObject'];
    }
  },
  methods: {
    selectToday() {
      const date = dayjs();
      this.$store.commit('booking/setDate', {
        year: date.year(),
        month: date.month(),
        date: date.date()
      });

      const currentTime = new Date();

      if (this.$store.getters['booking/getDateObject'] < currentTime) {
        const currentHour = currentTime.getHours();
        const nextHour = currentHour + 1;

        this.$store.commit('booking/setTime', {
          hour: nextHour,
          minute: 0
        });
      }
      this.handleDateChange();
    },
    selectTomorrow() {
      const date = dayjs().add(1, 'day');
      this.$store.commit('booking/setDate', {
        year: date.year(),
        month: date.month(),
        date: date.date()
      });
      this.handleDateChange();
    },
    selectDate(input) {
      this.$store.commit('booking/setDate', {
        year: input.getFullYear(),
        month: input.getMonth(),
        date: input.getDate()
      });

      const currentTime = new Date();
      if (this.$store.getters['booking/getDateObject'] < currentTime) {
        const currentHour = currentTime.getHours();
        const nextHour = currentHour + 1;

        this.$store.commit('booking/setTime', {
          hour: nextHour,
          minute: 0
        });
      }
      this.handleDateChange();
    },
    handleDateChange() {
      this.$store.dispatch('booking/getSessions');
      this.$store.commit('booking/clearAlternativeTimes');
      this.$store.commit('booking/hideModal');
      this.$store.commit('booking/resetUnavailableSessions');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='date-modal'] {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 299px;
  height: 360px;
  background-color: $white;
  border-radius: 0.375rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba($true-black, 0.5);
  padding: 16px;

  [data-element='row'] {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 15px;

    [data-element='date-btn'] {
      width: calc(50% - 7px);
    }
  }
}
</style>
