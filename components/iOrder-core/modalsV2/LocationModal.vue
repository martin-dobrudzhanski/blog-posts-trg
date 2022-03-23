<template>
	<div data-component="location-modal">
		<section-header text="Nearest Chiquito" size="sm" :modalHeader="true" background="blue"/>
		<p data-element="subheading">Select where you would like to order:</p>
		<div data-element="locations" v-for="(restaurant, index) in localRestaurants">
			<div
				data-element="modal-block"
				@click="select(restaurant.fields.slug)">
				<p data-element="restaurant">{{ stripBrandFromSiteTitle(restaurant.fields.title) }}</p>
			</div>
		</div>
	</div>
</template>

<script>

	import SectionHeader from '~/components/iOrder-core/uiV2/SectionHeader';

	export default {
		props: [
			'localRestaurants',
			'closeModal',
			'app'
		],
		components: {
			SectionHeader
		},
		methods: {
			select (slug) {
				if (this.app === 'OAT') {
					this.$router.push(`/restaurants/${slug}/order`);
				}
				this.closeModal();
			},
			stripBrandFromSiteTitle (string) {
				return string.replace('Chiquito, ', '')
			}
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='location-modal'] {
		position:relative;
		width:312px; height:326px;
		margin:20px;
		background-color:#fff;
		box-shadow:0 2px 4px rgba(0, 0, 0, 0.5);
		@include whenScreenIs(sm) {
			width:464px; height:360px;
		}
		[data-element='subheading'] {
			font-size:16px;
			font-weight:500;
			padding:24px;
			text-align:center;
		}
		[data-element='modal-block'] {
			background:#f6f6f6;
			display:flex;
			flex-direction:row;
			align-items:center;
			justify-content:center;
			margin-bottom:1px;
			width:100%; height:56px;
			&:active {
				background:$rebrand-orange;
				[data-element='restaurant'] {
					color:#fff;
					font-weight:bold;
				}
			}
			[data-element='restaurant'] {
				color:$black;
				font-size:16px;
				line-height:1.25;
				padding:16px;
				text-align:center;
			}
		}
	}

</style>
