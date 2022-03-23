<template lang="html">
	<section
		class="error-component"
		data-fullscreen
	>
		<div data-element="main">
			<section-header
				inverse="true"
				background="transparent"
				:text="heading"
			/>
			<p data-element="error-text">
				{{ text }}
			</p>
		</div>
		<btn
			size="md"
			:text="btnText"
			@click.native="clickBtn"
		/>
		<div
			data-element="link-row"
			data-center="true"
		>
			<dynamic-link
				v-if="!hideTerms"
				text="Terms and conditions"
				size="sm"
				:link="true"
				href="/terms"
			/>
		</div>
	</section>
</template>

<script>

	import SectionHeader from '~/components/iOrder-core/uiV2/SectionHeader';
	import DynamicLink   from '~/components/iOrder-core/uiV2/DynamicLink';
	import Btn           from '~/components/iOrder-core/uiV2/Btn';

	export default {
		props: [
			'heading',
			'text',
			'btnText',
			'btnBack',
			'btnLink',
			'hideTerms'
		],
		components: {
			SectionHeader,
			DynamicLink,
			Btn
		},
		methods: {
			clickBtn () {
				if (this.btnLink) {
					return this.$router.push(this.btnLink);
				}
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

	.error-component {
		background:transparent;
		display:flex;
		flex-direction:column;
		align-items:center;
		@include whenScreenIs(sm) {
			padding-top:80px;
		}
		[data-element='main'] {
			height:196px;
			[data-component='drinks-header'] {
				@include whenScreenIs(sm) {
					margin-bottom:24px;
				}
			}
			[data-element='error-text'] {
				width:328px;
				font-size:16px;
				font-weight:normal;
				line-height:1.19;
				margin:auto;
				margin-bottom:24px;
				text-align:center;
				@include whenScreenIs(sm) {
					width:476px;
					height:40px;
					margin-bottom:40px;
				}
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
