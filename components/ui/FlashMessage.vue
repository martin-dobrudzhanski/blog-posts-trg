<template>
	<transition name="slide">
		<div class="flash-message" v-if="$store.state.ui.flashMessage.isVisible">
			<p class="message">{{ flashMessage }}</p>
			<div class="close" @click="close"></div>
		</div>
	</transition>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		methods: {
			close () {
				this.$store.commit('ui/hideFlashMessage');
			}
		},
		computed: {
			...mapGetters({
				flashMessage: ['ui/getFlashMessage']
			})
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.flash-message {
		position:fixed;
		z-index:100000;
		top:16px; right:16px;
		display:flex;
		align-items:center;
		max-width:472px;
		padding:14px 48px 14px 24px;
		background-color:$black;
		p.message {
			margin:0;
			font-size:14px; line-height:1.4;
			font-weight:700;
			color:#fff;
		}
		.close {
			position:absolute;
			top:16px; right:12px; 
			width:18px; height:18px;
			background-image:url('~/assets/img/icons/icon-close-white.svg');
			background-size:100%;
			background-repeat:no-repeat;
			background-position:center;
			cursor:pointer;
		}
		&.slide-enter-active,
		&.slide-leave-active {
			transition:opacity .2s ease-out, transform 0.4s ease;
		}
		&.slide-enter,
		&.slide-leave-to {
			transform:translate3d(0,-40px,0);
			opacity: 0;
		}
	}
</style>
