<template>
	<div data-component="timeslot-display" @click.self="openTimepicker">
		<p data-element="text" @click.self="openTimepicker">Pick up time: <span data-element="timeslot" @click.self="openTimepicker">{{ formattedTimeslot }}</span></p>
		<p data-element="change-timeslot-link" @click.self="openTimepicker">Change</p>
		<modal-container v-if="showTimepicker" :closeModal="closeTimepicker">
			<time-picker
				data-element="time-picker"
				:defaultTime="timeslot"
				:times="filteredTimeslots"
				:selectTime="selectTime"
			/>
		</modal-container>
	</div>
</template>

<script>

	import dayjs from 'dayjs';
	import DynamicLink from '~/components/iOrder-core/uiV2/DynamicLink';
	import ModalContainer from '~/components/iOrder-core/modalsV2/ModalContainer';
	import TimePicker from '~/components/iOrder-core/modalsV2/TimePicker';

	export default {
		props: [
			'timeslot',
			'availableTimeslots',
			'setTimeslot'
		],
		components: {
			TimePicker,
			ModalContainer
		},
		data () {
			return {
				showTimepicker: false
			}
		},
		computed: {
			formattedTimeslot () {
				if(!this.availableTimeslots || !this.availableTimeslots[0]) return ('No Timeslots Available')
				if (this.timeslot === this.availableTimeslots[0].time) {
					return `ASAP (${dayjs(this.timeslot).format('HH:mm')})`;
				} else {
					return dayjs(this.timeslot).format('HH:mm');
				}
			},
			filteredTimeslots () {
				return this.availableTimeslots.reduce((arr, timeslot) => {
					if (timeslot.available) arr.push(timeslot.time);
					return arr;
				}, []);
			}
		},
		methods: {
			openTimepicker () {
				document.body.setAttribute('data-modal', true);
				document.documentElement.setAttribute('data-modal', true);
				this.showTimepicker = true;
			},
			closeTimepicker () {
				document.body.removeAttribute('data-modal');
				document.documentElement.removeAttribute('data-modal');
				this.showTimepicker = false;
			},
			selectTime (hour, minute) {
				const matchingTimeslot = this.filteredTimeslots.find(timeslot => {
					return dayjs(timeslot).format('HH') === hour && dayjs(timeslot).format('mm') === minute;
				});
				this.setTimeslot(matchingTimeslot);
				this.closeTimepicker();
			}
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='timeslot-display'] {
		padding:16px 8px;
		border:1px solid $black;
		display:flex;
		justify-content:space-between;
		background-color:transparent;
		-webkit-tap-highlight-color: transparent;
		&:hover {
			cursor:pointer;
		}
		[data-element='text'] {
			font-size:16px;
			[data-element='timeslot'] {
				font-size:17px;
				font-weight:bold;
				color:$black;
			}
		}
		[data-element='change-timeslot-link'] {
			font-size:14px;
			font-weight:normal;
			text-decoration:underline;
		}
	}

</style>
