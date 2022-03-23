<template>
  <transition name="slide-up-fade" mode="out-in">
    <div data-component="iorder-login-modal">
      <header data-element="subheading">
        <Icon class="user-icon" :icon="'mexican'" clickable="true" />
        <div class="white-circle">
          <Icon
            class="close-icon"
            :icon="'close-modal'"
            clickable="true"
            @click.native="$store.dispatch('iorderAuth/hideModal')"
          />
        </div>
      </header>
      <div data-element="text-block">
        <h1 class="text-block__heading" data-weight="black">
          Your details
        </h1>
        <p class="text-block__text">
          Almost there! <br />
          Please enter your details below.
        </p>
      </div>

      <div data-element="user-details">
        <div data-element="form-wrapper">
          <div data-element="user-form">
            <div data-element="form-row">
              <div data-element="input-wrapper">
                <input
                  class="user-details__input"
                  data-element="input"
                  placeholder="Name"
                  v-model="name"
                  v-validate="'required'"
                  name="name"
                  type="name"
                />
              </div>
              <div data-element="error-message">
                {{ errors.first('name') }}
              </div>
            </div>

            <div data-element="form-row">
              <div data-element="input-wrapper">
                <input
                  class="user-details__input"
                  data-element="input"
                  placeholder="Phone number"
                  v-model="phone"
                  v-validate="'required|min:11|max:15'"
                  name="phone"
                  type="tel"
                />
              </div>
              <div data-element="error-message">
                {{ errors.first('phone') }}
              </div>
            </div>

            <div data-element="form-row">
              <div data-element="input-wrapper">
                <input
                  class="user-details__input"
                  data-element="input"
                  placeholder="Email address"
                  v-model="email"
                  v-validate="'required|verify_email'"
                  name="email"
                  type="email"
                />
              </div>
              <div data-element="error-message">
                {{ errors.first('email') }}
              </div>
            </div>

            <div data-element="form-row">
              <div class="checkbox gdpr-input">
                <input
                  type="checkbox"
                  v-model="optIn"
                  class="checkbox-input"
                  id="checkbox"
                />
                <label class="checkbox-label" for="checkbox">{{
                  optInMessage
                }}</label>
              </div>
            </div>

            <div data-element="form-row">
              <BaseButton
                :disabled="isDisabled || isSubmitting"
                size="medium"
                class="login-modal__cta"
                @click.native="submit"
              >
                Pay now
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';

import Icon from '~/components/iOrder-core/uiV3/Icon';
import BaseButton from '~/components/buttons/BaseButton';

export default {
  components: {
    Icon,
    BaseButton
  },
  props: {
    guestLoginCallback: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isSubmitting: false,
      name: '',
      phone: '',
      email: '',
      optIn: false
    };
  },
  computed: {
    ...mapGetters({
      geolocationIsLoading: 'clickAndCollect/geolocationIsLoading',
      optInMessage: 'clickAndCollect/getOptInMessage'
    }),
    isDisabled() {
      return (
        !this.name || !this.email || !this.phone || this.errors.items.length > 0
      );
    }
  },
  methods: {
    async submit() {
      if (this.isDisabled || this.isSubmitting) {
        return;
      }
      this.isSubmitting = true;

      this.$identifyExponea({
        username: this.name,
        useremail: this.email
      });

      await this.$store.dispatch('iorderAuth/submitGuestDetails', {
        email: this.email,
        name: this.name,
        phone: this.phone
      });

      await this.$store.dispatch('iorderAuth/hideModal');

      this.$logExponeaConsent({
        action: this.optIn ? 'accept' : 'reject'
      });

      this.guestLoginCallback();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';
@import '~assets/css/iorder-core/form-row.scss';

[data-component='iorder-login-modal'] {
  position: relative;
  margin: 0 1rem;
  background-color: $very-light-pink;
  border-radius: 9px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  @include whenScreenIs(sm) {
    width: 536px;
    height: 600px;
  }
  [data-element='subheading'] {
    height: 130px;
    text-align: center;
    .user-icon {
      height: 94px;
      width: 60px;
      margin: 1.5rem auto 0;
    }
    .white-circle {
      width: 40px;
      height: 40px;
      background: white;
      position: absolute;
      top: 8px;
      right: 8px;
      text-align: center;
      border-radius: 50%;
    }
    .close-icon {
      margin-top: 8px;
    }
  }
  [data-element='text-block'] {
    .text-block__heading {
      font-family: $heading-font;
      font-size: 48px;
      color: $peacock-blue;
      line-height: 1;
      text-align: center;
      position: relative;
      margin-bottom: 1rem;
    }
    .text-block__text {
      color: $greyish-brown;
      font-family: $font;
      font-size: 18px;
      text-align: center;
      line-height: 1.22;
    }

    padding: 0 16px;
    margin-bottom: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  [data-element='user-details'] {
    .user-details__input {
      border: 0;
      border-radius: 23px;
    }
    [data-element='form-wrapper'] {
      @include whenScreenIs(sm) {
        display: flex;
        flex-direction: row;
      }

      [data-element='user-form'] {
        @media (min-width: 500px) {
          padding: 0 16px 0;
        }
        margin: 0 auto;
        padding-bottom: 24px;
        .create-content {
          flex-direction: row;
          margin-bottom: 10px;
          color: $jungle-green;
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

      .checkbox {
        background-color: transparent;
      }

      [data-element='input-wrapper'] {
        border: 0;
        position: relative;
        width: 456px;
        @include whenScreenIs(xs) {
          width: 310px;
        }
        [data-component='icon'] {
          position: absolute;
          right: 8px;
          top: 12px;
        }
        input.user-details__input {
          text-align: left;
          padding-left: 1rem;
        }
      }
      [data-element='btn-container'] {
        background-color: transparent;
        border: 0;
      }

      [data-component='btn'] {
        background-color: $jungle-green;
        color: $true-white;
      }
    }
  }
}
</style>
