<template>
	<div data-element="iorder-header" :data-color="color">
        <h2 data-element="text">
            {{ text }}
        </h2>
	</div>
</template>

<script>
	export default {
		props: [ 'text', 'color' ]
	}
</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

		[data-element="iorder-header"] {
			position:relative;
			background:$booger-green;
			display:flex;
			align-items:center;
			justify-content: center;
			padding:16px;
			width:100%;
			height:56px;
			&[data-color="green"] {
				background:$booger-green;
			}
			&[data-color="grey"] {
				background:$white-two;
				h2 {
					color: black;
					letter-spacing: 0.3px;
				}

			}
			[data-element='text'] {
        color: white;
				font-size:20px;
				font-weight:normal;
				font-family:$display-font;
				text-transform:uppercase;
			}
		}


</style>
