<template>
  <div data-component="time-picker">
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
                  selected: isCurrent('selectedHour', hour),
                  adjacent: isAdjacent('hours', selectedHour, hour),
                }"
                @click="select('selectedHour', hour)"
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
            <ul
              class="minutes-list-element"
              ref="minutesListElement"
              :style="startPosition"
            >
              <li
                data-element="option"
                v-for="minute in minutes"
                class="individual-minute"
                :class="{
                  selected: isCurrent('selectedMinute', minute),
                  adjacent: isAdjacent('minutes', selectedMinute, minute),
                }"
                @click="select('selectedMinute', minute)"
              >
                {{ minute }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div data-element="button-component-container">
      <btn
        text="OK"
        @click.native="selectTime(selectedHour, selectedMinute)"
      ></btn>
    </div>
  </div>
</template>

<script>
import Btn from '~/components/bookings/ui/Btn';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      formattedTimeslots: [],
      hours: [],
      minutes: [],
      selectedHour: '12',
      selectedMinute: '00',
      config: {},
      windowWidth: null,
    };
  },
  components: {
    Btn,
  },
  props: ['times', 'defaultTime', 'selectTime'],
  computed: {
    indexOfCurrentHour() {
      return this.hours.indexOf(this.selectedHour);
    },
    indexOfCurrentMinute() {
      return this.minutes.indexOf(this.selectedMinute);
    },
    isMobileScreen() {
      return this.windowWidth < 992;
    },
    screenWidth() {
      return window.screen.width;
    },
    startPosition() {
      return {
        scrollTop: `${this.indexOfCurrentMinute * 35}px`,
      };
    },
  },
  methods: {
    init() {
      this.config = {
        hours: {
          listContainer: this.$refs.hoursListContainer,
          listElement: this.$refs.hoursListElement,
          selectedDataLabel: 'selectedHour',
        },
        minutes: {
          listContainer: this.$refs.minutesListContainer,
          listElement: this.$refs.minutesListElement,
          selectedDataLabel: 'selectedMinute',
        },
      };

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
      this.setMinutesHandling();
    },
    getSelected(type, dataLabel, distanceFromTop) {
      const numberIndex = (distanceFromTop / 35).toFixed(0);
      this[dataLabel] = this[type][numberIndex];
    },
    getWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    isAdjacent(type, shortTimeString1, shortTimeString2) {
      return (
        parseInt(this[type].indexOf(shortTimeString1)) ===
          parseInt(this[type].indexOf(shortTimeString2)) + 1 ||
        parseInt(this[type].indexOf(shortTimeString1)) ===
          parseInt(this[type].indexOf(shortTimeString2)) - 1
      );
    },
    isCurrent(timeElement, time) {
      return this[timeElement] === time;
    },
    select(timeElement, time) {
      this[timeElement] = time;
      this.setScrollHeight('hours');
      this.setScrollHeight('minutes');
    },
    setAvailableSlots() {
      const timeslotsArray = this.times.reduce((arr, timeslot) => {
        arr.push({
          hour: dayjs(timeslot).format('HH'),
          minute: dayjs(timeslot).format('mm'),
        });
        return arr;
      }, []);
      this.formattedTimeslots = timeslotsArray;
      this.hours = timeslotsArray.reduce((hoursArray, formattedTimeslot) => {
        if (!hoursArray.includes(formattedTimeslot.hour))
          hoursArray.push(formattedTimeslot.hour);
        return hoursArray;
      }, []);
      this.minutes = this.formattedTimeslots.reduce(
        (minutesArray, timeslot) => {
          if (dayjs(this.defaultTime).format('HH') === timeslot.hour)
            minutesArray.push(timeslot.minute);
          return minutesArray;
        },
        []
      );
    },
    setMinutesHandling() {
      let scrollTimeout = null;

      this.$refs.hoursListContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
          const newMinutesArray = this.formattedTimeslots.reduce(
            (minutesArray, timeslot) => {
              if (this.selectedHour === timeslot.hour)
                minutesArray.push(timeslot.minute);
              return minutesArray;
            },
            []
          );

          const minutesMatch = this.minutes.reduce(
            (boolean, minuteString, index) => {
              if (minuteString === newMinutesArray[index]) {
                return boolean && true;
              } else {
                return false;
              }
            },
            true
          );

          if (!minutesMatch) {
            this.minutes = newMinutesArray;
            this.selectedMinute = this.minutes[0];
            this.setScrollHeight('minutes');
          }
        }, 75);
      });
    },
    setScrollHeight(type) {
      this.config[type].listContainer.scrollTop = this.setScrollTop(type);
    },
    setScrollTop(type) {
      if (type === 'hours') {
        return this.indexOfCurrentHour * 35;
      } else if (type === 'minutes') {
        return this.indexOfCurrentMinute * 35;
      }
    },
    setSelecting(type) {
      this.config[type].listContainer.addEventListener('scroll', () => {
        const distanceFromTop = this.config[type].listContainer.scrollTop;
        const distanceFromPreviousItem = distanceFromTop % 35;
        this.getSelected(
          type,
          this.config[type].selectedDataLabel,
          distanceFromTop
        );
      });
    },
    setSlotOnLoad() {
      this.selectedHour = dayjs(this.defaultTime).format('HH');
      this.selectedMinute = dayjs(this.defaultTime).format('mm');
    },
    setSnapping(type) {
      let transformAmount = 0;
      let scrollTimeout = null;

      this.config[type].listContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
          const distanceFromTop = this.config[type].listContainer.scrollTop;
          const distanceFromPreviousItem = distanceFromTop % 35;
          transformAmount = 0;
          if (distanceFromPreviousItem > 35 / 2) {
            transformAmount = distanceFromPreviousItem - 35;
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
  created() {
    this.setAvailableSlots();
    this.setSlotOnLoad();
  },
  mounted() {
    this.init();
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

[data-component='time-picker'] {
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
    margin-right: 20px;
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
        width: 120px; // To hide scrollbar
        &::-webkit-scrollbar {
          display: none;
        }
        [data-element='list-element'] {
          height: 175px;
          width: 100px;
          ul {
            width: 120px; // To hide scrollbar
            overflow-y: scroll;
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
