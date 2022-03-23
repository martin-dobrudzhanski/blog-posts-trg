<template>
	<div data-element="btn-container">
		<nuxt-link
		v-if="link"
		data-element="link"
		:to="href"
		>
			<div data-component="btn"
				:data-size="size"
				:class="{ inactive: inactive}">
				<span data-element="text">{{ text }}</span>
			</div>
		</nuxt-link>
		<button v-else
			data-component="btn"
			:data-size="size"
			:class="{ inactive: inactive}">
			<span data-element="text">{{ text }}</span>
		</button>
	</div>
</template>

<script>
	export default {
		props: [ 'text', 'link', 'href', 'size', 'inactive' ]
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
		cursor:pointer;
		[data-element='link'] {
			width:100%;
			@include whenScreenIs(sm) {
				display:flex;
				justify-content:center;
			}
			[data-component='btn'] {
				display:flex;
				align-items:center;
				justify-content:center;
				height:48px; width:100%;
				color:#ffffff;
				background:$rebrand-blue;
				cursor:pointer;
				@include whenScreenIs(sm) {
					max-width:328px;
				}
				&[data-size='md'] {
					@include whenScreenIs(sm) {
						width:208px;
					}
				}
				&[data-size='sm'] {
					height:50px; width:72px;
				}
				&.inactive {
					background:#ffffff;
					border:1px solid $rebrand-blue;
					color:#ffffff;;
					opacity:0.3;
					pointer-events:none;
				}
				[data-element='text']{
					text-align:center;
					line-height:1.2;
					font-size:20px;
					font-weight:normal;
					text-transform:uppercase;
					font-family:$secondary-body-font;
				}
			}
		}
		[data-component='btn'] {
			display:flex;
			align-items:center;
			justify-content:center;
			height:48px; width:100%;
			color:#ffffff;
			background:$rebrand-blue;
			border:none;
			@include whenScreenIs(sm) {
				max-width:328px;
			}
			&[data-size='md'] {
				@include whenScreenIs(sm) {
					width:208px;
				}
			}
			&[data-size='sm'] {
				height:50px; width:72px;
				@include whenScreenIs(sm) {
					height:48px;
				}
			}
			&.inactive {
				background:$rebrand-blue;
				border:1px solid $rebrand-blue;
				color:#ffffff;
				opacity:0.3;
				pointer-events:none;
			}
			[data-element='text']{
				text-align:center;
				line-height:1.2;
				font-size:20px;
				font-weight:normal;
				text-transform:uppercase;
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
