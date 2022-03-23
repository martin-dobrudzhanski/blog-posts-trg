<template>
  <div class="details-input">
    <div @click="$emit('handleCloseModal')" class="modal-wrapper__close">
      <img
        src="@/assets/img/generic/icon-close.svg"
        alt="close"
        class="modal-wrapper__close-icon"
      />
    </div>
    <section class="details-input__container">
      <v-header :title="content && content.userDetailsPageTitle" />
      <p v-text="content && content.userDetailsPageText"></p>
    </section>
    <section class="details-input__input-container">
      <div class="details-input__input">
        <v-input
          label="Email"
          placeholder="Your email"
          @input="handleInput"
          @formSubmit="handleContinue"
          type="email"
        />
        <p class="error-message" v-if="!email && emailEntered">
          Please enter a valid email address
        </p>
      </div>
    </section>
    <section class="details-input__footer">
      <a
        :href="content && content.termsAndConditionsLink"
        class="details-input__footer-link"
        target="_blank"
      >
        Terms and Conditions
      </a>
      <v-button
        hasContainer
        :disabled="!email"
        :buttonText="content && content.billPageButtonText"
        @buttonClick="handleContinue"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const VButton = () => import('@/components/pmb/VButton')
const VHeader = () => import('@/components/pmb/VHeader')
const VInput = () => import('@/components/pmb/VInput')

export default {
  components: {
    VButton,
    VHeader,
    VInput
  },
  data: () => ({
    email: null,
    emailEntered: false
  }),
  computed: {
    ...mapGetters({
      content: 'pay/getContent'
    })
  },
  methods: {
    handleInput(input) {
      this.emailEntered = true
      if (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          input
        )
      ) {
        this.email = input
      } else {
        this.email = null
      }
    },
    handleContinue() {
      if (this.email) {
        this.$emit('handleContinue', this.email)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/site.scss';

.details-input {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow-y: scroll;
  width: 100%;

  &__container {
    padding: 0 16px;

    p {
      font-size: 14px;
    }
  }

  &__input-container {
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    padding-bottom: 24px;
  }

  &__heading {
    @extend .pmb-heading;
  }

  &__content {
    margin: 0 16px 170px;
  }

  &__buttons {
    display: flex;

    div {
      height: 48px;
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__input {
    input {
      border-radius: 0;
      border: 1px solid $jungle-green;
      font-size: 16px;
      height: 100%;
      padding: 12px;
      text-align: center;
      width: 100%;
    }
  }

  &__footer {
    text-align: center;

    &-link {
      @extend .pmb-link;
      margin-bottom: 8px;
    }
  }
}

.error-message {
  color: $pinkish-red;
  margin: 10px 0;
  text-align: center;
}
</style>
