<template>

	<div class="login-form form-container" :data-size="size" :data-fullscreen="size === 'lg'">
		<h1 class="form-heading" :data-size="size">{{ content.pageHeaderText }}</h1>


		<form class="form" :data-size="size" @submit.prevent="submit('login')">


			<button v-if="showFacebookLogin" class="btn facebook-button"
				:data-loading="loaders.facebook"
				type="button"
				@click.prevent="submit('socialLogin')">
					<img class="facebook-logo" src="~assets/img/icons/icon-fb-square.svg" />
					Continue with Facebook
				<div class="loader" v-if="loaders.facebook"></div>
			</button>

			<p class="text" v-if="showFacebookLogin" >Or</p>

			<div class="field">
				<div class="field-header">
					<label for="email">Email address:<span class="required">*</span></label>
				</div>
				<div class="control">
					<input v-model="email" placeholder="Your email" id="email" v-validate="'required|verify_email'" class="input" :data-invalid="errors.has('email')" data-vv-name="email" type="email" />
				</div>
				<div class="field-footer">
					<p v-show="errors.has('email')" class="help">{{ errors.first('email') }}</p>
				</div>
			</div>

			<div class="field" :class="{ 'no-social-login': !showFacebookLogin}">
				<div class="field-header">
					<label for="password">Password:<span class="required">*</span></label>
				</div>
				<div class="control">
					<input v-model="password" placeholder="Password" id="password" v-validate="'required|min:8|max:20|verify_password'" class="input" :data-invalid="errors.has('password')" data-vv-name="password" type="password" />
				</div>
				<div class="field-footer">
					<p v-show="errors.has('password')" class="help">{{ errors.first('password') }}</p>
				</div>
			</div>

			<div class="checkbox gdpr-input" v-if="showOptOutField">

				<input type="checkbox"
					v-model="optIn"
					class="checkbox-input" id="checkbox">
				<label class="checkbox-label" for="checkbox">We would like to send you special offers, discount vouchers and news about Chiquito by email. If you do not want to receive these, please tick the box. For further information see our Privacy Policy.</label>
			</div>

			<div class="controls buttons">
				<button class="btn"
					v-if="!showOptOutField"
					data-color="rebrand-blue"
					data-size="md"
					:data-loading="loaders.login"
					type="submit"
					@click.prevent="submit('login')">Log in
					<div class="loader" v-if="loaders.login"></div>
				</button>

				<button class="btn login-button"
					data-color="rebrand-blue"
					:class="{ 'single-button': showOptOutField }"
					data-size="md"
					:data-loading="loaders.register"
					type="submit"
					@click.prevent="submit('register')">Register
					<div class="loader" v-if="loaders.register"></div>
				</button>
			</div>

			<div class="controls">
				<nuxt-link class="text" to="/forgotten-password">{{ showOptOutField ? 'Reset password' : 'Forgot password?' }}</nuxt-link>
			</div>

		</form>

		<VueMarkdown
			v-if="content && content.bodyText"
			class="body-text"
			:source="content.bodyText"
		/>

	</div>

</template>

<script>

	import axios from '~/plugins/axios';
	import VueMarkdown from 'vue-markdown'
	import { mapActions } from 'vuex'

	export default {
		props: ['size', 'content', 'redirect'],
	    components: {
				VueMarkdown
	    },
		data () {
			return {
				loaders: {
					login: false,
					register: false,
					facebook: false
				},
				showOptOutField: false,
				email: '',
				password: '',
				optIn: false,
        action: null
      }
		},
		computed: {
			submissionData () {
				return {
					register: {
						email: this.email,
						password: this.password,
						optIn: !this.optIn
					},
					login: {
						email: this.email,
						password: this.password
					}
				}
			},
			isApp () {
				return this.$store.state.ui.isApp
			},
			showFacebookLogin () {
	      if (this.isApp) {
	        return this.content && this.content.showFacebookLoginApp
	      }
				return this.content && this.content.showFacebookLogin
			}
		},
		methods: {
			...mapActions({
				'login': 'auth/login',
				'register': 'auth/register',
				'flash': 'ui/flash',
				'registerEmarsysUser': 'auth/registerEmarsysUser',
				'socialLogin': 'auth/socialLogin'
			}),

			submit (action) {
        this.action = action
				if (action === 'register' && !this.showOptOutField) {
					this.showOptOutField = true
					return;
				} else if (action === 'login') {
					this.$validator.validateAll().then((result) => {
						if (!result || this.loaders.login || this.loaders.register) {
							return;
						}
						this.loaders[action] = true
						this[action](this.submissionData[action])
							.then(this.handleSuccess)
							.catch(err => this.handleFailure(err, action) )
					})
				} else if (action === 'socialLogin') {
					this.loaders.facebook = true
					return this[action]()
						.then(({ statusCode, email }) => {
							this.handleSuccess(statusCode, email)
						})
						.catch(err => this.handleFailure(err, action))
				}

				this.$validator.validateAll().then((result) => {
					if (!result || this.loaders.login || this.loaders.register) {
						return;
					}

					this.loaders[action] = true
					this[action](this.submissionData[action])
						.then(this.handleSuccess)
						.catch(err => this.handleFailure(err, action) )
				})
			},

			handleSuccess (socialLoginStatusCode, socialLoginEmail) {
        this.$logExponeaWalletAction({
          action: this.action,
          extraProperties: {
            ...this.submissionData[this.action],
            email: socialLoginEmail || this.email
          }
        })

				const path = this.redirect ? this.redirect : '/offers/profile'
				this.$nuxt.$router.push({ path: `${path}${socialLoginStatusCode === 201 ? '?firstLogin=true' : ''}` })
			},

			handleFailure (err, action) {
				this.email = ''
				this.password = ''
				this.loaders['login'] = false
				this.loaders['register'] = false
				this.loaders['facebook'] = false

				if (err.code === "ECONNABORTED") {
					this.flash({ message: 'Hmm, its taking a too long to access your account, please try again shortly' })
					return
				}

				if (err.code === 'PERMISSIONS') {
					this.flash({ message: 'In order to login via facebook you will need to give permission for us to view your email address. Please try again'})
					return
				}
				if (err.response && /400/.test(err.response.status)) {
					if (err.response.data.validationErrors === "Please reset your password") {
						this.$nuxt.$router.push({ path: '/forgotten-password?expired=true' }, () => {
							this.flash({ message: 'Oops, looks like your password has expired!' })
						})
						return
					}
					this.flash({ message: "Oops, something went wrong. There may already be an account under this email address. Try logging in, or hit 'Forgot password' below." })
					return
				}

				if (err.response && /409/.test(err.response.status)) {
					this.flash({ message: 'Oops, Looks like there is already a user with this email address!' })
					return
				}

				if (err.response && /401/.test(err.response.status)) {
					this.flash({ message: 'Oops, incorrect email or password combination!' })
					return
				}

				if (err.response && /403/.test(err.response.status)) {
					this.flash({ message: 'Oops, something went wrong, please try again' })
					return
				}


			}

		},
		mounted () {
			this.$store.dispatch('auth/loadFacebookSdk')
			this.$store.dispatch('auth/initFacebookSdk')
		},
		destroyed () {
			this.$store.dispatch('auth/unloadFacebookSdk')
		}
	}

</script>

<style lang="scss">

	@import '~assets/css/variables.scss';
	@import '~assets/css/helpers.scss';

	div.login-form {
		background-color: #fff;
		background-position:right -20px bottom;
		background-repeat:no-repeat;
		background-size:224px 158px;
		display:flex;
		flex-direction:column;
		align-items:center;
		@include whenScreenIs(mdx) {
			background-position:right 38px bottom;
		}
		@include whenScreenIs(xs) {
			background-image:none !important;
		}
		.form-heading {
			margin-bottom:10px;
		}
		.body-text {
			padding: 12px;
			text-align: center;
			h2, h3 {
				color: $rebrand-orange;
				font-family: $display-font;
			}
			h2 {
				font-size:22px;
				line-height:1.1;
				margin-bottom: 12px;
				@include whenScreenIs(mdx) {
					font-size:26px;
					line-height:1.09;
					margin-bottom:20px;
				}
			}
			h3 {
				font-size:20px;
				line-height:1.2;
				margin-bottom: 12px;
				@include whenScreenIs(mdx) {
					font-size:24px;
					margin-bottom:20px;
				}
			}
		}
		.form, .body-text {
			max-width:370px;
			.field {
				margin-bottom:15px;
				&.no-social-login {
					margin-top:16px;
				}
				.field-header label {
					text-align:left;
				}
			}
			.text {
				font-size:16px;
				font-weight:700;
			}
			.facebook-button {
				background-color:#4267b2;
				border:none;
				color:#fff;
				border-radius:4px;
				font-size:16px;
				font-weight:700;
				height:46px;
				margin:20px 0 15px;
				position:relative;
				font-family:$font;
				text-transform:none;
				.facebook-logo {
					position:absolute;
					left:11px;
					top:11px;
				}
			}
			.buttons {
				.btn {
					@include whenScreenIs(mdx) {
						&:not(.single-button) {
							max-width:173px;
						}
					}
				}
			}


			div.gdpr-input {
				margin: 20px 0 50px 0;
			}
		}
	}

</style>
