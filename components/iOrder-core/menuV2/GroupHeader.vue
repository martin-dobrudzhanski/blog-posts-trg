<template>
	<div data-component="group-header"
		:data-expanded="expanded"
		@click="handleClick">
		<p data-element="group-name"
			:data-bold="expanded"
			:data-size="size">
			{{ text }}
		</p>
		<div
			v-if="!hideChevron"
			data-element="icon-container"
			data-position="right"
			:data-modal="modal"
		>
			<icon
				icon="collapse-arrow-light"
				size="sm"
				data-element="icon"
				:class="{ rotated: expanded }"
			/>
		</div>
	</div>
</template>

<script>
	import Icon from '~/components/iOrder-core/uiV2/Icon';

	export default {
		props: [ 'handleClick', 'expanded', 'text', 'size', 'modal', 'hideChevron' ],
		components: {
			Icon
		}
	}
</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='group-header'] {
		position:relative;
		display:flex;
		align-items:center;
		height:48px;
		color:$black;
		font-family:$font;
		text-transform:none;
		font-size:18px;
		font-weight:normal;
		line-height:1.22;
		border-bottom:2px solid $rebrand-orange;
		transition:1s border-color ease;
		&[data-expanded] {
			border-color:$white-two;
		}
		[data-element='icon'] {
			-webkit-transition: all 0.5s ease-in-out;
			-o-transition: all 0.5s ease-in-out;
			transition: all 0.5s ease-in-out;
			&[data-size='md']  {
				@include whenScreenIs(mdx) {
					display:none;
				}
			}
			&.rotated {
				-webkit-transform: rotate(180deg);
				-ms-transform: rotate(180deg);
				-o-transform: rotate(180deg);
				transform: rotate(180deg);
			}
		}
		[data-element='icon-container'] {
			position:absolute;
			display:inline-block;
			&:not([data-modal]) {
				@include whenScreenIs(mdx) {
					display:none;
				}
			}
			&[data-position='right'] {
				right:0;
				top:13px;
			}
			&[data-modal] {
				right:0;
			}
		}
		[data-element='group-name'], [data-element='icon-container']{
			cursor: pointer;
		}
		[data-element='group-name'] {
			&[data-size='md'] {
				font-size: 22px !important;
				font-family: $display-font;
				color: $rebrand-orange;
				@include whenScreenIs(mdx) {
					font-size:28px;
					line-height: 24;
					// font-weight:800;
				}
			}
			&[data-bold] {
				// font-weight:bold;
			}
		}
	}
</style>
