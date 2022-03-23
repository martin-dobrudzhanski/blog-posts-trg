<template>
	<section class="matchday" data-fullscreen>
		<div class="jumbotron" :style="getHeroImage">
		</div>
		<div class="slider">
			<MobileSwiper v-if="slides" class="mobile"
				:slides="slides" />
			<DesktopSwiper v-if="slides" class="desktop"
				:slides="slides" />
		</div>
		<div class="text">
			<h1 class="heading" data-size="xl" data-color='rebrand-orange'>{{ content.pageHeading }}</h1>
			<dual-link :href="content.buttonLink" :linkInfo="content" class="btn" data-size="lg">{{ content.buttonText }}</dual-link>
			<VueMarkdown class="heading" data-size="sm" data-weight="normal" :source="content.pageText"></VueMarkdown>
		</div>
		<dual-link :href="content.bottomImageLink" :linkInfo="{ external: false, newTab: false }">
			<img :src="getBottomImage" class="bottom-image">
		</dual-link>
	</section>
</template>

<script>
	import { getContent } from '~/libs/templateHelpers.js'
	import DualLink from '~/components/ui/DualLink'
	import MobileSwiper from '~/components/menu/foodSlider/mobile/Swiper.vue'
	import DesktopSwiper from '~/components/menu/foodSlider/desktop/Swiper.vue'
	import VueMarkdown from 'vue-markdown'

	export default {
		components: {
			DualLink,
			MobileSwiper,
			DesktopSwiper,
			VueMarkdown
		},
		computed: {
			getHeroImage () {
				const url = this.content.heroImage &&
							this.content.heroImage.fields &&
							this.content.heroImage.fields.file &&
							this.content.heroImage.fields.file.url
				return {
					'background-image': 'url(' + url + '?w=950&q=100)'
				}
			},
			getBottomImage () {
				return this.content.bottomImage &&
					this.content.bottomImage.fields &&
					this.content.bottomImage.fields.file &&
					this.content.bottomImage.fields.file.url;
				},
			slides () {
				const content = this.content
				return content.swiper && content.swiper.fields && content.swiper.fields.sliderCards || false;
			}
		},
		head () {
			let getMeta = () => {
				if (!this.$store.state.ui.metaDescription) {
					return '';
				}
				return this.$store.state.ui.metaDescription;
			}
			return {
				title: '2 for 1',
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
				content: null
			}
		},
		async asyncData ({ store, params, error }) {
			return await getContent(store, 'matchday-page', error);
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	section.matchday {
		display:flex;
		flex-direction:column;
		align-items:center;
		justify-content:flex-start;
		width:100%;
		.jumbotron {
			position:relative;
			width:100%; height:144px;
			background-position:center;
			background-size:cover;
			@media(min-width:500px) {
				height:200px;
			}
			@media(min-width:650px) {
				height:260px;
			}
			@include whenScreenIs(sm) {
				height:300px;
			}
			@include whenScreenIs(mdx) {
				height:348px;
			}
		}
		.slider {
			width:100%;
			.desktop {
				display:none;
				margin-top:20px;
				@include whenScreenIs(mdx) {
					display:block;
				}
			}
			.mobile {
				display:block;
				@include whenScreenIs(mdx) {
					display:none;
				}
			}
		}
		.text {
			display:flex;
			flex-direction:column;
			align-items:center;
			width:100%;
			overflow:hidden;
			padding:0 16px;
			h1 {
				width:100%;
				max-width:560px;
				margin:16px auto;
				@include whenScreenIs(mdx) {
					margin:24px 0 16px;
				}
			}
			p {
				text-align:center;
				width:100%;
				max-width:700px;
				color:$black;
				@include whenScreenIs(mdx) {
					margin-bottom:20px;
				}
			}
			.btn {
				margin:20px 0 30px;
				max-width:560px;
				&.green {
					&:hover {
						background-color: #fff;
					}
				}
			}
		}
		.bottom-image {
			width: 100%;
			margin-top: 40px;
			@include whenScreenIs(sm) {
				width:600px; height:258px;
			}
			@include whenScreenIs(mdx) {
				margin-top: 0;
			}
			margin-bottom: 40px;
		}
	}

</style>
