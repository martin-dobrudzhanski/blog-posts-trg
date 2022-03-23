<template>
	<div class="slide-body">
		<dual-link :href="card.fields.buttonLink || '/'" :linkInfo="card.fields">
			<div class="card-top">
				<div class="card-image"
					:style="{backgroundImage: `url(${imageUrl}?h=500)`}">
				</div>
			</div>
			<div class="card-bottom" :class="card.fields.color">
				<div class="card-title">
					<h1 class="heading card-text" data-weight="normal" data-size="lg">{{ card.fields.title }}</h1>
				</div>
				<p class="card-text">Part of our <span class="bold">{{card.fields.buttonText}}</span></p>
			</div>
		</dual-link>
	</div>
</template>

<script>
	import DualLink from '@/components/ui/DualLink';

	export default {
		props: ['card'],
		components: {
			DualLink
		},
		computed: {
			imageUrl () {
				return this.card &&
						this.card.fields &&
						this.card.fields.image &&
						this.card.fields.image.fields &&
						this.card.fields.image.fields.file &&
						this.card.fields.image.fields.file.url
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/mixins/tiles.scss';

	.slide-body {
		height: 100%;
		width: 100%;
		overflow: hidden;
		box-sizing:border-box;
		.card-top,
		.card-bottom {
			vertical-align: top;
		}
		.card-top {
			@include fadeIn();
			overflow: hidden;
			.card-image {
				height: 184px;
				background-position: center center;
				background-size: cover;
				@include EnlargeHover();
			}
		}
		.card-bottom {
			display:flex;
			flex-direction:column;
			justify-content:space-between;
			height: 104px;
			padding:0 8px;
			&.orange { @include tileFormat($color:orange); }
			&.green { @include tileFormat($color:green); }
			&.grey { @include tileFormat($color:grey); }
			.card-title {
				display:flex;
				align-items:center;
				justify-content:center;
				flex-grow:1;
				h1.card-text {
					&.heading {
						font-size:28px;
						line-height:0.86;
					}
				}
			}
			p.card-text {
				text-align: center;
				font-weight:400;
				width: 100%;
				margin-bottom:13px;
				.bold {
					font-weight: 700;
					margin: 0;
				}
			}
		}
	}

</style>
