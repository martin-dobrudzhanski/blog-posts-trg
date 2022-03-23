<template>
	<div class="cookies-message" v-if="$store.state.ui.cookiesMessageIsVisible">
		<div class="wrapper">
			<p>This site uses cookies. By continuing to browse the site you are agreeing to our use of cookies. <nuxt-link :to="cookiesPage">Find out more</nuxt-link>.</p>
			<img class="cross" 
				src="~assets/img/icons/icon-close-white.svg" 
				alt="expand-arrow" @click="closeCookiesMessage" />
		</div>
	</div>
</template>

<script>

	import { mapMutations } from 'vuex'

	export default {
		data () {
			return {
				cookiesPage: '/terms'
			}
		},
		methods: {
			...mapMutations({
				'closeCookiesMessage': 'ui/closeCookiesMessage'
			})
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.cookies-message {
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
