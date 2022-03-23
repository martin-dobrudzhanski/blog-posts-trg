<template>
	<section class="restaurant-map-tile-container">
		<h2 class="heading" data-size="md" data-weight="bold">{{restaurant.title | remove-fb }}</h2>
		<p class="distance">{{restaurant.distance | distance}} miles away</p>
		<span class="section-break"></span>
		<span class="hours" v-if="openToday">Open today {{restaurant.openToday}}</span>
		<a class="phone" :href="`tel:${restaurant.telephone}`">
			{{restaurant.telephone}}
		</a>
		<div class="facilities">
			<Facilities :facilities="getFacilities" offset="4"/>
		</div>
		<div class="link-container">

			<nuxt-link class="btn link-view" data-size="sm" :to="`/restaurants/${restaurant.slug}`">View details</nuxt-link>
			<nuxt-link :to="getBookingLink" class="btn link link-book" data-size="sm">
				Book now
			</nuxt-link>

		</div>
	</section>
</template>

<script>

	import facilities from '~/mixins/facilities.js';
	import Facilities from '~/components/restaurant/Facilities.vue'

	export default {
		props: ['locationInfo'],
		components: {
			Facilities
		},
		mixins: [ facilities ],
		computed: {
			getBookingLink () {
				if (!this.restaurant.siteId) {
					return '/book';
				}
				return `/book/${this.restaurant.slug}`;
			},
			facilities () {
				if (!this.restaurant.taxonomy) {
					return false;
				}
				return this.restaurant.taxonomy;
			},
			restaurant () {
				if(this.locationInfo.fields) {
					const dayMethods = ['openSunday','openMonday','openTuesday','openWednesday','openThursday','openFriday','openSaturday'];
					const dayOfTheWeek = (new Date()).getDay();
					return Object.assign({}, this.locationInfo.fields, { distance: this.locationInfo.distance, openToday: this.locationInfo.fields[dayMethods[dayOfTheWeek]] });
				} else {
					return this.locationInfo
				}
			},
			today () {
				return new Date().toLocaleString('en-gb', { weekday: 'long' });
			},
			openToday () {
				if (!this.restaurant[`open${this.today}`]) {
					return false;
				}
				return this.restaurant[`open${this.today}`];
			}
		}
	}

</script>

<style lang="scss">

  @import '~assets/css/helpers.scss';
  @import '~assets/css/variables.scss';

  .restaurant-map-tile-container {

		@include fadeIn();
		width:100%;
		padding:8px 8px 12px;
		border:solid 2px $rebrand-green;
		background-color:#fff;

		h2.heading {
			margin:0 0 8px;
			color:$rebrand-orange;
		}

		p.distance {
			text-align:center;
			margin-bottom:8px;
		}

		span.section-break {
			display:block;
			width:100%; height:2px;
			margin:0 0 8px;
			background-color:$rebrand-green;
		}

		span.hours {
			display:block;
			margin:0 0 12px;
			font-size:16px; line-height:1;
			font-weight:500;
			text-align:center;
			color:#2b2929;
		}

    a.phone {
			display:block;
			width:100%;
			margin:0 0 18px;
			font-size:18px; line-height:1;
			text-decoration: none;
			text-align:center;
			font-weight:700;
			color: #008257;
		}

    .facilities {
			.facilities-group {
				justify-content:center;
			}
    }
		.link-container {
			margin:18px 0 0;
			display:flex;
			align-items:center;
			justify-content:center;
			.btn {
				margin:0 4px;
				width:152px !important;
			}
		}


  }

</style>
