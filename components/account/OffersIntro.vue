<template>
	<div class="offers-intro">
		<h1 class="heading" data-size="lg" data-weight="normal">{{ content.howItWorksHeader }}</h1>
		<div class="item">
			<div class="number one">1</div>
			<p class="heading" data-size="xs" data-weight="bold">{{ content.howItWorksLine1 }}</p>
		</div>
		<div class="item">
			<div class="number two">2</div>
			<p class="heading" data-size="xs" data-weight="bold">{{ content.howItWorksLine2 }}</p>
		</div>
		<div class="item">
			<div class="number three">3</div>
			<p class="heading" data-size="xs" data-weight="bold">{{ content.howItWorksLine3 }}</p>
		</div>
	</div>
</template>

<script>

	export default {
		props: ['content']
	}
</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.offers-intro {
		box-sizing:border-box;
		overflow:hidden;
		display:flex;
		flex-direction:column;
		flex-wrap:nowrap;
		align-items:center;
		padding:30px 0;
		background-color:$booger-green;
		border:46px solid $light-grey;
		@include whenScreenIs(xs) {
			height:auto;
			padding:16px 16px 22px 23px;
			border:none;
		}
		h1.heading {
			margin:0 0 40px;
			text-align:center;
			color:#fff;
			@include whenScreenIs(xs) {
				margin:0 0 20px;
			}
		}
		.item {
			display:flex;
			flex-direction:column;
			align-items:center;
			justify-content:center;
			margin-bottom:35px;
			&:last-child {
				margin-bottom:0;
			}
			p.heading {
				font-size:14px;
			}
			@include whenScreenIs(xs) {
				flex-direction:row;
				justify-content:flex-start;
				width:100%;
				margin:0 0 14px;
			}
			.number {
				display:block;
				margin:0 0 9px;
				font-family:monotonia;
				font-size:37px;
				@include whenScreenIs(xs) {
					font-size:24px;
					margin:5px 11px 0 0;
				}
				&.one, &.three   { transform:rotate(-6deg); }
				&.two   { transform:rotate(6deg) }
			}
			p {
				color:#fff;
				text-align:center;
				@include whenScreenIs(xs) {
					text-align:left;
				}
			}
		}
	}


</style>
