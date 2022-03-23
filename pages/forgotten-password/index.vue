<template>
  <section class="forgotten-password" data-fullscreen>
    <PageHeader with-negative-margin />
    <div class="forgotten-password__container">
      <h1 class="forgotten-password__title">
        <template v-if="expired">Password expired</template>
        <template v-else>Forgotten Password?</template>
      </h1>
      <p class="forgotten-password__description">
        <template v-if="expired">
          Your passsord has expired. <br />
          Please use this form to reset your password.
        </template>
        <template v-else>
          Enter your email and click the button. <br />
          If you have an account with us we will send you an email with details on how to reset your password.
        </template>
      </p>
      <form class="forgotten-password__form" @submit.prevent="onSubmit">
        <div class="forgotten-password__form__row">
          <input
            ref="emailInput"
            :class="['forgotten-password__form__input', { 'error': errors.has('email') }]"
            name="email"
            type="email"
            placeholder="Email address*"
            :disabled="api.submitting"
            v-model="form.email"
            v-validate="'required|verify_email'"
          />
          <p v-if="errors.has('email')" class="forgotten-password__form__error">
            {{ errors.first('email') }}
          </p>
        </div>
        <div class="forgotten-password__form__row">
          <BaseButton
            class="forgotten-password__form__btn"
            type="submit"
            size="medium"
            :loading="api.submitting"
          >
            Continue
          </BaseButton>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import meta from '@/mixins/meta';

import PageHeader from '@/components/ui/PageHeader.vue';
import BaseButton from '@/components/buttons/BaseButton.vue';

export default {
  name: 'ForgottenPasswordPage',
  layout: 'fullWidth',
  components: {
    PageHeader,
    BaseButton
  },
  mixins: [meta],
  data() {
    return {
      content: {
        pageHeading: 'Forgot password?'
      },
      form: {
        email: ''
      },
      api: {
        submitting: false
      }
    };
  },
  computed: {
    expired() {
      return this.$route.query.expired;
    }
  },
  methods: {
    ...mapActions({
      'resetPassword': 'auth/resetPassword',
      'logout': 'auth/logout',
      'flash': 'ui/flash'
    }),
    async onSubmit() {
      if (this.api.submitting) return;

      const isValid = await this.$validator.validateAll();

      if (!isValid) {
        this.$refs.emailInput.focus();
        this.flash({
          message: 'Please enter a valid email address',
          autoHide: true
        });
        return;
      }

      this.api.submitting = true;
      this.resetPassword(this.form)
        .then(this.handleSuccess)
        .catch(this.handleFailure);
    },
    handleSuccess(res) {
      const message = this.expired
        ? 'Thanks! You will receive an email with password reset instructions. If you do not receive an email please check your spam/junk folder.'
        : 'Thanks! If you have an account with us, you will receive an email with password reset instructions. If you do not receive an email please check your spam/junk folder.';

      this.api.submitting = false;

      this.$nuxt.$router.push({ path: '/login' }, () => {
        this.flash({ message });
      });
    },
    handleFailure (err) {
      const defaultMessage = 'Oops, something went wrong! Please try again';
      let message;

      this.api.submitting = false;

      if (err.code === "ECONNABORTED" && !message) {
        message = 'Looks like it’s taking a bit too long to access your account, try again';
      }

      if (/400/.test(err.response.status) && !message) {
        const errors = err.response.data.errors.children;

        message = Object.keys(errors).map(key => errors[key].errors).filter(Boolean)[0][0];
      }

      if (/401|403/.test(err.response.status) && !message) {
        message = defaultMessage;
        this.logout()
      }

      if (!message) {
        message = defaultMessage;
      }

      this.flash({ message, autoHide: true });
    }
  },
  beforeMount() {
    if (this.$store.getters['auth/userAuthenticated']) {
      this.$router.push({ path: `/offers/profile` });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.forgotten-password {
  background-image: url('~/assets/img/background/paper.jpg');

  &__container {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    padding: 1rem;
    background: $light-pink;
    border-radius: 13px;
    text-align: center;

    @include whenScreenIs(sm) {
      max-width: $max-width-mdesktop;
      padding: 3rem 2rem;
    }

    @include whenScreenIs(lg) {
      max-width: 1088px;
      padding: 4rem 2rem 3rem;
    }
  }

  &__title {
    font-family: $card-display-font;
    font-size: 40px;
    color: $greyish-brown;
    line-height: 0.89;
    margin-bottom: 1.25rem;

    @include whenScreenIs(sm) {
      font-size: 56px;
    }
  }

  &__description {
    font-family: $font;
    font-size: 1rem;
    font-weight: 700;
    color: $greyish-brown;
    line-height: 1.22;
    margin-bottom: 1.25rem;

    @include whenScreenIs(sm) {
      font-size: 1.125rem;
    }
  }

  &__form {
    max-width: 400px;
    margin: 0 auto;

    &__row {
      @include whenScreenIs(lg) {
        padding-bottom: 2rem;
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

    &__btn {
      min-width: 135px;
      padding: 0 1.75rem;
      margin: 0 auto;
    }
  }
}
</style>
