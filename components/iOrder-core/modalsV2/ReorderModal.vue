<template>
	<div data-component="reorder-modal">
		<section-header text="Would you like to order the same round?" size="md" :modalHeader="true"/>
		<div data-element="content">
			<btn
			text="No"
			inverse="true"
			size="md"
			@click.native="closeModal" />
			<btn
			text="Yes"
			size="md"
			@click.native="reorder" />
		</div>
	</div>
</template>

<script>

	import SectionHeader from '~/components/iOrder-core/ui/SectionHeader';
	import Btn from '~/components/iOrder-core/ui/Btn';

	export default {
		props: [
			'closeModal',
			'reorder'
		],
		components: {
			SectionHeader,
			Btn
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='reorder-modal'] {
		position:relative;
		width:312px; height:176px;
		background-color:#fff;
		box-shadow:0 2px 4px rgba(0, 0, 0, 0.5);
		@include whenScreenIs(sm) {
			width:464px; height:360px;
		}
		[data-element='content'] {
			display:flex;
			align-items:center;
			justify-content:center;
			height:98px;
			@include whenScreenIs(sm) {
				height:307px;
			}
		}
	}

</style>
