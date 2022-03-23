import Vue from 'vue'
import VeeValidate from 'vee-validate'

const config = {
  inject: true
}

Vue.use(VeeValidate, config)

VeeValidate.Validator.extend('verify_password', {
  getMessage: field => `Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 number`,
  validate: value => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/.test(value)
})

VeeValidate.Validator.extend('date_selection_validation', {
  getMessage: field => `Date must be in the past`,
  validate: value => {
    const datePartsArray = value.split('/')
    const dateGiven = new Date(datePartsArray[2], datePartsArray[1] - 1, datePartsArray[0])
    const today = new Date()
    return ((today - dateGiven) / (24 * 60 * 60 * 1000)) >= 1
  }
})

VeeValidate.Validator.extend('verify_email', {
  getMessage: field => `Please enter a valid email address`,
  validate: value => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
})

VeeValidate.Validator.extend('verify_mobile_number', {
  getMessage: field => `Please enter a valid UK phone number`,
  validate: value => /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/.test(value)
})

VeeValidate.Validator.extend('accents_no_special_chars', {
  getMessage: field => `Please enter a valid name`,
  validate: value => /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,20}$/.test(value)
})

VeeValidate.Validator.extend('street_address', {
  getMessage: field => `Please enter a valid address`,
  validate: value => /^[A-Za-z0-9'.,\-\s]+$/.test(value)
})

const dictionary = {
  custom: {
    email: {
      required: 'Please enter a valid email address'
    },
    phone: {
      min: 'Please enter a valid UK phone number',
      max: 'Please enter a valid UK phone number'
    },
    passwordConfirm: {
      required: 'The password field is required.',
      confirmed: 'The password confirmation does not match.'
    }
  }
};

VeeValidate.Validator.localize('en', dictionary);
