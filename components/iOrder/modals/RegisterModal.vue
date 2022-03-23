<template>
	<transition name="slide-up-fade" mode="out-in">
		<div data-component="iorder-register-modal">
			<header data-element="subheading">
				<h1 data-size="xl" data-weight="black">
					Create Account
				</h1>
				<Icon :icon="'close'" clickable="true" @click.native="$store.dispatch('iorderAuth/hideModal')" />
			</header>
			<div data-element="text-block">
				<p>Please enter your details.</p>
			</div>

			<div data-element="user-details">
				<div data-element="form-wrapper">
					<form data-element="user-form" @submit.prevent="register">

						<div data-element="form-row">
							<p data-element="field-header">
								Email Address
							</p>
							<div data-element="input-wrapper">
								<input
								data-element="input"
								placeholder="Email"
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
						<div data-element="form-row">
							<p data-element="field-header">
								Name
							</p>
							<div data-element="input-wrapper">
								<input
								data-element="input"
								placeholder="Name"
								v-model="name"
								v-validate="'required'"
								name="name"
								type="name"
								/>
								<icon
								data-component="icon"
								data-position="left"
								v-if="getIcon('name')"
								:icon="getIcon('name')"
								size="sm"
								/>
							</div>
							<div data-element="error-message">
								{{ errors.first('name') }}
							</div>
						</div>
						<div data-element="form-row" :data-disabled="false">
							<p data-element="field-header">Password</p>
							<div data-element="input-wrapper">
								<input
								data-element="input"
								placeholder="Password"
								v-model="password"
								v-validate="'required|min:5'"
								name="password"
								type="password"
								ref="password"
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
						<div data-element="form-row" :data-disabled="false">
							<p data-element="field-header">Confirm Password</p>
							<div data-element="input-wrapper">
								<input
								data-element="input"
								placeholder="Confirm password"
								v-model="confirmPassword"
								v-validate="'required|confirmed:password'"
								name="confirmPassword"
								type="password"
								/>
								<icon
								v-if="getIcon('confirmPassword')"
								:icon="getIcon('confirmPassword')"
								size="sm"
								/>
							</div>
							<div data-element="error-message">
								{{ errors.first('confirmPassword') }}
							</div>
						</div>
						<div data-element="form-row" >
							<btn
							size="full"
							text="Register"
							:inactive="isDisabled"
							/>
						</div>
						<div data-element="form-row">
							<iOrderLink
								data-element="reset-link"
								text="Forgot Password?"
								size="sm"
								@click.native="$store.dispatch('iorderAuth/showResetPasswordModal')"
								/>
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
				email: '',
				name: '',
				password: '',
				confirmPassword: ''
			}
		},
		computed: {
				isDisabled () {
						return !this.email || !this.password || !this.confirmPassword || this.errors.items.length
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
			async register () {
				if (this.isDisabled || this.isSubmitting) {
					return;
				}
				this.isSubmitting = true
				const success = await this.$store.dispatch('iorderAuth/register', {
					email: 		this.email,
					password: 	this.password,
					firstName: 		this.name
				})
				if (!success) {
					this.email = ''
					this.password = ''
					this.name = ''
					this.confirmPassword = ''
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


	[data-component='iorder-register-modal'] {
		position:relative;
		width:100%; height:100%;
		background-color:#fff;
		box-shadow:0 2px 4px rgba(0, 0, 0, 0.5);
		@include whenScreenIs(sm) {
			width:400px; height:672px;
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
