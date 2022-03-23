<template>
	<div data-element="btn-container">
		<nuxt-link data-component="btn"
			v-if="link"
			:to="href"
			:data-size="size"
			:data-inverse="inverse"
			:class="{ inactive: inactive }">
			<span v-if="!loading" data-element="text">{{ text }}</span>
			<div class="loader inverse" v-else></div>
		</nuxt-link>
		<button v-else
			data-component="btn"
			:data-size="size"
			:data-inverse="inverse"
			:class="{ inactive: inactive }"
			:disabled="inactive || loading">
			<div data-element="text-container">
				<span v-if="!loading" data-element="text">{{ text }}</span>
				<div class="loader inverse" v-else></div>
			</div>
		</button>
	</div>
</template>

<script>

	export default {
		props: [ 'text', 'link', 'href', 'size', 'inactive', 'loading', 'inverse' ]
	}
</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-element='btn-container'] {
		display:flex;
		align-items:center;
		justify-content:center;
		width:100%;
		-webkit-tap-highlight-color:transparent;
		@include whenScreenIs(sm) {
			display:flex;
			justify-content:center;
		}
			[data-component='btn'] {
				width:100%;
				display:flex;
				align-items:center;
				justify-content:center;
				height:48px; width:100%;
				color:#ffffff;
				background:$rebrand-blue;
				border:none;
				@include whenScreenIs(sm) {
					max-width:336px;
				}
				&:hover {
					cursor:pointer;
				}
				&[data-size='md'] {
					width:calc(100% - 32px);
					margin:0 16px;
					@include whenScreenIs(sm) {
						width:336px;
					}
				}
				&[data-size='sm'] {
					height:50px; width:72px;
					@include whenScreenIs(sm) {
						height:48px;
					}
				}
				&[data-inverse] {
					background:#ffffff;
					border:1px solid $rebrand-green;
					color:$rebrand-green;
				}
				&.inactive {
					background:#ffffff;
					border:1px solid $rebrand-green;
					color:$rebrand-green;
					opacity:0.3;
					pointer-events:none;
					&:hover {
						cursor:default;
					}
				}
				// Need this for Safari 10 flexbox button bug:
				[data-element='text-container'] {
					display:flex;
					align-items:center;
					justify-content:center;
					width:100%;
				}
				[data-element='text']{
					text-align:center;
					line-height:1.33;
					font-size:18px;
					font-weight:bold;
					font-family:$secondary-body-font;
				}
				outline:none;
				&:hover {
					background-color:$rebrand-green;
					cursor:pointer;
				}
				&:focus, &:active {
					background-color:$rebrand-green;
				}
		}
	}


</style>
