<template>
  <!-- <div class="profile-form form-container" data-fullscreen :style="getStyle" data-size="lg" > -->
  <div class="profile-form form-container" data-size="lg">
    <h1 class="form-heading heading" data-size="xl">
      {{ content.profileHeaderText }}
    </h1>
    <p class="form-intro">{{ content.profileSubHeader }}</p>

    <form
      class="form"
      data-size="lg"
      v-if="userProfileLoaded"
      @submit.prevent="saveProfile"
    >
      <div class="field">
        <div class="field-header">
          <label for="name">First name:<span class="required">*</span></label>
        </div>
        <div class="control">
          <input
            v-model="firstName"
            id="name"
            v-validate="'required|alpha_spaces|min:2|max:30'"
            class="input"
            :data-invalid="errors.has('name')"
            data-vv-name="name"
            type="text"
            placeholder="First name*"
          />
        </div>
        <div class="field-footer">
          <p v-show="errors.has('name')" class="help">
            {{ errors.first('name') }}
          </p>
        </div>
      </div>

      <div class="field">
        <div class="field-header">
          <label for="dob">Date of birth:<span class="required">*</span></label>
        </div>
        <div class="control">
          <input
            v-model="dateOfBirth"
            id="dob"
            v-validate="`required|date_format:DD/MM/YYYY`"
            class="input"
            :data-invalid="errors.has('dob')"
            data-vv-name="dob"
            type="text"
            placeholder="Date of birth*"
          />
        </div>
        <div class="field-footer">
          <p v-show="errors.has('dob')" class="help">
            {{ errors.first('dob') }}
          </p>
        </div>
      </div>

      <div class="field" data-grouped>
        <div class="controls buttons">
          <button
            class="btn btn__save"
            type="submit"
            :data-loading="isSaving"
            data-size="md"
            @click.prevent="saveProfile"
          >
            Save
            <div class="loader" v-if="isSaving"></div>
          </button>
          <button
            class="btn"
            :data-loading="isLoggingOut"
            data-size="md"
            @click.prevent="logoutClick"
          >
            Log out
            <div class="loader" v-if="isLoggingOut"></div>
          </button>
        </div>
      </div>
    </form>

    <spinner v-else />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Spinner from '@/components/iOrder-core/ui/GenericLoader';

export default {
  props: ['size', 'content'],
  components: {
    Spinner
  },
  data() {
    return {
      firstName: '',
      dateOfBirth: '',
      optIn: false,
      userProfileLoaded: false,
      isLoggingOut: false,
      isSaving: false,
      name: null,
      dob: null,
      errorMsg: null
    };
  },

  methods: {
    ...mapActions({
      getUser: 'auth/getUser',
      logout: 'auth/logout',
      saveUser: 'auth/saveUser',
      flash: 'ui/flash'
    }),

    logoutClick() {
      this.isLoggingOut = true;
      this.logout();
      this.$nuxt.$router.push({ path: '/login' });
    },

    handleError(err) {
      this.isLoggingOut = false;
      this.isSaving = false;

      if (err.code === 'ECONNABORTED') {
        this.flash({
          message:
            'Looks like it’s taking a bit too long to access your account, try again'
        });
        return;
      }

      if (/401|400/.test(status)) {
        this.logout();
        this.$nuxt.$router.push({ path: '/login' }, () => {
          this.flash({
            message: 'Oops, something went wrong! Please try again'
          });
        });
        return;
      }

      if (/403/.test(err.response.status)) {
        this.logout();
        this.$nuxt.$router.push({ path: '/login' }, () => {
          this.flash({ message: 'You must be logged in to see this page!' });
        });
        return;
      }

      if (/500|504/.test(err.response.status)) {
        this.flash({
          message: 'Oops, we couldnt retrieve your profile, please try again'
        });
      }
    },

    saveProfile() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }
        this.isSaving = true;
        this.saveUser({
          firstName: this.firstName,
          dateOfBirth: this.dateOfBirth,
          optIn: this.optIn
        })
          .then(data => {
            this.isSaving = false;
            this.flash({ message: 'Your details have been updated!' });
          })
          .catch(this.handleError);
      });
    },
    sanitize(profile) {
      profile.firstName = this.replaceUnknown(profile.firstName);
      profile.dateOfBirth = this.replaceUnknown(profile.dateOfBirth);
      return profile;
    },
    replaceUnknown(string) {
      return string ? string.replace(/Unknown|Firstname|Lastname/gi, '') : '';
    }
  },
  beforeMount() {
    this.getUser()
      .then(res => {
        this.userProfileLoaded = true;
        const sanitizedProfile = this.sanitize(res.data);
        this.firstName = sanitizedProfile.firstName;
        this.dateOfBirth = sanitizedProfile.dateOfBirth;
        this.optIn = sanitizedProfile.optIn;
      })
      .catch(this.handleError);
  }
};
</script>

<style lang="scss">
@import '~assets/css/variables.scss';
@import '~assets/css/helpers.scss';

.profile-form {
  background-position: right 18px bottom 43px;
  background-repeat: no-repeat;
  background-size: 194px 137px;
  background-color: unset;

  .btn {
    width: 138px;
    height: 40px;
    margin: 32px 16px 0 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 22px;
    background-color: $greyish-brown;

    &__save {
      background-color: $mac-and-cheese;
      color: $black;
    }
  }

  .field-header {
    display: none;
  }

  .field .control,
  .field .control input {
    border: none;
    border-radius: 22px;
    height: 46px;
  }

  @include whenScreenIs(xs) {
    background-image: none !important;
    background-color: unset;
  }

  h1.form-heading {
    padding-top: 24px;
  }

  .loader.main {
    margin: 0 auto;
  }
}
</style>
