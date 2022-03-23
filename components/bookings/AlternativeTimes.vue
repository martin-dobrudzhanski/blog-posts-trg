<template lang="html">
	<div data-component="alternative-times">
		<p data-element="message"> {{ $store.getters['booking/getTime'] }} is unavailable. Nearest available timeslots below</p>
		<div data-element="button-row">
			<btn
			v-for="(alternativeTime, index) in alternativeTimes"
			@click.native="selectTime(alternativeTime)"
			class="block"
			size="sm"
			:key="index"
			:text="alternativeTime.slot"
			:inactive="!alternativeTime.availability" />
		</div>
	</div>
</template>

<script>
import Btn from '~/components/bookings/ui/Btn';

export default {
  props: ['alternativeTimes'],
  components: {
    Btn,
  },
  computed: {
    getTime() {
      return `${this.$store.state.booking.hour}:${this.$store.state.booking.minute}`;
    },
  },
  methods: {
    selectTime(time) {
      if (time.availability) {
        let hour = time.slot.substring(0, 2);
        let minute = time.slot.slice(-2);

        this.$store.commit('booking/setTime', {
          hour: hour,
          minute: minute,
        });

        this.$store.dispatch('booking/checkAvailability');
      }
      return;
    },
    countUnavailable() {
      let unavailable = null;

      this.alternativeTimes.forEach((alternativeTime) => {
        if (!alternativeTime.availability) unavailable++;
      });

      if (unavailable === 4) {
        this.$toast.show(
          'Sorry, no times available near to selected time. Please try another time.',
          {
            className: 'booking-toast',
            closeOnSwipe: true,
            containerClass: 'bookings',
            duration: 4000,
            fullWidth: true,
            fitToScreen: true,
            position: 'bottom-center',
            singleton: true,
            action: {
              text: 'Close',
              onClick: (e, toastObject) => {
                toastObject.goAway(0);
              },
            },
          }
        );
      }
      return;
    },
  },
  mounted() {
    this.countUnavailable();
  },
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/bookings/form-row.scss';

[data-component='alternative-times'] {
  background: $white;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 128px;
  width: 100vw;
  padding: 16px 8px 16px;
  @media (min-width: $bookings-mobile) {
    padding: 16px;
  }
  @include whenScreenIs(sm) {
    background: #fff;
    padding: 0;
  }
  [data-element='message'] {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    text-align: center;
  }
  [data-element='button-row'] {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    @include whenScreenIs(sm) {
      width: 328px;
    }
  }
}
</style>
