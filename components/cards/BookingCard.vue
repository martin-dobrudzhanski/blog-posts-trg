<template>
	<div class="card booking-card">
		<h1 class="heading" data-weight="normal" data-size="xl" data-align="center">{{card.headerText}}</h1>
		<img :src="`${imgUrl}?w=188`">
		<a ref="bookingModalLink" id="target" class="btn" data-size="lg">Click here</a>
	</div>
</template>

<script>

	export default {
		props: ['card'],
		computed: {
			imgUrl () {
				return this.card &&
						this.card.headerImage &&
						this.card.headerImage.fields &&
						this.card.headerImage.fields.file &&
						this.card.headerImage.fields.file.url
			}
		},
		mounted () {
			$(() => {
				$(this.$refs.bookingModalLink).lbuiDirect({
					connectionid: "UK-RES-FRANKIEANDBENNYSGROUP:69075",
					modalWindow: {
						enabled:  true
					}
				});
			});
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';
	@import '~assets/css/mixins/tiles.scss';

	.booking-card {

		text-align:center;
		height:228px;

		@include whenScreenIs(mdx) {
			height:393px;
		}

		background-color:$white-three;
		height:228px;
		padding:16px;
		h1 {
			color: $rebrand-orange;
			@include whenScreenIs(mdx) {
				margin-top:8px;
			}
		}
		img {
			display:block;
			width:94px; height:auto;
			margin:16px auto 0;
			@include whenScreenIs(mdx) {
				width:108px;
				margin:82px auto 0;
			}
		}
		a {
			margin:0 auto;
			&:hover {
				background-color: $light-green;
				color: white;
			}
		}

	}

</style>
