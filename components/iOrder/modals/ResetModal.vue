<template>
	<transition name="slide-up-fade" mode="out-in">
		<div data-component="iorder-reset-modal">
			<header data-element="subheading">
				<h1 data-size="xl" data-weight="black">
					Reset Password
				</h1>
				<Icon :icon="'close'" clickable="true" @click.native="$store.dispatch('iorderAuth/hideModal')" />
			</header>
			<div data-element="text-block">
				Enter your email and click Continue. If you have an account with us we will send you an email with details about your new password.
			</div>

			<div data-element="user-details">
				<div data-element="form-wrapper">
					<form data-element="user-form" @submit.prevent="resetPassword">

						<div data-element="form-row">
							<p data-element="field-header">
								Email Address
							</p>
							<div data-element="input-wrapper">
								<input
								data-element="input"
								placeholder="Your email"
								v-model="email"
								v-validate="'required|verify_email'"
								name="email"
								type="email"
								/>
								<icon
								data-component="icon"
								data-position="left"
								v-if="getIcon('email')"
								:icon="getIcon('email')"
								size="sm"
								/>
							</div>
							<div data-element="error-message">
								{{ errors.first('email') }}
							</div>
						</div>

						<div data-element="form-row" >

							<btn
							size="full"
							text="Continue"
							:inactive="isDisabled"
							>Continue</btn>
						</div>

					</form>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>

import Icon from '~/components/iOrder-core/ui/Icon';
import Btn from '~/components/iOrder/Button';
import iOrderLink from '~/components/iOrder/Link';

export default {
	components: {
		Icon,
		Btn,
		iOrderLink
	},
	data () {
		return {
			isSubmitting: false,
			email: ''
		}
	},
	computed: {
		isDisabled () {
			return !this.email || this.errors.items.length
		}
	},
	methods: {
		getIcon (fieldName) {
			if (!this[fieldName]) {
				return false;
			}
			if (this.errors.first(fieldName)) {
				return 'error-form';
			}
			return 'correct-form';
		},
		async resetPassword () {
			if (this.isDisabled ||	this.isSubmitting) {
				return;
			}
			this.isSubmitting = true
			const success = await this.$store.dispatch('iorderAuth/resetPassword', {
				email: this.email
			})
			if (!success) {
				this.email = ''
				this.isSubmitting = false
				return
			}

		}
	}
}

</script>

<style lang="scss" scoped>

@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/iorder-core/form-row.scss';


[data-component='iorder-reset-modal'] {
	position:relative;
	width:100%; height:100%;
	background-color:#fff;
	box-shadow:0 2px 4px rgba(0, 0, 0, 0.5);
	@include whenScreenIs(sm) {
		width:460px; height:400px;
	}
	[data-element='subheading'] {
		height: 70px; line-height: 70px;
		font-size: 24px;
		color: $booger-green;
		text-align:center;
		position: relative;
		h1 {
			font-weight: 900;
		}
		[data-component="icon"] {
			position: absolute;
			top: 24px; right: 24px;
		}
	}
	[data-element='text-block'] {
		padding: 0 16px;
		margin: 22px 0;
	}

	[data-element='user-details'] {
		background:#ffffff;

		[data-element='form-wrapper'] {
			@include whenScreenIs(sm) {
				display:flex;
				flex-direction:row;
			}

			[data-element='user-form'] {
				@media (min-width: 500px) {
					padding:0 16px 0;
				}
				margin:0 auto;
				padding-bottom:24px;
				@include whenScreenIs(sm) {
					max-width:none;
					width:100%;
					margin:0;
					padding:0 24px;
				}
			}
		}
		[data-element='form-row'] {
			@extend .form-row;
			@include whenScreenIs(sm) {
				width:100%;
				padding:0;
			}
			[data-element='input-wrapper'] {
				position:relative;
				@include whenScreenIs(sm) {
					width:100%;
				}
				[data-component='icon'] {
					position:absolute;
					right:8px;
					top:12px;
				}
			}
		}
	}
}

</style>
