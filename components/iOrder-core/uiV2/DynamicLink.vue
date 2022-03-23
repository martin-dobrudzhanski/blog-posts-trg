<template>
	<no-ssr
		data-component="iorder-core-link"
		:data-left="left"
	>
		<div>
			<component :is="wrapperElementTag"
			:to="href"
			:href="href"
			:data-size="size"
			:target="target"
			>
				<p data-element="text" :data-size="size" :class="colour">{{ text }}</p>
			</component>
		</div>
	</no-ssr>
</template>

<script>

	import Vue from 'vue';
	import NoSSR from 'vue-no-ssr';
	export default {
		props: [ 'text', 'href', 'size', 'link', 'external', 'left', 'newTab', 'colour' ],
		components: {
			NoSSR
		},
		computed: {
			target () {
				if (this.external || this.newTab) {
					return '_blank';
				}
				return false;
			},
			wrapperElementTag () {
				if (this.external === true) {
					return 'a'
				}
				if (this.link === true) {
					return 'nuxt-link'
				}
				return 'div'
			}
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='iorder-core-link'] {
		display:flex;
		align-items:center;
		justify-content:center;
		&[data-left] {
			@include whenScreenIs(mdx) {
				justify-content:flex-start;
				padding-left:8px;
			}
		}
		[data-element='text'] {
			color:$black;
			font-size:18px;
			font-weight:bold;
			line-height:1.33;
			text-decoration:underline;
			&:hover {
				cursor:pointer;
			}
			&[data-size='sm'] {
				font-size:12px;
				font-weight:500;
				@include whenScreenIs(sm) {
					font-size:16px;
					line-height:1.13;
				}
			}
			&[data-size='xs'] {
				font-size:12px;
				font-weight:normal;
				line-height:1.5;
			}
			&[data-size='md'] {
				font-size:13px;
				font-weight:normal;
			}
			&.blue {
				color:$rebrand-blue;
			}
			&.black {
				color:$black;
			}
		}
	}
</style>
