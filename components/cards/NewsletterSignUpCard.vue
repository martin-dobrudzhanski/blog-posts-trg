<template>
  <div v-if="!isSmallDevice" class="newsletter-card">
    <div class="newsletter-card__text-container">
      <h3 class="newsletter-card__title">{{ title }}</h3>
      <p class="newsletter-card__text">{{ text }}</p>
      <form class="sign-up-card__form" @submit.prevent="handleSubmit">
        <input
          ref="emailInput"
          class="sign-up-card__input"
          :placeholder="emailInputPlaceholder"
          :disabled="form.api.submitting"
          v-model="form.values.email"
          v-validate="'required|verify_email'"
        />
        <div class="sign-up-card__submit-btn-wrapper">
          <BaseButton
            type="submit"
            size="medium"
            width="fit"
            class="sign-up-card__submit-btn"
            :loading="form.api.submitting"
          >
            {{ submitCtaText }}
          </BaseButton>
        </div>
      </form>
    </div>
    <div class="newsletter-card__image-container">
      <img
        v-if="ilustration && ilustration.fields"
        class="newsletter-card__left"
        :src="ilustrationUrl"
        :alt="title"
      />
      <img
        v-if="image && image.fields"
        class="newsletter-card__right"
        :src="imageUrl"
        :alt="title"
      />
    </div>
  </div>
  <div v-else class="newsletter-card">
    <div class="newsletter-card__image-container" :class="{ mobile: isMobile }">
      <img
        v-if="ilustration && ilustration.fields"
        class="newsletter-card__left"
        :src="ilustrationUrl"
        :alt="title"
      />
      <img
        v-if="image && image.fields"
        class="newsletter-card__right"
        :src="imageUrl"
        :alt="title"
      />
    </div>
    <div class="newsletter-card__text-container">
      <h3 class="newsletter-card__title">{{ title }}</h3>
      <p class="newsletter-card__text">{{ text }}</p>
      <form class="sign-up-card__form" @submit.prevent="handleSubmit">
        <input
          ref="emailInput"
          class="sign-up-card__input"
          :placeholder="emailInputPlaceholder"
          :disabled="form.api.submitting"
          v-model="form.values.email"
          v-validate="'required|verify_email'"
        />
        <div class="sign-up-card__submit-btn-wrapper">
          <BaseButton
            type="submit"
            size="medium"
            width="fit"
            class="sign-up-card__submit-btn"
            :loading="form.api.submitting"
          >
            {{ submitCtaText }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { resizeImage } from '@/libs/templateHelpers.js';

import BaseButton from '@/components/buttons/BaseButton';

const LOADING_TIMEOUT_MS = 600;

export default {
  name: 'LocationCard',
  inheritAttrs: false,
  components: {
    BaseButton
  },
  props: {
    title: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    ilustration: {
      type: Object,
      default: () => {}
    },
    image: {
      type: Object,
      default: () => {}
    },
    emailInputPlaceholder: {
      type: String,
      default: 'Email address'
    },
    submitCtaText: {
      type: String,
      default: 'Sign up'
    },
    submitSuccessFlashText: {
      type: String,
      default: 'You have been signed up!'
    }
  },
  data: () => ({
    isSmallDevice: false,
    isMobile: false,
    form: {
      api: {
        submitting: false
      },
      values: {
        email: ''
      }
    }
  }),
  computed: {
    imageUrl() {
      return resizeImage(this.image.fields.file.url);
    },
    ilustrationUrl() {
      return resizeImage(this.ilustration.fields.file.url, false);
    }
  },
  methods: {
    ...mapActions({
      flash: 'ui/flash'
    }),
    async handleSubmit() {
      if (this.form.api.submitting) return;

      try {
        // Validate
        const valid = await this.$validator.validateAll();
        if (!valid) {
          // Move focus back on the input
          // On mobile, this brings up the keyboard and focuses on the input field
          this.$refs.emailInput.focus();
          this.flash({
            message: 'Please enter a valid email address',
            autoHide: true
          });
          return;
        }

        // Submit
        this.form.api.submitting = true;
        // Log to exponea
        this.$identifyExponea({
          useremail: this.form.values.email
        });
        this.$logExponeaConsent({
          action: 'accept'
        });
        this.$logExponeaWebsiteSignup(this.form.values);

        setTimeout(() => {
          // Fake longer loading time to prevent text flashing
          this.form.values.email = '';
          this.form.values.consent = false;
          this.flash({
            message: this.submitSuccessFlashText,
            autoHide: true
          });
        }, LOADING_TIMEOUT_MS);
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
        this.flash({
          message: 'Something went wrong, please try again',
          autoHide: true
        });
      } finally {
        setTimeout(() => {
          // Fake longer loading time to prevent text flashing
          this.form.api.submitting = false;
        }, LOADING_TIMEOUT_MS);
      }
    },
    checkIfSmallDevice() {
      this.isSmallDevice = window.innerWidth <= 1199;
      this.isMobile = window.innerWidth <= 500;
    }
  },
  mounted() {
    this.checkIfSmallDevice();
    window.addEventListener('resize', this.checkIfSmallDevice);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfSmallDevice);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.newsletter-card {
  padding: 16px;
  display: flex;
  height: 100%;
  width: 100%;
  max-width: $max-width-desktop;

  margin: auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  margin-bottom: 16px;

  @include whenScreenIs(lg) {
    flex-direction: row;
    background-image: url('~/assets/img/background/ticket.png');
    background-repeat: no-repeat;
    background-size: contain;
  }

  &__image-container {
    display: flex;
    padding: 1rem;
    align-items: center;

    @include whenScreenIs(xs) {
      width: unset;
    }

    &.mobile {
      .newsletter-card__left {
        left: 45%;
      }
      .newsletter-card__right {
        right: 70%;

        @include whenScreenIs(xs) {
          right: 85%;
        }
      }
    }
  }

  &__left {
    position: relative;
    left: 300px;
    width: 360px;
    height: auto;

    @include whenScreenIs(xs) {
      left: 240px;
      width: 200px;
    }
  }

  &__right {
    width: 410px;
    height: auto;
    border-radius: 50%;
    position: relative;
    right: 240px;

    @include whenScreenIs(xs) {
      right: 25%;
      width: 244px;
    }

    @include whenScreenIs(mdx) {
      right: 120px;
    }
  }

  &__text-container {
    height: 100%;
    width: 50%;
    padding: 4rem 1rem 1rem;
    background-image: url('~/assets/img/background/ticket.png');
    background-repeat: repeat;
    background-size: contain;

    @include whenScreenIs(xs) {
      width: unset;
      margin-top: -5rem;
      text-align: center;
    }

    @include whenScreenIs(sm) {
      width: unset;
      margin-top: -5rem;
      text-align: center;
      padding-left: 2rem;
      padding-right: 2rem;
    }

    @include whenScreenIs(mdx) {
      padding: 4rem 2rem 1rem;
      margin-top: -5rem;
      text-align: center;
      background-repeat: no-repeat;
      background-size: auto;
    }

    @include whenScreenIs(lg) {
      max-width: calc(50% + 2rem);
      text-align: left;
      padding: 2rem 1rem 1rem 3rem;
      background-image: none;
    }
  }

  &__title {
    font-family: $card-display-font;
    font-size: 56px;
    color: $greyish-brown;
    line-height: 0.89;
    padding: 2rem 0 1rem;
    width: 100%;

    @include whenScreenIs(xs) {
      font-size: 40px;
    }
  }

  &__text {
    font-family: $font;
    color: $greyish-brown;
    font-size: 18px;
    line-height: 1.22;
    padding: 1rem 0;
    width: 100%;
  }

  &__cta-container {
    margin: 0 auto;
    max-width: fit-content;
    min-width: 8rem;
  }
}

.sign-up-card {
  &__form {
    width: 100%;
  }

  &__input {
    width: 100%;
    height: 3rem;
    padding: 0 1.5rem;
    margin: 1.5rem 0;
    background-color: $white;
    text-align: center;
    border: none;
    border-radius: 1.5rem;
    color: $greyish-brown;
    font-family: $font;
    font-size: 1rem;

    @include whenScreenIs(mdx) {
      font-size: 1.125rem;
      margin-bottom: 0;
      background-color: $true-white;
    }
  }

  &__submit-btn-wrapper {
    display: inline-block;
    min-width: 12.5rem;
    max-width: 100%;
    margin: 0 auto;
  }

  &__submit-btn {
    margin-top: 1.5rem;
  }
}
</style>
