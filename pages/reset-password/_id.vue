<template>
  <section class="reset-password" data-fullscreen>
    <PageHeader with-negative-margin />
    <div class="reset-password__container">
      <h1 class="reset-password__title">Reset password?</h1>
      <p class="reset-password__description">
        Enter your new password and click the button.
      </p>
      <form class="reset-password__form" @submit.prevent="onSubmit">
        <div class="reset-password__form__row">
          <input
            :class="[
              'reset-password__form__input',
              { error: errors.has('email') }
            ]"
            name="email"
            type="email"
            placeholder="Email address*"
            :disabled="api.submitting"
            v-model="form.email"
            v-validate="'required|verify_email'"
          />
          <p v-if="errors.has('email')" class="reset-password__form__error">
            {{ errors.first('email') }}
          </p>
        </div>
        <div class="reset-password__form__row">
          <input
            :class="[
              'reset-password__form__input',
              { error: errors.has('password') }
            ]"
            name="password"
            type="password"
            placeholder="New password*"
            :disabled="api.submitting"
            v-model="form.password"
            v-validate="'required|min:8|max:20|verify_password'"
          />
          <p v-if="errors.has('password')" class="reset-password__form__error">
            {{ errors.first('password') }}
          </p>
        </div>
        <div class="reset-password__form__row">
          <input
            :class="[
              'reset-password__form__input',
              { error: errors.has('passwordConfirm') }
            ]"
            name="passwordConfirm"
            type="password"
            placeholder="Re-enter password*"
            :disabled="api.submitting"
            v-model="form.passwordConfirm"
            v-validate="'required|confirmed:password'"
          />
          <p
            v-if="errors.has('passwordConfirm')"
            class="reset-password__form__error"
          >
            {{ errors.first('passwordConfirm') }}
          </p>
        </div>
        <div class="reset-password__form__row buttons">
          <BaseButton
            class="reset-password__form__btn"
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
  name: 'ResetPasswordPage',
  layout: 'fullWidth',
  components: {
    PageHeader,
    BaseButton
  },
  mixins: [meta],
  data() {
    return {
      content: {
        pageHeading: 'Reset password?'
      },
      form: {
        email: '',
        password: '',
        passwordConfirm: ''
      },
      api: {
        submitting: false
      }
    };
  },
  methods: {
    ...mapActions({
      submitNewPassword: 'auth/submitNewPassword',
      logout: 'auth/logout',
      flash: 'ui/flash'
    }),
    async onSubmit() {
      if (this.api.submitting) return;

      const isValid = await this.$validator.validateAll();
      const passwordResetToken = this.$route.params.id;

      if (!isValid) return;

      this.api.submitting = true;
      this.submitNewPassword({
        ...this.form,
        passwordResetToken
      })
        .then(res => {
          this.api.submitting = false;
          this.$logExponeaPasswordReset();
          this.$nuxt.$router.push({ path: '/login' }, () => {
            this.flash({ message: 'Password changed successfully!' });
          });
        })
        .catch(this.handleFailure);
    },
    handleFailure(err) {
      let message;

      if (err.code === 'ECONNABORTED' && !message) {
        message =
          'Looks like it’s taking a bit too long to access your account, try again';
      }

      if (/400/.test(err.response.status) && !message) {
        message = 'Oops, looks like something went wrong, please try again';
      }

      if (/410/.test(err.response.status) && !message) {
        this.$nuxt.$router.push({ path: '/forgotten-password' }, () => {
          this.flash({
            message: 'Oops, looks like this link has expired, please try again'
          });
        });
        this.logout();
      }

      if (/401|404/.test(err.response.status) && !message) {
        this.$nuxt.$router.push({ path: '/login' }, () => {
          this.flash({
            message:
              'Oops, we cant reset your password right now! Please try again'
          });
        });
        this.logout();
      }
      this.flash({ message, autoHide: true });
    }
  },
  beforeMount() {
    if (this.$store.getters['auth/userAuthenticated']) {
      this.$router.push({ path: `/offers/profile` });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.reset-password {
  background-image: url('~/assets/img/background/paper.jpg');
  padding-bottom: 4rem;

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
        padding-bottom: 1rem;
      }

      &.buttons {
        padding-top: 1rem;

        @include whenScreenIs(sm) {
          padding-top: 2rem;
        }
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
