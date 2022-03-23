<template>
	<div class="slide-body">
		<dual-link v-if="card.fields.buttonLink" :href="card.fields.buttonLink || '/'" :linkInfo="card.fields">
			<div class="card-top">
				<div class="card-image"
					:style="{backgroundImage: `url(${imageUrl}?h=500&q=100)`}">
				</div>
			</div>
			<div class="card-bottom" :class="card.fields.color">
				<div class="card-title">
					<h1 class="heading card-text" data-size="xl" data-weight="normal">{{ card.fields.title }}</h1>
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
		height:100%;
		a {
			width:100%; height: 100%;
			box-sizing:border-box;
			.card-left,
			.card-right {
				vertical-align: top;
	    }
			.card-top {
				@include fadeIn();
				overflow: hidden;
				.card-image {
					height: 144px;
					background-position:center;
					background-repeat:no-repeat;
					background-size:cover;
					@include EnlargeHover();
				}
			}
			.card-bottom {
				position:relative;
				display:flex;
				flex-direction:column;
				align-items:center;
				height:88px;
				padding:0 8px;
				&.orange { @include tileFormat($color:orange); }
				&.green { @include tileFormat($color:green); }
				&.grey { @include tileFormat($color:grey); }
				.card-title {
					display:flex;
					align-items:center;
					justify-content:center;
					flex-grow:1;
					h1 {
						width:100%;
						line-height: 0.86;
						margin-bottom:0;
					}
				}
				p.card-text {
					font-size:12px;
					font-weight:400;
					text-align: center;
					margin-bottom:13px;
					.bold {
						font-weight:700;
						margin: 0;
					}
				}
			}
		}
  }

</style>
