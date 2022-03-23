<template>
	<component :is="wrapperElementTag" data-component="iorder-link"
	:to="href"
	:href="href"
	:data-size="size"
	:target="target"
	>
		<p data-element="text" :data-size="size">{{ text }}</p>
	</component>
</template>

<script>

	export default {
		props: [ 'text', 'href', 'size', 'link', 'external' ],
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

	[data-component='iorder-link'] {
		display:flex;
		align-items:center;
		justify-content:center;
		cursor:pointer;
		[data-element='text'] {
			color:$rebrand-green;
			font-size:12px;
			font-weight:bold;
			line-height:1.33;
			text-decoration:underline;
			margin-bottom:24px;
			&[data-size='sm'] {
				font-size:12px;
				font-weight:500;
			}
		}
	}
</style>
