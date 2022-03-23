<template>
	<section class="cinema" data-fullscreen>
		<div class="jumbotron" :style="getStyle">
		</div>
		<div class="text">
			<h1 class="heading" data-size="xl" data-color='rebrand-orange'>{{ content.pageHeading }}</h1>
			<VueMarkdown class="heading" data-size="sm" data-weight="normal" :source="content.pageText"></VueMarkdown>
			<dual-link :href="content.buttonLink" :linkInfo="content" class="btn" data-size="md" data-color="moss-green">{{ content.buttonText }}</dual-link>
			<VueMarkdown class="heading" data-size="sm" data-weight="normal" :source="content.pageSecondText"></VueMarkdown>
		</div>
	</section>
</template>

<script>
	import { getContent } from '~/libs/templateHelpers.js'
	import DualLink from '~/components/ui/DualLink';
	import VueMarkdown from 'vue-markdown'

	export default {
		components: {
			DualLink,
			VueMarkdown
		},
		computed: {
			getStyle () {
				const url = this.content.heroImage &&
							this.content.heroImage.fields &&
							this.content.heroImage.fields.file &&
							this.content.heroImage.fields.file.url
				return {
					'background-image': 'url(' + url + '?w=950&q=100)'
				}
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
				title: 'Cinema',
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
			return await getContent(store, 'cinema-page', error);
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	section.cinema {
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
		.text {
			display:flex;
			flex-direction:column;
			align-items:center;
			width:100%;
			overflow:hidden;
			padding:0 16px 24px;
			h1 {
				width:100%;
				max-width:560px;
				margin:16px auto;
				@include whenScreenIs(mdx) {
					margin:24px 0 16px;
				}
			}
			p {
				text-align:left;
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
	}

</style>
