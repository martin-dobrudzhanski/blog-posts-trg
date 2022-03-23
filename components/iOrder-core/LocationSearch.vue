<template>
	<div data-component="location-search">
		<div
			data-element="form-container"
			:class="{ display: locationDisplayMode }"
		>
			<form
				data-element="form-row"
				v-on:submit.prevent="handleSearch"
			>
				<label
					for="location-input"
					data-element="field-header"
				>
					Which restaurant are you at?
				</label>
				<div
					data-element="input-wrapper"
					@click="handleInputClick"
				>
					<icon icon="location"
						v-if="!locationDisplayMode"
						data-position="left"
						@click.native="handleGeolocate"
						:class="{spin: isGeolocating}"
					/>
					<input data-element="input"
						id="location-input"
						v-model="locationQuery"
						:placeholder="inputPlaceholder"
						:disabled="locationDisplayMode"
						:class="{ display: locationDisplayMode }"
						v-validate="'street_address'"
						data-vv-name="location"
					/>
					<icon icon="search"
						v-if="!locationDisplayMode"
						data-position="right"
						:clickable="true"
					/>
				</div>
				<div data-element="error-message">
					{{ errors.first('location') }}
				</div>
			</form>
			<dynamic-link
				v-if="locationDisplayMode"
				:link="true"
				:href="changeLocationLink"
				text="Change location"
				size="sm"
				data-element="change-location-link"
				:class="{ display: locationDisplayMode }"
			/>
		</div>
		<transition name="fade">
			<modal-container v-if="showModal" :closeModal="closeModal" :transparent="true">
				<location-modal :localRestaurants="localRestaurants" :closeModal="closeModal" :app="app"/>
			</modal-container>
		</transition>
	</div>
</template>

<script>

import Icon from '~/components/iOrder-core/uiV2/Icon';
import ModalContainer from '~/components/iOrder-core/modalsV2/ModalContainer';
import LocationModal  from '~/components/iOrder-core/modalsV2/LocationModal';
import DynamicLink  from '~/components/iOrder-core/uiV2/DynamicLink';


export default {
	props:[
		'getLocalRestaurants',
		'redirectToNearest',
		'autoGeolocate',
		'locationDisplayMode',
		'restaurantName',
		'app'
	],
	data () {
		return {
			locationQuery: null,
			localRestaurants: [],
			showModal: false,
			inputPlaceholder: 'Search by town, city or postcode',
			isGeolocating: false
		}
	},
	components: {
		Icon,
		ModalContainer,
		LocationModal,
		DynamicLink
	},
	computed: {
		changeLocationLink () {
			if (this.app === "OAT") return '/order/all';
		}
	},
	methods: {
		async handleSearch () {
			if (!this.locationQuery) return false;
			const localRestaurants = await this.getLocalRestaurants(this.locationQuery);
			if (localRestaurants.length <= 3) {
				this.localRestaurants = localRestaurants;
			} else {
				this.localRestaurants = localRestaurants.slice(0, 3);
			}
			if (this.localRestaurants && this.localRestaurants.length) this.showModal = true;
		},
		handleInputClick () {
			if (this.locationDisplayMode) {
				this.$router.push({ path: '/order/all' });
			}
		},
		closeModal () {
			this.showModal = false;
		},
		async handleGeolocate () {
			this.isGeolocating = true;
			this.inputPlaceholder = 'Finding your nearest restaurant...'
			const success = await this.redirectToNearest()
			if (!success) {
				this.isGeolocating = false;
				this.inputPlaceholder = 'Search by Town, City or Post Code'
			}
		},
		init () {
			if (this.autoGeolocate) this.handleGeolocate();
			if (this.restaurantName) this.locationQuery = this.restaurantName;
		}
	},
	created () {
		this.init();
	},
	watch: {
		restaurantName () {
			this.locationQuery = this.restaurantName;
		}
	}
}

</script>

<style lang="scss" scoped>

@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/iorder-core/form-row.scss';

[data-component='location-search'] {
	[data-element='form-container'] {
		display:flex;
		flex-wrap:wrap;
		justify-content:center;
		margin-top:16px;
		margin-bottom:40px;
		@media(min-width:346px) {
			margin-top:8px;
		}
		&.display {
			margin-bottom:24px;
		}
		[data-element='form-row'] {
			@extend .form-row;
			padding:8px;
			margin-bottom:0;
			@media(min-width:346px) {
				padding:16px;
			}
			width:100%;
			[data-element='field-header'] {
				margin-bottom:16px;
				@media(min-width:328px) {
					width:328px;
				}
			}
			[data-element='input-wrapper'] {
				[data-element='input'] {
					font-size:15px;
					border-radius:0;
					@media(min-width:346px) {
						font-size:16px;
					}
					&:disabled {
						background-color:#fff;
						opacity:1;
						-webkit-text-fill-color:$black;
					}
					&.display {
						font-weight:bold;
						color:$black;
						opacity:1;
					}
					&:focus::-webkit-input-placeholder { color:transparent; }
					&:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */
					&:focus::-moz-placeholder { color:transparent; } /* FF 19+ */
					&:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */
				}
				[data-component='icon'] {
					position:absolute;
					top:11px;
					&[data-position='left'] {
						left:8px;
					}
					&[data-position='right'] {
						right:8px;
					}
				}
			}
			[data-element='error-message'] {
				color:$scarlet;
				font-size:12px;
				font-weight:500;
				line-height:1.33;
			}
			&[data-disabled] {
				opacity:0.5;
				pointer-events:none;
			}
		}
		[data-element='change-location-link'] {
			font-weight:normal;
			text-decoration:underline;
			font-size:12px;
		}
	}
	.fade-enter-active, .fade-leave-active {
		transition:opacity .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity:0;
	}
}

</style>
