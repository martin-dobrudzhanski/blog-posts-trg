<template>
  <form
    class="auth-form"
    @submit.prevent="onSubmit('login')"
  >
    <div class="auth-form__row">
      <div class="auth-form__col">
        <input
          ref="emailInput"
          :class="['auth-form__input', { 'error': errors.has('email') }]"
          name="email"
          type="email"
          placeholder="Email address"
          :disabled="api.submitting"
          v-model="form.email"
          v-validate="'required|verify_email'"
        />
        <p v-if="errors.has('email')" class="auth-form__error">
          {{ errors.first('email') }}
        </p>
      </div>
      <div class="auth-form__col">
        <input
          ref="passwordInput"
          :class="['auth-form__input', { 'error': errors.has('password') }]"
          name="password"
          placeholder="Password (min 8 characters)"
          :disabled="api.submitting"
          v-model="form.password"
          v-validate="'required|min:8|verify_password'"
        />
        <p v-if="errors.has('password')" class="auth-form__error">
          {{ errors.first('password') }}
        </p>
      </div>
    </div>
    <div v-if="showCheckbox" class="auth-form__row">
      <BaseCheckbox
        class="auth-form__checkbox"
        :required="true"
        v-model="optIn"
      >
        Tick here to receive the latest news and exclusive offers!
      </BaseCheckbox>
    </div>
    <div class="auth-form__row buttons">
      <BaseButton
        class="auth-form__btn"
        type="button"
        size="medium"
        width="fit"
        :loading="loaders.register"
        @click.native="onSubmit('register')"
      >
        Sign up
      </BaseButton>
      <BaseButton
        v-if="!showCheckbox"
        class="auth-form__btn"
        type="submit"
        size="medium"
        width="fit"
        :loading="loaders.login"
      >
        Log in
      </BaseButton>
      <button
        v-if="showFacebookButton"
        class="auth-form__facebook"
        type="button"
        @click="onSubmit('socialLogin')"
      >
        <img class="auth-form__facebook-logo" src="~assets/img/icons/icon-fb-square.svg" />
        <span v-if="loaders.facebook" class="auth-form__facebook-loader" />
        <template v-else>Continue with Facebook</template>
      </button>
    </div>
    <div v-if="showCheckbox" class="auth-form__row">
      <BaseLink
        class="auth-form__link"
        to="/forgotten-password"
      >
        Reset password
      </BaseLink>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
import get from 'lodash.get';

import BaseButton from '@/components/buttons/BaseButton';
import BaseCheckbox from '@/components/ui/BaseCheckbox';
import BaseLink from '@/components/ui/BaseLink';

export default {
  name: 'AuthForm',
  components: {
    BaseButton,
    BaseCheckbox,
    BaseLink
  },
  props: {
    showFacebookButton: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    api: {
      submitting: false
    },
    loaders: {
      login: false,
      register: false,
      facebook: false
    },
    showCheckbox: false,
    form: {
      email: '',
      password: ''
    },
    optIn: false
  }),
  methods: {
    ...mapActions({
      flash: 'ui/flash',
      login: 'auth/login',
      register: 'auth/register',
      socialLogin: 'auth/socialLogin'
    }),
    async onSubmit(action) {
      const isRegistration = action === 'register';

      if (this.api.submitting) return;

      if (isRegistration && !this.showCheckbox) {
        this.showCheckbox = true;
        return;
      }

      this.api.submitting = true;
      this.loaders[action] = true;

      if (action === 'socialLogin') {
        return this[action]()
          .then(({ statusCode, email }) => {
            this.handleSuccess(statusCode);
          })
          .catch(err => this.handleFailure(err, action));
      } else {
        const valid = await this.$validator.validateAll();
        const errors = this.errors;
        const data = { ...this.form };

        if (!valid) {
          this.loaders[action] = false;
          this.api.submitting = false;
          return;
        }

        if (isRegistration) data.optIn = this.optIn;

        this[action](data)
          .then(this.handleSuccess)
          .catch(err => this.handleFailure(err, action));
      }
    },
    handleSuccess(socialLoginStatusCode) {
      // TODO: Add Exponea event

      this.$nuxt.$router.push({
        path: `/offers/profile${socialLoginStatusCode === 201 ? '?firstLogin=true' : ''}`
      });
    },
    handleFailure(err, action) {
      let message;

      this.api.submitting = false;
      this.loaders[action] = false;

      if (err.code === "ECONNABORTED" && !message) {
        message = 'Hmm, its taking a too long to access your account, please try again shortly'
      }

      if (err.code === 'PERMISSIONS' && !message) {
        message = 'In order to login via facebook you will need to give permission for us to view your email address. Please try again';
      }

      if (err.response && /400/.test(err.response.status) && !message) {
        if (err.response.data.validationErrors === 'Please reset your password') {
          this.$nuxt.$router.push({
            path: '/forgotten-password?expired=true'
          }, () => {
            this.flash({
              message: 'Oops, looks like your password has expired!'
            });
          });

          return;
        }

        message = 'Oops, something went wrong. There may already be an account under this email address. Try logging in, or hit \'Forgot password\' below.';
      }

      if (err.response && /409/.test(err.response.status) && !message) {
        message = 'Oops, Looks like there is already a user with this email address!';
      }

      if (err.response && /401/.test(err.response.status) && !message) {
        message = 'Oops, incorrect email or password combination!';
      }

      if (
        (err.response && /403/.test(err.response.status) || err.code === 'UNKNOWN') &&
        !message
      ) {
        message = 'Oops, something went wrong, please try again';
      }

      this.flash({
        message,
        autoHide: true
      });
    }
  },
  mounted() {
    if (this.showFacebookButton) {
      this.$store.dispatch('auth/loadFacebookSdk');
      this.$store.dispatch('auth/initFacebookSdk');
    }
  },
  destroyed() {
    if (this.showFacebookButton) this.$store.dispatch('auth/unloadFacebookSdk');
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.auth-form {
  &__row {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }

    @include whenScreenIs(mdx) {
      display: flex;
      justify-content: space-between;
    }

    &.buttons {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      @include whenScreenIs(mdx) {
        flex-wrap: nowrap;
        justify-content: flex-start;
      }
    }
  }

  &__col {
    @include whenScreenIs(mdx) {
      width: calc(50% - 7px);
    }
  }

  &__input {
    width: 100%;
    height: 3rem;
    font-family: $font;
    font-size: 1rem;
    color: $greyish-brown;
    padding: 0 1.5rem;
    background-color: $white;
    border: none;
    border-radius: 1.5rem;
    margin: 0.75rem 0;

    @include whenScreenIs(sm) {
      margin: 1rem 0;
    }

    @include whenScreenIs(mdx) {
      font-size: 1.125rem;
      background-color: $true-white;
      margin: 1.5rem 0 0;
    }

    &.error {
      border: 2px solid $rebrand-red;
    }
  }

  &__error {
    font-size: 12px;
    color: $rebrand-red;
    padding-top: 5px;
  }

  &__checkbox {
    text-align: left;

    /deep/ .base-checkbox__label {
      font-size: 0.875rem;
      color: $greyish-brown;
      padding-left: 30px;
    }
  }

  &__btn {
    max-width: 135px;
    margin: 0 10px;

    @include whenScreenIs(xs) {
      // max-width: 115px;
      margin: 0 5px;
      max-width: calc(50% - 10px);
    }

    @include whenScreenIs(mdx) {
      max-width: calc(27% - 7px);
      margin: 0 7px 0 0;
    }
  }

  &__facebook {
    width: 230px;
    font-size: 14px;
		font-weight: 700;
    color: $white;
    background-color: #1978f2;
		border: none;
		border-radius: 20px;
    padding: 11px 10px 11px 30px;
    margin-top: 25px;
		position: relative;
    cursor: pointer;
    transition: box-shadow 300ms ease-in-out, opacity 300ms ease-in-out;

    @include whenScreenIs(mdx) {
      width: 45%;
      margin-top: 0;
      margin-left: auto;
      padding: 0 0 0 30px;
    }

    &:hover {
      box-shadow: 0 2px 0.5rem rgba($true-black, 0.5);
    }

    &-logo {
      border-radius: 50%;
      position: absolute;
      top: 8px;
      left: 8px;
    }

    &-loader {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      margin: 0 auto;
      background-image: url('~/assets/img/icons/icon-tick-off-white.svg');
      background-size: 100%;
      background-position: center;
      animation: spin 1s infinite linear;
      position: relative;
      left: -15px;
    }
  }

  &__link {
    font-size: 1rem;
    color: $greyish-brown;
    text-decoration: underline;
    text-transform: uppercase;

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
