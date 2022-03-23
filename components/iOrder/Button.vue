<template>
	<div data-element="btn-container" :data-size="size">
		<nuxt-link
		v-if="link"
		data-element="link"
		:to="href"
		>
			<div data-component="btn"
				:data-size="size"
				:class="{ inactive: inactive, loading: loading }">
				<div class="loader white inverse" v-if="loading"></div>
				<span v-else data-element="text">{{ text }}</span>
			</div>
		</nuxt-link>
		<button v-else
			data-component="btn"
			:data-size="size"
			:class="{ inactive: inactive, loading: loading}">
			<div class="loader white inverse" v-if="loading"></div>
			<span v-else data-element="text">{{ text }}</span>
		</button>
	</div>
</template>



<script>
	export default {
		props: [ 'text', 'link', 'href', 'size', 'inactive', 'loading' ],
	}
</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-element='btn-container'] {
		display:flex;
				justify-content: space-between;
				flex-wrap: wrap;
				width:159px;
				@include whenScreenIs(sm) {
						width: 130px;
				}
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
				&.inactive {
					opacity:0.3;
					pointer-events:none;
				}
				&.loading {
					background-color:$rebrand-teal;
					pointer-events:none;
				}
				[data-element='text']{
					text-align:center;
					line-height:1.33;
					font-size:18px;
					font-weight:bold;
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
			cursor:pointer;
			@include whenScreenIs(sm) {
				max-width:328px;
			}
			&.inactive {
				opacity:0.3;
				pointer-events:none;
			}
			&.loading {
				background-color:$rebrand-green;
				pointer-events:none;
			}
			[data-element='text']{
				text-align:center;
				line-height:1.33;
				font-size:18px;
				font-weight:normal;
				font-family:$secondary-body-font;
				text-transform:uppercase;
			}
			outline:none;
			&:hover {
				&:not(.loading) {
					background-color:$rebrand-green;
				}
				cursor:pointer;
			}
			&:focus, &:active {
				background-color:$rebrand-green;
			}
		}
		&[data-size='full'] {
			width: 100%;
			@include whenScreenIs(sm) {
				width: 100%;
			}
			[data-element='link'] {
				[data-component='btn'] {
					@include whenScreenIs(sm) {
						max-width:none;
					}
				}
			}
			[data-component='btn'] {
				@include whenScreenIs(sm) {
					max-width:none;
				}
			}
		}
		&[data-size='md'] {
			[data-element='link'] {
				[data-component='btn'] {
					@include whenScreenIs(sm) {
						width:208px;
					}
				}
			}
			[data-component='btn'] {
				@include whenScreenIs(sm) {
					width:208px;
				}
			}
		}
		&[data-size='sm'] {
			[data-element='link'] {
				[data-component='btn'] {
					height:50px; width:72px;
				}
			}
			[data-component='btn'] {
				height:50px; width:72px;
				@include whenScreenIs(sm) {
					height:48px;
				}
			}
		}
	}

</style>
