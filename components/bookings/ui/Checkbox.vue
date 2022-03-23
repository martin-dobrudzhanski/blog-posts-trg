<template>
  <div data-component="checkbox">
		<input
			type="checkbox"
			data-element="checkbox-input"
			:id="id"
			:required="required"
			:checked="checked"
			:disabled="disabled"
			@change="$emit('toggle')"
		>
		<label
			data-element="checkbox-label"
			:for="id"
		>
			<p>
				{{ label }}
				<span data-element="label-link" v-if="link">
					<a :href="link.link" target="_blank">
						{{ link.copy }}
					</a>
				</span>
			</p>
		</label>
	</div>
</template>

<script>

	export default {

		props: [
			'label',
			'required',
			'valueUpdate',
			'checked',
			'link',
			'disabled'
		],
		computed: {
			id () {
				return this._uid;
			}
		}
	}

</script>

<style lang="scss" scoped>

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	[data-component='checkbox'] {
		position:relative;
		display:block;
		min-height:24px;
		margin:0 0 24px;
		width:100%;
		user-select:none;
		-webkit-tap-highlight-color:transparent;
		@media(min-width:$bookings-mobile) {
			width:328px;
		}
		[data-element="checkbox-input"] {
			position:absolute;
			z-index:-1;
			opacity:0;
			&:checked ~ [data-element="checkbox-label"]:after {
				background-image:url('~/assets/img/bookings/icons/checkbox-active.svg');
			}
		}
		[data-element="checkbox-label"] {
			display:flex;
			align-items:center;
			height:24px;
			margin:0;
			padding-left:40px;
			cursor:pointer;
			line-height:1.3;

			a {
				color: $black;
			}

			&:before,
			&:after {
				content:'';
				position:absolute;
				top:0; left:0;
				display:block;
				width:24px; height:24px;
			}

			&:before {
				pointer-events:none;
				user-select:none;
				background-color:#fff;
				border-radius: 50%;
			}

			// Foreground (icon)
			&:after {
				background-image:url('~/assets/img/bookings/icons/checkbox.svg');
				background-size:100%;
				background-repeat:no-repeat;
			}
			[data-element="label-link"] {
				text-decoration:underline;
			}
		}
	}


</style>
