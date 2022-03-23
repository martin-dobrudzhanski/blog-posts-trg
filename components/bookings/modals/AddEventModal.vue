<template>
  <div data-component="add-event-modal">
    <booking-header size="sm" text="Select your calendar" />
    <div data-element="modal-block">
      <icon icon="apple" size="sm" />
      <a data-element="link" :href="getIcal">Apple</a>
    </div>
    <div data-element="modal-block">
      <icon icon="google" size="sm" />
      <a data-element="link" :href="getGoogle" target="_blank">Google</a>
    </div>
    <div data-element="modal-block">
      <icon icon="outlook" size="sm" />
      <a data-element="link" :href="getOutlook" target="_blank">Outlook</a>
    </div>
    <div data-element="modal-block">
      <icon icon="yahoo" size="sm" />
      <a data-element="link" :href="getYahoo" target="_blank">Yahoo</a>
    </div>
  </div>
</template>

<script>
import BookingHeader from '~/components/bookings/ui/BookingHeader';
import Icon from '~/components/bookings/ui/Icon';

export default {
  data: () => ({
    title: 'Meal at Chiquito',
    description: 'Meal at Chiquito',
    duration: 120,
    msInMinutes: 60 * 1000,
  }),
  components: {
    BookingHeader,
    Icon,
  },
  computed: {
    getAddress() {
      const street = this.$store.state.booking.location.street;
      const city = this.$store.state.booking.location.city;
      const postalCode = this.$store.state.booking.location.postalCode;
      return `${street}, ${city} ${postalCode}`;
    },
    startTime() {
      return this.$store.getters['booking/getDateObject'];
    },
    getEndTime() {
      return this.formatTime(
        new Date(this.startTime.getTime() + this.duration * this.msInMinutes)
      );
    },
    getStartTime() {
      return this.formatTime(this.startTime);
    },
    getYahoo() {
      const yahooHourDuration =
        this.duration < 600
          ? '0' + Math.floor(this.duration / 60)
          : Math.floor(this.duration / 60) + '';
      const yahooMinuteDuration =
        this.duration % 60 < 10
          ? '0' + (this.duration % 60)
          : (this.duration % 60) + '';
      const yahooEventDuration = yahooHourDuration + yahooMinuteDuration;
      // Remove timezone from event time
      const st =
        this.formatTime(
          new Date(
            this.startTime -
              this.startTime.getTimezoneOffset() * this.msInMinutes
          )
        ) || '';
      return encodeURI(
        [
          'http://calendar.yahoo.com/?v=60&view=d&type=20',
          '&title=' + (this.title || ''),
          '&st=' + st,
          '&dur=' + (yahooEventDuration || ''),
          '&desc=' + (this.description || ''),
          '&in_loc=' + (this.address || ''),
        ].join('')
      );
    },
    getGoogle() {
      return encodeURI(
        [
          'https://www.google.com/calendar/render',
          '?action=TEMPLATE',
          '&text=' + (this.title || ''),
          '&dates=' + (this.formatTime(this.startTime) || ''),
          '/' + (this.endTime || ''),
          '&details=' + (this.description || ''),
          '&location=' + (this.address || ''),
          '&sprop=&sprop=name:',
        ].join('')
      );
    },
    getIcal() {
      return this.getIcs('ical');
    },
    getOutlook() {
      return this.getIcs('outlook');
    },
  },
  methods: {
    formatTime(date) {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    },
    getIcs(calType) {
      var url = document.URL;
      // if (calType === 'ical') {
      // 	url = url.replace('https://', 'webcal://')
      // 		.replace('http://', 'webcal://');
      // }
      return encodeURI(
        'data:text/calendar;charset=utf8,' +
          [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            'URL:' + url,
            'DTSTART:' + (this.getStartTime || ''),
            'DTEND:' + (this.getEndTIme || ''),
            'SUMMARY:' + (this.title || ''),
            'DESCRIPTION:' + (this.description || ''),
            'LOCATION:' + (this.address || ''),
            'END:VEVENT',
            'END:VCALENDAR',
          ].join('\n')
      );
    },
  },
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

[data-component='add-event-modal'] {
  background: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  width: 328px;
  height: 312px;
  [data-component='booking-header'] {
    margin-bottom: 24px;
    background-color: $rebrand-blue;
  }
  [data-element='modal-block'] {
    background: #f6f6f6;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 7px;
    padding-left: 32px;
    width: 100%;
    height: 56px;
    [data-element='link'] {
      color: $black;
      font-size: 16px;
      font-weight: bold;
      line-height: 1.25;
      padding-left: 16px;
    }
  }
}
</style>
