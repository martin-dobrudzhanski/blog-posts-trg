<template>
	<div class="gdpr-message" v-if="$store.state.ui.GDPRMessageIsVisible">
		<div class="wrapper">
			<p>PRIVACY NOTICE: Our Privacy Notice was updated on 24th May 2018. <nuxt-link :to="policyPage"> Follow this link</nuxt-link> to read the updated Privacy Notice.</p>
			<img class="cross"
				src="~assets/img/icons/icon-close-white.svg"
				alt="expand-arrow" @click="closeGDPRMessage" />
		</div>
	</div>
</template>

<script>

	import { mapMutations } from 'vuex'

	export default {
		data () {
			return {
				policyPage: '/terms'
			}
		},
		methods: {
			...mapMutations({
				'closeGDPRMessage': 'ui/closeGDPRMessage'
			})
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.gdpr-message {
		position:fixed;
		z-index:99;
		right:0; bottom:0; left:0;
		background-color:$black;
		.wrapper {
			max-width:960px; min-width:320px;
			margin:0 auto;
			padding:16px 70px 16px 20px;
			@include whenScreenIs(mdx) {
				padding-left:0;
			}
			p {
				font-size:14px; line-height:1.43;
				font-weight:500;
				color:#fff;
				a {
					color:#fff;
					font-weight:700;
					text-decoration: underline;
				}
			}
			.cross {
				position:absolute;
				top:50%; right:24px;
				margin:-12px 0 0;
				width:24px; height:24px;
				cursor:pointer;
			}
		}
	}

</style>
