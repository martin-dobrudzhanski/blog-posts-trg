<template lang="html">
	<div data-component="alternative-times">
		<div data-element="modal-header">
			<section-header
				data-element="alternative-times-heading"
				text="Sorry, no times available near to selected time. Please try another time."
				size="lg"
				background="white"
				:modalHeader="true"
				v-if="noAvailableTimeslots"
			/>
			<section-header
				data-element="alternative-times-heading"
				text="Oops - that pick up time is unavailable. Please select from the available timeslots."
				size="lg"
				background="white"
				:modalHeader="true"
				v-else
			/>
			<icon data-element="close-modal-icon" size="md" icon="close" @click.native="closeModal" data-clickable/>
		</div>
		<div data-element="button-row" v-if="!noAvailableTimeslots">
			<btn
				v-for="(timeslot, index) in alternativeTimeslots"
				@click.native="selectTime(timeslot.time)"
				class="block"
				size="sm"
				:key="index"
				:text="formatTime(timeslot.time)"
			/>
		</div>
		<div v-else >
			<nuxt-link to="/takeaway/all">
				<p class="no-timeslots-available"> Sorry, There is no timeslots available at this Venue! <br> Click here to select different one</p>

			</nuxt-link>
		</div>
	</div>
</template>

<script>
	import Btn from '~/components/iOrder-core/uiV2/Btn';
	import Icon from '~/components/iOrder-core/uiV2/Icon';
	import SectionHeader from '~/components/iOrder-core/uiV2/SectionHeader';
	import dayjs from 'dayjs';

	export default {
		props: [ 'alternativeTimeslots', 'closeModal', 'setTimeslot' ],
		components: {
			Btn,
			SectionHeader,
			Icon
		},
		computed: {
			noAvailableTimeslots () {
				let unavailable = 0;

				this.alternativeTimeslots.forEach((timeslot) => {
					if (!timeslot.available) unavailable++;
				})

				return unavailable === 4 || !this.alternativeTimeslots.length;
			}
		},
		methods: {
			selectTime (time) {
				this.setTimeslot(time);
				this.closeModal();
			},
			formatTime(timestring) {
				return dayjs(timestring).format('HH:mm');
			}
		}
	}
</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='alternative-times'] {
		position:relative;
		display:flex;
		flex-direction:column;
		justify-content:space-between;
		margin:16px;
		padding:34px 20px;
		background-color:#fff;
		height:282px;
		max-width:400px;
		@media (max-width: 370px) {
			padding-left:8px;
			padding-right:8px;
		}
		[data-element='modal-header'] {
			width:100%;
			background-color:#fff;
			z-index: 1;
			margin-bottom:24px;
			[data-element='close-modal-icon'] {
				position:absolute;
				top:16px;
				right:16px;
			}
		}
		[data-element='button-row'] {
			display:flex;
			flex-direction:row;
			justify-content:center;
			width:100%;
		}
		.no-timeslots-available {
				font-size: 18px;
				text-align: center;
				font-weight: 800;
		}
	}
</style>
