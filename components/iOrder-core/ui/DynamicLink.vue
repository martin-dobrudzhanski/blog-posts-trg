<template>
	<no-ssr data-component="iorder-core-link">
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
		props: [ 'text', 'href', 'size', 'link', 'external', 'colour' ],
		components: {
			NoSSR
		},
		computed: {
			target () {
				if (!this.external) {
					return false;
				}
				return '_blank'
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
		[data-element='text'] {
			color:$rebrand-green;
			font-size:18px;
			font-weight:bold;
			line-height:1.33;
			text-decoration:underline;
			font-family:$font;
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
				font-weight:500;
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
