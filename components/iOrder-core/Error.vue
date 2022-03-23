<template lang="html">
	<section class="drinks-error" data-fullscreen>
		<section-header inverse="true" :text="heading" />
		<p data-element="error-text">{{ text }}</p>
		<btn size="md" :link="btnLink" :text="btnText" :href="btnLink" @click.native="clickBtn" />
		<div data-element="link-row" data-center="true">
			<dynamic-link
			text="Terms and conditions"
			size="sm"
			:link="true"
			href="/terms"
			/>
		</div>
	</section>
</template>

<script>

	import SectionHeader            from '~/components/iOrder-core/ui/SectionHeader';
	import DynamicLink              from '~/components/iOrder-core/ui/DynamicLink';
	import Btn                     from '~/components/iOrder-core/ui/Btn';

	export default {
		props: [ 'heading', 'text', 'btnText', 'btnBack', 'btnLink' ],
		components: {
			SectionHeader,
			DynamicLink,
			Btn
		},
		methods: {
			clickBtn () {
				if (!this.btnBack) {
					return;
				}
				this.$router.go(-1);
			}
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	.drinks-error {
		background:#ffffff;
		display:flex;
		flex-direction:column;
		align-items:center;
		padding-top:40px;
		@include whenScreenIs(sm) {
			padding-top:80px;
		}
		[data-component='drinks-header'] {
			@include whenScreenIs(sm) {
				margin-bottom:24px;
			}
		}
		[data-element='error-text'] {
			width:328px;
			font-size:16px;
			font-weight:bold;
			line-height:1.25;
			margin-bottom:24px;
			text-align:center;
			@include whenScreenIs(sm) {
				width:476px;
				height:40px;
				margin-bottom:40px;
			}
		}
		hr {
			color:$rebrand-green;
			background:$rebrand-green;
			border:none;
			height:2px; width:328px;
			margin:0 auto;
			@include whenScreenIs(sm) {
				width:448px;
			}
		}
		[data-component='btn'] {
			margin:0 auto;
			@include whenScreenIs(sm) {
				margin-top:16px;
			}
		}
		[data-element='link-row'] {
			display:flex;
			flex-direction:row;
			justify-content:space-between;
			margin:0 auto;
			padding-top:24px;
			width:296px;
			@include whenScreenIs(sm) {
				width:448px;
			}
			&[data-center] {
				justify-content:center;
			}
		}
	}
</style>
