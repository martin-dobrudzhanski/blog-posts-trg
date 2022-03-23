<template>
  <div data-component="time-modal">
    <div data-component="title-container">
      <div data-component="title">HH</div>
      <div data-component="title">mm</div>
    </div>
    <div ref="scrollersContainer" data-element="scrollers-container">
      <div data-element="list-container">
        <div data-element="list" class="hours-list" ref="hoursListContainer">
          <div data-element="list-element">
            <ul class="hours-list-element" ref="hoursListElement">
              <li
                data-element="option"
                v-for="hour in hours"
                class="individual-hour"
                :class="{
                  selected: isCurrent('hour', hour),
                  adjacent: isAdjacent('hour', hour, 1),
                }"
                @click="select('hour', hour)"
              >
                <p>{{ hour }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div data-element="list-container">
        <div
          data-element="list"
          class="minutes-list"
          ref="minutesListContainer"
        >
          <div data-element="list-element">
            <ul class="minutes-list-element" ref="minutesListElement">
              <li
                data-element="option"
                v-for="minute in minutes"
                class="individual-minute"
                :class="{
                  selected: isCurrent('minute', minute),
                  adjacent: isAdjacent('minute', minute, 15),
                }"
                @click="select('minute', minute)"
              >
                {{ minute }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div data-element="button-component-container">
      <BaseButton data-element="date-btn" @click.native="selectTime">
        OK
      </BaseButton>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import BaseButton from '@/components/buttons/BaseButton';

export default {
  components: {
    BaseButton,
  },
  data() {
    return {
      hours: [
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
      ],
      minutes: ['00', '15', '30', '45'],
      hour: '12',
      minute: '00',
      config: {},
      windowWidth: null,
    };
  },
  computed: {
    indexOfCurrentHour() {
      return this.hours.indexOf(this.hour);
    },
    indexOfCurrentMinute() {
      return this.minutes.indexOf(this.minute);
    },
    isMobileScreen() {
      return this.windowWidth < 992;
    },
    screenWidth() {
      return window.screen.width;
    },
    firstTimeslot() {
      return this.$store.getters['booking/getFirstTimeslot'];
    },
    lastTimeslot() {
      return this.$store.getters['booking/getLastTimeslot'];
    },
  },
  methods: {
    toHourMinuteString(number) {
      if (number.toString().length === 1) return `0${number}`;
      return number.toString();
    },
    getSelected(type, dataLabel, distanceFromTop, childElementHeight) {
      const numberIndex = (distanceFromTop / childElementHeight).toFixed(0);
      this[dataLabel] = this[type][numberIndex];
    },
    getWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    isCurrent(timeElement, time) {
      return this[timeElement] === time;
    },
    isAdjacent(timeElement, time, step) {
      return (
        parseInt(this[timeElement]) + step === parseInt(time) ||
        parseInt(this[timeElement]) - step === parseInt(time)
      );
    },
    select(timeElement, time) {
      this[timeElement] = time;
      this.setScrollHeight('hours');
      this.setScrollHeight('minutes');
    },
    selectTime() {
      this.$store.commit('booking/clearAlternativeTimes');
      this.$store.commit('booking/setTime', {
        hour: this.hour,
        minute: this.minute,
      });
      this.$store.commit('booking/hideModal');
    },
    setAvailableSlots() {
      this.hours = [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
      ];
      const firstHour = dayjs(this.firstTimeslot).format('HH');
      const lastHour = dayjs(this.lastTimeslot).format('HH');
      let filteredHours = this.hours.filter((hour) => {
        return parseInt(hour) >= firstHour && parseInt(hour) <= lastHour;
      });
      if (
        new Date(this.$store.state.booking.dateTime).setHours(0, 0, 0, 0) ===
        new Date().setHours(0, 0, 0, 0)
      ) {
        const timeNow = new Date();
        filteredHours = filteredHours.filter((hour) => {
          return hour >= timeNow.getHours() + 1;
        });
      }
      this.hours = filteredHours;
    },
    setOnlyDisplayAvailableMinutes() {
      let scrollTimeout = null;
      const firstMinutes = dayjs(this.firstTimeslot).format('mm');
      if (
        new Date(this.$store.state.booking.dateTime).setHours(0, 0, 0, 0) !==
        new Date().setHours(0, 0, 0, 0)
      ) {
        this.minutes = ['00', '15', '30', '45'].filter((minutesSet) => {
          return parseInt(minutesSet) >= firstMinutes;
        });
      }
      const lastMinutes = dayjs(this.lastTimeslot).format('mm');

      this.$refs.hoursListContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
          if (firstMinutes === 0 || lastMinutes < 45) {
            if (
              this.hour === this.hours[0] &&
              new Date(this.$store.state.booking.dateTime).setHours(
                0,
                0,
                0,
                0
              ) !== new Date().setHours(0, 0, 0, 0)
            ) {
              this.minutes = ['00', '15', '30', '45'].filter((minutesSet) => {
                return parseInt(minutesSet) >= firstMinutes;
              });
              this.minute = this.minutes[0];
              this.setScrollHeight('minutes');
            } else if (this.hour === this.hours[this.hours.length - 1]) {
              this.minutes = ['00', '15', '30', '45'].filter((minutesSet) => {
                return parseInt(minutesSet) <= lastMinutes;
              });
              this.minute = this.minutes[0];
              this.setScrollHeight('minutes');
            } else if (this.minutes.length !== 4) {
              this.minutes = ['00', '15', '30', '45'];
              this.minute = this.minutes[0];
              this.setScrollHeight('minutes');
            }
          }
        }, 75);
      });
    },
    setSlotOnLoad() {
      if (
        this.hours[0] > new Date(this.$store.state.booking.dateTime).getHours()
      ) {
        this.hour = this.hours[0];
      } else if (
        new Date(this.$store.state.booking.dateTime).setHours(0, 0, 0, 0) ===
        new Date().setHours(0, 0, 0, 0)
      ) {
        if (
          this.$store.state.booking.dateTime.getHours() >
          this.toHourMinuteString(new Date().getHours())
        ) {
          this.hour = this.toHourMinuteString(
            new Date(this.$store.state.booking.dateTime).getHours()
          );
          this.minute = this.toHourMinuteString(
            new Date(this.$store.state.booking.dateTime).getMinutes()
          );
        } else {
          this.hour = this.toHourMinuteString(new Date().getHours() + 1);
        }
      } else {
        this.hour =
          this.toHourMinuteString(
            new Date(this.$store.state.booking.dateTime).getHours()
          ) || '12';
        this.minute =
          this.toHourMinuteString(
            new Date(this.$store.state.booking.dateTime).getMinutes()
          ) || '00';
      }
    },
    setScrollTop(type, scrollHeight) {
      if (type === 'hours') {
        const heightToSet = this.indexOfCurrentHour * scrollHeight;
        return heightToSet;
      } else if (type === 'minutes') {
        const heightToSet = this.indexOfCurrentMinute * scrollHeight;
        return heightToSet;
      }
    },
    setScrollHeight(type) {
      const childElementHeight =
        this.config[type].listElement.children[0].scrollHeight;
      this.config[type].listContainer.scrollTop = this.setScrollTop(
        type,
        childElementHeight
      );
    },
    setSelecting(type) {
      this.config[type].listContainer.addEventListener('scroll', () => {
        const distanceFromTop = this.config[type].listContainer.scrollTop;
        const childElementHeight =
          this.config[type].listElement.children[0].scrollHeight;
        const distanceFromPreviousItem = distanceFromTop % childElementHeight;
        this.getSelected(
          type,
          this.config[type].selectedDataLabel,
          distanceFromTop,
          childElementHeight
        );
      });
    },
    setSnapping(type) {
      let transformAmount = 0;
      let scrollTimeout = null;
      const childElementHeight =
        this.config[type].listElement.children[0].scrollHeight;

      this.config[type].listContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
          const distanceFromTop = this.config[type].listContainer.scrollTop;
          const distanceFromPreviousItem = distanceFromTop % childElementHeight;
          transformAmount = 0;
          if (distanceFromPreviousItem > childElementHeight / 2) {
            transformAmount = distanceFromPreviousItem - childElementHeight;
          } else {
            transformAmount = distanceFromPreviousItem;
          }
          this.config[
            type
          ].listElement.style.transform = `translate(0,${transformAmount}px)`;
          const newDistanceFromTop = distanceFromTop - transformAmount;
        }, 50);
      });
    },
  },
  mounted() {
    this.config = {
      hours: {
        listContainer: this.$refs.hoursListContainer,
        listElement: this.$refs.hoursListElement,
        selectedDataLabel: 'hour',
      },
      minutes: {
        listContainer: this.$refs.minutesListContainer,
        listElement: this.$refs.minutesListElement,
        selectedDataLabel: 'minute',
      },
    };

    this.setAvailableSlots();
    this.setSlotOnLoad();
    this.getWindowWidth();
    this.setScrollHeight('hours');
    this.setScrollHeight('minutes');

    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });

    this.setSnapping('hours');
    this.setSelecting('hours');
    this.setSnapping('minutes');
    this.setSelecting('minutes');
    this.setOnlyDisplayAvailableMinutes();
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

$selected-element: 35px;

[data-component='time-modal'] {
  position: relative;
  height: 286px;
  width: 300px;
  display: flex;
  flex-direction: column;
  margin: 20px;
  padding-top: 20px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  [data-component='title-container'] {
    display: none;
    [data-component='title'] {
      color: $black;
      font-family: tt-norms;
      font-size: 16px;
      opacity: 0.3;
      padding-bottom: 16px;
      text-align: center;
      width: 50%;
    }
  }
  [data-element='scrollers-container'] {
    display: flex;
    justify-content: center;
    [data-element='list-container'] {
      background-color: transparent;
      position: relative;
      overflow: hidden;
      height: 175px;
      width: 100px;
      -ms-overflow-style: none;
      [data-element='list'] {
        background-color: transparent;
        overflow: hidden;
        overflow-x: hidden;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        [data-element='list-element'] {
          height: 175px;
          width: 100px;
          ul {
            overflow: scroll;
            padding-top: $selected-element * 2;
            padding-bottom: $selected-element * 2;
            transition: all 0.1s ease-in-out;
            [data-element='option'] {
              display: flex;
              align-items: center;
              color: #d8d8d8;
              font-size: 14px;
              justify-content: center;
              height: $selected-element;
              text-align: center;
              opacity: 0.7;
              transition: color 0.2s ease;
              &.selected {
                color: $black;
                font-size: 23px;
                opacity: 1;
              }
              &.adjacent {
                color: #d8d8d8;
                font-size: 18px;
                opacity: 0.85;
              }
            }
          }
        }
      }
    }
  }
  [data-element='button-component-container'] {
    margin: 0 11px 11px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
}
</style>
