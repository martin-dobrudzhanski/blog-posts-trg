<template>
	<transition name="slide-up-fade" mode="out-in">
		<div data-component="iorder-login-modal">
			<header data-element="subheading">
				<h1 data-size="xl" data-weight="black">
					Login or register
				</h1>
				<Icon :icon="'close'" clickable="true" @click.native="$store.dispatch('iorderAuth/hideModal')" />
			</header>
			<div data-element="text-block">
				<p>Please login or register to complete your order</p>
			</div>

			<div data-element="user-details">
				<div data-element="form-wrapper">
					<div data-element="user-form">
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
						<div data-element="form-row" :data-disabled="false">
							<p data-element="field-header">Password</p>
							<div data-element="input-wrapper">
								<input
								data-element="input"
								placeholder="Password"
								v-model="password"
								v-validate="'required'"
								name="password"
								type="password"
								/>
								<icon
								v-if="getIcon('password')"
								:icon="getIcon('password')"
								size="sm"
								/>
							</div>
							<div data-element="error-message">
								{{ errors.first('password') }}
							</div>
						</div>
						<div data-element="form-row" class="create-content" >
							<span>Dont have an account?</span>
							<strong @click="$store.dispatch('iorderAuth/showRegisterModal')">Register now</strong>
						</div>
						<div data-element="form-row">
							<btn
							text="Login"
							:inactive="isDisabled || isSubmitting"
							:loading="isSubmitting"
							size="full"
							@click.native="login"
							>Login</btn>
						</div>
						<div data-element="form-row">
							<iOrderLink
							data-element="reset-link"
							text="Forgot Password?"
							size="sm"
							@click.native="$store.dispatch('iorderAuth/showResetPasswordModal')"
							/>
						</div>
					</div>
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
			email: '',
			password: ''
		}
	},
	computed: {
		isDisabled () {
			return !this.email || !this.password || this.errors.items.length
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
		async login () {
			if (this.isDisabled || this.isSubmitting) {
				return;
			}
			this.isSubmitting = true
			const success = await this.$store.dispatch('iorderAuth/login', {
				email: this.email,
				password: this.password
			})
			if (!success) {
				this.email = ''
				this.password = ''
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


[data-component='iorder-login-modal'] {
	position:relative;
	width:100%; height:100%;
	background-color:#fff;
	box-shadow:0 2px 4px rgba(0, 0, 0, 0.5);
	@include whenScreenIs(sm) {
		width:400px; height:544px;
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
		display: flex;
		align-items: center;
		justify-content: center;
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
				padding-bottom: 24px;
				.create-content {
					flex-direction: row;
					margin-bottom: 10px;
					color: $rebrand-green;
					strong {
						text-decoration: underline;
						font-weight: 700;
						padding-left: 5px;
					}
				}
			}
		}
		[data-element='form-row'] {
			@extend .form-row;
			[data-element='input-wrapper'] {
				position:relative;
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
