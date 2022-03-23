<template>

	<section class="" data-fullscreen>
		<div class="jumbotron" :style="heroImage" />
		<div class="discount-banner">
			<p class="heading" data-size="lg">{{ content.banner.fields.text }}</p>
		</div>
		<section class="find-restaurant-container">
			<h1 class="heading" data-size="xl">{{ content.headerText }}</h1>
			<p class="heading" data-size="sm" data-weight="bold">
				<span>{{ content.subHeading1 }} </span>
				<span>{{ content.subHeading2 }} </span>
			</p>
			<div class="location-form-container">
				<LocationForm size="md" shouldRedirect="true" clickAndCollectSearch="true"/>
			</div>

		</section>

		<section class="restaurant-library-container">
			<div class="library">
				<div
					v-for="(list, regionName) in regonalList"
					class="region-container"
					:key="regionName"
				>
					<div @click="handleClick(regionName)">
						<img
							v-if="!list.show"
							class="status-icon"
							:class="{ rotated: isExpanded(regionName) }"
							src="~assets/img/iorder-coreV2/icons/collapse-arrow-light.svg" alt="expand-arrow"
						>

						<h2 class="main">{{ regionName | capitalize }}</h2>
					</div>

					<ul v-if="isExpanded(regionName)">

						<li class="restaurant-list-item"
							v-for="restaurant in list.locations"
							v-if="restaurant.fields.clickAndCollect"
							:key="restaurant.fields.zonalSiteId">

							<!-- v1 C&C -->
							<a
								v-if="!isV2(restaurant)"
								:href="`https://clickandcollect.omnifitrgsites.co.uk/chiquito.html#/locations/${restaurant && restaurant.fields && restaurant.fields.zonalSiteId || ''}`">
								<h2 class="restaurant">{{ restaurant.fields.title | remove-fb | capitalize }}</h2>
								<img
									class="status-icon right"
									src="~assets/img/iorder-coreV2/icons/collapse-arrow-light.svg" alt="collapse-arrow">
							</a>

							<!-- v2 C&C -->
							<nuxt-link
								v-else
								:to="`/restaurants/${restaurant && restaurant.fields && restaurant.fields.slug || ''}/takeaway`">
								<h2 class="restaurant">{{ restaurant.fields.title | remove-fb | capitalize }}</h2>
								<img
									class="status-icon right"
									src="~assets/img/iorder-coreV2/icons/collapse-arrow-light.svg" alt="collapse-arrow">
							</nuxt-link>

						</li>
					</ul>
				</div>
			</div>
		</section>

	</section>
</template>

<script>

	import LocationForm from '~/components/LocationForm.vue'
	import { getContent } from '~/libs/templateHelpers.js'
	import { mapMutations } from 'vuex';

	export default {
		components: {
			LocationForm
		},
		head () {
			let getMeta = () => {
				if (!this.$store.state.ui.metaDescription) {
					return '';
				}
				return this.$store.state.ui.metaDescription;
			}
			return {
				title: 'Find a restaurant',
				bodyAttrs: {
					'data-pagecolor': 'white'
				},
				meta: [
					{
						hid: 'description',
						name: 'description',
						content: getMeta()
					}
				]
			}
		},
		data () {
			return {
				content: null,
				expandedRegions: []
			}
		},
		async asyncData ({ store, params, error }) {
			return await getContent(store, 'restaurants-click-and-collect', error);
		},
		computed: {
			regonalList () {
				let list = {
					"london" : { locations: [] },
					"south east" : { locations: [] },
					"south west" : { locations: [] },
					"east of england" : { locations: [] },
					"west midlands" : { locations: [] },
					"east midlands" : { locations: [] },
					"yorkshire and the humber" : { locations: [] },
					"north east" : { locations: [] },
					"north west" : { locations: [] },
					"scotland" : { locations: [] },
					"wales" : { locations: [] }
				}
				this.content.restaurants.fields.list.forEach((el) => {
					el.fields.region = el.fields.region ? el.fields.region.toLowerCase() : null
					list[el.fields.region] ? list[el.fields.region].locations.push(el) : list[el.fields.region] = { locations: [el] }
				})
				return list
			},
			heroImage () {
				const url = this.content &&
				this.content.headerImage &&
				this.content.headerImage.fields &&
				this.content.headerImage.fields.file &&
				this.content.headerImage.fields.file.url
				return {
					'background-image': 'url(' + url + '?w=950&q=100)'
				}
			}
		},
		methods: {
			...mapMutations({
				toggleRegion: 'restaurants/toggleRegion'
			}),
			getClickAndCollectLink (restaurant) {
				const siteId = restaurant && restaurant.fields && restaurant.fields.zonalSiteId || ''
				return `https://clickandcollect.omnifitrgsites.co.uk/chiquito.html#/locations/${siteId}`
			},
			init () {
				this.$store.dispatch('clickAndCollect/initState');
			},
			isV2 (restaurant) {
				return restaurant && restaurant.fields && restaurant.fields.ccVersion === 'v2'
			},
			handleClick (regionName) {
				if (this.isExpanded(regionName)) {
					return this.closeRegion(regionName);
				}
				return this.openRegion(regionName);
			},
			isExpanded (regionName) {
				return this.expandedRegions.includes(regionName.toLowerCase());
			},
			closeRegion (regionName) {
				const index = this.expandedRegions.indexOf(regionName);
				this.expandedRegions.splice(index,1);
			},
			openRegion (regionName) {
				this.expandedRegions.push(regionName.toLowerCase());
			}
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.jumbotron {
		position:relative;
		width:100%; height:172px;
		background-position:center;
		background-size:cover;
		@include whenScreenIs(sm) {
			height:256px;
		}
	}
	.discount-banner {
		display:flex;
		align-items:center;
		justify-content:center;
		min-height:100px;
		color: white;
		background-color: $rebrand-orange;
		padding:0 15px;
		.heading {
			max-width:564px;
			font-size:28px;
			letter-spacing:1.1px;
			line-height:0.86;
		}
	}
	.find-restaurant-container {
		background-color:$rebrand-blue;
		height: 176px;
		overflow:hidden;
		padding:0 16px;
		.heading {
			color:$white;
		}
		h1.heading {
			margin-top:18px;
			margin-bottom:14px;
			font-size:28px;
			line-height:0.86;
			@include whenScreenIs(mdx) {
				margin-top:24px;
				margin-bottom:12px;
				font-size:38px;
			}
		}
		p {
			display:none;
			@include whenScreenIs(mdx) {
				display:block;
				font-size:16px;
				line-height:1.13;
				font-weight:normal;
			}
		}
		p, img { display: none; }
		.location-form-container {
		    max-width: 560px;
		    margin: 0 auto;
		}
	}

	.restaurant-library-container {
		@include fadeIn();
		width: 100%;
		height: 100%;
		padding-top: 8px;
		padding-bottom:20px;
		@include whenScreenIs(mdx) {
			padding-bottom: 70px;
		}
		.region-container {
			position: relative;
		}
		.library {
			min-width: 320px;
			max-width: 600px;
			padding: 0 20px;
			margin: 0 auto;
			.status-icon {
				position: absolute;
				right: 2px;
				top: 14px;
				transition: all 0.5s ease-in-out;
				&.rotated {
					transform: rotate(180deg);
				}
				&.right {
					transform: rotate(270deg);
				}
			}
			.restaurant-list-item {
				position: relative;
				a {
					position: static;
				}
			}
			h2.main,
			h2.restaurant {
				overflow: hidden;
				display:flex;
				align-items:center;
				justify-content:flex-start;
				height:48px;
				font-size:18px; line-height:1.33;
				font-weight:normal;
				color: $black;
				text-transform: capitalize;
				text-overflow: ellipsis;
				white-space: nowrap;
				border-bottom: solid 2px $rebrand-orange;
				@include clickable(false);
				user-select:none;
				-webkit-tap-highlight-color:transparent;
			}
			li {
				-webkit-tap-highlight-color:transparent;
				user-select:none;
				a {
					-webkit-tap-highlight-color:transparent;
					user-select:none;
				}
			}
			h2.restaurant {
				color: $rebrand-blue;
				padding-right: 30px;
				-webkit-tap-highlight-color:transparent;
				user-select:none;
			}
		}
	}

	@include whenScreenIs(mdx) {
		.find-restaurant-container {
			height: 192px;
			h1 {
				color:$white;
			}
			p.heading {
				margin-bottom:24px;
				span {	display: block; }
			}
			p, img { display: block; }
		}
	}

</style>
